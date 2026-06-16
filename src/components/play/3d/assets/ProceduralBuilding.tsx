import { Billboard, useTexture } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { assetUrl, locationSceneTextureCandidates } from '../../../../lib/play-api'
import { DISTRICT_BRAND } from '../district-brand-colors'
import { presetForLocation, type BuildingPreset } from './building-presets'

interface ProceduralBuildingProps {
  locationId: string
  zone: string
  label: string
  isPlayerHere?: boolean
  sceneTexture?: string | null
  onClick?: (e: ThreeEvent<MouseEvent>) => void
}

function NeonStrip({ w, h, y, color }: { w: number; h: number; y: number; color: string }) {
  return (
    <mesh position={[0, y, 0]}>
      <boxGeometry args={[w, h, 0.08]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} toneMapped={false} />
    </mesh>
  )
}

function ResidentialBlock({ p, active }: { p: BuildingPreset; active: boolean }) {
  const [w, h, d] = p.footprint
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={p.wallColor} roughness={0.78} metalness={0.15} />
      </mesh>
      {[-0.9, 0.9].map((x) => (
        <group key={x} position={[x, h * 0.55, d / 2 + 0.06]}>
          <mesh>
            <boxGeometry args={[0.7, 0.9, 0.12]} />
            <meshStandardMaterial color="#0f172a" emissive={p.emissive} emissiveIntensity={active ? 0.45 : 0.2} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, h + p.roofHeight / 2, 0]} castShadow>
        <boxGeometry args={[w + 0.12, p.roofHeight, d + 0.12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.35} roughness={0.55} />
      </mesh>
      <NeonStrip w={w * 0.7} h={0.06} y={h * 0.25} color={p.trimColor} />
    </group>
  )
}

function CafeBlock({ p }: { p: BuildingPreset }) {
  const [w, h, d] = p.footprint
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={p.wallColor} roughness={0.85} />
      </mesh>
      <mesh position={[0, h + 0.08, d / 2 + 0.35]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[w + 0.6, 0.06, 1.4]} />
        <meshStandardMaterial color={p.trimColor} emissive={p.emissive} emissiveIntensity={0.35} />
      </mesh>
      {[-0.8, 0.8].map((x) => (
        <mesh key={x} position={[x, 0.35, d / 2 + 0.5]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.7, 8]} />
          <meshStandardMaterial color="#44403c" />
        </mesh>
      ))}
      <pointLight color={p.emissive} intensity={0.4} distance={4} position={[0, h, d / 2]} />
    </group>
  )
}

function MarketBlock({ p }: { p: BuildingPreset }) {
  const [w, h, d] = p.footprint
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <planeGeometry args={[w + 1, d + 0.8]} />
        <meshStandardMaterial color="#0f766e" roughness={0.9} />
      </mesh>
      {[-1.1, 0, 1.1].map((x) => (
        <mesh key={x} castShadow position={[x, h / 2, 0]}>
          <boxGeometry args={[0.9, h, 1.2]} />
          <meshStandardMaterial color={p.wallColor} />
        </mesh>
      ))}
      <mesh position={[0, h + 0.5, 0]}>
        <boxGeometry args={[w + 0.4, 0.08, d]} />
        <meshStandardMaterial color={p.trimColor} emissive={p.emissive} emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

function IndustrialBlock({ p }: { p: BuildingPreset }) {
  const [w, h, d] = p.footprint
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={p.wallColor} metalness={0.4} roughness={0.65} />
      </mesh>
      <mesh position={[w / 2 - 0.2, h + 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 1.6, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.6} />
      </mesh>
      <mesh position={[-w / 3, h * 0.6, d / 2 + 0.1]}>
        <boxGeometry args={[0.5, 0.5, 0.15]} />
        <meshStandardMaterial color={p.emissive} emissive={p.emissive} emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}

function CivicBlock({ p }: { p: BuildingPreset }) {
  const [w, h] = p.footprint
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <circleGeometry args={[w / 2, 32]} />
        <meshStandardMaterial color={DISTRICT_BRAND.elevated} />
      </mesh>
      <mesh position={[0, h / 2, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.45, h, 6]} />
        <meshStandardMaterial color={p.trimColor} emissive={p.emissive} emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

function BuildingMesh({ preset, active }: { preset: BuildingPreset; active?: boolean }) {
  switch (preset.style) {
    case 'cafe':
      return <CafeBlock p={preset} />
    case 'market':
      return <MarketBlock p={preset} />
    case 'industrial':
      return <IndustrialBlock p={preset} />
    case 'civic':
      return <CivicBlock p={preset} />
    default:
      return <ResidentialBlock p={preset} active={!!active} />
  }
}

function SceneSign({ sceneTexture }: { sceneTexture: string }) {
  const urls = locationSceneTextureCandidates(sceneTexture)
  const texture = useTexture(urls[0] ?? assetUrl(sceneTexture)!)
  return (
    <Billboard follow lockX lockZ position={[0, 2.8, 1.6]}>
      <mesh>
        <planeGeometry args={[1.4, 0.9]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} opacity={0.92} />
      </mesh>
    </Billboard>
  )
}

export function ProceduralBuilding({
  locationId,
  zone,
  isPlayerHere,
  sceneTexture,
  onClick,
}: ProceduralBuildingProps) {
  const preset = presetForLocation(locationId, zone)
  const [w, h] = [preset.footprint[0], preset.footprint[1]]

  return (
    <group onClick={onClick}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <ringGeometry args={[Math.max(w, 2) * 0.45, Math.max(w, 2) * 0.62, 32]} />
        <meshStandardMaterial
          color={isPlayerHere ? DISTRICT_BRAND.amber : '#1f2937'}
          emissive={isPlayerHere ? DISTRICT_BRAND.amber : '#000000'}
          emissiveIntensity={isPlayerHere ? 0.4 : 0}
        />
      </mesh>
      <BuildingMesh preset={preset} active={isPlayerHere} />
      {sceneTexture ? <SceneSign sceneTexture={sceneTexture} /> : null}
      <pointLight
        color={isPlayerHere ? DISTRICT_BRAND.amberGlow : preset.emissive}
        intensity={isPlayerHere ? 0.55 : 0.2}
        distance={5}
        position={[0, h, 0]}
      />
    </group>
  )
}
