import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CORRECT = '2026-03-15'

const SPARKLES = [
  { emoji: '✨', top: '8%',  left: '10%' },
  { emoji: '🌸', top: '12%', left: '82%' },
  { emoji: '💫', top: '28%', left: '5%'  },
  { emoji: '⭐', top: '22%', left: '90%' },
  { emoji: '🩷', top: '70%', left: '8%'  },
  { emoji: '💕', top: '75%', left: '85%' },
]

export default function LockScreen({ onUnlock }) {
  const [date, setDate]       = useState('')
  const [status, setStatus]   = useState('idle') // idle | error | success

  const handleSubmit = () => {
    if (!date) { setStatus('error'); return }
    if (date === CORRECT) {
      setStatus('success')
      setTimeout(onUnlock, 1600)
    } else {
      setStatus('error')
    }
  }

  const handleChange = (e) => {
    setDate(e.target.value)
    setStatus('idle')
  }

  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center px-6 py-12 z-10">

      {/* Background sparkles */}
      {SPARKLES.map((s, i) => (
        <motion.span
          key={i}
          className="absolute text-xl pointer-events-none select-none"
          style={{ top: s.top, left: s.left }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.3, 0.7], rotate: [0, 25, -25, 0] }}
          transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: i * 0.35 }}
        >
          {s.emoji}
        </motion.span>
      ))}

      {/* Lock icon */}
      <motion.div
        className="mb-7"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-300 via-pink-400 to-purple-400 flex items-center justify-center shadow-2xl pulse-glow">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.span
                key="gift"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220 }}
                className="text-4xl"
              >
                🎁
              </motion.span>
            ) : (
              <motion.span key="lock" className="text-4xl" exit={{ scale: 0, rotate: 180 }}>
                🔐
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        className="w-full max-w-sm bg-white/85 backdrop-blur-md rounded-3xl px-7 py-8 shadow-2xl border border-pink-100"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 90 }}
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h1
            className="text-3xl text-pink-500 leading-tight"
            style={{ fontFamily: 'Pacifico, cursive' }}
          >
            Unlock Hadiah
          </h1>
          <p className="text-gray-400 text-sm mt-1.5">Jawab dulu, baru boleh masuk — nggak bisa skip wkwk 😄</p>
        </div>

        {/* Question */}
        <div className="bg-pink-50/80 border border-pink-100 rounded-2xl px-4 py-4 mb-5 text-center">
          <p className="text-gray-700 font-semibold text-sm">
            💭 Kapan pertama kali kita ketemu?
          </p>
          <p className="text-pink-400 text-xs mt-2 italic font-medium">
            *clue: bareng Dadan hehehe
          </p>
        </div>

        {/* Date input */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-0.5">
            Pilih tanggal:
          </label>
          <input
            type="date"
            value={date}
            onChange={handleChange}
            className={`
              w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-700
              outline-none transition-all duration-200
              ${status === 'error'
                ? 'border-red-300 bg-red-50 focus:border-red-400'
                : date
                  ? 'border-green-300 bg-green-50 focus:border-green-400'
                  : 'border-pink-200 bg-pink-50 focus:border-pink-400 focus:bg-white'
              }
            `}
          />
        </div>

        {/* Feedback messages */}
        <AnimatePresence>
          {status === 'error' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-center">
                <p className="text-red-500 text-xs font-semibold leading-relaxed">
                  Eitss belum tepat 😝<br />
                  Coba tanyain dulu kalau pengen tau jawabannya.
                </p>
              </div>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center">
                <p className="text-green-600 text-xs font-semibold">
                  🎉 Bener! Nah itu tau. Selamat datang wkwk~
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <motion.button
          onClick={handleSubmit}
          disabled={status === 'success'}
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-bold py-4 rounded-2xl shadow-lg text-sm tracking-wide disabled:opacity-60 transition-opacity"
        >
          {status === 'success' ? '✨ Membuka hadiah...' : 'Buka Hadiahnya 🎁'}
        </motion.button>
      </motion.div>

      {/* Hint below card */}
      <motion.p
        className="mt-7 text-pink-300 text-xs text-center font-medium"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        ada hadiah beneran di dalem, ayo cepet jawab wkwk 🎁
      </motion.p>
    </div>
  )
}
