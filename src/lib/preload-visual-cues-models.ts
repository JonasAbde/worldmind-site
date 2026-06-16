import type { VisualCues } from './play-api'
import { assetUrl } from './play-api'
import { collectVisualCuesModelUrls } from './embodied-3d-render'
import { preloadGltfModel } from '../components/play/3d/assets/GltfModel'

/** Preload all glTF models referenced by visualCues before district paint. */
export function preloadVisualCuesModels(cues: VisualCues): void {
  for (const url of collectVisualCuesModelUrls(cues)) {
    preloadGltfModel(url)
  }
}

export function resolveVisualCuesModelUrls(cues: VisualCues): string[] {
  return collectVisualCuesModelUrls(cues).map((url) => assetUrl(url) ?? url)
}
