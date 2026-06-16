/** Pure render-mode helpers for 3D embodied assets (testable without R3F). */

export type EmbodiedRenderMode = 'mesh3d' | 'sprite2d'

export function shouldUseGltfBody(
  renderMode: EmbodiedRenderMode = 'mesh3d',
  modelUrl?: string | null,
): boolean {
  return renderMode === 'mesh3d' && Boolean(modelUrl)
}

export function shouldUseGltfBuilding(modelUrl?: string | null): boolean {
  return Boolean(modelUrl)
}

export function collectVisualCuesModelUrls(cues: {
  locations?: Array<{ modelUrl?: string | null; agents?: Array<{ modelUrl?: string | null }> }>
  player?: { modelUrl?: string | null } | null
}): string[] {
  const urls = new Set<string>()
  for (const loc of cues.locations ?? []) {
    if (loc.modelUrl) urls.add(loc.modelUrl)
    for (const agent of loc.agents ?? []) {
      if (agent.modelUrl) urls.add(agent.modelUrl)
    }
  }
  if (cues.player?.modelUrl) urls.add(cues.player.modelUrl)
  return [...urls]
}
