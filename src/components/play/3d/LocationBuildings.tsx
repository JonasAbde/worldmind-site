import { Billboard, Float, Html, useTexture } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group, Mesh, MeshBasicMaterial } from 'three'
import type { VisualCuesAgent, VisualCuesLocation } from '../../../lib/play-api'
import { assetUrl } from '../../../lib/play-api'
import { SceneErrorBoundary } from './CanvasErrorBoundary'
import { CharacterFigure } from './CharacterFigure'
import { DistrictBuilding3D } from './assets/DistrictBuilding3D'
import { DISTRICT_BRAND } from './district-brand-colors'
import type { Selection } from './district-scene-types'
import { usePlayerLocomotionState } from './PlayerLocomotionContext'

function locationSelection(loc: VisualCuesLocation): Selection {
  return {
    kind: 'location',
    id: loc.id,
    label: loc.label,
    command: loc.command,
    description: loc.isPlayerHere ? `${loc.zone} · you are here` : `${loc.zone} · click to travel`,
  }
}

function handleLocationClick(
  loc: VisualCuesLocation,
  onSelect: (s: Selection) => void,
  onTravel: ((s: Selection) => void) | undefined,
  e: ThreeEvent<MouseEvent>,
) {
  e.stopPropagation()
  const sel = locationSelection(loc)
  if (!loc.isPlayerHere && onTravel) {
    onTravel(sel)
    return
  }
  onSelect(sel)
}

function LocationBuilding3D({
  loc,
  onSelect,
  onTravel,
}: {
  loc: VisualCuesLocation
  onSelect: (s: Selection) => void
  onTravel?: (s: Selection) => void
}) {
  const position = loc.position as [number, number, number]
  return (
    <group position={[position[0], 0, position[2]]}>
      <DistrictBuilding3D
        locationId={loc.id}
        zone={loc.zone}
        label={loc.label}
        isPlayerHere={loc.isPlayerHere}
        sceneTexture={loc.sceneTexture}
        modelUrl={loc.modelUrl}
        onClick={(e) => handleLocationClick(loc, onSelect, onTravel, e)}
      />
      <Html position={[0, 3.6, 0]} center distanceFactor={14}>
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
  onTravel,
}: {
  loc: VisualCuesLocation
  onSelect: (s: Selection) => void
  onTravel?: (s: Selection) => void
}) {
  const [w, h, d] = loc.scale ?? [2, 2.5, 2]
  const position = loc.position as [number, number, number]
  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh
        castShadow
        receiveShadow
        position={[0, h / 2, 0]}
        onClick={(e) => handleLocationClick(loc, onSelect, onTravel, e)}
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={loc.color ?? '#64748b'}
          emissive={loc.emissive ?? '#000000'}
          emissiveIntensity={loc.emissiveIntensity ?? 0.12}
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
  const turnRef = useRef<Group>(null)
  const idleKind = agent.idleAnimation === 'turn' ? 'turn' : 'bob'
  const figureTexture =
    agent.figureTexture ?? agent.portrait ?? `assets/characters/${agent.id}/portrait.png`

  useFrame(({ clock }) => {
    if (idleKind !== 'turn' || !turnRef.current) return
    const phase = agent.id.split('').reduce((n, c) => n + c.charCodeAt(0), 0) * 0.17
    turnRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.45 + phase) * 0.4
  })

  return (
    <group position={pos}>
      <Float speed={1.4} rotationIntensity={idleKind === 'turn' ? 0.08 : 0} floatIntensity={0.45}>
        <group ref={turnRef}>
          <CharacterFigure
            characterId={agent.id}
            figureTexture={figureTexture}
            fullBodyTexture={agent.fullBodyTexture}
            modelUrl={agent.modelUrl}
            renderMode={agent.renderMode ?? 'mesh3d'}
            variant="npc"
            role={agent.role}
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
          />
        </group>
      </Float>
      <Html position={[0, 2.05, 0]} center distanceFactor={12}>
        <span className="font-mono text-[9px] text-text-bright bg-void/75 px-1.5 py-0.5 rounded border border-cyan/30">
          {agent.name}
        </span>
      </Html>
    </group>
  )
}

function HotspotGem() {
  return (
    <mesh>
      <octahedronGeometry args={[0.38, 0]} />
      <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.7} />
    </mesh>
  )
}

