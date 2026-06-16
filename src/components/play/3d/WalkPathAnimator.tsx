import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { WalkAnimation } from '../../../lib/play-api'
import { PlayerMarker } from './LocationBuildings'

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function samplePath(waypoints: number[][], t: number) {
  if (!waypoints.length) return new THREE.Vector3(0, 0.1, 0)
  if (waypoints.length === 1) return new THREE.Vector3(...(waypoints[0] as [number, number, number]))

  const scaled = t * (waypoints.length - 1)
  const i = Math.min(Math.floor(scaled), waypoints.length - 1)
  const local = easeInOutCubic(scaled - i)
  const a = waypoints[i]
  const b = waypoints[Math.min(i + 1, waypoints.length - 1)]
  return new THREE.Vector3(
    a[0] + (b[0] - a[0]) * local,
    a[1] + (b[1] - a[1]) * local,
    a[2] + (b[2] - a[2]) * local,
  )
}

function cameraPathFor(animation: WalkAnimation) {
  if (animation.cameraWaypoints?.length) return animation.cameraWaypoints
  const waypoints = animation.waypoints
  if (!waypoints.length) return waypoints
  const eye = animation.camera?.eye
  if (eye?.length === 3 && waypoints.length === 1) return [eye]
  return waypoints.map((point, index) => {
    const prev = waypoints[Math.max(index - 1, 0)]
    const dx = point[0] - prev[0]
    const dz = point[2] - prev[2]
    const len = Math.hypot(dx, dz) || 1
    return [point[0] - (dx / len) * 4.5, (point[1] ?? 0.1) + 0.55, point[2] - (dz / len) * 4.5]
  })
}

function lookAtFor(animation: WalkAnimation, waypoints: number[][]) {
  if (animation.lookAt?.length === 3) return animation.lookAt
  if (animation.camera?.target?.length === 3) return animation.camera.target
  const last = waypoints[waypoints.length - 1]
  return [last[0], 1.4, last[2]]
}

interface WalkPathAnimatorProps {
  animation: WalkAnimation
  onComplete: () => void
  playerFigureTexture?: string | null
  playerFullBodyTexture?: string | null
  playerModelUrl?: string | null
  playerRenderMode?: 'mesh3d' | 'sprite2d'
}

export function WalkPathAnimator({
  animation,
  onComplete,
  playerFigureTexture,
  playerFullBodyTexture,
  playerModelUrl,
  playerRenderMode = 'mesh3d',
}: WalkPathAnimatorProps) {
  const { camera } = useThree()
  const started = useRef(performance.now())
  const completed = useRef(false)
  const lookAt = useRef(new THREE.Vector3(0, 1.4, 0))
  const playerRef = useRef<THREE.Group>(null)
  const cameraPath = useRef(animation.waypoints)
  const finalEye = useRef<[number, number, number] | null>(null)
  const prevPlayer = useRef(new THREE.Vector3())

  useEffect(() => {
    started.current = performance.now()
    completed.current = false
    cameraPath.current = cameraPathFor(animation)
    const look = lookAtFor(animation, animation.waypoints)
    lookAt.current.set(look[0], look[1], look[2])
    finalEye.current =
      animation.camera?.eye?.length === 3 ? (animation.camera.eye as [number, number, number]) : null
    prevPlayer.current.copy(samplePath(animation.waypoints, 0))
  }, [animation])

  useFrame(() => {
    if (completed.current) return

    const elapsed = performance.now() - started.current
    const t = Math.min(1, elapsed / (animation.durationMs ?? 1200))
    const player = samplePath(animation.waypoints, t)
    const eye =
      finalEye.current && t >= 1
        ? new THREE.Vector3(...finalEye.current)
        : samplePath(cameraPath.current, t)

    if (playerRef.current) {
      playerRef.current.position.copy(player)
      const dx = player.x - prevPlayer.current.x
      const dz = player.z - prevPlayer.current.z
      if (Math.hypot(dx, dz) > 0.02) {
        playerRef.current.rotation.y = Math.atan2(dx, dz)
      }
    }
    prevPlayer.current.copy(player)

    camera.position.lerp(eye, 0.35)
    camera.lookAt(lookAt.current)

    if (t >= 1) {
      completed.current = true
      if (finalEye.current) camera.position.set(...finalEye.current)
      camera.lookAt(lookAt.current)
      onComplete()
    }
  })

  const start = animation.waypoints[0] as [number, number, number] | undefined

  return (
    <group ref={playerRef} position={start ?? [0, 0.1, 0]}>
      <PlayerMarker
        position={[0, 0, 0]}
        figureTexture={playerFigureTexture ?? 'assets/characters/player/portrait.png'}
        fullBodyTexture={playerFullBodyTexture ?? 'assets/characters/player/fullbody.png'}
        modelUrl={playerModelUrl}
        renderMode={playerRenderMode}
        walking
      />
    </group>
  )
}
