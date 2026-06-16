import type { DistrictNode, WalkAnimation } from './play-api'

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function getWalkNodePath(animation: WalkAnimation | null | undefined): string[] {
  if (!animation) return []
  return animation.nodePath ?? animation.path ?? []
}

export function getPathEdges(path: string[]): Array<{ from: string; to: string }> {
  const edges: Array<{ from: string; to: string }> = []
  for (let i = 0; i < path.length - 1; i++) {
    edges.push({ from: path[i], to: path[i + 1] })
  }
  return edges
}

export function edgeMatchesPathStep(
  edge: { from: string; to: string },
  step: { from: string; to: string },
): boolean {
  return (
    (edge.from === step.from && edge.to === step.to) ||
    (edge.from === step.to && edge.to === step.from)
  )
}

export function isEdgeOnWalkPath(
  edge: { from: string; to: string },
  path: string[],
): boolean {
  return getPathEdges(path).some((step) => edgeMatchesPathStep(edge, step))
}

export function nodeLabel(node: DistrictNode): string {
  return node.label ?? node.name ?? node.id
}

export function sampleWalkPosition(
  nodes: DistrictNode[],
  path: string[],
  progress: number,
): { x: number; y: number } | null {
  if (!path.length) return null

  const coords = path
    .map((id) => nodes.find((n) => n.id === id))
    .filter((n): n is DistrictNode => Boolean(n))

  if (!coords.length) return null
  if (coords.length === 1) return { x: coords[0].x, y: coords[0].y }

  const segments: Array<{ a: DistrictNode; b: DistrictNode; len: number }> = []
  let total = 0
  for (let i = 0; i < coords.length - 1; i++) {
    const a = coords[i]
    const b = coords[i + 1]
    const len = Math.hypot(b.x - a.x, b.y - a.y)
    segments.push({ a, b, len })
    total += len
  }

  if (total === 0) return { x: coords[coords.length - 1].x, y: coords[coords.length - 1].y }

  let remaining = Math.max(0, Math.min(1, progress)) * total
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    if (remaining <= seg.len || i === segments.length - 1) {
      const t = seg.len === 0 ? 1 : Math.min(1, remaining / seg.len)
      return {
        x: seg.a.x + (seg.b.x - seg.a.x) * t,
        y: seg.a.y + (seg.b.y - seg.a.y) * t,
      }
    }
    remaining -= seg.len
  }

  const last = coords[coords.length - 1]
  return { x: last.x, y: last.y }
}
