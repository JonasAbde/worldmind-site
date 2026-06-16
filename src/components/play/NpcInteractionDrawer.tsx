import { motion } from 'framer-motion'
import type { NpcCard } from '../../lib/play-api'
import { NpcPortrait } from './NpcPortrait'

interface NpcInteractionDrawerProps {
  npc: NpcCard | null
  busy: boolean
  onClose: () => void
  onCommand: (cmd: string) => void
}

function RelationshipBar({
  label,
  value = 0,
  max = 10,
  tone,
}: {
  label: string
  value?: number
  max?: number
  tone: 'cyan' | 'amber' | 'registry'
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const fill =
    tone === 'cyan'
      ? 'bg-gradient-to-r from-cyan/60 to-cyan-glow'
      : tone === 'amber'
        ? 'bg-gradient-to-r from-amber/60 to-amber-glow'
        : 'bg-gradient-to-r from-registry/60 to-registry-glow'

  return (
    <div>
      <div className="flex justify-between text-[10px] font-mono mb-1">
        <span className="text-muted uppercase tracking-wider">{label}</span>
        <span className="text-text-bright">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-void/80 border border-border/50 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${fill}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function NpcInteractionDrawer({ npc, busy, onClose, onCommand }: NpcInteractionDrawerProps) {
  if (!npc) return null

  const topics = npc.topics ?? []
  const actions = npc.actions ?? []

  const runAndClose = (cmd: string) => {
    onCommand(cmd)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[70] flex justify-end" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-void/70 backdrop-blur-sm"
        aria-label="Close agent drawer"
        onClick={onClose}
      />
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md h-full border-l border-cyan/25 bg-surface shadow-[-8px_0_48px_rgba(34,211,238,0.12)] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wm-npc-drawer-title"
      >
        <div className="flex items-start gap-4 p-5 border-b border-border/50">
          <NpcPortrait npc={npc} size="md" className="border-cyan/30 rounded-lg" />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] text-cyan/70 uppercase tracking-[0.2em] mb-1">Agent</p>
            <h2 id="wm-npc-drawer-title" className="font-display text-xl font-semibold text-text-bright truncate">
              {npc.name}
            </h2>
            <p className="text-sm text-muted">{npc.role}</p>
            <p className="text-[10px] font-mono text-muted mt-1 capitalize">Mood: {npc.mood ?? 'neutral'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-sm text-muted hover:text-cyan-glow px-2"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <section>
            <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">Relationship</p>
            <div className="space-y-3 rounded-lg border border-border/60 bg-void/40 p-4">
              <RelationshipBar label="Trust" value={npc.trust ?? 0} tone="cyan" />
              <RelationshipBar label="Suspicion" value={npc.suspicion ?? 0} tone="amber" />
              <RelationshipBar label="Fear" value={npc.fear ?? 0} tone="registry" />
            </div>
          </section>

          {topics.length > 0 && (
            <section>
              <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">Known topics</p>
              <div className="flex flex-wrap gap-1.5">
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className="font-mono text-[10px] px-2 py-1 rounded-full border border-cyan/25 text-cyan-glow bg-cyan/5"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </section>
          )}

          {npc.lockedTopics && npc.lockedTopics.length > 0 && (
            <section>
              <p className="font-mono text-[10px] text-amber-glow/80 uppercase tracking-widest mb-2">Locked topics</p>
              <ul className="space-y-1.5">
                {npc.lockedTopics.map((t) => (
                  <li key={t.topic} className="text-xs text-muted font-mono">
                    {t.topic} — requires trust {t.minTrust}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">Risks</p>
            <p className="text-xs text-muted leading-relaxed">
              {(npc.suspicion ?? 0) >= 5
                ? 'High suspicion — pressure tactics may backfire.'
                : (npc.trust ?? 0) < 2
                  ? 'Low trust — sensitive topics stay locked.'
                  : 'Stable enough for direct dialogue and trade.'}
            </p>
          </section>

          <section>
            <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">Actions</p>
            <div className="flex flex-col gap-2">
              {actions.length === 0 ? (
                <p className="text-xs text-muted italic">No actions available.</p>
              ) : (
                actions.map((action) => (
                  <button
                    key={`${npc.id}-${action.command}`}
                    type="button"
                    disabled={busy}
                    onClick={() => runAndClose(action.command)}
                    className="w-full text-left font-mono text-xs px-4 py-2.5 rounded-lg border border-cyan/30 text-cyan-glow bg-cyan/5 hover:bg-cyan/12 disabled:opacity-40 transition-colors"
                  >
                    {action.label}
                  </button>
                ))
              )}
            </div>
          </section>
        </div>
      </motion.aside>
    </div>
  )
}
