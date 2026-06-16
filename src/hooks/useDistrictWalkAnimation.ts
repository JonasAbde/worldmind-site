import { useEffect, useRef, useState } from 'react'
import { easeInOutCubic, getWalkNodePath } from '../lib/district-walk-utils'
import type { WalkAnimation } from '../lib/play-api'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export function useDistrictWalkAnimation(
  animation: WalkAnimation | null,
  onComplete?: () => void,
) {
  const reducedMotion = usePrefersReducedMotion()
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const [progress, setProgress] = useState(0)
  const [isWalking, setIsWalking] = useState(false)

  useEffect(() => {
    if (!animation) {
      setProgress(0)
      setIsWalking(false)
      return
    }

    const path = getWalkNodePath(animation)
    if (!path.length && !animation.waypoints?.length) {
      setProgress(0)
      setIsWalking(false)
      return
    }

    if (reducedMotion) {
      setProgress(1)
      setIsWalking(false)
      onCompleteRef.current?.()
      return
    }

    setIsWalking(true)
    setProgress(0)
    const start = performance.now()
    const duration = animation.durationMs ?? 1200
    let raf = 0

    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / duration)
      setProgress(easeInOutCubic(raw))
      if (raw >= 1) {
        setIsWalking(false)
        onCompleteRef.current?.()
      } else {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [animation, reducedMotion])

  return { progress, isWalking }
}
