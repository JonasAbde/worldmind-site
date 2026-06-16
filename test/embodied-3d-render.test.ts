import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  collectVisualCuesModelUrls,
  shouldUseGltfBody,
  shouldUseGltfBuilding,
} from '../src/lib/embodied-3d-render.ts'

describe('embodied-3d-render', () => {
  it('shouldUseGltfBody requires mesh3d and modelUrl', () => {
    assert.equal(shouldUseGltfBody('mesh3d', 'assets/models/characters/humanoid.glb'), true)
    assert.equal(shouldUseGltfBody('mesh3d', null), false)
    assert.equal(shouldUseGltfBody('sprite2d', 'assets/models/characters/humanoid.glb'), false)
  })

  it('shouldUseGltfBuilding keys off modelUrl', () => {
    assert.equal(shouldUseGltfBuilding('assets/models/locations/cafe.glb'), true)
    assert.equal(shouldUseGltfBuilding(null), false)
  })

  it('collectVisualCuesModelUrls dedupes location, agent, and player models', () => {
    const urls = collectVisualCuesModelUrls({
      locations: [
        {
          modelUrl: 'assets/models/locations/cafe.glb',
          agents: [{ modelUrl: 'assets/models/characters/humanoid.glb' }],
        },
        { modelUrl: 'assets/models/locations/market.glb', agents: [] },
      ],
      player: { modelUrl: 'assets/models/characters/humanoid.glb' },
    })
    assert.equal(urls.length, 3)
    assert.ok(urls.includes('assets/models/locations/cafe.glb'))
    assert.ok(urls.includes('assets/models/characters/humanoid.glb'))
  })
})
