import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export function AmbientCursor() {
  const reduced = usePrefersReducedMotion()
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const springX = useSpring(x, { stiffness: 120, damping: 28, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 120, damping: 28, mass: 0.4 })

  useEffect(() => {
    if (reduced) return
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (coarse) return

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced, x, y])

  if (reduced) return null

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[60] hidden md:block"
      aria-hidden
    >
      <motion.div
        className="absolute w-[520px] h-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: springX,
          top: springY,
          background:
            'radial-gradient(circle, rgba(34,211,238,0.07) 0%, rgba(59,130,246,0.04) 35%, transparent 70%)',
        }}
      />
      <motion.div
        className="absolute w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: springX,
          top: springY,
          background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 65%)',
        }}
      />
    </motion.div>
  )
}
