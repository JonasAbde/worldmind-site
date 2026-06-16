import type { VisualCuesAgent } from '../../../lib/play-api'

export type Selection =
  | { kind: 'location'; id: string; label: string; command: string; description?: string }
  | {
      kind: 'agent'
      id: string
      label: string
      commands: VisualCuesAgent['commands']
      description?: string
      preview?: string
      trust?: number
    }
  | {
      kind: 'hotspot'
      id: string
      label: string
      command: string
      description?: string
      preview?: string
      risk?: number
      possibleEvidence?: string[]
    }
