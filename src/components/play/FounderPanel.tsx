import {
  founderContractCommand,
  type GameShellFounder,
} from '../../lib/play-api'

interface FounderPanelProps {
  founder: GameShellFounder
  busy: boolean
  onCommand: (cmd: string) => void
}

export function FounderPanel({ founder, busy, onCommand }: FounderPanelProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 className="font-display font-medium text-text-bright">Founder</h2>
        <span
          className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
            founder.unlocked
              ? 'border-amber/40 text-amber-glow bg-amber/10'
              : 'border-border text-muted bg-elevated/60'
          }`}
        >
          {founder.unlocked ? founder.tierLabel ?? 'unlocked' : 'locked'}
        </span>
      </div>
      <p className="text-sm text-muted leading-relaxed mb-4">
        {founder.unlockText ?? 'Resolve The Missing Delivery to unlock founder loop.'}
      </p>
      <ul className="text-xs font-mono text-muted space-y-1 mb-4">
        <li>Base level: {founder.baseLevel ?? 0}</li>
        <li>Contracts completed: {founder.contractsCompleted ?? 0}</li>
        {founder.activeContract && <li>Active: {founder.activeContract}</li>}
      </ul>
      <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">Contracts</p>
      {founder.contracts.length === 0 ? (
        <p className="text-sm text-muted italic">No contract offers yet.</p>
      ) : (
        <ul className="space-y-2 mb-4">
          {founder.contracts.map((c) => {
            const cmd = founderContractCommand(c, founder)
            const status = c.status ?? (c.locked ? 'locked' : 'available')
            return (
              <li key={c.id} className="rounded-lg border border-border/70 bg-void/50 p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm text-text-bright">{c.label}</p>
                  <span className="font-mono text-[9px] uppercase text-muted">{status}</span>
                </div>
                {c.customer && <p className="text-xs text-muted mb-1">Customer: {c.customer}</p>}
                {c.payout != null && <p className="text-xs text-muted mb-2">Payout: {c.payout}</p>}
                {cmd ? (
                  <button
                    type="button"
                    disabled={busy || !founder.unlocked}
                    onClick={() => onCommand(cmd)}
                    className="font-mono text-xs px-3 py-1.5 rounded-md border border-registry/35 text-registry-glow bg-registry/5 hover:bg-registry/12 disabled:opacity-40 transition-colors"
                  >
                    {status === 'active' ? 'Run delivery' : 'Start contract'}
                  </button>
                ) : (
                  <p className="text-xs text-muted italic">Locked — complete more contracts</p>
                )}
              </li>
            )
          })}
        </ul>
      )}
      {founder.unlocked && (
        <button
          type="button"
          disabled={busy}
          onClick={() => onCommand('list_contracts')}
          className="font-mono text-xs text-cyan-glow hover:underline disabled:opacity-50"
        >
          Refresh contract list
        </button>
      )}
    </>
  )
}
