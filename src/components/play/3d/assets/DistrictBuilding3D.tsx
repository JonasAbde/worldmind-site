import type { ThreeEvent } from '@react-three/fiber'
import { SceneErrorBoundary } from '../CanvasErrorBoundary'
import { shouldUseGltfBuilding } from '../../../../lib/embodied-3d-render'
import { GltfModel } from './GltfModel'
import { ProceduralBuilding } from './ProceduralBuilding'

interface DistrictBuilding3DProps {
  locationId: string
  zone: string
  label: string
  isPlayerHere?: boolean
  sceneTexture?: string | null
  modelUrl?: string | null
  onClick?: (e: ThreeEvent<MouseEvent>) => void
}

/** Real 3D district building — glTF when baked, else live procedural mesh kit. */
export function DistrictBuilding3D({
  locationId,
  zone,
  isPlayerHere,
  sceneTexture,
  modelUrl,
  onClick,
}: DistrictBuilding3DProps) {
  if (shouldUseGltfBuilding(modelUrl)) {
    return (
      <SceneErrorBoundary
        fallback={
          <ProceduralBuilding
            locationId={locationId}
            zone={zone}
            label=""
            isPlayerHere={isPlayerHere}
            sceneTexture={sceneTexture}
            onClick={onClick}
          />
        }
      >
        <group onClick={onClick}>
          <GltfModel url={modelUrl!} />
        </group>
      </SceneErrorBoundary>
    )
  }

  return (
    <ProceduralBuilding
      locationId={locationId}
      zone={zone}
      label=""
      isPlayerHere={isPlayerHere}
      sceneTexture={sceneTexture}
      onClick={onClick}
    />
  )
}
