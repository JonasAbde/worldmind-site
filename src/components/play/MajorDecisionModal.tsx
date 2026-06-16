import type { MajorDecision } from '../../lib/play-api'

interface MajorDecisionModalProps {
  decision: MajorDecision
  command: string
  busy: boolean
  onBranchAndContinue: () => void
  onContinueWithout: () => void
  onCancel: () => void
}

export function MajorDecisionModal({
  decision,
  command,
  busy,
  onBranchAndContinue,
  onContinueWithout,
  onCancel,
}: MajorDecisionModalProps) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wm-major-decision-title"
    >
      <div className="w-full max-w-md rounded-xl border border-amber/40 bg-surface shadow-[0_0_40px_rgba(245,158,11,0.15)] p-6">
        <p className="font-mono text-[10px] text-amber-glow uppercase tracking-[0.2em] mb-2">Major decision</p>
        <h2 id="wm-major-decision-title" className="font-display text-xl font-semibold text-text-bright mb-2">
          {decision.label}
        </h2>
        <p className="text-sm text-muted leading-relaxed mb-6">
          Create a branch snapshot before <span className="text-cyan-glow font-mono text-xs">{command}</span>? You can
          continue without branching if save fails.
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={onBranchAndContinue}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-amber to-amber-glow text-void disabled:opacity-50"
          >
            Branch &amp; continue
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onContinueWithout}
            className="w-full py-2.5 rounded-lg text-sm border border-border text-text hover:border-cyan/40 disabled:opacity-50"
          >
            Continue without branch
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="w-full py-2 text-sm text-muted hover:text-text disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
