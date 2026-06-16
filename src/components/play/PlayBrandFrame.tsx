import type { ReactNode } from 'react'

interface PlayBrandFrameProps {
  children: ReactNode
  /** `game` = lighter vignette for full-bleed 3D play */
  variant?: 'default' | 'game'
}

/** Subtle vignette + Nordic cyberpunk frame aligned with static-dashboard depth. */
export function PlayBrandFrame({ children, variant = 'default' }: PlayBrandFrameProps) {
  const isGame = variant === 'game'
  return (
    <div className="relative min-h-screen bg-void text-text noise-overlay">
      <div
        className={`pointer-events-none fixed inset-0 z-[50] ${isGame ? 'vignette-game' : 'vignette'}`}
        aria-hidden
      />
      <div
        className={`pointer-events-none fixed inset-0 z-[51] ${isGame ? 'play-brand-frame-game' : 'play-brand-frame'}`}
        aria-hidden
      />
      <div className="relative z-[10]">{children}</div>
    </div>
  )
}
