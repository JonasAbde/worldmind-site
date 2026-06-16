import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { PRODUCT } from '../../data/product'
import {
  fetchHealth,
  fetchState,
  postCommand,
  type ConsequenceBeat,
  type GameShell,
  type HealthResponse,
  type VisualCues,
} from '../../lib/play-api'
import { ConsequencePanel } from './ConsequencePanel'
import type { Selection } from './3d/district-scene-types'
import { PlayOfflineFallback } from './PlayOfflineFallback'

const Play3DCanvas = lazy(() =>
  import('./3d/Play3DCanvas').then((m) => ({ default: m.Play3DCanvas })),
)

type BootPhase = 'loading' | 'offline' | 'ready'
type CameraMode = 'walk' | 'orbit'

export function WorldMindPlay3D() {
  const [phase, setPhase] = useState<BootPhase>('loading')
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [shell, setShell] = useState<GameShell | null>(null)
  const [visualCues, setVisualCues] = useState<VisualCues | null>(null)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [output, setOutput] = useState('')
  const [consequenceBeat, setConsequenceBeat] = useState<ConsequenceBeat | null>(null)
  const [command, setCommand] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cameraMode, setCameraMode] = useState<CameraMode>('walk')

  const boot = useCallback(async () => {
    setPhase('loading')
    try {
      const h = await fetchHealth()
      setHealth(h)
      const state = await fetchState()
      setShell(state.gameShell)
      setVisualCues(state.visualCues ?? null)
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
      setConsequenceBeat(result?.consequenceBeat ?? null)
      const state = await fetchState()
      setVisualCues(state.visualCues ?? null)
      setShell(state.gameShell)
      setOutput(result?.text ?? res.text ?? 'Command completed.')
      setSelection(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Command failed')
    } finally {
      setBusy(false)
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void runCommand(command)
    setCommand('')
  }

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-void text-text flex items-center justify-center">
        <p className="font-mono text-sm text-cyan-glow animate-pulse">Loading 3D district…</p>
      </div>
    )
  }

  if (phase === 'offline' || !visualCues) return <PlayOfflineFallback />

  const topbar = shell?.topbar ?? {}
  const walkEye = (visualCues.camera?.walkEye ?? [0, 1.65, 4.5]) as [number, number, number]
  const walkTarget = (visualCues.camera?.walkTarget ?? visualCues.camera?.target ?? [0, 1.4, 0]) as [
    number,
    number,
    number,
  ]
  const orbitTarget = (visualCues.camera?.target ?? [0, 1.5, 0]) as [number, number, number]

  return (
    <div className="h-screen w-screen bg-void text-text flex flex-col overflow-hidden">
      <header className="shrink-0 border-b border-border/50 bg-void/90 backdrop-blur-xl z-10 px-4 h-12 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 font-mono text-xs">
          <a href="/" className="text-muted hover:text-cyan-glow">← {PRODUCT.name}</a>
          <a href="/play" className="text-cyan/80 hover:text-cyan-glow">2D</a>
          <span className="text-amber-glow font-semibold">3D</span>
          <button
            type="button"
            onClick={() => setCameraMode((m) => (m === 'walk' ? 'orbit' : 'walk'))}
            className="text-[10px] px-2 py-0.5 rounded border border-border text-muted hover:text-cyan-glow"
          >
            {cameraMode === 'walk' ? 'Orbit cam' : 'Walk cam'}
          </button>
        </div>
        <div className="flex gap-3 font-mono text-[11px] text-muted">
          {health?.version && <span>{health.version}</span>}
          <span>Day {topbar.day ?? '—'}</span>
          <span>¢ {topbar.money ?? 0}</span>
          <span>@ {shell?.location?.name ?? '—'}</span>
        </div>
      </header>

      <div className="flex-1 relative min-h-0">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center font-mono text-sm text-cyan-glow">
              Loading WebGL…
            </div>
          }
        >
          <Play3DCanvas
            visualCues={visualCues}
            cameraMode={cameraMode}
            walkEye={walkEye}
            walkTarget={walkTarget}
            orbitTarget={orbitTarget}
            onSelect={setSelection}
          />
        </Suspense>

        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[400px] pointer-events-none">
          <div className="pointer-events-auto rounded-xl border border-border/70 bg-void/90 backdrop-blur-xl p-4 shadow-2xl">
            <h2 className="font-display text-sm text-text-bright mb-1">
              {selection?.label ?? 'Explore the district'}
            </h2>
            <p className="text-xs text-muted mb-3">
              {cameraMode === 'walk'
                ? 'WASD move · drag to look · click hotspots & agents'
                : 'Orbit · scroll zoom · click buildings to travel'}
            </p>
            {selection && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selection.kind === 'location' && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runCommand(selection.command)}
                    className="font-mono text-xs px-3 py-1.5 rounded border border-cyan/35 text-cyan-glow bg-cyan/5"
                  >
                    Move here
                  </button>
                )}
                {selection.kind === 'hotspot' && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runCommand(selection.command)}
                    className="font-mono text-xs px-3 py-1.5 rounded border border-amber/35 text-amber-glow bg-amber/5"
                  >
                    {selection.label}
                  </button>
                )}
                {selection.kind === 'agent' && selection.commands && (
                  <>
                    <button type="button" disabled={busy} onClick={() => void runCommand(selection.commands!.talk)} className="font-mono text-xs px-3 py-1.5 rounded border border-cyan/35 text-cyan-glow bg-cyan/5">Talk</button>
                    <button type="button" disabled={busy} onClick={() => void runCommand(selection.commands!.ask)} className="font-mono text-xs px-3 py-1.5 rounded border border-cyan/35 text-cyan-glow bg-cyan/5">Ask</button>
                    <button type="button" disabled={busy} onClick={() => void runCommand(selection.commands!.pay)} className="font-mono text-xs px-3 py-1.5 rounded border border-cyan/35 text-cyan-glow bg-cyan/5">Pay</button>
                    <button type="button" disabled={busy} onClick={() => void runCommand(selection.commands!.leno)} className="font-mono text-xs px-3 py-1.5 rounded border border-cyan/35 text-cyan-glow bg-cyan/5">Leno</button>
                  </>
                )}
              </div>
            )}
            <form onSubmit={onSubmit} className="flex gap-2">
              <input
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                disabled={busy}
                placeholder="inspect cafe cafe_delivery_crate"
                className="flex-1 rounded border border-border bg-surface px-3 py-2 font-mono text-xs text-cyan-glow"
              />
              <button type="submit" disabled={busy} className="px-4 py-2 rounded text-xs font-semibold bg-amber text-void">
                Run
              </button>
            </form>
            {error && <p className="mt-2 text-xs text-amber-glow">{error}</p>}
            <ConsequencePanel beat={consequenceBeat} />
            {output && <p className="mt-2 text-xs text-text whitespace-pre-wrap">{output}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
