import React from 'react'
import { motion } from 'framer-motion'

const TABS = [
  { id: 'music',   emoji: '🎵', label: 'Musik'   },
  { id: 'home',    emoji: '🏠', label: 'Home'    },
  { id: 'gallery', emoji: '📸', label: 'Gallery' },
]

export default function BottomNav({ current, onChange, giftOpened }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 420,
        zIndex: 50,
      }}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
        className="mx-4 mb-5 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-pink-100/60 px-2 py-2.5"
      >
        <div className="flex justify-around items-center">
          {TABS.map((tab) => {
            const active   = current === tab.id
            // Music & Gallery dikunci sampai kado dibuka
            const locked   = tab.id !== 'home' && !giftOpened

            return (
              <motion.button
                key={tab.id}
                onClick={() => !locked && onChange(tab.id)}
                whileTap={locked ? {} : { scale: 0.87 }}
                className={`
                  relative flex flex-col items-center gap-1 px-5 py-1.5 rounded-xl transition-all duration-200
                  ${active ? 'bg-pink-100' : ''}
                  ${locked ? 'opacity-35 cursor-not-allowed' : ''}
                `}
              >
                <motion.span
                  className="text-2xl leading-none"
                  animate={active ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {locked ? '🔒' : tab.emoji}
                </motion.span>
                <span className={`text-[11px] font-bold tracking-wide ${active ? 'text-pink-500' : 'text-gray-400'}`}>
                  {tab.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
