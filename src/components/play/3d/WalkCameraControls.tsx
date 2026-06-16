import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const keys = { w: false, a: false, s: false, d: false, shift: false }

interface WalkCameraControlsProps {
  enabled: boolean
  eye: [number, number, number]
  target: [number, number, number]
  radius?: number
}

export function WalkCameraControls({
  enabled,
  eye,
  target,
  radius = 5.5,
}: WalkCameraControlsProps) {
  const { camera } = useThree()
  const yaw = useRef(0)
  const position = useRef(new THREE.Vector3())

  useEffect(() => {
    if (!enabled) return

    position.current.set(eye[0], eye[1], eye[2])

    const setKey = (e: KeyboardEvent, down: boolean) => {
      const k = e.key.toLowerCase()
      if (k in keys) keys[k as keyof typeof keys] = down
      if (e.key === 'Shift') keys.shift = down
    }

    const onDown = (e: KeyboardEvent) => setKey(e, true)
    const onUp = (e: KeyboardEvent) => setKey(e, false)
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [enabled, eye])

  useEffect(() => {
    if (!enabled) return
    const onMove = (e: MouseEvent) => {
      if (e.buttons !== 1) return
      yaw.current -= e.movementX * 0.004
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [enabled])

  useFrame((_, dt) => {
    if (!enabled) return

    const speed = (keys.shift ? 7 : 3.5) * dt
    const forward = new THREE.Vector3(Math.sin(yaw.current), 0, Math.cos(yaw.current))
    const right = new THREE.Vector3(forward.z, 0, -forward.x)

    if (keys.w) position.current.addScaledVector(forward, speed)
    if (keys.s) position.current.addScaledVector(forward, -speed)
    if (keys.a) position.current.addScaledVector(right, -speed)
    if (keys.d) position.current.addScaledVector(right, speed)

    const anchor = new THREE.Vector3(target[0], position.current.y, target[2])
    const flat = position.current.clone().sub(anchor)
    flat.y = 0
    if (flat.length() > radius) {
      flat.setLength(radius)
      position.current.x = anchor.x + flat.x
      position.current.z = anchor.z + flat.z
    }

    position.current.y = THREE.MathUtils.clamp(position.current.y, 1.2, 2.6)
    camera.position.copy(position.current)
    camera.lookAt(target[0], target[1], target[2])
  })

  return null
}
