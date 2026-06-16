import type { ConsequenceBeat } from '../../lib/play-api'

export function ConsequencePanel({ beat }: { beat: ConsequenceBeat | null | undefined }) {
  if (!beat?.bullets?.length) return null

  return (
    <div className="rounded-lg border border-cyan/25 bg-cyan/5 p-4">
      <p className="font-mono text-[10px] text-cyan-glow uppercase tracking-widest mb-2">Consequences</p>
      <ul className="space-y-1.5">
        {beat.bullets.map((b, i) => (
          <li key={`${b.category}-${i}`} className="text-sm text-text flex gap-2">
            <span className="font-mono text-[10px] text-muted uppercase shrink-0 w-20">{b.category}</span>
            <span>{b.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
