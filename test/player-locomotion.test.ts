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
import { matchMajorDecision } from '../src/lib/major-decision.ts'
import type { VisualCues } from '../src/lib/play-api.ts'

const LOCATIONS = [
  { id: 'cafe', position: [0, 0, 0] as [number, number, number] },
  { id: 'harbor', position: [8, 0, -6] as [number, number, number] },
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
    assert.equal(anchor[2], LOCOMOTION.spawnStreetOffset)
  })

  it('anchorFromCues prefers street offset at co-located player', () => {
    const anchor = anchorFromCues({
      playerLocationId: 'cafe',
      locations: LOCATIONS,
      player: { position: [0, 0, 0], locationId: 'cafe' },
    } as VisualCues)
    assert.equal(anchor[2], LOCOMOTION.spawnStreetOffset)
  })

  it('isLocomotionMoving reflects keys or residual velocity', () => {
    assert.equal(isLocomotionMoving(EMPTY_KEYS, { vx: 0, vz: 0 }), false)
    assert.equal(isLocomotionMoving({ ...EMPTY_KEYS, forward: true }, { vx: 0, vz: 0 }), true)
    assert.equal(isLocomotionMoving(EMPTY_KEYS, { vx: 0.5, vz: 0 }), true)
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
