import { useEffect, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { usePlayerLocomotionState } from './PlayerLocomotionContext'

export type ExploreCameraMode = 'follow' | 'overview'

interface PlayerFollowCameraProps {
  enabled: boolean
  mode: ExploreCameraMode
  playerPosition: [number, number, number] | null
  overviewTarget: [number, number, number]
  minDistance?: number
  maxDistance?: number
  /** When true, read position from WASD locomotion ref each frame. */
  useLivePosition?: boolean
}

/**
 * Third-person explore camera: orbit around the player, or district overview.
 * WASD locomotion updates the follow target via PlayerLocomotionContext when enabled.
 */
export function PlayerFollowCamera({
  enabled,
  mode,
  playerPosition,
  overviewTarget,
  minDistance = 5,
  maxDistance = 22,
  useLivePosition = false,
}: PlayerFollowCameraProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()
  const targetVec = useRef(new THREE.Vector3())
  const prevPlayerPos = useRef<[number, number, number] | null>(null)
  const initialized = useRef(false)
  const locomotion = usePlayerLocomotionState()

  const resolvePlayerPosition = (): [number, number, number] | null => {
    if (useLivePosition && locomotion) return locomotion.positionRef.current
    return playerPosition
  }

  useEffect(() => {
    if (!enabled || mode !== 'follow') return
    const pos = resolvePlayerPosition()
    if (!pos) return
    const [x, , z] = pos
    targetVec.current.set(x, 1.4, z)
    prevPlayerPos.current = [x, pos[1], z]
    if (controlsRef.current) {
      controlsRef.current.target.copy(targetVec.current)
      controlsRef.current.update()
    }
    if (!initialized.current) {
      camera.position.set(x, 1.65, z + 5.5)
      camera.lookAt(targetVec.current)
      initialized.current = true
    }
  }, [camera, enabled, mode, playerPosition, useLivePosition])

  useEffect(() => {
    if (!enabled || mode !== 'overview' || !controlsRef.current) return
    controlsRef.current.target.set(overviewTarget[0], overviewTarget[1], overviewTarget[2])
    controlsRef.current.update()
    prevPlayerPos.current = null
  }, [enabled, mode, overviewTarget])

  useFrame((_, dt) => {
    if (!enabled || !controlsRef.current) return
    if (mode === 'follow') {
      const pos = resolvePlayerPosition()
      if (!pos) return
      const [x, , z] = pos
      targetVec.current.set(x, 1.4, z)

      if (useLivePosition && prevPlayerPos.current) {
        const dx = x - prevPlayerPos.current[0]
        const dz = z - prevPlayerPos.current[2]
        if (Math.hypot(dx, dz) > 0.0001) {
          camera.position.x += dx
          camera.position.z += dz
        }
      }
      prevPlayerPos.current = [x, pos[1], z]

      const followSharpness = useLivePosition ? 18 : 8
      controlsRef.current.target.lerp(targetVec.current, Math.min(1, dt * followSharpness))
      controlsRef.current.update()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enabled}
      enablePan={mode === 'overview'}
      enableDamping
      dampingFactor={useLivePosition ? 0.09 : 0.07}
      minPolarAngle={0.25}
      maxPolarAngle={Math.PI / 2.05}
      minDistance={mode === 'overview' ? 12 : minDistance}
      maxDistance={mode === 'overview' ? 42 : maxDistance}
      rotateSpeed={0.55}
      zoomSpeed={0.85}
    />
  )
}
