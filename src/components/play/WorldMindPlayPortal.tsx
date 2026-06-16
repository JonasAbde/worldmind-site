import { useCallback, useEffect, useRef, useState } from 'react'

import type { FormEvent } from 'react'

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

  type NpcCard,

  type WalkAnimation,

} from '../../lib/play-api'

import { useDistrictWalkAnimation } from '../../hooks/useDistrictWalkAnimation'
import { usePlayAudioCues } from '../../hooks/usePlayAudioCues'

import { Card } from '../ui/Card'

import { ConsequencePanel } from './ConsequencePanel'

import { FounderPanel } from './FounderPanel'

import {

  CaseBoardPanel,

  NpcCardsPanel,

  QuestProgressPanel,

  RumorTrailPanel,

} from './InvestigationPanels'

import { LocationScenePanel } from './LocationScenePanel'

import { NpcInteractionDrawer } from './NpcInteractionDrawer'

import { DistrictWalkMap } from './DistrictWalkMap'

import { LenoPanel } from './LenoPanel'

import { PlayBrandFrame } from './PlayBrandFrame'

import { PlayBrandedHeader } from './PlayBrandedHeader'

import { ProgressionPanel } from './ProgressionPanel'

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

  const [selectedNpc, setSelectedNpc] = useState<NpcCard | null>(null)

  const [walkAnimation, setWalkAnimation] = useState<WalkAnimation | null>(null)

  const busyRef = useRef(false)

  const [pendingDistrictView, setPendingDistrictView] = useState<DistrictView | null>(null)



  const onWalkComplete = useCallback(() => {

    setWalkAnimation(null)

    if (pendingDistrictView) {

      setDistrictView(pendingDistrictView)

      setPendingDistrictView(null)

    }

  }, [pendingDistrictView])



  const { progress: walkProgress, isWalking } = useDistrictWalkAnimation(walkAnimation, onWalkComplete)

  const { playCues } = usePlayAudioCues()

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

    playCues(result?.audioCues)

    setCommand('')

  }, [playCues])



  const executeCommand = useCallback(

    async (text: string, options?: { skipBusyGuard?: boolean }) => {

      const trimmed = text.trim()

      if (!trimmed || walkAnimation) return

      if (!options?.skipBusyGuard && busyRef.current) return



      busyRef.current = true

      setBusy(true)

      setError(null)

      setConsequenceBeat(null)

      try {

        const res = await postCommand(trimmed)

        applyCommandResult(res)

        const state = await fetchState()

        if (state.gameShell) setShell(state.gameShell)

        const animation = res.result?.walkAnimation ?? null

        if (animation?.waypoints?.length) {

          setWalkAnimation(animation)

          setPendingDistrictView(state.districtView ?? null)

        } else {

          setWalkAnimation(null)

          setPendingDistrictView(null)

          setDistrictView(state.districtView ?? null)

        }

      } catch (err) {

        setError(err instanceof Error ? err.message : 'Command failed')

      } finally {

        busyRef.current = false

        setBusy(false)

      }

    },

    [applyCommandResult, walkAnimation],

  )



  const runCommand = useCallback(

    async (text: string) => {

      const trimmed = text.trim()

      if (!trimmed || busyRef.current || walkAnimation) return



      const decision = matchMajorDecision(trimmed, shell?.majorDecisions ?? [])

      if (decision?.branchSuggested) {

        setPendingDecision({ decision, command: trimmed })

        return

      }



      await executeCommand(trimmed)

    },

    [executeCommand, shell?.majorDecisions, walkAnimation],

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

      busyRef.current = false

      setBusy(false)

    }

  }



  const continueWithoutBranch = () => {

    if (!pendingDecision) return

    const { command: cmd } = pendingDecision

    setPendingDecision(null)

    void executeCommand(cmd)

  }

  const playerLoc = isWalking

    ? (walkAnimation?.from ?? walkAnimation?.fromLocationId ?? districtView?.playerLocationId ?? shell?.location?.id ?? null)

    : (districtView?.playerLocationId ?? shell?.location?.id ?? null)

  const mapBusy = busy || isWalking

  const handleMapTravel = useCallback(

    (nodeId: string) => {

      if (!nodeId || mapBusy) return

      if (nodeId === playerLoc) return

      void runCommand(`move ${nodeId}`)

    },

    [mapBusy, playerLoc, runCommand],

  )



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

    <PlayBrandFrame>

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



      <PlayBrandedHeader topbar={topbar} version={health?.version} />



      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] gap-6">

          <div className="space-y-6">

            {districtView && districtView.nodes.length > 0 && (

              <Card accent="neutral">

                <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-1">

                  District{isWalking ? ' · walking' : ''}

                </p>

                <p className="text-xs text-muted mb-3">

                  {isWalking

                    ? 'Walking to destination…'

                    : 'Click a map node to travel · inspect hotspots below for clues'}

                </p>

                <DistrictWalkMap

                  districtView={districtView}

                  walkAnimation={walkAnimation}

                  walkProgress={walkProgress}

                  isWalking={isWalking}

                  playerLocationId={playerLoc}

                  disabled={mapBusy}

                  onNodeClick={handleMapTravel}

                />

              </Card>

            )}



            <Card accent="cyan">

              <LocationScenePanel

                location={location}

                sceneSrc={sceneSrc}

                busy={mapBusy}

                districtNodes={districtView?.nodes}

                playerLocationId={playerLoc}

                onTravel={handleMapTravel}

                onCommand={(cmd) => void runCommand(cmd)}

              />

            </Card>

          </div>



          <aside className="space-y-6">

            <Card accent="cyan" delay={0}>

              <ProgressionPanel progression={shell?.progression} />

            </Card>



            <Card accent="registry" delay={0}>

              <QuestProgressPanel quest={shell?.questProgress} />

            </Card>



            <Card accent="registry" delay={0}>

              <LenoPanel shell={shell} busy={mapBusy} onCommand={(cmd) => void runCommand(cmd)} />

            </Card>



            <Card accent="neutral" delay={0}>

              <NpcCardsPanel

                npcs={shell?.npcCards}

                busy={mapBusy}

                onSelectNpc={setSelectedNpc}

              />

            </Card>



            <Card accent="cyan" delay={0}>

              <CaseBoardPanel

                caseBoard={shell?.caseBoard}

                assets={shell?.assets}

                busy={mapBusy}

                onCommand={(cmd) => void runCommand(cmd)}

              />

            </Card>



            <Card accent="amber" delay={0}>

              <RumorTrailPanel

                trail={shell?.rumorTrail}

                rumorIcon={shell?.assets?.rumorIcon}

                busy={mapBusy}

                onCommand={(cmd) => void runCommand(cmd)}

              />

            </Card>



            <Card accent="registry" delay={0}>

              <FounderPanel
                founder={founder}
                assets={shell?.assets}
                busy={mapBusy}
                onCommand={(cmd) => void runCommand(cmd)}
              />

            </Card>

          </aside>

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

              disabled={mapBusy}

              className="flex-1 rounded-lg border border-border bg-void px-4 py-3 font-mono text-sm text-cyan-glow placeholder:text-muted focus:outline-none focus:border-cyan/50"

              autoComplete="off"

              spellCheck={false}

            />

            <button

              type="submit"

              disabled={mapBusy}

              className="shrink-0 inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold tracking-wide bg-gradient-to-r from-amber to-amber-glow text-void shadow-[0_0_24px_rgba(245,158,11,0.35)] hover:from-amber-glow disabled:opacity-50 transition-all"

            >

              {mapBusy ? (isWalking ? 'Walking…' : 'Running…') : 'Run command'}

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

    </PlayBrandFrame>

  )

}


