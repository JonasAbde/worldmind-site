import { Suspense, useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
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
import { DistrictScene3D, type Selection } from './3d/DistrictScene3D'
import { PlayOfflineFallback } from './PlayOfflineFallback'

type BootPhase = 'loading' | 'offline' | 'ready'

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
  const camTarget = (visualCues.camera?.target ?? [0, 1.5, 0]) as [number, number, number]

  return (
    <div className="h-screen w-screen bg-void text-text flex flex-col overflow-hidden">
      <header className="shrink-0 border-b border-border/50 bg-void/90 backdrop-blur-xl z-10 px-4 h-12 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 font-mono text-xs">
          <a href="/" className="text-muted hover:text-cyan-glow">← {PRODUCT.name}</a>
          <a href="/play" className="text-cyan/80 hover:text-cyan-glow">2D play</a>
          <span className="text-amber-glow font-semibold">3D</span>
        </div>
        <div className="flex gap-3 font-mono text-[11px] text-muted">
          {health?.version && <span>{health.version}</span>}
          <span>Day {topbar.day ?? '—'}</span>
          <span>¢ {topbar.money ?? 0}</span>
          <span>@ {shell?.location?.name ?? '—'}</span>
        </div>
      </header>

      <div className="flex-1 relative min-h-0">
        <Canvas shadows camera={{ position: [camTarget[0] + 8, camTarget[1] + 10, camTarget[2] + 12], fov: 50 }}>
          <Suspense fallback={null}>
            <DistrictScene3D cues={visualCues} onSelect={setSelection} />
            <OrbitControls target={camTarget} enableDamping dampingFactor={0.06} minDistance={7} maxDistance={32} />
          </Suspense>
        </Canvas>

        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[400px] pointer-events-none">
          <div className="pointer-events-auto rounded-xl border border-border/70 bg-void/90 backdrop-blur-xl p-4 shadow-2xl">
            <h2 className="font-display text-sm text-text-bright mb-1">
              {selection?.label ?? 'Click building, agent, or hotspot'}
            </h2>
            <p className="text-xs text-muted mb-3">{selection?.description ?? 'Orbit with mouse · scroll to zoom'}</p>
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
