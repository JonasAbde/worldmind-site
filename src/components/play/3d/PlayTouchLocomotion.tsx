import { usePlayerLocomotionState } from './PlayerLocomotionContext'
import type { LocomotionKeys } from '../../../lib/player-locomotion'

interface PlayTouchLocomotionProps {
  enabled: boolean
}

function TouchBtn({
  label,
  className,
  onPress,
  onRelease,
}: {
  label: string
  className: string
  onPress: () => void
  onRelease: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`play-hud-panel w-11 h-11 font-mono text-sm text-cyan-glow active:bg-cyan/15 select-none touch-none ${className}`}
      onPointerDown={(e) => {
        e.preventDefault()
        onPress()
      }}
      onPointerUp={onRelease}
      onPointerLeave={onRelease}
      onPointerCancel={onRelease}
    >
      {label}
    </button>
  )
}

export function PlayTouchLocomotion({ enabled }: PlayTouchLocomotionProps) {
  const locomotion = usePlayerLocomotionState()
  if (!enabled || !locomotion) return null

  const set = (key: keyof LocomotionKeys, pressed: boolean) => locomotion.setKey(key, pressed)

  return (
    <div className="absolute bottom-24 left-3 z-[45] pointer-events-auto md:hidden select-none">
      <div className="grid grid-cols-3 gap-1.5 w-[min(132px,36vw)]">
        <div />
        <TouchBtn label="W" className="" onPress={() => set('forward', true)} onRelease={() => set('forward', false)} />
        <div />
        <TouchBtn label="A" className="" onPress={() => set('left', true)} onRelease={() => set('left', false)} />
        <TouchBtn label="S" className="" onPress={() => set('back', true)} onRelease={() => set('back', false)} />
        <TouchBtn label="D" className="" onPress={() => set('right', true)} onRelease={() => set('right', false)} />
      </div>
      <button
        type="button"
        className="mt-2 w-full play-hud-chip text-center text-amber-glow py-1.5 touch-none"
        onPointerDown={(e) => {
          e.preventDefault()
          set('sprint', true)
        }}
        onPointerUp={() => set('sprint', false)}
        onPointerLeave={() => set('sprint', false)}
      >
        Sprint
      </button>
    </div>
  )
}
