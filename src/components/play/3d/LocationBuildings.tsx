import { Float, Html, useTexture } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { assetUrl } from '../../../lib/play-api'
import type { VisualCuesAgent, VisualCuesLocation } from '../../../lib/play-api'
import type { Selection } from './district-scene-types'

const BILLBOARD_W = 4.2
const BILLBOARD_H = 2.8

function TexturedSceneBuilding({
  loc,
  onSelect,
}: {
  loc: VisualCuesLocation
  onSelect: (s: Selection) => void
}) {
  const url = assetUrl(loc.sceneTexture!)!
  const texture = useTexture(url)
  const position = loc.position as [number, number, number]

  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[1.6, 2.3, 32]} />
        <meshStandardMaterial
          color={loc.isPlayerHere ? '#f59e0b' : '#1f2937'}
          emissive={loc.isPlayerHere ? '#f59e0b' : '#000000'}
          emissiveIntensity={loc.isPlayerHere ? 0.35 : 0}
        />
      </mesh>
      <mesh
        castShadow
        position={[0, BILLBOARD_H / 2 + 0.15, 0]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          onSelect({
            kind: 'location',
            id: loc.id,
            label: loc.label,
            command: loc.command,
            description: `${loc.zone} · click to travel`,
          })
        }}
      >
        <planeGeometry args={[BILLBOARD_W, BILLBOARD_H]} />
        <meshBasicMaterial map={texture} toneMapped={false} transparent />
      </mesh>
      <Html position={[0, BILLBOARD_H + 0.6, 0]} center distanceFactor={14}>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-void/80 border border-border/60 text-cyan-glow whitespace-nowrap">
          {loc.label}
          {loc.isPlayerHere ? ' · you are here' : ''}
        </span>
      </Html>
      {loc.agents?.map((agent: VisualCuesAgent) => (
        <AgentMarker key={agent.id} agent={agent} onSelect={onSelect} />
      ))}
    </group>
  )
}

function FallbackBuilding({
  loc,
  onSelect,
}: {
  loc: VisualCuesLocation
  onSelect: (s: Selection) => void
}) {
  const [w, h, d] = loc.scale ?? [2, 2.5, 2]
  const position = loc.position as [number, number, number]
  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh
        castShadow
        receiveShadow
        position={[0, h / 2, 0]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          onSelect({
            kind: 'location',
            id: loc.id,
            label: loc.label,
            command: loc.command,
            description: loc.zone,
          })
        }}
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={loc.color ?? '#64748b'}
          emissive={loc.emissive ?? '#000000'}
          emissiveIntensity={loc.emissiveIntensity ?? 0.12}
        />
      </mesh>
    </group>
  )
}

function AgentMarker({
  agent,
  onSelect,
}: {
  agent: VisualCuesAgent
  onSelect: (s: Selection) => void
}) {
  const pos = agent.position as [number, number, number]
  return (
    <group position={pos}>
      <mesh
        castShadow
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          onSelect({
            kind: 'agent',
            id: agent.id,
            label: agent.name,
            commands: agent.commands,
            description: agent.role,
          })
        }}
      >
        <capsuleGeometry args={[0.35, 0.9, 4, 8]} />
        <meshStandardMaterial color="#58a6ff" emissive="#1d4ed8" emissiveIntensity={0.35} />
      </mesh>
      <Html position={[0, 1.4, 0]} center distanceFactor={12}>
        <span className="font-mono text-[9px] text-text-bright bg-void/75 px-1.5 py-0.5 rounded border border-cyan/30">
          {agent.name}
        </span>
      </Html>
    </group>
  )
}

function HotspotMarker({
  id,
  label,
  command,
  risk,
  position,
  onSelect,
}: {
  id: string
  label: string
  command: string
  risk?: number
  position: [number, number, number]
  onSelect: (s: Selection) => void
}) {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.6}>
      <group position={position}>
        <mesh
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation()
            onSelect({ kind: 'hotspot', id, label, command, description: `Risk ${risk ?? 1}` })
          }}
        >
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.7} />
        </mesh>
        <Html position={[0, 0.9, 0]} center distanceFactor={10}>
          <button
            type="button"
            className="font-mono text-[9px] px-2 py-1 rounded border border-amber/40 bg-amber/10 text-amber-glow whitespace-nowrap"
          >
            {label}
          </button>
        </Html>
      </group>
    </Float>
  )
}

function PlayerMarker({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.45, 0.65, 32]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.28, 0.5, 4, 8]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

export function DistrictScene3D({
  loc,
  onSelect,
}: {
  loc: VisualCuesLocation
  onSelect: (s: Selection) => void
}) {
  if (loc.sceneTexture) {
    return <TexturedSceneBuilding loc={loc} onSelect={onSelect} />
  }
  return <FallbackBuilding loc={loc} onSelect={onSelect} />
}

export { HotspotMarker, PlayerMarker, AgentMarker }
