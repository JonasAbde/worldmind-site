import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  EMPTY_KEYS,
  LOCOMOTION,
  anchorFromCues,
  cameraForwardYaw,
  inputToWorldDirection,
  integrateLocomotion,
  isLocomotionMoving,
  locomotionKeyFromCode,
  shouldEnterLocation,
  streetAnchorFromLocation,
} from '../src/lib/player-locomotion.ts'
import { streetOffsetForLocation } from '../src/lib/building-collision.ts'
import { matchMajorDecision } from '../src/lib/major-decision.ts'
import type { VisualCues } from '../src/lib/play-api.ts'

const LOCATIONS = [
  {
    id: 'cafe',
    zone: 'social',
    position: [0, 0, 0] as [number, number, number],
    label: 'Café',
    command: 'move cafe',
    collision: {
      shape: 'box' as const,
      footprint: [3.6, 3.0] as [number, number],
      halfExtents: [2.15, 1.85] as [number, number],
      radius: 2.84,
      currentLocationRadius: 0.85,
    },
  },
  {
    id: 'harbor',
    zone: 'commerce',
    position: [8, 0, -6] as [number, number, number],
    label: 'Harbor',
    command: 'move harbor',
    collision: {
      shape: 'box' as const,
      footprint: [4, 3] as [number, number],
      halfExtents: [2.35, 1.85] as [number, number],
      radius: 3,
      currentLocationRadius: 0.85,
    },
  },
]

describe('player-locomotion', () => {
  it('maps WASD and arrows to locomotion keys', () => {
    assert.equal(locomotionKeyFromCode('KeyW'), 'forward')
    assert.equal(locomotionKeyFromCode('ArrowLeft'), 'left')
    assert.equal(locomotionKeyFromCode('ShiftLeft'), 'sprint')
    assert.equal(locomotionKeyFromCode('KeyE'), null)
  })

  it('integrates movement with acceleration and district bounds', () => {
    const keys = { ...EMPTY_KEYS, forward: true }
    const yaw = 0
    const pos: [number, number, number] = [0, LOCOMOTION.playerY, LOCOMOTION.spawnStreetOffset]
    const { position, velocity } = integrateLocomotion(
      pos,
      { vx: 0, vz: 0 },
      keys,
      yaw,
      0.05,
      LOCATIONS,
      'cafe',
    )
    assert.ok(position[2] < pos[2], 'forward (negative Z at yaw 0) moves player')
    assert.ok(velocity.vz < 0)
    assert.equal(position[1], LOCOMOTION.playerY)
  })

  it('camera-relative input rotates with yaw', () => {
    const keys = { ...EMPTY_KEYS, forward: true }
    const forward = inputToWorldDirection(keys, 0)
    const turned = inputToWorldDirection(keys, Math.PI / 2)
    assert.ok(forward)
    assert.ok(turned)
    assert.notDeepEqual(forward, turned)
  })

  it('shouldEnterLocation only when near a different building', () => {
    const nearHarbor: [number, number, number] = [8, 0, -6 + 1.5]
    assert.equal(shouldEnterLocation(nearHarbor, LOCATIONS, 'cafe'), 'harbor')
    assert.equal(shouldEnterLocation(nearHarbor, LOCATIONS, 'harbor'), null)
    const far: [number, number, number] = [0, 0, 20]
    assert.equal(shouldEnterLocation(far, LOCATIONS, null), null)
  })

  it('streetAnchorFromLocation offsets spawn onto the street ring', () => {
    const anchor = streetAnchorFromLocation(LOCATIONS[0], [0, 0, 0])
    assert.ok(anchor[2] >= 2.3, 'spawn clears cafe collision shell')
  })

  it('integrateLocomotion blocks walking through building volume', () => {
    const keys = { ...EMPTY_KEYS, forward: true }
    const start: [number, number, number] = [0, LOCOMOTION.playerY, 3.2]
    const { position } = integrateLocomotion(
      start,
      { vx: 0, vz: -8 },
      keys,
      0,
      0.2,
      LOCATIONS,
      null,
    )
    assert.ok(position[2] > -0.5, 'player stopped before cafe center')
  })

  it('anchorFromCues prefers street offset at co-located player', () => {
    const anchor = anchorFromCues({
      playerLocationId: 'cafe',
      locations: LOCATIONS,
      player: { position: [0, 0, 0], locationId: 'cafe' },
    } as VisualCues)
    assert.ok(anchor[2] >= 2.3)
  })

  it('isLocomotionMoving reflects keys or residual velocity', () => {
    assert.equal(isLocomotionMoving(EMPTY_KEYS, { vx: 0, vz: 0 }), false)
    assert.equal(isLocomotionMoving({ ...EMPTY_KEYS, forward: true }, { vx: 0, vz: 0 }), true)
    assert.equal(isLocomotionMoving(EMPTY_KEYS, { vx: 0.5, vz: 0 }), true)
  })


  it('blocks walking into other building footprints', () => {
    let pos: [number, number, number] = [4, LOCOMOTION.playerY, 0]
    let vel = { vx: 0, vz: 0 }
    const keys = { ...EMPTY_KEYS, left: true }
    for (let i = 0; i < 240; i++) {
      const step = integrateLocomotion(pos, vel, keys, 0, 0.05, LOCATIONS, 'harbor')
      pos = step.position
      vel = step.velocity
    }
    const distToCafe = Math.hypot(pos[0], pos[2])
    assert.ok(distToCafe >= 2.1, `expected cafe footprint block, got dist ${distToCafe}`)
  })

  it('cameraForwardYaw points from player toward camera bearing', () => {
    const yaw = cameraForwardYaw(0, 10, 0, 0)
    assert.ok(Number.isFinite(yaw))
  })
})

describe('matchMajorDecision', () => {
  const decisions = [
    { id: 'accuse', command: 'accuse omar', label: 'Accuse Omar', branchSuggested: true },
    { id: 'trust', command: 'trust lina', label: 'Trust Lina', branchSuggested: false },
  ]

  it('matches exact and prefixed commands only', () => {
    assert.equal(matchMajorDecision('accuse omar', decisions)?.id, 'accuse')
    assert.equal(matchMajorDecision('accuse omar quietly', decisions)?.id, 'accuse')
    assert.equal(matchMajorDecision('accuse', decisions), null)
    assert.equal(matchMajorDecision('accuse omarish', decisions), null)
    assert.equal(matchMajorDecision('trust lina', decisions)?.id, 'trust')
  })
})
