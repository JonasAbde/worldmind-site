import type { ReactNode } from 'react'
import type {
  ConsequenceBeat,
  DistrictView,
  GameShell,
  HealthResponse,
  NpcCard,
  VisualCues,
  WalkAnimation,
} from '../../../lib/play-api'
import type { Selection } from '../3d/district-scene-types'
import type { ExploreCameraMode } from '../3d/PlayerFollowCamera'
import { PlayGameTopBar } from './PlayGameTopBar'
import { PlayQuestTracker } from './PlayQuestTracker'
import { PlayContextRail } from './PlayContextRail'
import { PlayHudMinimap } from './PlayHudMinimap'
import { PlayGameDock, type DockTab } from './PlayGameDock'

interface PlayGameHudProps {
  children: ReactNode
  health: HealthResponse | null
  shell: GameShell | null
  visualCues: VisualCues
  districtView: DistrictView | null
  selection: Selection | null
  selectionDetail?: string | null
  output: string
  consequenceBeat: ConsequenceBeat | null
  error: string | null
  busy: boolean
  cameraMode: ExploreCameraMode
  interiorOpen: boolean
  isWalking: boolean
  walkAnimation: WalkAnimation | null
  walkProgress: number
  mapWalking: boolean
  mapPlayerLoc?: string
  mapCollapsed: boolean
  questExpanded: boolean
  dockOpen: boolean
  dockTab: DockTab
  onToggleCamera: () => void
  onToggleInterior: () => void
  onToggleMap: () => void
  onToggleQuest: () => void
  onToggleDock: () => void
  onDockTab: (tab: DockTab) => void
  onCloseDock: () => void
  onOpenHelp: () => void
  onOpenLeno?: () => void
  onMapTravel: (nodeId: string) => void
  onRunCommand: (cmd: string, options?: { clearSelection?: boolean; toastTitle?: string }) => void
  onSubmitCommand: (cmd: string) => void
  onSelectNpc: (npc: NpcCard) => void
  onOpenNpcProfile?: () => void
  overlay?: ReactNode
}

export function PlayGameHud({
  children,
  health,
  shell,
  visualCues,
  districtView,
  selection,
  selectionDetail,
  output,
  consequenceBeat,
  error,
  busy,
  cameraMode,
  interiorOpen,
  isWalking,
  walkAnimation,
  walkProgress,
  mapWalking,
  mapPlayerLoc,
  mapCollapsed,
  questExpanded,
  dockOpen,
  dockTab,
  onToggleCamera,
  onToggleInterior,
  onToggleMap,
  onToggleQuest,
  onToggleDock,
  onDockTab,
  onCloseDock,
  onOpenHelp,
  onOpenLeno,
  onMapTravel,
  onRunCommand,
  onSubmitCommand,
  onSelectNpc,
  onOpenNpcProfile,
  overlay,
}: PlayGameHudProps) {
  const inInterior = interiorOpen && Boolean(visualCues.interior)
  const showDistrictHud = !inInterior

  return (
    <div className="h-screen w-screen text-text flex flex-col overflow-hidden">
      <PlayGameTopBar
        topbar={shell?.topbar ?? {}}
        version={health?.version}
        locationName={shell?.location?.name}
        progression={shell?.progression}
        cameraMode={cameraMode}
        isWalking={isWalking}
        interiorOpen={interiorOpen}
        hasInterior={Boolean(visualCues.interior)}
        mapOpen={!mapCollapsed}
        dockOpen={dockOpen}
        onToggleCamera={onToggleCamera}
        onToggleInterior={onToggleInterior}
        onToggleMap={onToggleMap}
        onToggleDock={onToggleDock}
        onOpenHelp={onOpenHelp}
        onOpenLeno={onOpenLeno}
      />
      {isWalking && (
        <div className="shrink-0 h-0.5 bg-void/80 relative z-[60]" aria-hidden>
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan/60 to-amber-glow/80 transition-[width] duration-150"
            style={{ width: `${Math.round(walkProgress * 100)}%` }}
          />
        </div>
      )}

      <div className="flex-1 relative min-h-0">
        {children}

        {overlay}

        {showDistrictHud && districtView && (
          <div className="absolute top-3 left-3 z-[40] pointer-events-none">
            <PlayHudMinimap
              districtView={districtView}
              walkAnimation={walkAnimation}
              walkProgress={walkProgress}
              isWalking={mapWalking}
              playerLocationId={mapPlayerLoc}
              collapsed={mapCollapsed}
              onToggle={onToggleMap}
              onNodeClick={onMapTravel}
              disabled={busy || isWalking}
            />
          </div>
        )}

        {showDistrictHud && shell?.questProgress && (
          <div className="absolute bottom-3 left-3 z-[40] pointer-events-none max-sm:bottom-[min(42vh,280px)]">
            <PlayQuestTracker
              quest={shell.questProgress}
              expanded={questExpanded}
              onToggle={onToggleQuest}
            />
          </div>
        )}

        <div
          className={`absolute bottom-3 z-[40] pointer-events-none ${
            dockOpen ? 'right-[min(320px,88vw)] mr-3' : 'right-3'
          }`}
        >
          <PlayContextRail
            selection={selection}
            selectionDetail={selectionDetail}
            busy={busy}
            isWalking={isWalking}
            cameraMode={cameraMode}
            error={error}
            output={output}
            consequenceBeat={consequenceBeat}
            onRunCommand={onRunCommand}
            onSubmitCommand={onSubmitCommand}
            onOpenNpcProfile={onOpenNpcProfile}
          />
        </div>

        <PlayGameDock
          open={dockOpen}
          tab={dockTab}
          onTabChange={onDockTab}
          onClose={onCloseDock}
          shell={shell}
          founderUnlocked={Boolean(shell?.founder?.unlocked)}
          busy={busy}
          isWalking={isWalking}
          onCommand={onRunCommand}
          onSelectNpc={onSelectNpc}
        />
      </div>
    </div>
  )
}
