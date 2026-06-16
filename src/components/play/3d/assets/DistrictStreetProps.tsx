import type { ReactNode } from 'react'
import { DISTRICT_BRAND } from '../district-brand-colors'
import type { VisualCuesLocation } from '../../../../lib/play-api'

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 2.2, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.5} />
      </mesh>
      <mesh position={[0, 2.25, 0]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshStandardMaterial color={DISTRICT_BRAND.cyanGlow} emissive={DISTRICT_BRAND.cyan} emissiveIntensity={1} />
      </mesh>
      <pointLight color={DISTRICT_BRAND.cyanGlow} intensity={0.35} distance={4} position={[0, 2.2, 0]} />
    </group>
  )
}

function DeliveryCrate({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.28, 0]}>
        <boxGeometry args={[0.55, 0.55, 0.55]} />
        <meshStandardMaterial color="#78350f" roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.28, 0.29]}>
        <boxGeometry args={[0.45, 0.12, 0.04]} />
        <meshStandardMaterial color={DISTRICT_BRAND.amber} emissive={DISTRICT_BRAND.amber} emissiveIntensity={0.35} />
      </mesh>
    </group>
  )
}

function DataPylon({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.12, 1.8, 0.12]} />
        <meshStandardMaterial color={DISTRICT_BRAND.border} metalness={0.55} />
      </mesh>
      <mesh position={[0, 1.5, 0.08]}>
        <boxGeometry args={[0.5, 0.3, 0.03]} />
        <meshStandardMaterial color={DISTRICT_BRAND.cyanDim} emissive={DISTRICT_BRAND.cyan} emissiveIntensity={0.45} />
      </mesh>
    </group>
  )
}

interface DistrictStreetPropsProps {
  locations: VisualCuesLocation[]
}

/** Ambient street props anchored near district locations. */
export function DistrictStreetProps({ locations }: DistrictStreetPropsProps) {
  const nodes: ReactNode[] = []
  for (const loc of locations) {
    const [x, , z] = loc.position as [number, number, number]
    nodes.push(<StreetLamp key={`lamp-${loc.id}`} position={[x + 2.2, 0, z + 1.4]} />)
    if (loc.id === 'cafe') {
      nodes.push(<DeliveryCrate key={`crate-${loc.id}`} position={[x - 1.5, 0, z + 1.8]} />)
    }
    if (loc.id === 'market' || loc.id === 'workshop') {
      nodes.push(<DataPylon key={`pylon-${loc.id}`} position={[x - 2, 0, z - 1.2]} />)
    }
  }
  return <>{nodes}</>
}
