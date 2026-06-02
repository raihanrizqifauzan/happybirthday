import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Target: 5 Juni 2026 00:00:00 WIB (UTC+7)
// const TARGET = new Date(Date.now() + 5000) // TESTING: 5 detik dari sekarang
const TARGET = new Date('2026-06-05T00:00:00+07:00')

function getTimeLeft() {
  const diff = TARGET - Date.now()
  if (diff <= 0) return null
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function Pad({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      {/* Box — fixed 62px, cukup untuk semua ukuran HP */}
      <div className="w-[62px] h-[62px] bg-white/85 backdrop-blur-md rounded-xl shadow-md flex items-center justify-center border border-pink-100">
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{   y:  12, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="text-2xl font-extrabold text-pink-500 tabular-nums leading-none"
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] font-bold text-gray-400 mt-1.5 tracking-widest uppercase">
        {label}
      </span>
    </div>
  )
}

function Colon() {
  return (
    <div className="flex items-center pb-5 px-0.5">
      <motion.span
        className="text-xl font-extrabold text-pink-300 leading-none"
        animate={{ opacity: [1, 0.15, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        :
      </motion.span>
    </div>
  )
}

const SPARKLES = [
  { emoji: '✨', top: '6%',  left: '6%'  },
  { emoji: '🌸', top: '9%',  left: '82%' },
  { emoji: '⭐', top: '32%', left: '3%'  },
  { emoji: '💫', top: '28%', left: '88%' },
  { emoji: '🩷', top: '70%', left: '5%'  },
  { emoji: '🎂', top: '74%', left: '85%' },
]

export default function Countdown({ onComplete }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    const iv = setInterval(() => {
      const t = getTimeLeft()
      if (!t) { clearInterval(iv); setTimeLeft(null); onComplete() }
      else setTimeLeft(t)
    }, 1000)
    return () => clearInterval(iv)
  }, [onComplete])

  if (!timeLeft) return null

  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center z-10 overflow-hidden"
         style={{ padding: '48px 20px 32px' }}>

      {/* Sparkles */}
      {SPARKLES.map((s, i) => (
        <motion.span
          key={i}
          className="absolute text-lg pointer-events-none select-none"
          style={{ top: s.top, left: s.left }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.3, 0.7], rotate: [0, 20, -20, 0] }}
          transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        >
          {s.emoji}
        </motion.span>
      ))}

      {/* Header */}
      <motion.div
        className="text-center mb-7"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-5xl mb-3"
          animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
        >
          🎂
        </motion.div>
        <h1
          className="text-[28px] text-pink-500 leading-tight mb-1.5"
          style={{ fontFamily: 'Pacifico, cursive' }}
        >
          Bentar lagi nih!
        </h1>
        <p className="text-gray-500 text-sm font-semibold">
          Hadiahnya lagi nunggu dibuka wkwk 🎁
        </p>
      </motion.div>

      {/* Countdown row — total lebar ≈ 4×62 + 3×(colon+px) ≈ 295px, aman di 320px */}
      <motion.div
        className="flex items-end gap-1 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
      >
        <Pad value={timeLeft.days}    label="Hari"  />
        <Colon />
        <Pad value={timeLeft.hours}   label="Jam"   />
        <Colon />
        <Pad value={timeLeft.minutes} label="Menit" />
        <Colon />
        <Pad value={timeLeft.seconds} label="Detik" />
      </motion.div>

      {/* Info card */}
      <motion.div
        className="w-full bg-white/80 backdrop-blur-md rounded-3xl px-5 py-5 shadow-xl border border-pink-100 text-center"
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

      {/* Bottom hint */}
      <motion.p
        className="mt-6 text-pink-300 text-xs font-medium text-center leading-relaxed"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        halaman ini akan terbuka sendiri kok pas waktunya 💕
      </motion.p>
    </div>
  )
}
