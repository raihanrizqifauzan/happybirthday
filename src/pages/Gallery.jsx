import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PHOTOS = [
  {
    src: '/assets/gallery/IMG-20260503-WA0002.jpg',
    caption: 'cantik. titik.',
    color: 'from-pink-200 via-rose-100 to-pink-50',
  },
  {
    src: '/assets/gallery/IMG-20260507-WA0015.jpg',
    caption: 'ya gini lah orangnya.',
    color: 'from-purple-200 via-violet-100 to-purple-50',
  },
  {
    src: '/assets/gallery/ssstik.io_1780389396799.webp',
    caption: 'nggak ada caption yang cukup.',
    color: 'from-blue-200 via-sky-100 to-blue-50',
  },
  {
    src: '/assets/gallery/ssstik.io_1780389403663.webp',
    caption: 'selalu bikin aku diem sebentar.',
    color: 'from-green-200 via-emerald-100 to-green-50',
  },
  {
    src: '/assets/gallery/ssstik.io_1780389407713.webp',
    caption: 'favorit. sudah.',
    color: 'from-yellow-200 via-amber-100 to-yellow-50',
  },
]

const ROTATIONS = [-2, 1.5, -1, 2, -1.5]

export default function Gallery() {
  const [idx, setIdx]         = useState(0)
  const [dir, setDir]         = useState(0)
  const [errors, setErrors]   = useState({})
  const touchStart             = useRef(null)

  const goTo = (next) => {
    setDir(next > idx ? 1 : -1)
    setIdx(next)
  }
  const prev = () => { if (idx > 0) goTo(idx - 1) }
  const next = () => { if (idx < PHOTOS.length - 1) goTo(idx + 1) }

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX }
  const onTouchEnd   = (e) => {
    if (touchStart.current === null) return
    const delta = e.changedTouches[0].clientX - touchStart.current
    if (delta < -48) next()
    else if (delta > 48) prev()
    touchStart.current = null
  }

  const photo = PHOTOS[idx]

  return (
    <div className="relative min-h-screen px-5 py-9 z-10">

      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-pink-400 text-xs font-bold tracking-widest uppercase mb-1">
          📸 Koleksi Foto
        </p>
        <h1 className="text-xl font-extrabold text-gray-700">Teh Ica yang cantik 🌸</h1>
      </motion.div>

      {/* Polaroid carousel */}
      <div
        className="flex justify-center mb-6"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative w-72 h-96">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              initial={{ x: dir * 310, opacity: 0, rotate: dir * 6 }}
              animate={{ x: 0, opacity: 1, rotate: ROTATIONS[idx % ROTATIONS.length] }}
              exit={{ x: dir * -310, opacity: 0, rotate: dir * -6 }}
              transition={{ type: 'spring', stiffness: 210, damping: 26 }}
              className="absolute inset-0 bg-white rounded-2xl p-4 pb-16 shadow-2xl border border-gray-100"
              style={{ boxShadow: '0 10px 40px rgba(220,120,180,0.22), 0 2px 10px rgba(0,0,0,0.08)' }}
            >
              {/* Photo area */}
              <div
                className={`w-full h-64 rounded-xl bg-gradient-to-br ${photo.color} overflow-hidden flex items-center justify-center`}
              >
                {errors[idx] ? (
                  <div className="flex flex-col items-center gap-2 opacity-70">
                    <span className="text-5xl">📷</span>
                    <p className="text-gray-400 text-xs text-center px-3 font-medium">
                      Foto akan hadir di sini 🌸
                    </p>
                  </div>
                ) : (
                  <img
                    src={photo.src}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => setErrors((p) => ({ ...p, [idx]: true }))}
                  />
                )}
              </div>

              {/* Caption area */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-center">
                <p className="text-gray-600 text-xs font-semibold leading-snug text-center w-full">{photo.caption}</p>
              </div>

              {/* Tape decoration */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-yellow-200/55 rounded-sm rotate-1 backdrop-blur-sm border border-yellow-200/40" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-4">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={prev}
          disabled={idx === 0}
          className="w-11 h-11 rounded-full bg-white/90 border border-pink-100 shadow-md flex items-center justify-center text-gray-500 disabled:opacity-30 transition-opacity"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </motion.button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {PHOTOS.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              animate={{ scale: i === idx ? 1.35 : 1, opacity: i === idx ? 1 : 0.45 }}
              className={`rounded-full transition-colors ${
                i === idx ? 'w-4 h-2.5 bg-pink-400' : 'w-2.5 h-2.5 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={next}
          disabled={idx === PHOTOS.length - 1}
          className="w-11 h-11 rounded-full bg-white/90 border border-pink-100 shadow-md flex items-center justify-center text-gray-500 disabled:opacity-30 transition-opacity"
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Counter */}
      <p className="text-center text-gray-400 text-xs font-medium mb-8">
        {idx + 1} dari {PHOTOS.length} foto
      </p>

      {/* Swipe hint */}
      <motion.p
        className="text-center text-pink-300 text-xs mb-6"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        ← Geser untuk melihat foto lainnya →
      </motion.p>

      {/* Love note */}
      <motion.div
        className="bg-white/85 backdrop-blur-md rounded-3xl px-6 py-5 shadow-xl border border-pink-100"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-center text-gray-600 text-sm leading-relaxed">
          LDR emang nyebelin, tapi liat foto kamu kayak gini langsung makin kangen. Terus gimana dong? 😭
          <br /><span className="text-pink-400 font-bold">Pokoknya cepet ketemu ya!</span>
        </p>
      </motion.div>
    </div>
  )
}
