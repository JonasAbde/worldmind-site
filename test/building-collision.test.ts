import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  collidersFromLocations,
  collidesWithBuildings,
  pointInCollider,
  resolveLocationCollision,
  streetOffsetForLocation,
} from '../src/lib/building-collision.ts'
import type { VisualCuesLocation } from '../src/lib/play-api.ts'

const CAFE_LOC: VisualCuesLocation = {
  id: 'cafe',
  label: 'Café',
  zone: 'social',
  position: [0, 0, 0],
  command: 'move cafe',
  collision: {
    shape: 'box',
    footprint: [3.6, 3.0],
    halfExtents: [2.15, 1.85],
    radius: 2.84,
    currentLocationRadius: 0.85,
  },
}

const MARKET_LOC: VisualCuesLocation = {
  id: 'market',
  label: 'Market',
  zone: 'commerce',
  position: [8, 0, -6],
  command: 'move market',
  collision: {
    shape: 'box',
    footprint: [4.2, 3.4],
    halfExtents: [2.45, 2.05],
    radius: 3.2,
    currentLocationRadius: 0.85,
  },
}

describe('building-collision', () => {
  it('resolveLocationCollision falls back to presets when cue missing', () => {
    const col = resolveLocationCollision({ id: 'workshop', zone: 'industrial', position: [0, 0, 0], label: '', command: '' })
    assert.equal(col.shape, 'box')
    assert.ok(col.halfExtents[0] > 1.9)
  })

  it('box collider blocks interior points but not street offset', () => {
    const buildings = collidersFromLocations([CAFE_LOC], null)
    assert.equal(collidesWithBuildings(0, 0, buildings), true)
    assert.equal(collidesWithBuildings(0, 3.5, buildings), false)
  })

  it('current location uses softer circle collider', () => {
    const buildings = collidersFromLocations([CAFE_LOC], 'cafe')
    const col = buildings[0]
    assert.equal(col.shape, 'circle')
    assert.equal(col.halfWidth, 0.85)
    assert.equal(collidesWithBuildings(0.5, 0, buildings), true)
    assert.equal(collidesWithBuildings(1.2, 0, buildings), false)
  })

  it('streetOffsetForLocation clears building shell', () => {
    const offset = streetOffsetForLocation(CAFE_LOC)
    const buildings = collidersFromLocations([CAFE_LOC], null)
    assert.equal(collidesWithBuildings(0, offset, buildings), false)
  })

  it('pointInCollider respects box half extents', () => {
    const box = { id: 'x', x: 8, z: -6, shape: 'box' as const, halfWidth: 2, halfDepth: 1.5 }
    assert.equal(pointInCollider(8, -6, box), true)
    assert.equal(pointInCollider(10.5, -6, box), false)
    assert.equal(pointInCollider(8, -4.2, box), false)
  })

  it('separate buildings do not overlap collision at district spacing', () => {
    const buildings = collidersFromLocations([CAFE_LOC, MARKET_LOC], null)
    assert.equal(collidesWithBuildings(4, -3, buildings), false)
  })
})
