import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from 'react'
import {
  anchorFromCues,
  EMPTY_KEYS,
  ZERO_VELOCITY,
  type LocomotionKeys,
  type LocomotionVelocity,
} from '../../../lib/player-locomotion'
import type { VisualCues } from '../../../lib/play-api'

export interface PlayerLocomotionState {
  positionRef: MutableRefObject<[number, number, number]>
  velocityRef: MutableRefObject<LocomotionVelocity>
  facingRef: MutableRefObject<number | null>
  isMovingRef: MutableRefObject<boolean>
  keysRef: MutableRefObject<LocomotionKeys>
  setKey: (key: keyof LocomotionKeys, pressed: boolean) => void
  clearKeys: () => void
}

const PlayerLocomotionContext = createContext<PlayerLocomotionState | null>(null)

export function usePlayerLocomotionState(): PlayerLocomotionState | null {
  return useContext(PlayerLocomotionContext)
}

interface PlayerLocomotionProviderProps {
  visualCues: VisualCues
  snapToAnchor?: boolean
  children: ReactNode
}

export function PlayerLocomotionProvider({ visualCues, snapToAnchor, children }: PlayerLocomotionProviderProps) {
  const anchor = anchorFromCues(visualCues)
  const positionRef = useRef<[number, number, number]>(anchor)
  const velocityRef = useRef<LocomotionVelocity>({ ...ZERO_VELOCITY })
  const facingRef = useRef<number | null>(null)
  const isMovingRef = useRef(false)
  const keysRef = useRef<LocomotionKeys>({ ...EMPTY_KEYS })

  const setKey = useCallback((key: keyof LocomotionKeys, pressed: boolean) => {
    keysRef.current = { ...keysRef.current, [key]: pressed }
  }, [])

  const clearKeys = useCallback(() => {
    keysRef.current = { ...EMPTY_KEYS }
    velocityRef.current = { ...ZERO_VELOCITY }
  }, [])

  useEffect(() => {
    const next = anchorFromCues(visualCues)
    positionRef.current = next
    velocityRef.current = { ...ZERO_VELOCITY }
    facingRef.current = null
    keysRef.current = { ...EMPTY_KEYS }
  }, [visualCues.player?.locationId])

  useEffect(() => {
    if (!snapToAnchor) return
    const next = anchorFromCues(visualCues)
    positionRef.current = next
    velocityRef.current = { ...ZERO_VELOCITY }
    facingRef.current = null
    keysRef.current = { ...EMPTY_KEYS }
  }, [snapToAnchor, visualCues])

  return (
    <PlayerLocomotionContext.Provider
      value={{ positionRef, velocityRef, facingRef, isMovingRef, keysRef, setKey, clearKeys }}
    >
      {children}
    </PlayerLocomotionContext.Provider>
  )
}

export function readPlayerWorldPosition(
  locomotion: PlayerLocomotionState | null,
  fallback: [number, number, number] | undefined,
): [number, number, number] {
  if (locomotion) return locomotion.positionRef.current
  return fallback ?? [0, 0.1, 0]
}