function HotspotIconBillboard({ iconUrl }: { iconUrl: string }) {
  const texture = useTexture(iconUrl)
  return (
    <Billboard follow lockX lockZ>
      <mesh>
        <planeGeometry args={[0.72, 0.72]} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.08} toneMapped={false} />
      </mesh>
    </Billboard>
  )
}

function HotspotMarker({
  id,
  label,
  command,
  risk,
  preview,
  description,
  icon,
  position,
  onSelect,
  onInspect,
}: {
  id: string
  label: string
  command: string
  risk?: number
  preview?: string | null
  description?: string | null
  icon?: string | null
  position: [number, number, number]
  onSelect: (s: Selection) => void
  onInspect?: (s: Selection) => void
}) {
  const detail = preview ?? description ?? `Risk ${risk ?? 1}`
  const iconUrl = icon ? assetUrl(icon) : null

  const handleHotspotClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const selection: Selection = {
      kind: 'hotspot',
      id,
      label,
      command,
      description: detail,
      preview: preview ?? description ?? undefined,
      risk,
    }
    onSelect(selection)
    onInspect?.(selection)
  }

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.5}>
      <group position={position} onClick={handleHotspotClick}>
        {iconUrl ? <HotspotIconBillboard iconUrl={iconUrl} /> : <HotspotGem />}
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

function PlayerMarker({
  position,
  figureTexture = 'assets/characters/player/portrait.png',
  fullBodyTexture,
  modelUrl,
  renderMode = 'mesh3d',
  useLocomotion = false,
  walking = false,
}: {
  position: [number, number, number]
  figureTexture?: string
  fullBodyTexture?: string | null
  modelUrl?: string | null
  renderMode?: 'mesh3d' | 'sprite2d'
  useLocomotion?: boolean
  /** Force walk cycle (e.g. scripted path animation). */
  walking?: boolean
}) {
  const groupRef = useRef<Group>(null)
  const outerRingRef = useRef<Mesh>(null)
  const locomotion = usePlayerLocomotionState()
  const isWalkingRef = useRef(walking)
  const facingRef = useRef<number | null>(null)

  useFrame(({ clock }) => {
    if (useLocomotion && locomotion && groupRef.current) {
      const [x, y, z] = locomotion.positionRef.current
      groupRef.current.position.set(x, y, z)
      isWalkingRef.current = locomotion.isMovingRef.current
      facingRef.current = locomotion.facingRef.current
      const facing = locomotion.facingRef.current
      if (facing != null) groupRef.current.rotation.y = facing
    } else {
      isWalkingRef.current = walking
    }

    const t = clock.elapsedTime
    const pulse = 0.92 + Math.sin(t * 3.2) * 0.12
    if (outerRingRef.current) {
      outerRingRef.current.scale.set(pulse, pulse, 1)
      const mat = outerRingRef.current.material as MeshBasicMaterial
      mat.opacity = 0.45 + Math.sin(t * 3.2) * 0.25
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <pointLight color={DISTRICT_BRAND.amberGlow} intensity={1.1} distance={5} position={[0, 1.3, 0]} />
      <mesh ref={outerRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[0.55, 0.88, 32]} />
        <meshBasicMaterial color={DISTRICT_BRAND.amber} transparent opacity={0.65} />
      </mesh>
      <CharacterFigure
        characterId="player"
        figureTexture={figureTexture}
        fullBodyTexture={fullBodyTexture}
        modelUrl={modelUrl}
        renderMode={renderMode}
        variant="player"
        walking={isWalkingRef.current}
        facing={facingRef.current}
      />
      <Html position={[0, 2.15, 0]} center distanceFactor={10}>
        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-amber/60 bg-amber/20 text-amber-glow uppercase tracking-widest shadow-[0_0_12px_rgba(251,191,36,0.35)]">
          You
        </span>
      </Html>
    </group>
  )
}

export function DistrictScene3D({
  loc,
  onSelect,
  onTravel,
}: {
  loc: VisualCuesLocation
  onSelect: (s: Selection) => void
  onTravel?: (s: Selection) => void
}) {
  return (
    <SceneErrorBoundary fallback={<FallbackBuilding loc={loc} onSelect={onSelect} onTravel={onTravel} />}>
      <LocationBuilding3D loc={loc} onSelect={onSelect} onTravel={onTravel} />
    </SceneErrorBoundary>
  )
}

export { HotspotMarker, PlayerMarker, AgentMarker }
