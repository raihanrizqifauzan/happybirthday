import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'

// enableScroll=false saat kembali ke Home (sudah pernah buka kado) supaya
// tidak ada scrollIntoView yang mengganggu posisi paling atas
// index=0 → skip scroll (biarkan terlihat natural dari posisi atas)
// index>0 → scroll 'nearest' (scroll minimal hanya jika card di luar layar)
function ScrollCard({ children, className, variants }) {
  return (
    <motion.div
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const PARTICLES = Array.from({ length: 28 }, (_, i) => {
  const angle  = (i / 28) * 360
  const rad    = (angle * Math.PI) / 180
  const dist   = 80 + (i % 4) * 38
  const EMOJIS = ['🎊', '✨', '🌸', '💖', '⭐', '🎉', '🩷', '💫', '🎈', '🎀', '💝', '🌟', '🪄', '🎆']
  return {
    emoji:    EMOJIS[i % EMOJIS.length],
    tx:       Math.cos(rad) * dist,
    ty:       Math.sin(rad) * dist - 60,
    rotate:   (i % 2 === 0 ? 1 : -1) * (120 + i * 22),
    size:     16 + (i % 4) * 6,
    delay:    (i % 7) * 0.028,
    duration: 0.65 + (i % 4) * 0.18,
  }
})

const CARDS = [
  {
    emoji: '🎂',
    title: 'Selamat ulang tahun, Teh Icaaaaa!',
    body: 'Udah 27 tahun nih, tua juga ya — eh tapi tetep cantik kok tenang aja wkwk. Semoga tahun ini banyak hal baik yang dateng, rezekinya lancar, dan hidupnya makin seru!',
  },
  {
    emoji: '💪',
    title: 'Semoga sehat selalu',
    body: 'Jaga kesehatan ya, jangan lupa makan — ini serius, bukan basa-basi. Semoga fisik dan mentalnya kuat terus, apapun yang lagi dihadapin. Kamu bisa kok.',
  },
  {
    emoji: '🌟',
    title: 'Karir & mimpi-mimpinya',
    body: 'Semoga semua yang lagi dikerjain makin berkembang, kerja kerasnya kebayar, dan impian yang udah lama disimpen di kepala bisa satu-satu terwujud. Aamiin ya!',
  },
  {
    emoji: '😌',
    title: 'Semoga hatinya tenang',
    body: 'Hidup emang kadang ribet dan capek. Tapi semoga Teh Ica bisa selalu nemu ketenangan di tengah semua itu. Nggak harus sempurna kok — yang penting happy.',
  },
  {
    emoji: '🙈',
    title: 'Maap-maap ya kalau...',
    body: 'Aku tau aku orangnya berantakan, kadang nyebelin, dan nggak jago ngomong yang puitis-puitis. Tapi yang pasti, perhatian aku ke kamu itu real, bukan settingan. Percaya deh. (kali ini serius)',
  },
  {
    emoji: '✈️',
    title: 'Soal LDR ini...',
    body: 'Berat sih, bohong kalau bilang enggak. Tapi liat kamu happy aja udah cukup kok. Ntar juga ketemu lagi — ditunggu ya, jangan kemana-mana dulu wkwkwk.',
  },
]

export default function Home({ giftOpened = false, onGiftOpen = () => {} }) {
  const [phase, setPhase] = useState(giftOpened ? 'opened' : 'idle')
  const [flash, setFlash] = useState(false)
  const boxControls       = useAnimation()
  // true jika komponen ini di-mount dalam keadaan sudah open (kembali ke Home)
  // dipakai untuk skip animasi stagger & scrollIntoView supaya tidak geser dari atas
  const isReturning = useRef(giftOpened)

  // Lock scroll body saat idle, unlock saat opened
  React.useEffect(() => {
    if (phase !== 'opened') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [phase])

  // Scroll ke atas setelah opened content benar-benar ada di DOM.
  // Delay 350ms = idle exit animation (300ms) + buffer, supaya tidak kejar-kejaran.
  // isReturning = skip (App.jsx sudah handle scroll saat navigasi balik).
  React.useEffect(() => {
    if (phase === 'opened' && !isReturning.current) {
      const raf1 = requestAnimationFrame(() => {
        window.scrollTo(0, 0)
      })
      const raf2 = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, 0)
        })
      })
      const t = setTimeout(() => {
        window.scrollTo(0, 0)
      }, 380)

      return () => {
        cancelAnimationFrame(raf1)
        cancelAnimationFrame(raf2)
        clearTimeout(t)
      }
    }
  }, [phase])

  const handleGiftTap = async () => {
    if (phase !== 'idle') return
    setPhase('shaking')

    await boxControls.start({
      x:      [0, -14, 14, -10, 10, -6, 6, 0],
      rotate: [0,  -8,  8,  -5,  5,  0],
      scale:  [1,   1,   1,   1,  1, 1.15],
      transition: { duration: 0.55, ease: 'easeInOut' },
    })

    setFlash(true)
    setTimeout(() => setFlash(false), 350)

    onGiftOpen()
    setPhase('opened')
  }

  return (
    <>
      {/* Flash overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div
            className="fixed inset-0 bg-white pointer-events-none z-40"
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* ── IDLE / SHAKING — full screen center, tidak bisa scroll ── */}
        {phase !== 'opened' && (
          <motion.div
            key="idle"
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex flex-col items-center justify-center px-6 gap-6"
            style={{ height: '100dvh', overflow: 'hidden' }}
          >
            {/* Header */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.p
                className="text-pink-400 text-xs font-bold tracking-widest uppercase mb-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎂 5 Juni 2026 🎂
              </motion.p>
              <h1
                className="text-4xl text-pink-500 leading-tight"
                style={{ fontFamily: 'Pacifico, cursive' }}
              >
                Hi Ica!
              </h1>
              <h2 className="text-xl font-extrabold text-purple-400 mt-1">
                Happy 27th Birthday! 🎉
              </h2>
            </motion.div>

            {/* Instruction */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-gray-700 font-extrabold text-base leading-snug">
                Ada kado beneran yang udah aku kirim! 📦
              </p>
              <p className="text-pink-500 font-semibold text-sm mt-1">
                Yuk buka dulu — jangan cuma diliat doang wkwk 🎁
              </p>
            </motion.div>

            {/* Gift box + glow */}
            <div className="relative flex items-center justify-center">
              <motion.div
                className="absolute w-40 h-40 rounded-full bg-pink-300/30"
                animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.15, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <motion.div
                className="absolute w-28 h-28 rounded-full bg-purple-300/25"
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
              />
              <motion.button
                animate={phase === 'idle' ? { y: [0, -14, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                onClick={handleGiftTap}
                className="relative z-10 select-none focus:outline-none"
              >
                <motion.span
                  animate={boxControls}
                  className="text-[96px] drop-shadow-2xl block"
                >
                  🎁
                </motion.span>
              </motion.button>
            </div>

            {/* Tap hint */}
            <motion.div
              className="flex flex-col items-center gap-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              <motion.span
                className="text-2xl"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              >
                👆
              </motion.span>
              <span className="text-pink-400 text-xs font-bold bg-pink-100 px-5 py-2 rounded-full">
                Tap kado ini dulu! ✨
              </span>
            </motion.div>
          </motion.div>
        )}

        {/* ── OPENED — layout normal dari atas ── */}
        {phase === 'opened' && (
          <motion.div
            key="opened"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 px-5 py-9 pb-4"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <p className="text-pink-400 text-xs font-bold tracking-widest uppercase mb-2">
                🎂 5 Juni 2026 🎂
              </p>
              <h1
                className="text-4xl text-pink-500 leading-tight"
                style={{ fontFamily: 'Pacifico, cursive' }}
              >
                Hi Ica!
              </h1>
              <h2 className="text-xl font-extrabold text-purple-400 mt-1">
                Happy 27th Birthday! 🎉
              </h2>
            </div>

            {/* Gift opened — bow + particles + SURPRISE */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative flex items-center justify-center mb-2">
                <div className="relative">
                  {PARTICLES.map((p, i) => (
                    <motion.span
                      key={i}
                      className="absolute pointer-events-none select-none"
                      style={{
                        fontSize: p.size,
                        top: '50%', left: '50%',
                        marginTop: -(p.size / 2),
                        marginLeft: -(p.size / 2),
                      }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                      animate={{ x: p.tx, y: p.ty, opacity: [1, 1, 0], scale: [1, 1.2, 0.4], rotate: p.rotate }}
                      transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
                    >
                      {p.emoji}
                    </motion.span>
                  ))}
                  <motion.span
                    className="text-[88px] drop-shadow-2xl block relative z-10"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                  >
                    🎀
                  </motion.span>
                </div>
              </div>

              <motion.div
                className="text-center mt-4"
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 180, delay: 0.3 }}
              >
                <p className="text-3xl text-pink-500 font-extrabold" style={{ fontFamily: 'Pacifico, cursive' }}>
                  SURPRISE! 🎉
                </p>
                <motion.p
                  className="text-purple-400 text-sm font-bold mt-1"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Dorr, reuwas teuu ? Henteu nyaa wkwkwk 🙈
                </motion.p>
              </motion.div>
            </div>

            {/* Staggered cards
                isReturning → initial sudah "show", skip animasi & scrollIntoView */}
            <motion.div
              initial={isReturning.current ? 'show' : 'hidden'}
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { delayChildren: 0.55, staggerChildren: 0.38 },
                },
              }}
              className="space-y-4"
            >
              {/* Gift message — index=0, tidak scrollIntoView agar layar tetap di atas */}
              <ScrollCard
                variants={{
                  hidden: { opacity: 0, y: 32, scale: 0.88 },
                  show:   { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 110 } },
                }}
                className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl px-6 py-5 shadow-xl border border-pink-200"
              >
                <p className="text-gray-700 text-sm leading-relaxed font-semibold text-center">
                  Iya iya, aku tau mungkin kadonya nggak sempurna.<br />
                  Tapi niatnya tulus kok — jangan dilihat dari harganya ya! 😭🎀
                </p>
                <div className="my-3 h-px bg-pink-200/60" />
                <p className="text-pink-500 text-sm font-bold italic text-center">
                  Semoga Teh Ica suka, kalau nggak suka bilang aja ntar aku ganti wkwk 💕
                </p>
              </ScrollCard>

              {CARDS.map((card, i) => (
                <ScrollCard
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: i % 2 === 0 ? -28 : 28, scale: 0.93 },
                    show:   { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 100 } },
                  }}
                  className="bg-white/75 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-md border border-pink-50"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5 shrink-0">{card.emoji}</span>
                    <div>
                      <h3 className="font-extrabold text-pink-500 text-sm mb-1">{card.title}</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">{card.body}</p>
                    </div>
                  </div>
                </ScrollCard>
              ))}

              {/* Signature */}
              <ScrollCard
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show:   { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="text-center py-2"
              >
                <p className="text-pink-300 text-xs font-semibold">
                  dari Raihan — yang comell hehehe 💕
                </p>
              </ScrollCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
