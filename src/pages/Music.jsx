import React from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'

const SONG = {
  title: 'What Took You So Long',
  artist: 'Neck Deep',
  duration: '3:58',
}

function formatTime(secs) {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Music({
  playing, togglePlay,
  current, duration,
  volume, changeVolume,
  liked, setLiked,
  seek,
}) {
  const pct = duration ? (current / duration) * 100 : 0

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    seek(p)
  }

  return (
    <div className="relative min-h-screen px-5 py-9 z-10">

      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-1">
          🎵 Lagu Istimewa
        </p>
        <h1 className="text-xl font-extrabold text-gray-700">Buat Teh Ica 💜</h1>
      </motion.div>

      {/* Album art */}
      <motion.div
        className="flex justify-center mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 110 }}
      >
        <motion.div
          className="w-60 h-60 rounded-[2rem] shadow-2xl bg-gradient-to-br from-pink-200 via-purple-300 to-indigo-300 flex items-center justify-center"
          animate={playing ? { rotate: [0, 1.5, -1.5, 0] } : {}}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ boxShadow: '0 20px 60px rgba(180,100,220,0.3)' }}
        >
          <span className="text-7xl">🎵</span>
        </motion.div>
      </motion.div>

      {/* Song meta */}
      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <h2 className="text-xl font-extrabold text-gray-800 leading-tight">{SONG.title}</h2>
        <p className="text-gray-500 text-sm font-semibold mt-0.5">{SONG.artist}</p>
        <div className="flex justify-center gap-0.5 mt-2">
          {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
        </div>
      </motion.div>

      {/* Progress bar */}
      <div className="mb-5 px-1">
        <div
          className="h-1.5 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
          onClick={handleProgressClick}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full origin-left"
            style={{ width: `${pct}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] text-gray-400 font-medium">{formatTime(current)}</span>
          <span className="text-[11px] text-gray-400 font-medium">{SONG.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-9 mb-7">
        <motion.button whileTap={{ scale: 0.85 }} className="text-gray-400">
          <SkipBack size={22} strokeWidth={2.5} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-xl text-white"
          style={{ boxShadow: '0 8px 24px rgba(200,80,200,0.4)' }}
        >
          {playing
            ? <Pause size={26} strokeWidth={2.5} />
            : <Play size={26} strokeWidth={2.5} className="ml-1" />
          }
        </motion.button>

        <motion.button whileTap={{ scale: 0.85 }} className="text-gray-400">
          <SkipForward size={22} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 mb-7 px-1">
        <Volume2 size={16} className="text-gray-400 shrink-0" />
        <input
          type="range" min={0} max={1} step={0.05} value={volume}
          onChange={(e) => changeVolume(parseFloat(e.target.value))}
          className="flex-1 accent-pink-400 h-1 cursor-pointer"
        />
      </div>

      {/* Like button */}
      <div className="flex justify-center mb-7">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => setLiked((p) => !p)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 bg-white/70 px-5 py-2.5 rounded-full shadow-sm border border-pink-100"
        >
          <motion.span animate={liked ? { scale: [1, 1.45, 1] } : {}} transition={{ duration: 0.3 }}>
            {liked ? '❤️' : '🤍'}
          </motion.span>
          {liked ? 'Disuka banget!' : 'Tambahkan ke favorit'}
        </motion.button>
      </div>

      {/* Playing indicator — terlihat saat di halaman lain */}
      {playing && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div className="flex items-end gap-0.5 h-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-pink-400 rounded-full"
                animate={{ height: ['40%', '100%', '40%'] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
              />
            ))}
          </div>
          <span className="text-pink-400 text-xs font-bold">Sedang diputar</span>
        </motion.div>
      )}

      {/* About section */}
      <motion.div
        className="bg-white/85 backdrop-blur-md rounded-3xl px-6 py-6 shadow-xl border border-purple-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-extrabold text-purple-500 mb-3 text-sm flex items-center gap-2">
          <span>💜</span> Kenapa lagu ini?
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Jadi ceritanya aku lagi dengerin playlist random, terus lagu ini muncul — dan langsung
          nyantol gitu di kepala. <em>"What Took You So Long"</em> tuh basically nanya,
          "kemana aja sih kamu, kok baru sekarang datengnya?"
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Nggak tau kenapa, tapi berasa relate aja. Katanya di liriknya <strong>"I was not me until I discovered You for the firs time"</strong>, njoyy.
          Cenah mah, <strong>"Aku bukanlah diriku sampai akhirnya bertemu Kamu untuk pertama kali"</strong> geloooo wkwkkw.
          Nadanya pop-punk, energik, asik buat
          didengernya. Kata Teh Ica mah gembrang gembrung 😭😭😂
        </p>
        <p className="text-pink-500 text-sm font-bold italic border-l-4 border-pink-300 pl-3">
          Intinya: lagu ini ngingetin aku ke kamu. Gitu aja, nggak usah didramatisir wkwk 🙈
        </p>
      </motion.div>
    </div>
  )
}
