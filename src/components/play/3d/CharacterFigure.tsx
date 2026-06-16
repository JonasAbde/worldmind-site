import type { ThreeEvent } from '@react-three/fiber'
import { SceneErrorBoundary } from './CanvasErrorBoundary'
import {
  EmbodiedCharacter,
  type EmbodiedRenderMode,
  type EmbodiedCharacterVariant,
} from './assets/EmbodiedCharacter'

export type CharacterFigureVariant = 'player' | 'npc'

interface CharacterFigureProps {
  characterId?: string
  figureTexture: string
  fullBodyTexture?: string | null
  modelUrl?: string | null
  renderMode?: EmbodiedRenderMode
  variant?: CharacterFigureVariant
  role?: string
  walking?: boolean
  facing?: number | null
  onClick?: (e: ThreeEvent<MouseEvent>) => void
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void
}

function CharacterFigureBody(props: CharacterFigureProps) {
  return (
    <EmbodiedCharacter
      characterId={props.characterId}
      figureTexture={props.figureTexture}
      fullBodyTexture={props.fullBodyTexture}
      modelUrl={props.modelUrl}
      renderMode={props.renderMode}
      variant={props.variant as EmbodiedCharacterVariant}
      role={props.role}
      walking={props.walking}
      facing={props.facing}
      onClick={props.onClick}
      onPointerOver={props.onPointerOver}
      onPointerOut={props.onPointerOut}
    />
  )
}

/** 3D embodied character — glTF or procedural mesh with portrait hologram. */
export function CharacterFigure(props: CharacterFigureProps) {
  return (
    <SceneErrorBoundary
      fallback={
        <group>
          <mesh position={[0, 0.9, 0]}>
            <capsuleGeometry args={[0.25, 0.8, 4, 8]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        </group>
      }
    >
      <CharacterFigureBody {...props} />
    </SceneErrorBoundary>
  )
}
