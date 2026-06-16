import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { VisualCues } from '../../../lib/play-api'
import {
  cameraForwardYaw,
  integrateLocomotion,
  isLocomotionMoving,
  isMovementKeyCode,
  isTypingTarget,
  locomotionFacing,
  locomotionKeyFromCode,
  shouldEnterLocation,
} from '../../../lib/player-locomotion'
import { usePlayerLocomotionState } from './PlayerLocomotionContext'

interface PlayerLocomotionControllerProps {
  enabled: boolean
  visualCues: VisualCues
  onEnterLocation?: (locationId: string) => void
}

export function PlayerLocomotionController({
  enabled,
  visualCues,
  onEnterLocation,
}: PlayerLocomotionControllerProps) {
  const locomotion = usePlayerLocomotionState()
  const { camera } = useThree()
  const visualCuesRef = useRef(visualCues)
  const onEnterRef = useRef(onEnterLocation)
  const currentLocationRef = useRef(
    visualCues.playerLocationId ?? visualCues.player?.locationId ?? null,
  )

  visualCuesRef.current = visualCues
  onEnterRef.current = onEnterLocation
  currentLocationRef.current = visualCues.playerLocationId ?? visualCues.player?.locationId ?? null

  useEffect(() => {
    if (!enabled || !locomotion) {
      locomotion?.clearKeys()
      if (locomotion) locomotion.isMovingRef.current = false
      return
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return
      if (e.code === 'KeyE' || e.code === 'Enter') {
        e.preventDefault()
        if (!e.repeat && onEnterRef.current) {
          const cues = visualCuesRef.current
          const pos = locomotion.positionRef.current
          const enterId = shouldEnterLocation(
            pos,
            cues.locations,
            currentLocationRef.current,
          )
          if (enterId) {
            locomotion.clearKeys()
            onEnterRef.current(enterId)
          }
        }
        return
      }
      const key = locomotionKeyFromCode(e.code)
      if (!key) return
      locomotion.setKey(key, true)
      if (isMovementKeyCode(e.code) || key === 'sprint') e.preventDefault()
    }

    const onKeyUp = (e: KeyboardEvent) => {
      const key = locomotionKeyFromCode(e.code)
      if (!key) return
      locomotion.setKey(key, false)
    }

    const onBlur = () => {
      locomotion.clearKeys()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [enabled, locomotion])

  useFrame((_, dt) => {
    if (!enabled || !locomotion) return

    const keys = locomotion.keysRef.current
    const pos = locomotion.positionRef.current
    const yaw = cameraForwardYaw(camera.position.x, camera.position.z, pos[0], pos[2])
    const { position, velocity } = integrateLocomotion(
      pos,
      locomotion.velocityRef.current,
      keys,
      yaw,
      dt,
      visualCuesRef.current.locations,
      currentLocationRef.current,
    )
    locomotion.positionRef.current = position
    locomotion.velocityRef.current = velocity
    locomotion.isMovingRef.current = isLocomotionMoving(keys, velocity)
    locomotion.facingRef.current = locomotionFacing(keys, yaw)
  })

  return null
}
