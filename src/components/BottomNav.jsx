import React from 'react'
import { motion } from 'framer-motion'

const TABS = [
  { id: 'music',   emoji: '🎵', label: ''   },
  { id: 'home',    emoji: '🏠', label: ''    },
  { id: 'gallery', emoji: '📸', label: '' },
]

export default function BottomNav({ current, onChange }) {
  return (
    // Outer div: handles CSS fixed + center positioning — no Framer Motion here
    // so translateX(-50%) is never overwritten by motion transforms
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
      {/* Inner motion element: slide-up animation only, no positional transform */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
        className="mx-4 mb-5 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-pink-100/60 px-2 py-2.5"
      >
        <div className="flex justify-around items-center">
          {TABS.map((tab) => {
            const active = current === tab.id
            return (
              <motion.button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                whileTap={{ scale: 0.87 }}
                className={`
                  flex flex-col items-center gap-1 px-5 py-1.5 rounded-xl transition-all duration-200
                  ${active ? 'bg-pink-100' : ''}
                `}
              >
                <motion.span
                  className="text-2xl leading-none"
                  animate={active ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {tab.emoji}
                </motion.span>
                <span
                  className={`text-[11px] font-bold tracking-wide ${
                    active ? 'text-pink-500' : 'text-gray-400'
                  }`}
                >
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
