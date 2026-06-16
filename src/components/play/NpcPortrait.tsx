import { useMemo, useState } from 'react'
import { npcPortraitCandidates, type NpcCard } from '../../lib/play-api'

interface NpcPortraitProps {
  npc: Pick<NpcCard, 'id' | 'portrait' | 'avatar'>
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClass = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
} as const

export function NpcPortrait({ npc, className = '', size = 'sm' }: NpcPortraitProps) {
  const candidates = useMemo(() => npcPortraitCandidates(npc), [npc])
  const [index, setIndex] = useState(0)
  const src = candidates[index] ?? null

  if (!src) {
    return (
      <div
        className={`${sizeClass[size]} rounded-md bg-elevated border border-border/50 shrink-0 ${className}`}
        aria-hidden
      />
    )
  }

  return (
    <img
      src={src}
      alt=""
      className={`${sizeClass[size]} rounded-md object-cover border border-border/50 shrink-0 ${className}`}
      onError={() => {
        if (index < candidates.length - 1) setIndex((i) => i + 1)
      }}
    />
  )
}
