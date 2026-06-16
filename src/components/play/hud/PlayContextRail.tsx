import { useState, type ReactNode } from 'react'
import type { ConsequenceBeat } from '../../../lib/play-api'
import type { Selection } from '../3d/district-scene-types'
import { ConsequencePanel } from '../ConsequencePanel'

interface PlayContextRailProps {
  selection: Selection | null
  selectionDetail?: string | null
  busy: boolean
  isWalking: boolean
  cameraMode: 'follow' | 'overview'
  error: string | null
  output: string
  consequenceBeat: ConsequenceBeat | null
  onRunCommand: (cmd: string, options?: { clearSelection?: boolean; toastTitle?: string }) => void
  onSubmitCommand: (cmd: string) => void
  onOpenNpcProfile?: () => void
}

export function PlayContextRail({
  selection,
  selectionDetail,
  busy,
  isWalking,
  cameraMode,
  error,
  output,
  consequenceBeat,
  onRunCommand,
  onSubmitCommand,
  onOpenNpcProfile,
}: PlayContextRailProps) {
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [command, setCommand] = useState('')
  const locked = busy || isWalking

  const hint = isWalking
    ? 'Walking…'
    : cameraMode === 'follow'
      ? 'WASD move · Shift sprint · E enter building · drag to look'
      : 'Overview — click map nodes'

  return (
    <div className="play-hud-panel p-3 w-[min(360px,92vw)] pointer-events-auto flex flex-col gap-2">
      <div className="min-w-0">
        <p className="font-mono text-[9px] text-cyan/70 uppercase tracking-[0.2em] mb-0.5">
          {selection ? 'Focus' : 'Explore'}
        </p>
        <p className="font-display text-sm text-text-bright truncate">
          {selection?.label ?? 'District'}
        </p>
        {(selectionDetail || !selection) && (
          <p className="text-[11px] text-muted mt-1 line-clamp-2 leading-relaxed">
            {selectionDetail ?? hint}
          </p>
        )}
      </div>

      {selection && (
        <div className="flex flex-wrap gap-1.5">
          {selection.kind === 'location' && (
            <ActionBtn disabled={locked} onClick={() => onRunCommand(selection.command)}>
              Travel
            </ActionBtn>
          )}
          {selection.kind === 'hotspot' && (
            <>
              {selection.risk != null && (
                <span className="play-hud-chip text-amber-glow">Risk {selection.risk}</span>
              )}
              <ActionBtn
                disabled={locked}
                tone="amber"
                onClick={() =>
                  onRunCommand(selection.command, {
                    clearSelection: false,
                    toastTitle: `Inspect · ${selection.label}`,
                  })
                }
              >
                Inspect
              </ActionBtn>
            </>
          )}
          {selection.kind === 'agent' && selection.commands && (
            <>
              {selection.trust != null && (
                <span className="play-hud-chip text-muted">Trust {selection.trust}</span>
              )}
              {onOpenNpcProfile && (
                <ActionBtn disabled={locked} onClick={onOpenNpcProfile}>
                  Profile
                </ActionBtn>
              )}
              <ActionBtn disabled={locked} onClick={() => onRunCommand(selection.commands!.talk)}>
                Talk
              </ActionBtn>
              <ActionBtn disabled={locked} onClick={() => onRunCommand(selection.commands!.ask)}>
                Ask
              </ActionBtn>
              <ActionBtn disabled={locked} onClick={() => onRunCommand(selection.commands!.pay)}>
                Pay
              </ActionBtn>
              <ActionBtn disabled={locked} onClick={() => onRunCommand(selection.commands!.leno)}>
                Leno
              </ActionBtn>
            </>
          )}
        </div>
      )}

      {(output || consequenceBeat) && (
        <div className="rounded-md border border-border/40 bg-void/50 px-2.5 py-2 max-h-36 overflow-y-auto space-y-2">
          <ConsequencePanel beat={consequenceBeat} />
          {output && (
            <p className="text-[11px] text-text/90 whitespace-pre-wrap">{output}</p>
          )}
        </div>
      )}

      {error && <p className="text-[11px] text-amber-glow">{error}</p>}

      <button
        type="button"
        onClick={() => setTerminalOpen((o) => !o)}
        className="font-mono text-[9px] text-muted hover:text-cyan-glow text-left uppercase tracking-widest"
      >
        {terminalOpen ? '▾ Hide terminal' : '▸ Command terminal'}
      </button>
      {terminalOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmitCommand(command)
            setCommand('')
          }}
          className="flex gap-1.5"
        >
          <input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={locked}
            placeholder="inspect cafe cafe_delivery_crate"
            className="flex-1 min-w-0 rounded border border-border/60 bg-surface/80 px-2 py-1.5 font-mono text-[11px] text-cyan-glow"
          />
          <button
            type="submit"
            disabled={locked}
            className="px-3 py-1.5 rounded text-[11px] font-semibold bg-amber text-void disabled:opacity-40"
          >
            Run
          </button>
        </form>
      )}
    </div>
  )
}

function ActionBtn({
  children,
  disabled,
  onClick,
  tone = 'cyan',
}: {
  children: ReactNode
  disabled?: boolean
  onClick: () => void
  tone?: 'cyan' | 'amber'
}) {
  const colors =
    tone === 'amber'
      ? 'border-amber/40 text-amber-glow bg-amber/8 hover:bg-amber/12'
      : 'border-cyan/35 text-cyan-glow bg-cyan/5 hover:bg-cyan/10'
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`font-mono text-[11px] px-2.5 py-1 rounded border transition-colors disabled:opacity-40 ${colors}`}
    >
      {children}
    </button>
  )
}
