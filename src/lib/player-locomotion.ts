import type { VisualCues, VisualCuesLocation } from './play-api'

export const LOCOMOTION = {
  walkSpeed: 5.8,
  sprintSpeed: 10.5,
  acceleration: 38,
  deceleration: 46,
  playerY: 0.1,
  districtMin: -16,
  districtMax: 16,
  /** Solid building core — walkable street ring is outside this. */
  buildingRadius: 1.65,
  /** Softer zone at current location so you can leave the anchor. */
  currentLocationRadius: 0.85,
  spawnStreetOffset: 2.85,
  enterRadius: 2.6,
  maxDeltaSec: 1 / 20,
} as const

export type LocomotionKeys = {
  forward: boolean
  back: boolean
  left: boolean
  right: boolean
  sprint: boolean
}

export const EMPTY_KEYS: LocomotionKeys = {
  forward: false,
  back: false,
  left: false,
  right: false,
  sprint: false,
}

export type LocomotionVelocity = { vx: number; vz: number }

export const ZERO_VELOCITY: LocomotionVelocity = { vx: 0, vz: 0 }

const KEY_MAP: Record<string, keyof LocomotionKeys> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'back',
  ArrowDown: 'back',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  ShiftLeft: 'sprint',
  ShiftRight: 'sprint',
}

const MOVEMENT_KEY_CODES = new Set([
  'KeyW', 'KeyS', 'KeyA', 'KeyD',
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
])

export function locomotionKeyFromCode(code: string): keyof LocomotionKeys | null {
  return KEY_MAP[code] ?? null
}

export function isMovementKeyCode(code: string): boolean {
  return MOVEMENT_KEY_CODES.has(code)
}

export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

type BuildingCircle = { x: number; z: number; r: number; id: string }

function buildingCenters(
  locations: VisualCuesLocation[],
  currentLocationId?: string | null,
): BuildingCircle[] {
  return locations.map((loc) => {
    const pos = loc.position as [number, number, number]
    const r =
      loc.id === currentLocationId ? LOCOMOTION.currentLocationRadius : LOCOMOTION.buildingRadius
    return { x: pos[0], z: pos[2], r, id: loc.id }
  })
}

function collidesWithBuildings(x: number, z: number, buildings: BuildingCircle[]) {
  for (const b of buildings) {
    const dx = x - b.x
    const dz = z - b.z
    if (dx * dx + dz * dz < b.r * b.r) return true
  }
  return false
}

export function clampDistrictPosition(
  x: number,
  z: number,
  buildings: BuildingCircle[],
): [number, number] {
  let nx = Math.max(LOCOMOTION.districtMin, Math.min(LOCOMOTION.districtMax, x))
  let nz = Math.max(LOCOMOTION.districtMin, Math.min(LOCOMOTION.districtMax, z))
  if (!collidesWithBuildings(nx, nz, buildings)) return [nx, nz]

  const slideX = clampAxis(x, nz, buildings, 'x')
  if (slideX) return slideX
  const slideZ = clampAxis(nx, z, buildings, 'z')
  if (slideZ) return slideZ
  return [nx, nz]
}

function clampAxis(
  x: number,
  z: number,
  buildings: BuildingCircle[],
  axis: 'x' | 'z',
): [number, number] | null {
  const cx = Math.max(LOCOMOTION.districtMin, Math.min(LOCOMOTION.districtMax, x))
  const cz = Math.max(LOCOMOTION.districtMin, Math.min(LOCOMOTION.districtMax, z))
  if (!collidesWithBuildings(cx, cz, buildings)) {
    return axis === 'x' ? [cx, z] : [x, cz]
  }
  return null
}

/** Camera-relative forward on the XZ plane (W moves away from camera into the district). */
export function cameraForwardYaw(
  cameraX: number,
  cameraZ: number,
  targetX: number,
  targetZ: number,
): number {
  return Math.atan2(cameraX - targetX, cameraZ - targetZ)
}

export function inputToWorldDirection(
  keys: LocomotionKeys,
  cameraYaw: number,
): { x: number; z: number } | null {
  let moveX = 0
  let moveZ = 0
  if (keys.forward) moveZ -= 1
  if (keys.back) moveZ += 1
  if (keys.left) moveX -= 1
  if (keys.right) moveX += 1

  const len = Math.hypot(moveX, moveZ)
  if (len === 0) return null

  moveX /= len
  moveZ /= len

  const sin = Math.sin(cameraYaw)
  const cos = Math.cos(cameraYaw)
  return {
    x: moveX * cos - moveZ * sin,
    z: moveX * sin + moveZ * cos,
  }
}

