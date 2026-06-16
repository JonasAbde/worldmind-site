import {
  assetUrl,
  founderContractCommand,
  type GameShell,
  type GameShellFounder,
  type FounderContract,
  type FounderDeliveryProgress,
} from '../../lib/play-api'

interface FounderPanelProps {
  founder: GameShellFounder
  assets?: GameShell['assets']
  busy: boolean
  onCommand: (cmd: string) => void
  compact?: boolean
}

function statusStyles(status: string) {
  switch (status) {
    case 'active':
      return 'border-cyan/40 text-cyan-glow bg-cyan/10'
    case 'available':
      return 'border-amber/40 text-amber-glow bg-amber/10'
    default:
      return 'border-border text-muted bg-elevated/60'
  }
}

function tierBadge(level: number | undefined) {
  if (level == null) return 'T0'
  return `T${level}`
}

function DeliveryMilestoneTracker({ progress }: { progress: FounderDeliveryProgress }) {
  const tierSteps = progress.tierMilestones ?? []
  const workflowSteps = progress.workflowSteps ?? []
  const showWorkflow = workflowSteps.length > 0

  return (
    <div className="mb-4 rounded-lg border border-border/60 bg-void/40 p-3">
      <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">
        Delivery milestones
      </p>
      <ol className="space-y-2 mb-3">
        {tierSteps.map((step) => (
          <li key={step.id} className="flex items-center gap-2">
            <span
              className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-mono ${
                step.reached
                  ? 'border-cyan/50 bg-cyan/15 text-cyan-glow'
                  : step.current
                    ? 'border-amber/50 bg-amber/15 text-amber-glow'
                    : 'border-border/60 text-muted'
              }`}
            >
              {step.reached ? '✓' : step.level ?? '·'}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-xs ${step.reached || step.current ? 'text-text-bright' : 'text-muted'}`}>
                {step.label}
              </p>
              {step.contractsRequired != null && step.contractsRequired > 0 && !step.reached && (
                <p className="font-mono text-[9px] text-muted">
                  {progress.contractsCompleted ?? 0}/{step.contractsRequired} contracts
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
      {progress.nextTierLabel && (progress.contractsToNextTier ?? 0) > 0 && (
        <p className="text-[10px] text-amber-glow/90 mb-2">
          {progress.contractsToNextTier} more to {progress.nextTierLabel}
        </p>
      )}
      {showWorkflow && (
        <>
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">
            Active delivery
          </p>
          <ol className="flex flex-wrap gap-1.5">
            {workflowSteps.map((step) => (
              <li
                key={step.id}
                className={`rounded-md border px-2 py-1 font-mono text-[9px] uppercase tracking-wide ${
                  step.done
                    ? 'border-cyan/35 text-cyan-glow bg-cyan/5'
                    : step.current
                      ? 'border-amber/45 text-amber-glow bg-amber/10 animate-pulse'
                      : 'border-border/50 text-muted'
                }`}
              >
                {step.label}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  )
}

function ContractCard({
  contract,
  founder,
  busy,
  onCommand,
}: {
  contract: FounderContract
  founder: GameShellFounder
  busy: boolean
  onCommand: (cmd: string) => void
}) {
  const cmd = founderContractCommand(contract, founder)
  const status = contract.status ?? (contract.locked ? 'locked' : 'available')
  const isActive = status === 'active'
  const netGain =
    contract.payout != null && contract.upfrontCost != null
      ? contract.payout - contract.upfrontCost
      : contract.payout

  return (
    <li
      className={`rounded-lg border p-3 transition-colors ${
        isActive
          ? 'border-cyan/40 bg-cyan/5 shadow-[0_0_20px_rgba(34,211,238,0.08)]'
          : status === 'available'
            ? 'border-border/70 bg-void/50 hover:border-amber/30'
            : 'border-border/50 bg-void/30 opacity-80'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-sm text-text-bright font-medium truncate">{contract.label}</p>
          {contract.customer && (
            <p className="text-xs text-muted mt-0.5">Customer: {contract.customer}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${statusStyles(status)}`}
          >
            {status}
          </span>
          <span className="font-mono text-[9px] text-muted">{contract.tierLabel ?? tierBadge(contract.minBaseLevel)}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-2 font-mono text-[10px]">
        {contract.upfrontCost != null && contract.upfrontCost > 0 && (
          <div className="rounded border border-border/40 bg-void/60 px-2 py-1">
            <span className="text-muted block">Cost</span>
            <span className="text-amber-glow">{contract.upfrontCost}</span>
          </div>
        )}
        {contract.payout != null && (
          <div className="rounded border border-border/40 bg-void/60 px-2 py-1">
            <span className="text-muted block">Payout</span>
            <span className="text-cyan-glow">{contract.payout}</span>
          </div>
        )}
        {netGain != null && (
          <div className="rounded border border-border/40 bg-void/60 px-2 py-1">
            <span className="text-muted block">Net</span>
            <span className={netGain >= 0 ? 'text-cyan-glow' : 'text-amber-glow'}>
              {netGain >= 0 ? '+' : ''}
              {netGain}
            </span>
          </div>
        )}
      </div>

      {contract.reputationGain != null && (
        <p className="text-[10px] text-muted mb-2">+{contract.reputationGain} reputation on delivery</p>
      )}

      {status === 'locked' && contract.minBaseLevel != null && contract.minBaseLevel > 0 && (
        <p className="text-xs text-muted italic mb-2">
          Unlock at {contract.tierLabel ?? tierBadge(contract.minBaseLevel)}
        </p>
      )}

      {isActive && founder.activeContract?.deliveryStage === 'ready_to_deliver' && (
        <p className="text-[10px] text-cyan-glow/90 mb-2">Ready — run delivery to collect payout.</p>
      )}

      {cmd ? (
        <button
          type="button"
          disabled={busy || !founder.unlocked}
          onClick={() => onCommand(cmd)}
          className="font-mono text-xs px-3 py-1.5 rounded-md border border-registry/35 text-registry-glow bg-registry/5 hover:bg-registry/12 disabled:opacity-40 transition-colors w-full sm:w-auto"
        >
          {isActive ? 'Run delivery' : 'Start contract'}
        </button>
      ) : status !== 'locked' ? null : (
        <p className="text-xs text-muted italic">Complete more contracts to unlock</p>
      )}
    </li>
  )
}

export function FounderPanel({ founder, assets, busy, onCommand, compact }: FounderPanelProps) {
  const brandingUrl = assetUrl(assets?.founderAction ?? assets?.commandButton ?? assets?.incidentIcon)
  const hasDeliveryContracts = founder.contracts.some((c) => c.isDelivery !== false)
  const activeLabel =
    typeof founder.activeContract === 'object' && founder.activeContract?.label
      ? founder.activeContract.label
      : typeof founder.activeContract === 'string'
        ? founder.activeContract
        : null

  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {brandingUrl && (
            <img
              src={brandingUrl}
              alt=""
              className="h-8 w-8 rounded-md border border-border/50 object-cover shrink-0 opacity-90"
            />
          )}
          <h2 className="font-display font-medium text-text-bright truncate">Founder</h2>
        </div>
        <span
          className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${
            founder.unlocked
              ? 'border-amber/40 text-amber-glow bg-amber/10'
              : 'border-border text-muted bg-elevated/60'
          }`}
        >
          {founder.unlocked ? founder.tierLabel ?? 'unlocked' : 'locked'}
        </span>
      </div>

      <p className={`text-sm text-muted leading-relaxed ${compact ? 'mb-3' : 'mb-4'}`}>
        {founder.unlockText ?? 'Resolve The Missing Delivery to unlock founder loop.'}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-[10px]">
        <div className="rounded-lg border border-border/50 bg-void/50 px-2 py-1.5">
          <span className="text-muted block uppercase tracking-wider">Money</span>
          <span className="text-cyan-glow text-sm">{founder.money ?? 0}</span>
        </div>
        <div className="rounded-lg border border-border/50 bg-void/50 px-2 py-1.5">
          <span className="text-muted block uppercase tracking-wider">Rep</span>
          <span className="text-amber-glow text-sm">{founder.reputation ?? 0}</span>
        </div>
        <div className="rounded-lg border border-border/50 bg-void/50 px-2 py-1.5">
          <span className="text-muted block uppercase tracking-wider">Base</span>
          <span className="text-text-bright text-sm">Lv {founder.baseLevel ?? 0}</span>
        </div>
        <div className="rounded-lg border border-border/50 bg-void/50 px-2 py-1.5">
          <span className="text-muted block uppercase tracking-wider">Done</span>
          <span className="text-text-bright text-sm">{founder.contractsCompleted ?? 0}</span>
        </div>
      </div>

      {activeLabel && (
        <p className="text-xs text-cyan-glow/90 mb-3 rounded-md border border-cyan/25 bg-cyan/5 px-2 py-1.5">
          Active: {activeLabel}
        </p>
      )}

      {hasDeliveryContracts && founder.deliveryProgress && (
        <DeliveryMilestoneTracker progress={founder.deliveryProgress} />
      )}

      <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">Contracts</p>
      {founder.contracts.length === 0 ? (
        <p className="text-sm text-muted italic">No contract offers yet.</p>
      ) : (
        <ul className={`space-y-2 ${compact ? 'mb-3' : 'mb-4'}`}>
          {founder.contracts.map((c) => (
            <ContractCard
              key={c.id}
              contract={c}
              founder={founder}
              busy={busy}
              onCommand={onCommand}
            />
          ))}
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
