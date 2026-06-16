import {
  assetUrl,
  type CaseBoard,
  type GameShell,
  type NpcCard,
  type QuestProgress,
  type RumorTrailEntry,
} from '../../lib/play-api'
import { NpcPortrait } from './NpcPortrait'

interface CaseBoardPanelProps {
  caseBoard: CaseBoard | undefined
  assets?: GameShell['assets']
  busy: boolean
  onCommand: (cmd: string) => void
}

export function CaseBoardPanel({ caseBoard, assets, busy, onCommand }: CaseBoardPanelProps) {
  const evidence = caseBoard?.evidenceCards ?? []
  const rumors = caseBoard?.rumorCards ?? []
  const suspects = caseBoard?.suspectCards ?? []
  const evidenceIcon = assetUrl(assets?.evidenceIcon ?? 'assets/ui/evidence-card.png')
  const rumorIcon = assetUrl(assets?.rumorIcon ?? 'assets/ui/rumor-card.png')

  return (
    <>
      <h2 className="font-display font-medium text-text-bright mb-3">Case board</h2>
      <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">Evidence</p>
      {evidence.length === 0 ? (
        <p className="text-xs text-muted italic mb-4">No evidence collected yet.</p>
      ) : (
        <ul className="space-y-2 mb-4">
          {evidence.map((card) => (
            <li key={card.id} className="rounded-lg border border-cyan/25 bg-cyan/5 px-3 py-2 flex gap-2">
              {evidenceIcon && (
                <img src={evidenceIcon} alt="" className="w-8 h-8 object-contain shrink-0 opacity-90" />
              )}
              <div className="min-w-0 flex-1">
              <p className="text-sm text-text-bright">{card.label}</p>
              <p className="text-[10px] font-mono text-muted uppercase">{card.type ?? 'evidence'}</p>
              {card.inspectCommand && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onCommand(card.inspectCommand!)}
                  className="mt-2 font-mono text-[10px] text-cyan-glow hover:underline disabled:opacity-40"
                >
                  Re-inspect
                </button>
              )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">Rumors on board</p>
      {rumors.length === 0 ? (
        <p className="text-xs text-muted italic mb-4">No rumors pinned.</p>
      ) : (
        <ul className="space-y-2 mb-4">
          {rumors.map((card) => (
            <li key={card.id} className="rounded-lg border border-border/70 bg-void/50 px-3 py-2 flex gap-2">
              {rumorIcon && (
                <img src={rumorIcon} alt="" className="w-8 h-8 object-contain shrink-0 opacity-90" />
              )}
              <div className="min-w-0 flex-1">
              <p className="text-sm text-text-bright">{card.label}</p>
              <p className="text-[10px] font-mono text-muted">
                Truth: {card.truthLevel ?? 'unknown'}
                {card.sourceRedacted ? ' · source redacted' : ''}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {card.traceCommand && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onCommand(card.traceCommand!)}
                    className="font-mono text-[10px] px-2 py-1 rounded border border-registry/30 text-registry-glow disabled:opacity-40"
                  >
                    Trace
                  </button>
                )}
                {card.counterCommand && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onCommand(card.counterCommand!)}
                    className="font-mono text-[10px] px-2 py-1 rounded border border-amber/30 text-amber-glow disabled:opacity-40"
                  >
                    Counter
                  </button>
                )}
              </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {suspects.length > 0 && (
        <>
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">Suspects</p>
          <ul className="space-y-1">
            {suspects.map((s) => (
              <li key={s.id} className="text-xs text-muted">
                {s.label} — {s.status ?? 'unknown'}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}

interface RumorTrailPanelProps {
  trail: RumorTrailEntry[] | undefined
  rumorIcon?: string | null
  busy: boolean
  onCommand: (cmd: string) => void
}

export function RumorTrailPanel({ trail, rumorIcon, busy, onCommand }: RumorTrailPanelProps) {
  const entries = trail ?? []
  const iconSrc = assetUrl(rumorIcon ?? 'assets/ui/rumor-card.png')
  return (
    <>
      <h2 className="font-display font-medium text-text-bright mb-3">Rumor trail</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-muted italic">Listen at the market to start the trail.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((r) => (
            <li key={r.id} className="rounded-lg border border-border/60 bg-elevated/30 px-3 py-2 flex gap-2">
              {iconSrc && (
                <img src={iconSrc} alt="" className="w-7 h-7 object-contain shrink-0 opacity-80 mt-0.5" />
              )}
              <div className="min-w-0 flex-1">
              <p className="text-sm text-text-bright">{r.claim}</p>
              <p className="text-[10px] font-mono text-muted mt-1">
                {r.truthLevel ?? r.distortion ?? 'unknown'}
                {r.spreadRisk ? ` · ${r.spreadRisk} spread` : ''}
                {r.sourceRedacted ? ' · source hidden' : r.sourceLabel ? ` · ${r.sourceLabel}` : ''}
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
              {r.traceCommand && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onCommand(r.traceCommand!)}
                  className="font-mono text-[10px] text-cyan-glow hover:underline disabled:opacity-40"
                >
                  Trace rumor
                </button>
              )}
              {r.counterCommand && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onCommand(r.counterCommand!)}
                  className="font-mono text-[10px] text-amber-glow hover:underline disabled:opacity-40"
                >
                  Counter rumor
                </button>
              )}
              </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

interface NpcCardsPanelProps {
  npcs: NpcCard[] | undefined
  busy: boolean
  onSelectNpc: (npc: NpcCard) => void
}

export function NpcCardsPanel({ npcs, busy, onSelectNpc }: NpcCardsPanelProps) {
  const cards = (npcs ?? []).filter((n) => n.atPlayerLocation)
  return (
    <>
      <h2 className="font-display font-medium text-text-bright mb-3">Agents here</h2>
      {cards.length === 0 ? (
        <p className="text-sm text-muted italic">No agents at your location.</p>
      ) : (
        <ul className="space-y-3">
          {cards.map((npc) => (
              <li key={npc.id}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onSelectNpc(npc)}
                  className="w-full text-left rounded-lg border border-border/70 bg-void/40 p-3 hover:border-cyan/35 hover:bg-cyan/5 transition-colors disabled:opacity-40"
                >
                  <div className="flex gap-3">
                    <NpcPortrait npc={npc} size="sm" className="border-cyan/20" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-bright">{npc.name}</p>
                      <p className="text-xs text-muted">{npc.role}</p>
                      <p className="text-[10px] font-mono text-muted mt-1">
                        trust {npc.trust ?? 0} · suspicion {npc.suspicion ?? 0} · {npc.mood ?? 'neutral'}
                      </p>
                      {(npc.topics ?? []).length > 0 && (
                        <p className="text-[10px] font-mono text-cyan-glow/70 mt-1 truncate">
                          {(npc.topics ?? []).slice(0, 3).join(' · ')}
                        </p>
                      )}
                    </div>
                    <span className="self-center font-mono text-[10px] text-cyan/60 shrink-0">Open →</span>
                  </div>
                </button>
              </li>
          ))}
        </ul>
      )}
    </>
  )
}

interface QuestProgressPanelProps {
  quest: QuestProgress | undefined
}

export function QuestProgressPanel({ quest }: QuestProgressPanelProps) {
  if (!quest) return null
  const paths = quest.paths ?? []
  const resolvedId = quest.resolvedPathId

  return (
    <>
      <h2 className="font-display font-medium text-text-bright mb-1">{quest.title ?? 'Quest'}</h2>
      <p className="text-xs text-muted mb-4 leading-relaxed">{quest.objective}</p>
      {quest.incidentStatus && (
        <p className="text-[10px] font-mono text-muted uppercase tracking-widest mb-3">
          Status: <span className="text-cyan-glow/90">{quest.incidentStatus}</span>
        </p>
      )}
      {resolvedId ? (
        <p className="text-sm text-amber-glow font-mono mb-4">
          Resolved: {paths.find((p) => p.id === resolvedId)?.label ?? resolvedId}
        </p>
      ) : null}
      <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">Resolution paths</p>
      {paths.length === 0 ? (
        <p className="text-xs text-muted italic">No paths configured.</p>
      ) : (
        <ul className="space-y-4">
          {paths.map((path) => {
            const progress = path.progress ?? 0
            const isResolved = resolvedId === path.id
            const isLeading =
              !resolvedId && progress > 0 && progress === Math.max(...paths.map((p) => p.progress ?? 0))
            return (
              <li
                key={path.id}
                className={`rounded-lg border p-3 transition-colors ${
                  isResolved
                    ? 'border-amber/40 bg-amber/8'
                    : isLeading
                      ? 'border-cyan/35 bg-cyan/5'
                      : 'border-border/60 bg-void/30'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-sm font-medium text-text-bright">{path.label}</p>
                  <span className="font-mono text-[10px] text-muted shrink-0">{progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-void/80 border border-border/40 overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isResolved
                        ? 'bg-gradient-to-r from-amber/70 to-amber-glow'
                        : 'bg-gradient-to-r from-cyan/50 to-cyan-glow'
                    }`}
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
                <ul className="space-y-1">
                  {path.steps?.map((s) => (
                    <li key={s.step} className={`text-xs font-mono ${s.done ? 'text-cyan-glow' : 'text-muted'}`}>
                      {s.done ? '✓' : '○'} {s.step}
                    </li>
                  ))}
                </ul>
                {path.complete && !resolvedId && (
                  <p className="text-[10px] font-mono text-amber-glow/90 mt-2">Ready to resolve</p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
