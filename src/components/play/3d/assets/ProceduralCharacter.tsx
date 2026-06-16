import { Billboard, useTexture } from '@react-three/drei'
import { assetUrl, characterFigureTextureCandidates } from '../../../../lib/play-api'
import { DISTRICT_BRAND } from '../district-brand-colors'

export type ProceduralCharacterVariant = 'player' | 'npc'

interface ProceduralCharacterProps {
  variant: ProceduralCharacterVariant
  figureTexture?: string | null
  role?: string
}

/** Stylized Nordic cyberpunk humanoid — procedural mesh + hologram portrait. */
export function ProceduralCharacter({ variant, figureTexture, role }: ProceduralCharacterProps) {
  const isPlayer = variant === 'player'
  const jacket = isPlayer ? '#78350f' : '#0c4a6e'
  const accent = isPlayer ? DISTRICT_BRAND.amberGlow : DISTRICT_BRAND.cyanGlow
  const emissive = isPlayer ? DISTRICT_BRAND.amber : DISTRICT_BRAND.cyan
  const skin = '#e2c9a8'
  const pants = '#1e293b'
  const boots = '#0f172a'

  const texturePath = figureTexture ?? (isPlayer
    ? 'assets/characters/player/character-sheet.webp'
    : 'assets/characters/sara/avatar.webp')

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[0.38, 24]} />
        <meshBasicMaterial color={accent} transparent opacity={0.28} />
      </mesh>

      {/* Boots + legs */}
      <mesh position={[-0.13, 0.22, 0]} castShadow>
        <boxGeometry args={[0.14, 0.44, 0.2]} />
        <meshStandardMaterial color={boots} roughness={0.85} />
      </mesh>
      <mesh position={[0.13, 0.22, 0]} castShadow>
        <boxGeometry args={[0.14, 0.44, 0.2]} />
        <meshStandardMaterial color={boots} roughness={0.85} />
      </mesh>
      <mesh position={[-0.13, 0.52, 0]} castShadow>
        <boxGeometry args={[0.15, 0.42, 0.17]} />
        <meshStandardMaterial color={pants} />
      </mesh>
      <mesh position={[0.13, 0.52, 0]} castShadow>
        <boxGeometry args={[0.15, 0.42, 0.17]} />
        <meshStandardMaterial color={pants} />
      </mesh>

      {/* Torso + jacket */}
      <mesh position={[0, 1.02, 0]} castShadow>
        <boxGeometry args={[0.42, 0.55, 0.24]} />
        <meshStandardMaterial color={jacket} roughness={0.72} />
      </mesh>
      <mesh position={[0, 1.02, 0.14]}>
        <boxGeometry args={[0.18, 0.4, 0.04]} />
        <meshStandardMaterial color={accent} emissive={emissive} emissiveIntensity={0.55} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.28, 0.95, 0.02]} rotation={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[0.12, 0.48, 0.12]} />
        <meshStandardMaterial color={jacket} />
      </mesh>
      <mesh position={[0.28, 0.95, 0.02]} rotation={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[0.12, 0.48, 0.12]} />
        <meshStandardMaterial color={jacket} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.42, 0]} castShadow>
        <sphereGeometry args={[0.17, 14, 14]} />
        <meshStandardMaterial color={skin} roughness={0.65} />
      </mesh>
      <mesh position={[0, 1.42, 0.1]}>
        <boxGeometry args={[0.22, 0.08, 0.04]} />
        <meshStandardMaterial color={emissive} emissive={emissive} emissiveIntensity={0.9} />
      </mesh>

      {figureTexture ? <PortraitHologram figureTexture={texturePath} /> : null}

      {!isPlayer && role ? (
        <mesh position={[0.22, 1.15, 0.12]}>
          <boxGeometry args={[0.06, 0.06, 0.02]} />
          <meshStandardMaterial color={DISTRICT_BRAND.cyan} emissive={DISTRICT_BRAND.cyanGlow} emissiveIntensity={0.6} />
        </mesh>
      ) : null}
    </group>
  )
}

function PortraitHologram({ figureTexture }: { figureTexture: string }) {
  const urls = characterFigureTextureCandidates(figureTexture)
  const texture = useTexture(urls[0] ?? assetUrl(figureTexture)!)
  return (
    <Billboard follow lockX lockZ position={[0, 1.75, 0.2]}>
      <mesh>
        <planeGeometry args={[0.55, 0.75]} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.1} toneMapped={false} opacity={0.95} />
      </mesh>
    </Billboard>
  )
}
