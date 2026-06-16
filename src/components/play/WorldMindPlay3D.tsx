import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchHealth,
  fetchState,
  matchMajorDecision,
  postBranch,
  postCommand,
  postSave,
  type ConsequenceBeat,
  type DistrictView,
  type GameShell,
  type HealthResponse,
  type MajorDecision,
  type NpcCard,
  type VisualCues,
  type WalkAnimation,
} from '../../lib/play-api'
import { useDistrictWalkAnimation } from '../../hooks/useDistrictWalkAnimation'
import { usePlayAudioCues } from '../../hooks/usePlayAudioCues'
import { InteriorOverlay } from './3d/InteriorOverlay'
import type { Selection } from './3d/district-scene-types'
import { enrichSelection } from './3d/enrich-selection'
import { HowToPlay3DOverlay, readHowToPlayDismissed, dismissHowToPlay } from './3d/HowToPlay3DOverlay'
import { PlayFeedbackToast, type PlayFeedbackToastState } from './PlayFeedbackToast'
import { NpcInteractionDrawer } from './NpcInteractionDrawer'
import { MajorDecisionModal } from './MajorDecisionModal'
import { PlayOfflineFallback } from './PlayOfflineFallback'
import { PlayBrandFrame } from './PlayBrandFrame'
import { PlayGameHud } from './hud/PlayGameHud'
import type { DockTab } from './hud/PlayGameDock'
import type { ExploreCameraMode } from './3d/PlayerFollowCamera'

const Play3DCanvas = lazy(() =>
  import('./3d/Play3DCanvas').then((m) => ({ default: m.Play3DCanvas })),
)

type BootPhase = 'loading' | 'offline' | 'ready'

