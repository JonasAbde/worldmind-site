import type { QuestProgress } from '../../../lib/play-api'

interface PlayQuestTrackerProps {
  quest: QuestProgress | undefined
  expanded?: boolean
  onToggle?: () => void
}

function nextQuestStep(quest: QuestProgress): string | null {
  for (const path of quest.paths ?? []) {
    const steps = path.steps ?? []
    const pending = steps.find((s) => !s.done)
    if (pending?.step) return pending.step
  }
  return quest.objective ?? null
}

export function PlayQuestTracker({ quest, expanded, onToggle }: PlayQuestTrackerProps) {
  if (!quest) return null

  const step = nextQuestStep(quest)
  const leading = (quest.paths ?? []).find(
    (p) => !quest.resolvedPathId && (p.progress ?? 0) > 0,
  )

  return (
    <div className="play-hud-panel p-3 max-w-[min(280px,88vw)] pointer-events-auto">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left"
        aria-expanded={expanded}
      >
        <p className="font-mono text-[9px] text-amber/80 uppercase tracking-[0.22em] mb-1">
          Objective
        </p>
        <p className="font-display text-sm text-text-bright leading-snug">
          {quest.title ?? 'The Missing Delivery'}
        </p>
        {step && (
          <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed">
            → {step}
          </p>
        )}
        {leading && !expanded && (
          <p className="font-mono text-[9px] text-cyan-glow/80 mt-1.5">
            {leading.label} · {Math.round((leading.progress ?? 0) * 100)}%
          </p>
        )}
      </button>
      {expanded && quest.incidentStatus && (
        <p className="font-mono text-[9px] text-muted uppercase tracking-widest mt-2 pt-2 border-t border-border/40">
          {quest.incidentStatus}
        </p>
      )}
    </div>
  )
}
