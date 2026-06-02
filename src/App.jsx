import React, { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LockScreen from './components/LockScreen'
import Countdown from './components/Countdown'
import BottomNav from './components/BottomNav'
import FloatingHearts from './components/FloatingHearts'
import Home from './pages/Home'
import Music from './pages/Music'
import Gallery from './pages/Gallery'

const BIRTHDAY = new Date('2026-06-05T00:00:00+07:00')

const SONG_SRC = '/assets/music/lagu.mp3'
const SONG_DURATION_SECS = 238

export default function App() {
  // false = masih countdown, true = sudah boleh lanjut ke lock/home
  const [countdownDone, setCountdownDone] = useState(
    () => Date.now() >= BIRTHDAY.getTime()
  )
  const [isUnlocked, setIsUnlocked] = useState(
    () => localStorage.getItem('hbd_unlocked') === 'true'
  )
  const [page, setPage]             = useState('home')
  const [giftOpened, setGiftOpened] = useState(false)

  // ── Audio state (persisten lintas halaman) ──────────────────────────────────
  const audioRef                    = useRef(null)
  const [playing, setPlaying]       = useState(false)
  const [audioCurrent, setAudioCurrent] = useState(0)
  const [audioVolume, setAudioVolume]   = useState(0.8)
  const [liked, setLiked]           = useState(true)

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTime = () => setAudioCurrent(a.currentTime)
    const onEnd  = () => { setPlaying(false); setAudioCurrent(0); a.currentTime = 0 }
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('ended', onEnd)
    a.volume = audioVolume
    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('ended', onEnd)
    }
  }, [audioVolume])

  const togglePlay = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else         { a.play().catch(() => {}); setPlaying(true) }
  }, [playing])

  const seek = useCallback((pct) => {
    const a = audioRef.current
    if (!a) return
    const t = pct * SONG_DURATION_SECS
    a.currentTime = t
    setAudioCurrent(t)
  }, [])

  const changeVolume = useCallback((v) => {
    setAudioVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }, [])

  const audioProps = {
    playing, togglePlay,
    current: audioCurrent, duration: SONG_DURATION_SECS,
    volume: audioVolume, changeVolume,
    liked, setLiked,
    seek,
  }
  // ────────────────────────────────────────────────────────────────────────────

  // Scroll ke atas setiap kali pindah halaman
  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo(0, 0))
  }, [page])

  const handleUnlock = () => {
    localStorage.setItem('hbd_unlocked', 'true')
    setIsUnlocked(true)
  }

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home giftOpened={giftOpened} onGiftOpen={() => setGiftOpened(true)} />
      case 'music':
        return <Music {...audioProps} />
      case 'gallery':
        return <Gallery />
      default:
        return null
    }
  }

  return (
    <div className="app-shell">
      {/* Audio element selalu ada di DOM — tidak unmount saat pindah halaman */}
      <audio ref={audioRef} src={SONG_SRC} preload="metadata" />

      <FloatingHearts />

      <AnimatePresence mode="wait">
        {/* ── COUNTDOWN — sebelum tanggal 5 Juni WIB ── */}
        {!countdownDone ? (
          <motion.div
            key="countdown"
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(6px)' }}
            transition={{ duration: 0.6 }}
          >
            <Countdown onComplete={() => setCountdownDone(true)} />
          </motion.div>

        ) : !isUnlocked ? (
          <motion.div
            key="lock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
            transition={{ duration: 0.5 }}
          >
            <LockScreen onUnlock={handleUnlock} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="pb-28"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>

            <BottomNav current={page} onChange={setPage} giftOpened={giftOpened} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
