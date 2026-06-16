import type { GameShell } from '../../../lib/play-api'
import type { Selection } from './district-scene-types'

export function enrichSelection(selection: Selection, shell: GameShell | null): Selection {
  if (!shell) return selection

  if (selection.kind === 'hotspot') {
    const hs = shell.location?.hotspots?.find((h) => h.id === selection.id)
    if (!hs) return selection
    return {
      ...selection,
      preview: hs.preview ?? hs.description ?? selection.preview,
      description: hs.description ?? hs.preview ?? selection.description,
      risk: hs.risk ?? selection.risk,
      possibleEvidence: hs.possibleEvidence ?? selection.possibleEvidence,
    }
  }

  if (selection.kind === 'agent') {
    const npc = shell.npcCards?.find((n) => n.id === selection.id)
    if (!npc) return selection
    const roleLine = npc.role ?? selection.description
    const moodLine = npc.mood ? `${roleLine} · ${npc.mood}` : roleLine
    const locationLine = npc.locationName ? `${moodLine} · @ ${npc.locationName}` : moodLine
    return {
      ...selection,
      description: locationLine,
      preview: npc.topics?.length ? `Topics: ${npc.topics.join(', ')}` : undefined,
      trust: npc.trust,
    }
  }

  return selection
}
