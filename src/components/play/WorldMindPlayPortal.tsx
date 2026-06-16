import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { PRODUCT } from '../../data/product'
import {
  assetUrl,
  fetchHealth,
  fetchState,
  postCommand,
  type GameShell,
  type GameShellLocation,
  type HealthResponse,
} from '../../lib/play-api'
import { Card } from '../ui/Card'
import { PlayOfflineFallback } from './PlayOfflineFallback'

type BootPhase = 'loading' | 'offline' | 'ready'

export function WorldMindPlayPortal() {
  const [phase, setPhase] = useState<BootPhase>('loading')
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [shell, setShell] = useState<GameShell | null>(null)
  const [output, setOutput] = useState('')
  const [command, setCommand] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const boot = useCallback(async () => {
    setPhase('loading')
    setError(null)
    try {
      const h = await fetchHealth()
      setHealth(h)
      const state = await fetchState()
      setShell(state.gameShell)
      setPhase('ready')
    } catch {
      setPhase('offline')
    }
  }, [])

  useEffect(() => {
    void boot()
  }, [boot])

  const runCommand = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || busy) return

    setBusy(true)
    setError(null)
    try {
      const res = await postCommand(trimmed)
      const result = res.result
      if (result?.gameShell) setShell(result.gameShell)
      const lines = [result?.text ?? res.text ?? 'Command completed.']
      if (result?.leno?.summary) lines.push(`Leno: ${result.leno.summary}`)
      if (result?.majorDecisionPrompt?.label) {
        lines.push(`Major decision: ${result.majorDecisionPrompt.label}`)
      }
      setOutput(lines.filter(Boolean).join('\n\n'))
      setCommand('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Command failed')
    } finally {
      setBusy(false)
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void runCommand(command)
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

  return (
    <div className="min-h-screen bg-void text-text">
      <div className="pointer-events-none fixed inset-0 z-[55] vignette" aria-hidden />

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

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
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

          <Card accent="registry" delay={0}>
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
              <li>Contracts completed: {founder.contractsCompleted ?? 0}</li>
              {founder.activeContract && <li>Active: {founder.activeContract}</li>}
            </ul>
            <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">Contracts</p>
            {founder.contracts.length === 0 ? (
              <p className="text-sm text-muted italic">No contract offers yet.</p>
            ) : (
              <ul className="space-y-2">
                {founder.contracts.map((c) => (
                  <li key={c.id} className="rounded-lg border border-border/70 bg-void/50 p-3">
                    <p className="text-sm text-text-bright mb-1">{c.label}</p>
                    {c.reward && <p className="text-xs text-muted mb-2">{c.reward}</p>}
                    <button
                      type="button"
                      disabled={busy || c.locked || !founder.unlocked}
                      onClick={() => void runCommand(c.command)}
                      className="font-mono text-xs px-3 py-1.5 rounded-md border border-registry/35 text-registry-glow bg-registry/5 hover:bg-registry/12 disabled:opacity-40 transition-colors"
                    >
                      {c.command}
                    </button>
                  </li>
                ))}
              </ul>
            )}
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
          {output && (
            <pre className="mt-4 p-4 rounded-lg border border-border/70 bg-surface font-mono text-xs text-text leading-relaxed whitespace-pre-wrap">
              {output}
            </pre>
          )}
        </Card>

        <p className="text-center">
          <button
            type="button"
            onClick={() => void boot()}
            className="font-mono text-xs text-muted hover:text-cyan-glow transition-colors"
          >
            Refresh state
          </button>
        </p>
      </main>
    </div>
  )
}
