import { formatNextUnlock, progressionXpPercent, type GameShellProgression } from '../../lib/play-api'

interface ProgressionPanelProps {
  progression: GameShellProgression | undefined
}

export function ProgressionPanel({ progression }: ProgressionPanelProps) {
  if (!progression) return null

  const level = progression.level ?? 1
  const xp = progression.xp ?? 0
  const pct = progressionXpPercent(progression)
  const nextLabel = formatNextUnlock(progression.nextUnlock)
  const nextXp = progression.nextLevelAt ?? null

  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-2">
        <h2 className="font-display font-medium text-text-bright">Progression</h2>
        <span className="font-mono text-[10px] text-cyan-glow uppercase tracking-wider">
          Lv {level}
        </span>
      </div>
      <p className="text-xs text-muted mb-2">{progression.title ?? 'Observer'}</p>
      <div className="h-2 rounded-full bg-void/80 border border-border/50 overflow-hidden mb-2">
        <div
          className="h-full bg-gradient-to-r from-cyan/60 to-cyan-glow transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="font-mono text-[10px] text-muted mb-3">
        {xp} XP
        {progression.xpToNext != null && progression.xpToNext > 0
          ? ` · ${progression.xpToNext} to next level`
          : nextXp != null
            ? ` / ${nextXp}`
            : ''}
      </p>
      {nextLabel && (
        <p className="text-xs text-amber-glow/90 mb-2">
          Next unlock: {nextLabel}
        </p>
      )}
      {(progression.capabilities ?? []).length > 0 && (
        <ul className="space-y-1">
          {(progression.capabilities ?? []).slice(0, 4).map((cap) => (
            <li key={cap.id} className="font-mono text-[10px] flex items-center gap-2">
              <span className={cap.unlocked ? 'text-cyan-glow' : 'text-muted'}>
                {cap.unlocked ? '✓' : '○'}
              </span>
              <span className={cap.unlocked ? 'text-text' : 'text-muted'}>{cap.label ?? cap.id}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