export function WorldMindPlay3D() {
  const [phase, setPhase] = useState<BootPhase>('loading')
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [shell, setShell] = useState<GameShell | null>(null)
  const [visualCues, setVisualCues] = useState<VisualCues | null>(null)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [output, setOutput] = useState('')
  const [consequenceBeat, setConsequenceBeat] = useState<ConsequenceBeat | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingDecision, setPendingDecision] = useState<{
    decision: MajorDecision
    command: string
  } | null>(null)
  const [cameraMode, setCameraMode] = useState<ExploreCameraMode>('follow')
  const [interiorOpen, setInteriorOpen] = useState(false)
  const [walkAnimation, setWalkAnimation] = useState<WalkAnimation | null>(null)
  const [pendingVisualCues, setPendingVisualCues] = useState<VisualCues | null>(null)
  const [districtView, setDistrictView] = useState<DistrictView | null>(null)
  const [pendingDistrictView, setPendingDistrictView] = useState<DistrictView | null>(null)
  const [dockOpen, setDockOpen] = useState(false)
  const [dockTab, setDockTab] = useState<DockTab>('quest')
  const [mapCollapsed, setMapCollapsed] = useState(false)
  const [questExpanded, setQuestExpanded] = useState(false)
  const [selectedNpc, setSelectedNpc] = useState<NpcCard | null>(null)
  const [howToOpen, setHowToOpen] = useState(false)
  const [toast, setToast] = useState<PlayFeedbackToastState | null>(null)
  const toastTimerRef = useRef<number | null>(null)
  const busyRef = useRef(false)

  const { playCues } = usePlayAudioCues()

  const showToast = useCallback((next: PlayFeedbackToastState, autoDismissMs = 5200) => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    setToast(next)
    toastTimerRef.current = window.setTimeout(() => setToast(null), autoDismissMs)
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    }
  }, [])

  const boot = useCallback(async () => {
    setPhase('loading')
    try {
      const h = await fetchHealth()
      setHealth(h)
      const state = await fetchState()
      setShell(state.gameShell)
      setVisualCues(state.visualCues ?? null)
      setDistrictView(state.districtView ?? null)
      setHowToOpen(!readHowToPlayDismissed())
      setPhase('ready')
    } catch {
      setPhase('offline')
    }
  }, [])

  useEffect(() => {
    void boot()
  }, [boot])

  const applyCommandResult = useCallback(
    (res: Awaited<ReturnType<typeof postCommand>>, options?: { toastTitle?: string }) => {
      const result = res.result
      if (result?.gameShell) setShell(result.gameShell)
      setConsequenceBeat(result?.consequenceBeat ?? null)
      playCues(result?.audioCues)

      const lines = [result?.text ?? res.text ?? 'Command completed.']
      if (result?.leno?.summary) lines.push(`Leno: ${result.leno.summary}`)
      if (result?.majorDecisionPrompt?.label) {
        lines.push(`Major decision: ${result.majorDecisionPrompt.label}`)
      }
      if (result?.dialogue?.message) lines.push(result.dialogue.message)
      const resultText = lines.filter(Boolean).join('\n\n')
      setOutput(resultText)

      if (options?.toastTitle) {
        showToast({
          title: options.toastTitle,
          message: resultText.split('\n')[0]?.slice(0, 180) || resultText.slice(0, 180),
          tone: 'ok',
        })
      }
    },
    [playCues, showToast],
  )

  const executeCommand = useCallback(
    async (
      text: string,
      options?: {
        clearSelection?: boolean
        toastTitle?: string
        instantTravel?: boolean
        skipBusyGuard?: boolean
      },
    ) => {
      const trimmed = text.trim()
      if (!trimmed || walkAnimation) return
      if (!options?.skipBusyGuard && busyRef.current) return

      busyRef.current = true
      setBusy(true)
      setError(null)
      setConsequenceBeat(null)
      try {
        const res = await postCommand(trimmed)
        applyCommandResult(res, { toastTitle: options?.toastTitle })
        if (options?.clearSelection !== false) setSelection(null)

        const state = await fetchState()
        setShell(state.gameShell)

        const animation = res.result?.walkAnimation ?? null
        if (animation?.waypoints?.length && !options?.instantTravel) {
          setWalkAnimation(animation)
          setPendingVisualCues(state.visualCues ?? null)
          setPendingDistrictView(state.districtView ?? null)
          if (!state.visualCues?.interior) setInteriorOpen(false)
        } else {
          setWalkAnimation(null)
          setPendingVisualCues(null)
          setPendingDistrictView(null)
          setVisualCues(state.visualCues ?? null)
          setDistrictView(state.districtView ?? null)
          if (!state.visualCues?.interior) setInteriorOpen(false)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Command failed'
        setError(message)
        if (options?.toastTitle) {
          showToast({ title: options?.toastTitle, message, tone: 'error' })
        }
      } finally {
        busyRef.current = false
        setBusy(false)
      }
    },
    [applyCommandResult, showToast, walkAnimation],
  )

  const runCommand = useCallback(
    async (
      text: string,
      options?: { clearSelection?: boolean; toastTitle?: string; instantTravel?: boolean },
    ) => {
      const trimmed = text.trim()
      if (!trimmed || busyRef.current || walkAnimation) return

      const decision = matchMajorDecision(trimmed, shell?.majorDecisions ?? [])
      if (decision?.branchSuggested) {
        setPendingDecision({ decision, command: trimmed })
        return
      }

      await executeCommand(trimmed, options)
    },
    [executeCommand, shell?.majorDecisions, walkAnimation],
  )

  const branchAndContinue = async () => {
    if (!pendingDecision) return
    const { command: cmd, decision } = pendingDecision
    setPendingDecision(null)
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
      await executeCommand(cmd, { skipBusyGuard: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Branch failed')
    }
  }

  const continueWithoutBranch = () => {
    if (!pendingDecision) return
    const { command: cmd } = pendingDecision
    setPendingDecision(null)
    void executeCommand(cmd)
  }

  const onWalkComplete = useCallback(() => {
    setWalkAnimation(null)
    if (pendingVisualCues) {
      setVisualCues(pendingVisualCues)
      setPendingVisualCues(null)
    }
    if (pendingDistrictView) {
      setDistrictView(pendingDistrictView)
      setPendingDistrictView(null)
    }
  }, [pendingDistrictView, pendingVisualCues])

  const { progress: walkProgress, isWalking: mapWalking } = useDistrictWalkAnimation(walkAnimation)

  const openNpcFromSelection = useCallback(
    (sel: Selection) => {
      if (sel.kind !== 'agent') return
      const npc = shell?.npcCards?.find((n) => n.id === sel.id)
      if (npc) setSelectedNpc(npc)
    },
    [shell?.npcCards],
  )

  const handleTravel = useCallback(
    (sel: Selection) => {
      if (sel.kind !== 'location') return
      setSelection(enrichSelection(sel, shell))
      void runCommand(sel.command, { clearSelection: true, toastTitle: `Travel · ${sel.label}` })
    },
    [runCommand, shell],
  )

  const handleMapTravel = useCallback(
    (nodeId: string) => {
      if (!nodeId || busy || walkAnimation) return
      if (nodeId === districtView?.playerLocationId) return
      void runCommand(`move ${nodeId}`, { clearSelection: true, toastTitle: `Travel · ${nodeId}` })
    },
    [busy, districtView?.playerLocationId, runCommand, walkAnimation],
  )

  const handleWASDEnterLocation = useCallback(
    (locationId: string) => {
      if (!locationId || busy || walkAnimation) return
      if (locationId === districtView?.playerLocationId) return
      const label =
        visualCues?.locations.find((l) => l.id === locationId)?.label ?? locationId
      void runCommand(`move ${locationId}`, {
        clearSelection: true,
        instantTravel: true,
        toastTitle: `Arrived · ${label}`,
      })
    },
    [busy, districtView?.playerLocationId, runCommand, visualCues?.locations, walkAnimation],
  )

  const handleSelect = useCallback(
    (raw: Selection) => {
      const enriched = enrichSelection(raw, shell)
      setSelection(enriched)
      if (enriched.kind === 'agent') openNpcFromSelection(enriched)
    },
    [openNpcFromSelection, shell],
  )

  const handleHotspotInspect = useCallback(
    (raw: Selection) => {
      if (raw.kind !== 'hotspot') return
      const enriched = enrichSelection(raw, shell)
      if (enriched.kind !== 'hotspot') return
      setSelection(enriched)
      void runCommand(enriched.command, {
        clearSelection: false,
        toastTitle: `Inspect · ${enriched.label}`,
      })
    },
    [runCommand, shell],
  )

  const dismissHowTo = () => {
    dismissHowToPlay()
    setHowToOpen(false)
  }

  const toggleDock = () => {
    setDockOpen((open) => {
      if (!open) setDockTab('quest')
      return !open
    })
  }

  if (phase === 'loading') {
    return (
      <PlayBrandFrame variant="game">
        <div className="min-h-screen flex items-center justify-center">
          <p className="font-mono text-sm text-cyan-glow animate-pulse">Loading 3D district…</p>
        </div>
      </PlayBrandFrame>
    )
  }

  if (phase === 'offline' || !visualCues) {
    return (
      <PlayBrandFrame variant="game">
        <PlayOfflineFallback />
      </PlayBrandFrame>
    )
  }

  const orbitTarget = (visualCues.camera?.target ?? [0, 1.5, 0]) as [number, number, number]
  const isWalking = walkAnimation !== null
  const mapPlayerLoc = mapWalking
    ? (walkAnimation?.from ?? walkAnimation?.fromLocationId ?? districtView?.playerLocationId)
    : districtView?.playerLocationId

  const selectionDetail =
    selection && (selection.kind === 'hotspot' || selection.kind === 'agent')
      ? selection.preview ?? selection.description
      : selection?.description

  return (
    <PlayBrandFrame variant="game">
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
      <NpcInteractionDrawer
        npc={selectedNpc}
        busy={busy}
        onClose={() => setSelectedNpc(null)}
        onCommand={(cmd) => void runCommand(cmd)}
      />
      <PlayGameHud
        health={health}
        shell={shell}
        visualCues={visualCues}
        districtView={districtView}
        selection={selection}
        selectionDetail={selectionDetail}
        output={output}
        consequenceBeat={consequenceBeat}
        error={error}
        busy={busy}
        cameraMode={cameraMode}
        interiorOpen={interiorOpen}
        isWalking={isWalking}
        walkAnimation={walkAnimation}
        walkProgress={walkProgress}
        mapWalking={mapWalking}
        mapPlayerLoc={mapPlayerLoc ?? undefined}
        mapCollapsed={mapCollapsed}
        questExpanded={questExpanded}
        dockOpen={dockOpen}
        dockTab={dockTab}
        onToggleCamera={() => setCameraMode((m) => (m === 'follow' ? 'overview' : 'follow'))}
        onToggleInterior={() => setInteriorOpen((o) => !o)}
        onToggleMap={() => setMapCollapsed((c) => !c)}
        onToggleQuest={() => {
          setQuestExpanded((e) => !e)
          setDockOpen(true)
          setDockTab('quest')
        }}
        onToggleDock={toggleDock}
        onDockTab={setDockTab}
        onCloseDock={() => setDockOpen(false)}
        onOpenHelp={() => setHowToOpen(true)}
        onOpenLeno={() => {
          setDockOpen(true)
          setDockTab('leno')
        }}
        onMapTravel={handleMapTravel}
        onRunCommand={(cmd, opts) => void runCommand(cmd, opts)}
        onSubmitCommand={(cmd) => void runCommand(cmd)}
        onSelectNpc={setSelectedNpc}
        onOpenNpcProfile={() => selection && openNpcFromSelection(selection)}
        overlay={
          <>
            <HowToPlay3DOverlay open={howToOpen} onDismiss={dismissHowTo} />
            <PlayFeedbackToast toast={toast} onDismiss={() => setToast(null)} />
            {interiorOpen && visualCues.interior && (
              <InteriorOverlay
                interior={visualCues.interior}
                busy={busy}
                onCommand={(cmd) => void runCommand(cmd)}
                onClose={() => setInteriorOpen(false)}
              />
            )}
          </>
        }
      >
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
            orbitTarget={orbitTarget}
            walkAnimation={walkAnimation}
            onWalkComplete={onWalkComplete}
            onSelect={handleSelect}
            onTravel={handleTravel}
            onHotspotInspect={handleHotspotInspect}
            onEnterLocation={handleWASDEnterLocation}
          />
        </Suspense>
      </PlayGameHud>
    </PlayBrandFrame>
  )
}
