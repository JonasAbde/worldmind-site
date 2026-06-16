import type { MajorDecision } from './play-api'

export function matchMajorDecision(cmd: string, decisions: MajorDecision[] = []): MajorDecision | null {
  const n = cmd.trim().toLowerCase()
  if (!n) return null
  for (const d of decisions) {
    const dc = (d.command ?? '').trim().toLowerCase()
    if (!dc) continue
    if (n === dc || n.startsWith(`${dc} `)) return d
  }
  return null
}
