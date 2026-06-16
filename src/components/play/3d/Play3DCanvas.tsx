import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { VisualCues } from '../../../lib/play-api'
import { DistrictWorld } from './DistrictScene3D'
import type { Selection } from './district-scene-types'
import { WalkCameraControls } from './WalkCameraControls'

interface Play3DCanvasProps {
  visualCues: VisualCues
  cameraMode: 'walk' | 'orbit'
  walkEye: [number, number, number]
  walkTarget: [number, number, number]
  orbitTarget: [number, number, number]
  onSelect: (selection: Selection) => void
}

export function Play3DCanvas({
  visualCues,
  cameraMode,
  walkEye,
  walkTarget,
  orbitTarget,
  onSelect,
}: Play3DCanvasProps) {
  return (
    <Canvas
      shadows
      camera={{
        position: [walkEye[0], walkEye[1], walkEye[2]],
        fov: 55,
      }}
    >
      <Suspense fallback={null}>
        <DistrictWorld cues={visualCues} onSelect={onSelect} />
        {cameraMode === 'orbit' ? (
          <OrbitControls
            target={orbitTarget}
            enableDamping
            dampingFactor={0.06}
            minDistance={visualCues.camera?.minDistance ?? 4}
            maxDistance={visualCues.camera?.maxDistance ?? 32}
          />
        ) : (
          <WalkCameraControls enabled eye={walkEye} target={walkTarget} />
        )}
      </Suspense>
    </Canvas>
  )
}
