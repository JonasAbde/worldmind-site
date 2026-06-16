import { Billboard, Float, useTexture } from '@react-three/drei'

interface HologramPortraitProps {
  url: string
  /** World-space Y offset above character root. */
  y?: number
}

/** Floating portrait hologram — accent only; body stays 3D mesh. */
export function HologramPortrait({ url, y = 1.72 }: HologramPortraitProps) {
  const tex = useTexture(url)
  return (
    <Float speed={1.6} floatIntensity={0.22} rotationIntensity={0.05}>
      <Billboard follow lockX lockZ position={[0, y, 0]}>
        <mesh>
          <planeGeometry args={[0.34, 0.42]} />
          <meshBasicMaterial map={tex} transparent alphaTest={0.06} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[0.38, 0.46]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.12} toneMapped={false} />
        </mesh>
      </Billboard>
    </Float>
  )
}
