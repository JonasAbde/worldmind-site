import { Line } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import type { VisualCues, VisualCuesAgent, VisualCuesLocation, VisualCuesEdge } from '../../../lib/play-api'

export type Selection =
  | { kind: 'location'; id: string; label: string; command: string; description?: string }
  | { kind: 'agent'; id: string; label: string; commands: VisualCuesAgent['commands']; description?: string }
  | { kind: 'hotspot'; id: string; label: string; command: string; description?: string }

interface DistrictScene3DProps {
  cues: VisualCues
  onSelect: (selection: Selection) => void
}

function Building({
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
            description: `${loc.zone} · ${loc.agents?.length ?? 0} agent(s)`,
          })
        }}
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={loc.color ?? '#64748b'}
          emissive={loc.emissive ?? '#000000'}
          emissiveIntensity={loc.emissiveIntensity ?? 0.12}
          roughness={0.55}
          metalness={0.12}
        />
      </mesh>
      {loc.agents?.map((agent: VisualCuesAgent) => (
        <AgentMarker key={agent.id} agent={agent} onSelect={onSelect} />
      ))}
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
    <mesh
      castShadow
      position={pos}
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
      <meshStandardMaterial color="#58a6ff" emissive="#1d4ed8" emissiveIntensity={0.3} />
    </mesh>
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
    <mesh
      position={position}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        onSelect({ kind: 'hotspot', id, label, command, description: `Risk ${risk ?? 1}` })
      }}
    >
      <octahedronGeometry args={[0.35, 0]} />
      <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.55} />
    </mesh>
  )
}

export function DistrictScene3D({ cues, onSelect }: DistrictScene3DProps) {
  const env = cues.environment ?? {}
  const fogColor = env.fogColor ?? '#0a0e14'
  const cam = cues.camera ?? { target: [0, 1.5, 0], distance: 16 }

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

  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, env.fogNear ?? 18, env.fogFar ?? 42]} />
      <ambientLight intensity={env.ambientIntensity ?? 0.55} />
      <directionalLight castShadow position={[12, 18, 8]} intensity={env.sunIntensity ?? 1.1} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[48, 48]} />
        <meshStandardMaterial color={env.groundColor ?? '#0d1117'} roughness={0.9} />
      </mesh>
      <gridHelper args={[48, 48, env.gridColor ?? '#1f2937', '#111827']} position={[0, 0.02, 0]} />

      {edgeLines}
      {cues.locations.map((loc: VisualCuesLocation) => (
        <Building key={loc.id} loc={loc} onSelect={onSelect} />
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

      {/* Camera target hint for drei OrbitControls parent */}
      <mesh visible={false} position={cam.target as [number, number, number]}>
        <sphereGeometry args={[0.1]} />
      </mesh>
    </>
  )
}