export function integrateLocomotion(
  pos: [number, number, number],
  velocity: LocomotionVelocity,
  keys: LocomotionKeys,
  cameraYaw: number,
  dt: number,
  locations: VisualCuesLocation[],
  currentLocationId?: string | null,
): { position: [number, number, number]; velocity: LocomotionVelocity } {
  const step = Math.min(dt, LOCOMOTION.maxDeltaSec)
  const dir = inputToWorldDirection(keys, cameraYaw)
  const maxSpeed = keys.sprint ? LOCOMOTION.sprintSpeed : LOCOMOTION.walkSpeed
  const buildings = buildingCenters(locations, currentLocationId)

  let { vx, vz } = velocity
  if (dir) {
    const targetVx = dir.x * maxSpeed
    const targetVz = dir.z * maxSpeed
    const accel = LOCOMOTION.acceleration * step
    vx += Math.max(-accel, Math.min(accel, targetVx - vx))
    vz += Math.max(-accel, Math.min(accel, targetVz - vz))
  } else {
    const damp = Math.exp(-LOCOMOTION.deceleration * step)
    vx *= damp
    vz *= damp
    if (Math.hypot(vx, vz) < 0.04) {
      vx = 0
      vz = 0
    }
  }

  const [nx, nz] = clampDistrictPosition(pos[0] + vx * step, pos[2] + vz * step, buildings)

  if (nx !== pos[0] + vx * step || nz !== pos[2] + vz * step) {
    const slideX = clampAxis(pos[0] + vx * step, pos[2], buildings, 'x')
    const slideZ = clampAxis(pos[0], pos[2] + vz * step, buildings, 'z')
    if (slideX) {
      vx = (slideX[0] - pos[0]) / step
      vz *= 0.35
    } else if (slideZ) {
      vz = (slideZ[1] - pos[2]) / step
      vx *= 0.35
    } else {
      vx *= 0.2
      vz *= 0.2
    }
  }

  return {
    position: [nx, LOCOMOTION.playerY, nz],
    velocity: { vx, vz },
  }
}

export function locomotionFacing(keys: LocomotionKeys, cameraYaw: number): number | null {
  const dir = inputToWorldDirection(keys, cameraYaw)
  if (!dir) return null
  return Math.atan2(dir.x, dir.z)
}

export function isLocomotionMoving(keys: LocomotionKeys, velocity: LocomotionVelocity): boolean {
  return (
    keys.forward ||
    keys.back ||
    keys.left ||
    keys.right ||
    Math.hypot(velocity.vx, velocity.vz) > 0.15
  )
}

export function nearestLocationId(
  pos: [number, number, number],
  locations: VisualCuesLocation[],
): { id: string; distance: number } | null {
  let best: { id: string; distance: number } | null = null
  for (const loc of locations) {
    const [x, , z] = loc.position as [number, number, number]
    const d = Math.hypot(pos[0] - x, pos[2] - z)
    if (!best || d < best.distance) best = { id: loc.id, distance: d }
  }
  return best
}

export function shouldEnterLocation(
  pos: [number, number, number],
  locations: VisualCuesLocation[],
  currentLocationId: string | null | undefined,
): string | null {
  const nearest = nearestLocationId(pos, locations)
  if (!nearest) return null
  if (nearest.distance > LOCOMOTION.enterRadius) return null
  if (nearest.id === currentLocationId) return null
  return nearest.id
}

/** @deprecated use cameraForwardYaw */
export function cameraYawFromOrbit(
  cameraX: number,
  cameraZ: number,
  targetX: number,
  targetZ: number,
): number {
  return cameraForwardYaw(cameraX, cameraZ, targetX, targetZ)
}

export function streetAnchorFromLocation(
  loc: VisualCuesLocation | undefined,
  fallback: [number, number, number],
): [number, number, number] {
  if (!loc) return fallback
  const [bx, , bz] = loc.position as [number, number, number]
  const [px, , pz] = fallback
  const dist = Math.hypot(px - bx, pz - bz)
  if (dist > 0.6) return [px, LOCOMOTION.playerY, pz]
  return [bx, LOCOMOTION.playerY, bz + LOCOMOTION.spawnStreetOffset]
}

export function anchorFromCues(cues: VisualCues): [number, number, number] {
  const raw = (cues.player?.position ?? [0, LOCOMOTION.playerY, 0]) as [number, number, number]
  const locId = cues.playerLocationId ?? cues.player?.locationId
  const loc = cues.locations.find((l) => l.id === locId)
  return streetAnchorFromLocation(loc, raw)
}
