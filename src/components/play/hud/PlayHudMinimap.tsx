import { DistrictWalkMap } from '../DistrictWalkMap'
import type { DistrictView, WalkAnimation } from '../../../lib/play-api'

interface PlayHudMinimapProps {
  districtView: DistrictView
  walkAnimation: WalkAnimation | null
  walkProgress: number
  isWalking: boolean
  playerLocationId?: string
  collapsed: boolean
  onToggle: () => void
  onNodeClick: (nodeId: string) => void
  disabled: boolean
}

export function PlayHudMinimap({
  districtView,
  walkAnimation,
  walkProgress,
  isWalking,
  playerLocationId,
  collapsed,
  onToggle,
  onNodeClick,
  disabled,
}: PlayHudMinimapProps) {
  if (districtView.nodes.length === 0) return null

  return (
    <div className="pointer-events-auto">
      {collapsed ? (
        <button
          type="button"
          onClick={onToggle}
          className="play-hud-panel px-3 py-2 font-mono text-[10px] text-cyan-glow uppercase tracking-widest"
        >
          Map
        </button>
      ) : (
        <div className="play-hud-panel p-2 w-[min(200px,40vw)]">
          <div className="flex items-center justify-between gap-2 mb-1.5 px-0.5">
            <p className="font-mono text-[9px] text-muted uppercase tracking-widest">
              {isWalking ? 'Route' : 'District'}
            </p>
            <button
              type="button"
              onClick={onToggle}
              className="font-mono text-[10px] text-muted hover:text-cyan-glow"
              aria-label="Collapse map"
            >
              −
            </button>
          </div>
          <DistrictWalkMap
            districtView={districtView}
            walkAnimation={walkAnimation}
            walkProgress={walkProgress}
            isWalking={isWalking}
            playerLocationId={playerLocationId}
            onNodeClick={onNodeClick}
            compact
            disabled={disabled}
          />
        </div>
      )}
    </div>
  )
}
