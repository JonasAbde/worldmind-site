import type { VisualCuesLocation } from '../../../lib/play-api'
import { DISTRICT_BRAND } from './district-brand-colors'

const LANDMARK_KIND: Record<string, 'civic' | 'harbour'> = {
  district_square: 'civic',
  harbour: 'harbour',
  harbor: 'harbour',
  harbour_docks: 'harbour',
  harbor_docks: 'harbour',
}

function CivicPlaza({ position }: { position: [number, number, number] }) {
  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[3.4, 48]} />
        <meshStandardMaterial color={DISTRICT_BRAND.elevated} roughness={0.72} metalness={0.22} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.055, 0]}>
        <ringGeometry args={[2.5, 3.15, 48]} />
        <meshStandardMaterial
          color={DISTRICT_BRAND.civic}
          emissive={DISTRICT_BRAND.civicDim}
          emissiveIntensity={0.45}
          transparent
          opacity={0.88}
        />
      </mesh>
      {[-1.8, 0, 1.8].map((x) => (
        <mesh key={x} castShadow position={[x, 0.35, 0]}>
          <boxGeometry args={[0.35, 0.7, 0.35]} />
          <meshStandardMaterial color={DISTRICT_BRAND.border} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.35, 8]} />
        <meshStandardMaterial
          color={DISTRICT_BRAND.cyanGlow}
          emissive={DISTRICT_BRAND.cyan}
          emissiveIntensity={0.55}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
        <ringGeometry args={[0.55, 0.75, 24]} />
        <meshBasicMaterial color={DISTRICT_BRAND.cyan} transparent opacity={0.5} />
      </mesh>
      <pointLight color={DISTRICT_BRAND.civic} intensity={0.35} distance={6} position={[0, 1.2, 0]} />
    </group>
  )
}

function HarbourDock({ position }: { position: [number, number, number] }) {
  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.8, 0.025, 0]}>
        <planeGeometry args={[9, 7]} />
        <meshStandardMaterial
          color={DISTRICT_BRAND.cyanDim}
          emissive={DISTRICT_BRAND.cyan}
          emissiveIntensity={0.18}
          roughness={0.15}
          metalness={0.55}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh receiveShadow castShadow position={[0, 0.14, 0]}>
        <boxGeometry args={[4.2, 0.22, 2.8]} />
        <meshStandardMaterial color="#374151" roughness={0.92} />
      </mesh>
      {[-1.4, 1.4].map((x) => (
        <mesh key={x} castShadow position={[x, 0.45, 1.1]}>
          <cylinderGeometry args={[0.12, 0.14, 0.55, 8]} />
          <meshStandardMaterial color={DISTRICT_BRAND.border} metalness={0.4} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[-2.2, 0.55, 0]}>
        <boxGeometry args={[0.15, 1.1, 0.15]} />
        <meshStandardMaterial color={DISTRICT_BRAND.amber} emissive={DISTRICT_BRAND.amber} emissiveIntensity={0.35} />
      </mesh>
      <pointLight color={DISTRICT_BRAND.cyanGlow} intensity={0.25} distance={5} position={[2.5, 0.6, 0]} />
    </group>
  )
}

interface ZoneLandmarksProps {
  locations: VisualCuesLocation[]
}

/** Ground geometry for civic plaza / harbour when those locations appear in visualCues. */
export function ZoneLandmarks({ locations }: ZoneLandmarksProps) {
  return (
    <>
      {locations.map((loc) => {
        const kind = LANDMARK_KIND[loc.id]
        if (!kind) return null
        const position = loc.position as [number, number, number]
        if (kind === 'civic') {
          return <CivicPlaza key={`landmark-${loc.id}`} position={position} />
        }
        return <HarbourDock key={`landmark-${loc.id}`} position={position} />
      })}
    </>
  )
}
