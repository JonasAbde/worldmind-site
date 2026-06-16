import { useMemo } from 'react'
import {
  getWalkNodePath,
  isEdgeOnWalkPath,
  nodeLabel,
  sampleWalkPosition,
} from '../../lib/district-walk-utils'
import type { DistrictView, WalkAnimation } from '../../lib/play-api'

interface DistrictWalkMapProps {
  districtView: DistrictView
  walkAnimation?: WalkAnimation | null
  walkProgress: number
  isWalking: boolean
  playerLocationId?: string | null
  disabled?: boolean
  compact?: boolean
  onNodeClick?: (nodeId: string) => void
}

export function DistrictWalkMap({
  districtView,
  walkAnimation,
  walkProgress,
  isWalking,
  playerLocationId,
  disabled,
  compact,
  onNodeClick,
}: DistrictWalkMapProps) {
  const path = getWalkNodePath(walkAnimation)
  const destId = path[path.length - 1] ?? null

  const playerDot = useMemo(() => {
    if (isWalking && path.length > 0) {
      return sampleWalkPosition(districtView.nodes, path, walkProgress)
    }
    const node = districtView.nodes.find((n) => n.id === playerLocationId)
    return node ? { x: node.x, y: node.y } : null
  }, [districtView.nodes, isWalking, path, walkProgress, playerLocationId])

  return (
    <svg
      viewBox="0 0 400 220"
      className={`w-full h-auto rounded-lg border border-border/40 bg-elevated/30 ${compact ? 'max-h-36' : ''}`}
      role="img"
      aria-label="District map"
    >
      {(districtView.edges ?? []).map((e) => {
        const from = districtView.nodes.find((n) => n.id === e.from)
        const to = districtView.nodes.find((n) => n.id === e.to)
        if (!from || !to) return null
        const active = isWalking && isEdgeOnWalkPath(e, path)
        return (
          <line
            key={`${e.from}-${e.to}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={active ? 'rgba(245,158,11,0.9)' : 'rgba(34,211,238,0.25)'}
            strokeWidth={active ? 3 : 2}
          />
        )
      })}
      {districtView.nodes.map((node) => {
        const isHere = !isWalking && node.id === playerLocationId
        const isDest = isWalking && node.id === destId
        return (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={isHere || isDest ? 18 : 14}
              fill={isHere || isDest ? 'rgba(245,158,11,0.35)' : 'rgba(34,211,238,0.15)'}
              stroke={isHere || isDest ? '#f59e0b' : 'rgba(34,211,238,0.5)'}
              strokeWidth={2}
              className={disabled || isHere ? 'cursor-default' : 'cursor-pointer'}
              onClick={() => {
                if (disabled || !onNodeClick || isHere) return
                onNodeClick(node.id)
              }}
            />
            {!compact && (
              <text x={node.x} y={node.y + 32} textAnchor="middle" fill="#94a3b8" fontSize="10">
                {nodeLabel(node)}
              </text>
            )}
          </g>
        )
      })}
      {playerDot && (
        <circle
          cx={playerDot.x}
          cy={playerDot.y}
          r={6}
          fill="#fbbf24"
          stroke="#f59e0b"
          strokeWidth={2}
          className={isWalking ? 'animate-pulse' : undefined}
        />
      )}
    </svg>
  )
}
