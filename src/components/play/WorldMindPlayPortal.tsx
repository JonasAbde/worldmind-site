import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { PRODUCT } from '../../data/product'
import {
  assetUrl,
  fetchHealth,
  fetchState,
  matchMajorDecision,
  postBranch,
  postCommand,
  postSave,
  type ConsequenceBeat,
  type DistrictView,
  type GameShell,
  type GameShellLocation,
  type HealthResponse,
  type MajorDecision,
} from '../../lib/play-api'
import { Card } from '../ui/Card'
import { ConsequencePanel } from './ConsequencePanel'
import { FounderPanel } from './FounderPanel'
import { MajorDecisionModal } from './MajorDecisionModal'
import { PlayOfflineFallback } from './PlayOfflineFallback'

type BootPhase = 'loading' | 'offline' | 'ready'

export function WorldMindPlayPortal() {
  const [phase, setPhase] = useState<BootPhase>('loading')
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [shell, setShell] = useState<GameShell | null>(null)
  const [districtView, setDistrictView] = useState<DistrictView | null>(null)
  const [output, setOutput] = useState('')
  const [consequenceBeat, setConsequenceBeat] = useState<ConsequenceBeat | null>(null)
  const [command, setCommand] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingDecision, setPendingDecision] = useState<{
    decision: MajorDecision
    command: string
  } | null>(null)

  const applyCommandResult = useCallback((res: Awaited<ReturnType<typeof postCommand>>) => {
    const result = res.result
    if (result?.gameShell) setShell(result.gameShell)
    const lines = [result?.text ?? res.text ?? 'Command completed.']
    if (result?.leno?.summary) lines.push(`Leno: ${result.leno.summary}`)
    if (result?.majorDecisionPrompt?.label) {
      lines.push(`Major decision: ${result.majorDecisionPrompt.label}`)
    }
    if (result?.dialogue?.message) lines.push(result.dialogue.message)
    setOutput(lines.filter(Boolean).join('\n\n'))
    setConsequenceBeat(result?.consequenceBeat ?? null)
    setCommand('')
  }, [])

  const executeCommand = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || busy) return

      setBusy(true)
      setError(null)
      setConsequenceBeat(null)
      try {
        const res = await postCommand(trimmed)
        applyCommandResult(res)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Command failed')
      } finally {
        setBusy(false)
      }
    },
    [applyCommandResult, busy],
  )

  const runCommand = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || busy) return

      const decision = matchMajorDecision(trimmed, shell?.majorDecisions ?? [])
      if (decision?.branchSuggested) {
        setPendingDecision({ decision, command: trimmed })
        return
      }

      await executeCommand(trimmed)
    },
    [busy, executeCommand, shell?.majorDecisions],
  )

  const refresh = useCallback(async () => {
    setPhase('loading')
    setError(null)
    try {
      const h = await fetchHealth()
      setHealth(h)
      const state = await fetchState()
      setShell(state.gameShell)
      setDistrictView(state.districtView ?? null)
      setPhase('ready')
    } catch {
      setPhase('offline')
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function boot() {
      try {
        const h = await fetchHealth()
        if (cancelled) return
        setHealth(h)
        const state = await fetchState()
        if (cancelled) return
        setShell(state.gameShell)
        setDistrictView(state.districtView ?? null)
        setPhase('ready')
      } catch {
        if (!cancelled) setPhase('offline')
      }
    }

    void boot()
    return () => {
      cancelled = true
    }
  }, [])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void runCommand(command)
  }

  const branchAndContinue = async () => {
    if (!pendingDecision) return
    const { command: cmd, decision } = pendingDecision
    setPendingDecision(null)
    setBusy(true)
    setError(null)
    try {
      const save = await postSave({ note: `Before: ${cmd}` })
      if (save.snapshotId) {
        await postBranch({
          name: `before-${decision.id}`,
          snapshotId: save.snapshotId,
          note: decision.label,
        })
      }
      await executeCommand(cmd)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Branch failed')
      setBusy(false)
    }
  }

  const continueWithoutBranch = () => {
    if (!pendingDecision) return
    const { command: cmd } = pendingDecision
    setPendingDecision(null)
    void executeCommand(cmd)
  }

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-void text-text flex items-center justify-center">
        <p className="font-mono text-sm text-cyan-glow animate-pulse">Connecting to simulation core…</p>
      </div>
    )
  }

  if (phase === 'offline') return <PlayOfflineFallback />

  const topbar = shell?.topbar ?? {}
  const location: GameShellLocation = shell?.location ?? { id: null, hotspots: [] }
  const founder = shell?.founder ?? { unlocked: false, contracts: [] }
  const sceneSrc = assetUrl(location.scene)
  const playerLoc = districtView?.playerLocationId ?? location.id

  return (
    <div className="min-h-screen bg-void text-text">
      <div className="pointer-events-none fixed inset-0 z-[55] vignette" aria-hidden />

      {pendingDecision && (
        <MajorDecisionModal
          decision={pendingDecision.decision}
          command={pendingDecision.command}
          busy={busy}
          onBranchAndContinue={() => void branchAndContinue()}
          onContinueWithout={continueWithoutBranch}
          onCancel={() => setPendingDecision(null)}
        />
      )}

      <header className="border-b border-border/50 bg-void/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <a href="/" className="font-display font-semibold text-text-bright text-sm hover:text-cyan-glow transition-colors shrink-0">
            ← {PRODUCT.name}
          </a>
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
            {health?.version && <span className="text-cyan/80">{health.version}</span>}
            <span>
              <strong className="text-cyan-glow">Day</strong> {topbar.day ?? '—'}
            </span>
            <span>
              <strong className="text-cyan-glow">Time</strong> {topbar.time ?? '—'}
            </span>
            <span>
              <strong className="text-amber-glow">¢</strong> {topbar.money ?? 0}
            </span>
            <span>
              <strong className="text-registry-glow">Leno</strong> {topbar.lenoStatus ?? 'standby'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div>
          <p className="font-mono text-xs text-cyan/70 uppercase tracking-[0.2em] mb-1">Live play</p>
          <h1 className="font-display text-2xl font-semibold text-text-bright">
            {topbar.worldName ?? 'New Aarhus District 01'}
          </h1>
          <p className="text-sm text-muted mt-1">
            Branch <span className="text-cyan-glow/90">{topbar.branchName ?? 'main'}</span>
            {topbar.reputation != null && (
              <> · Rep <span className="text-amber-glow/90">{topbar.reputation}</span></>
            )}
            {topbar.energy != null && (
              <> · Energy <span className="text-cyan-glow/90">{topbar.energy}</span></>
            )}
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
          <div className="space-y-6">
            {districtView && districtView.nodes.length > 0 && (
              <Card accent="neutral">
                <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">District</p>
                <svg viewBox="0 0 400 220" className="w-full h-auto rounded-lg border border-border/40 bg-elevated/30">
                  {(districtView.edges ?? []).map((e) => {
                    const from = districtView.nodes.find((n) => n.id === e.from)
                    const to = districtView.nodes.find((n) => n.id === e.to)
                    if (!from || !to) return null
                    return (
                      <line
                        key={`${e.from}-${e.to}`}
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        stroke="rgba(34,211,238,0.25)"
                        strokeWidth={2}
                      />
                    )
                  })}
                  {districtView.nodes.map((node) => {
                    const active = node.id === playerLoc
                    return (
                      <g key={node.id}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={active ? 18 : 14}
                          fill={active ? 'rgba(245,158,11,0.35)' : 'rgba(34,211,238,0.15)'}
                          stroke={active ? '#f59e0b' : 'rgba(34,211,238,0.5)'}
                          strokeWidth={2}
                          className="cursor-pointer"
                          onClick={() => void runCommand(`move ${node.id}`)}
                        />
                        <text x={node.x} y={node.y + 32} textAnchor="middle" fill="#94a3b8" fontSize="10">
                          {node.label}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </Card>
            )}

          <Card accent="cyan">
            <div className="mb-4">
              <h2 className="font-display font-medium text-text-bright text-lg">{location.name ?? location.id ?? 'Location'}</h2>
              {location.mood && <p className="text-sm text-muted mt-0.5">{location.mood}</p>}
            </div>
            {sceneSrc ? (
              <img
                src={sceneSrc}
                alt={location.name ?? 'Location scene'}
                className="w-full max-h-56 object-cover rounded-lg border border-border/40 mb-4"
              />
            ) : (
              <div className="h-40 grid-pattern rounded-lg border border-border/40 flex items-center justify-center text-muted text-sm font-mono mb-4">
                {location.id ?? 'scene'}
              </div>
            )}
            <div>
              <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">Hotspots</p>
              {location.hotspots.length === 0 ? (
                <p className="text-sm text-muted italic">No hotspots at this location.</p>
              ) : (
                <ul className="space-y-2">
                  {location.hotspots.map((spot) => (
                    <li
                      key={spot.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 bg-elevated/40 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-text-bright">{spot.label}</p>
                        {spot.preview && <p className="text-xs text-muted truncate">{spot.preview}</p>}
                      </div>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void runCommand(spot.command)}
                        className="shrink-0 font-mono text-xs px-3 py-1.5 rounded-md border border-cyan/35 text-cyan-glow bg-cyan/5 hover:bg-cyan/12 disabled:opacity-50 transition-colors"
                      >
                        {spot.command}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
          </div>

          <Card accent="registry" delay={0}>
            <FounderPanel founder={founder} busy={busy} onCommand={(cmd) => void runCommand(cmd)} />
          </Card>
        </div>

        <Card accent="neutral">
          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
            <label className="sr-only" htmlFor="wm-command">
              Command
            </label>
            <input
              id="wm-command"
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="inspect cafe"
              disabled={busy}
              className="flex-1 rounded-lg border border-border bg-void px-4 py-3 font-mono text-sm text-cyan-glow placeholder:text-muted focus:outline-none focus:border-cyan/50"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={busy}
              className="shrink-0 inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold tracking-wide bg-gradient-to-r from-amber to-amber-glow text-void shadow-[0_0_24px_rgba(245,158,11,0.35)] hover:from-amber-glow disabled:opacity-50 transition-all"
            >
              {busy ? 'Running…' : 'Run command'}
            </button>
          </form>
          {error && (
            <p className="mt-3 text-sm text-amber-glow font-mono" role="alert">
              {error}
            </p>
          )}
          <ConsequencePanel beat={consequenceBeat} />
          {output && (
            <pre className="mt-4 p-4 rounded-lg border border-border/70 bg-surface font-mono text-xs text-text leading-relaxed whitespace-pre-wrap">
              {output}
            </pre>
          )}
        </Card>

        <p className="text-center">
          <button
            type="button"
            onClick={() => void refresh()}
            className="font-mono text-xs text-muted hover:text-cyan-glow transition-colors"
          >
            Refresh state
          </button>
        </p>
      </main>
    </div>
  )
}
