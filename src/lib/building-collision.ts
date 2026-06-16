import { presetForLocation } from './building-footprints'
import type { VisualCuesLocation } from './play-api'

/** Extra margin so players slide along building edges, not mesh faces. */
export const COLLISION_PADDING = 0.35

export type LocationCollision = {
  shape: 'box' | 'circle'
  footprint: [number, number]
  halfExtents: [number, number]
  radius: number
  currentLocationRadius: number
}

export type BuildingCollider = {
  id: string
  x: number
  z: number
  shape: 'box' | 'circle'
  halfWidth: number
  halfDepth: number
}

/** Resolve collision from visualCues or fall back to site building presets. */
export function resolveLocationCollision(loc: VisualCuesLocation): LocationCollision {
  const cue = loc.collision
  if (cue?.halfExtents && cue.radius != null) {
    return {
      shape: cue.shape ?? 'box',
      footprint: (cue.footprint as [number, number] | undefined) ?? [
        cue.halfExtents[0] * 2,
        cue.halfExtents[1] * 2,
      ],
      halfExtents: cue.halfExtents,
      radius: cue.radius,
      currentLocationRadius: cue.currentLocationRadius ?? 0.85,
    }
  }

  const preset = presetForLocation(loc.id, loc.zone)
  const [w, , d] = preset.footprint

  if (preset.style === 'civic') {
    const radius = w / 2 + COLLISION_PADDING
    return {
      shape: 'circle',
      footprint: [w, d],
      halfExtents: [radius, radius],
      radius,
      currentLocationRadius: 0.85,
    }
  }

  const halfWidth = w / 2 + COLLISION_PADDING
  const halfDepth = d / 2 + COLLISION_PADDING
  return {
    shape: 'box',
    footprint: [w, d],
    halfExtents: [halfWidth, halfDepth],
    radius: Math.hypot(halfWidth, halfDepth),
    currentLocationRadius: 0.85,
  }
}

export function collidersFromLocations(
  locations: VisualCuesLocation[],
  currentLocationId?: string | null,
): BuildingCollider[] {
  return locations.map((loc) => {
    const pos = loc.position as [number, number, number]
    const collision = resolveLocationCollision(loc)
    const atCurrent = loc.id === currentLocationId
    const halfWidth = atCurrent ? collision.currentLocationRadius : collision.halfExtents[0]
    const halfDepth = atCurrent ? collision.currentLocationRadius : collision.halfExtents[1]
    return {
      id: loc.id,
      x: pos[0],
      z: pos[2],
      shape: atCurrent ? 'circle' : collision.shape,
      halfWidth,
      halfDepth,
    }
  })
}

export function pointInCollider(px: number, pz: number, c: BuildingCollider): boolean {
  const dx = Math.abs(px - c.x)
  const dz = Math.abs(pz - c.z)
  if (c.shape === 'circle') {
    return dx * dx + dz * dz < c.halfWidth * c.halfWidth
  }
  return dx < c.halfWidth && dz < c.halfDepth
}

export function collidesWithBuildings(px: number, pz: number, buildings: BuildingCollider[]): boolean {
  for (const b of buildings) {
    if (pointInCollider(px, pz, b)) return true
  }
  return false
}

/** Street spawn offset just outside the building collision shell. */
export function streetOffsetForLocation(loc: VisualCuesLocation | undefined): number {
  if (!loc) return 2.7
  const collision = resolveLocationCollision(loc)
  return Math.max(collision.halfExtents[0], collision.halfExtents[1]) + 0.55
}
