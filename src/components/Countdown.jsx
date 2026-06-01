import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Target: 5 Juni 2026 00:00:00 WIB (UTC+7)
// const TARGET = new Date('2026-06-05T00:00:00+07:00')
const TARGET = new Date(Date.now() + 5000) // TESTING: 5 detik dari sekarang

function getTimeLeft() {
  const diff = TARGET - Date.now()
  if (diff <= 0) return null
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
}

function Pad({ value, label }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative">
        <div className="w-[72px] h-[72px] bg-white/80 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center border border-pink-100">
          <AnimatePresence mode="wait">
            <motion.span
              key={value}
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-3xl font-extrabold text-pink-500 tabular-nums leading-none"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {String(value).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <span className="text-xs font-bold text-gray-400 mt-2 tracking-wide uppercase">{label}</span>
    </motion.div>
  )
}

const SPARKLES = [
  { emoji: '✨', top: '7%',  left: '8%'  },
  { emoji: '🌸', top: '10%', left: '80%' },
  { emoji: '⭐', top: '30%', left: '4%'  },
  { emoji: '💫', top: '25%', left: '88%' },
  { emoji: '🩷', top: '68%', left: '6%'  },
  { emoji: '🎂', top: '72%', left: '84%' },
]

export default function Countdown({ onComplete }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    const iv = setInterval(() => {
      const t = getTimeLeft()
      if (!t) {
        clearInterval(iv)
        setTimeLeft(null)
        onComplete()
      } else {
        setTimeLeft(t)
      }
    }, 1000)
    return () => clearInterval(iv)
  }, [onComplete])

  // Sudah lewat target saat pertama load
  if (!timeLeft) return null

  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center px-6 py-12 z-10 overflow-hidden">

      {/* Background sparkles */}
      {SPARKLES.map((s, i) => (
        <motion.span
          key={i}
          className="absolute text-xl pointer-events-none select-none"
          style={{ top: s.top, left: s.left }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.3, 0.7], rotate: [0, 20, -20, 0] }}
          transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        >
          {s.emoji}
        </motion.span>
      ))}

      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-5xl mb-4"
          animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          🎂
        </motion.div>
        <h1
          className="text-3xl text-pink-500 leading-tight mb-2"
          style={{ fontFamily: 'Pacifico, cursive' }}
        >
          Bentar lagi nih!
        </h1>
        <p className="text-gray-500 text-sm font-semibold">
          Hadiahnya lagi nunggu dibuka wkwk 🎁
        </p>
      </motion.div>

      {/* Countdown boxes */}
      <motion.div
        className="flex gap-3 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
      >
        <Pad value={timeLeft.days}    label="Hari"   />
        <div className="flex items-center pb-5">
          <motion.span
            className="text-2xl font-extrabold text-pink-300 mx-0.5"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >:</motion.span>
        </div>
        <Pad value={timeLeft.hours}   label="Jam"    />
        <div className="flex items-center pb-5">
          <motion.span
            className="text-2xl font-extrabold text-pink-300 mx-0.5"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >:</motion.span>
        </div>
        <Pad value={timeLeft.minutes} label="Menit"  />
        <div className="flex items-center pb-5">
          <motion.span
            className="text-2xl font-extrabold text-pink-300 mx-0.5"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >:</motion.span>
        </div>
        <Pad value={timeLeft.seconds} label="Detik"  />
      </motion.div>

      {/* Info card */}
      <motion.div
        className="w-full max-w-sm bg-white/80 backdrop-blur-md rounded-3xl px-6 py-5 shadow-xl border border-pink-100 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-gray-600 text-sm font-semibold leading-relaxed">
          Website ini bakal buka otomatis pas tanggal
        </p>
        <p className="text-pink-500 text-base font-extrabold mt-1">
          5 Juni 2026 • 00:00 WIB 🎉
        </p>
        <div className="mt-3 h-px bg-pink-100" />
        <p className="text-gray-400 text-xs mt-3 leading-relaxed">
          Sabar dulu ya — ada yang spesial nunggu di dalem 🙈
        </p>
      </motion.div>

      {/* Pulse bottom text */}
      <motion.p
        className="mt-8 text-pink-300 text-xs font-medium text-center"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        halaman ini akan terbuka sendiri kok pas waktunya 💕
      </motion.p>
    </div>
  )
}
