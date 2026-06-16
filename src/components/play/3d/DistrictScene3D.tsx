import { Line } from '@react-three/drei'
import type { VisualCues, VisualCuesEdge, VisualCuesLocation } from '../../../lib/play-api'
import type { Selection } from './district-scene-types'
import { DistrictScene3D, HotspotMarker, PlayerMarker } from './LocationBuildings'

interface DistrictWorldProps {
  cues: VisualCues
  onSelect: (selection: Selection) => void
}

export function DistrictWorld({ cues, onSelect }: DistrictWorldProps) {
  const env = cues.environment ?? {}

  const edgeLines = (cues.edges ?? []).map((edge: VisualCuesEdge, i: number) => {
    if (!edge.fromPosition || !edge.toPosition) return null
    return (
      <Line
        key={`${edge.from}-${edge.to}-${i}`}
        points={[
          edge.fromPosition as [number, number, number],
          edge.toPosition as [number, number, number],
        ]}
        color="#22d3ee"
        transparent
        opacity={0.35}
        position={[0, 0.15, 0]}
      />
    )
  })

  const playerPos = cues.player?.position as [number, number, number] | undefined

  return (
    <>
      <color attach="background" args={[env.fogColor ?? '#0a0e14']} />
      <fog attach="fog" args={[env.fogColor ?? '#0a0e14', env.fogNear ?? 18, env.fogFar ?? 42]} />
      <ambientLight intensity={env.ambientIntensity ?? 0.55} />
      <directionalLight castShadow position={[12, 18, 8]} intensity={env.sunIntensity ?? 1.1} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[48, 48]} />
        <meshStandardMaterial color={env.groundColor ?? '#0d1117'} roughness={0.9} />
      </mesh>
      <gridHelper args={[48, 48, env.gridColor ?? '#1f2937', '#111827']} position={[0, 0.02, 0]} />

      {edgeLines}
      {cues.locations.map((loc: VisualCuesLocation) => (
        <DistrictScene3D key={loc.id} loc={loc} onSelect={onSelect} />
      ))}
      {cues.hotspots.map((hs) => (
        <HotspotMarker
          key={hs.id}
          id={hs.id}
          label={hs.label}
          command={hs.command}
          risk={hs.risk}
          position={hs.position as [number, number, number]}
          onSelect={onSelect}
        />
      ))}
      {playerPos && <PlayerMarker position={playerPos} />}
    </>
  )
}

export type { Selection } from './district-scene-types'
