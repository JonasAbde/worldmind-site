import { Suspense, useCallback, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import type { VisualCues, WalkAnimation } from '../../../lib/play-api'
import { preloadVisualCuesModels } from '../../../lib/preload-visual-cues-models'
import { CanvasErrorBoundary } from './CanvasErrorBoundary'
import { DistrictWorld } from './DistrictScene3D'
import type { Selection } from './district-scene-types'
import { PlayerFollowCamera, type ExploreCameraMode } from './PlayerFollowCamera'
import { PlayerLocomotionController } from './PlayerLocomotionController'
import { PlayerLocomotionProvider } from './PlayerLocomotionContext'
import { PlayTouchLocomotion } from './PlayTouchLocomotion'
import { WalkPathAnimator } from './WalkPathAnimator'

interface Play3DCanvasProps {
  visualCues: VisualCues
  cameraMode: ExploreCameraMode
  orbitTarget: [number, number, number]
  walkAnimation: WalkAnimation | null
  onWalkComplete: () => void
  onSelect: (selection: Selection) => void
  onTravel?: (selection: Selection) => void
  onHotspotInspect?: (selection: Selection) => void
  onEnterLocation?: (locationId: string) => void
}

function adaptiveDpr(): [number, number] {
  if (typeof window === 'undefined') return [1, 2]
  const narrow = window.innerWidth < 768
  return narrow ? [1, 1.5] : [1, 2]
}

export function Play3DCanvas({
  visualCues,
  cameraMode,
  orbitTarget,
  walkAnimation,
  onWalkComplete,
  onSelect,
  onTravel,
  onHotspotInspect,
  onEnterLocation,
}: Play3DCanvasProps) {
  const isWalking = walkAnimation !== null
  const locomotionEnabled = !isWalking && cameraMode === 'follow'
  const controlsEnabled = !isWalking
  const walkEye = (visualCues.camera?.walkEye ?? [0, 1.65, 4.5]) as [number, number, number]
  const dpr = useMemo(() => adaptiveDpr(), [])

  useEffect(() => {
    preloadVisualCuesModels(visualCues)
  }, [visualCues])

  const handleEnterLocation = useCallback(
    (locationId: string) => {
      onEnterLocation?.(locationId)
    },
    [onEnterLocation],
  )

  return (
    <CanvasErrorBoundary title="District view unavailable">
      <PlayerLocomotionProvider visualCues={visualCues} snapToAnchor={isWalking}>
        <div
          className="absolute inset-0 outline-none"
          tabIndex={0}
          role="application"
          aria-label="3D district view — click here then use WASD to move"
          onPointerDown={(e) => {
            if (e.currentTarget instanceof HTMLElement) e.currentTarget.focus()
          }}
        >
          <Canvas
            className="!absolute inset-0"
            shadows
            dpr={dpr}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            camera={{
              position: [walkEye[0], walkEye[1], walkEye[2]],
              fov: 55,
              near: 0.1,
              far: 120,
            }}
          >
            <Suspense fallback={null}>
              <DistrictWorld
                cues={visualCues}
                onSelect={onSelect}
                onTravel={onTravel}
                onHotspotInspect={onHotspotInspect}
                showPlayer={!isWalking}
                useLocomotion
              />
              {walkAnimation && (
                <WalkPathAnimator
                  animation={walkAnimation}
                  onComplete={onWalkComplete}
                  playerFigureTexture={visualCues.player?.figureTexture}
                  playerFullBodyTexture={visualCues.player?.fullBodyTexture}
                  playerModelUrl={visualCues.player?.modelUrl}
                  playerRenderMode={visualCues.player?.renderMode ?? 'mesh3d'}
                />
              )}
              <PlayerLocomotionController
                enabled={locomotionEnabled}
                visualCues={visualCues}
                onEnterLocation={handleEnterLocation}
              />
              <PlayerFollowCamera
                enabled={controlsEnabled}
                mode={cameraMode}
                playerPosition={visualCues.player?.position as [number, number, number] | undefined ?? null}
                overviewTarget={orbitTarget}
                minDistance={visualCues.camera?.minDistance ?? 5}
                maxDistance={visualCues.camera?.maxDistance ?? 22}
                useLivePosition={locomotionEnabled}
              />
            </Suspense>
          </Canvas>
          <PlayTouchLocomotion enabled={locomotionEnabled} />
        </div>
      </PlayerLocomotionProvider>
    </CanvasErrorBoundary>
  )
}
