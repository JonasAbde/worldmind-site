import { motion } from 'framer-motion'
import { useMemo } from 'react'

export function RainEffect() {
  const drops = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: `${(i * 17) % 100}%`,
        delay: (i * 0.13) % 3,
        duration: 1.2 + (i % 5) * 0.3,
        opacity: 0.15 + (i % 4) * 0.08,
      })),
    [],
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute w-px h-8 bg-gradient-to-b from-transparent via-slate-400/40 to-transparent"
          style={{ left: drop.left, opacity: drop.opacity }}
          animate={{ y: ['-10%', '110%'] }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
