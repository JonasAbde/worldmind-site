import { Grid } from '@react-three/drei'
import { DISTRICT_BRAND, resolveDistrictEnvironment, type DistrictEnvironment } from './district-brand-colors'

interface DistrictGroundProps {
  environment?: DistrictEnvironment
}

/** Nordic cyberpunk district floor — wet asphalt base + cyan section grid. */
export function DistrictGround({ environment }: DistrictGroundProps) {
  const env = resolveDistrictEnvironment(environment)
  const size = 56

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial
          color={env.groundColor}
          roughness={0.82}
          metalness={0.18}
          envMapIntensity={0.35}
        />
      </mesh>

      {/* Subtle wet sheen ring around district center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[6, 14, 64]} />
        <meshStandardMaterial
          color={DISTRICT_BRAND.cyanDim}
          emissive={DISTRICT_BRAND.cyan}
          emissiveIntensity={0.08}
          transparent
          opacity={0.35}
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>

      <Grid
        args={[size, size]}
        cellSize={0.85}
        cellThickness={0.55}
        cellColor={env.gridColor}
        sectionSize={4.25}
        sectionThickness={1.1}
        sectionColor={DISTRICT_BRAND.cyan}
        fadeDistance={30}
        fadeStrength={1.4}
        infiniteGrid={false}
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  )
}
