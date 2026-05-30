import React, { useEffect, useState } from 'react'

const EMOJIS = ['❤️', '🩷', '💕', '💖', '💗', '✨', '🌸', '⭐', '💫']

let _id = 0

export default function FloatingHearts() {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    const spawn = () => {
      const id = ++_id
      const duration = 5 + Math.random() * 5
      setHearts((prev) => [
        ...prev,
        {
          id,
          emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
          left: 3 + Math.random() * 94,
          size: 12 + Math.random() * 18,
          duration,
        },
      ])
      setTimeout(() => setHearts((prev) => prev.filter((h) => h.id !== id)), duration * 1000)
    }

    spawn()
    const iv = setInterval(spawn, 1400)
    return () => clearInterval(iv)
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      style={{ maxWidth: 420, left: '50%', transform: 'translateX(-50%)' }}
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          style={{
            position: 'absolute',
            bottom: -30,
            left: `${h.left}%`,
            fontSize: h.size,
            animation: `heartFloat ${h.duration}s ease-in forwards`,
            opacity: 0.65,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  )
}
