export const CORE_URL = (import.meta.env.VITE_WORLDMIND_CORE_URL ?? 'http://127.0.0.1:8080').replace(
  /\/$/,
  '',
)

export interface GameShellHotspot {
  id: string
  label: string
  command: string
  preview?: string
  risk?: number
}

export interface GameShellLocation {
  id: string | null
  name?: string
  mood?: string
  scene?: string | null
  hotspots: GameShellHotspot[]
}

export interface GameShellTopbar {
  worldName?: string
  day?: number | string
  time?: string
  money?: number
  reputation?: number
  energy?: number
  branchName?: string
  lenoStatus?: string
}

export interface FounderContract {
  id: string
  label: string
  command: string
  tier?: number
  reward?: string
  locked?: boolean
}

export interface GameShellFounder {
  unlocked: boolean
  baseLevel?: number
  tierLabel?: string
  contractsCompleted?: number
  activeContract?: string | null
  contracts: FounderContract[]
  reputation?: number
  money?: number
  unlockText?: string
}

export interface GameShell {
  topbar: GameShellTopbar
  location: GameShellLocation
  founder: GameShellFounder
  npcCards?: unknown[]
  caseBoard?: unknown
  rumorTrail?: unknown[]
  majorDecisions?: unknown[]
}

export interface HealthResponse {
  ok: boolean
  engine?: string
  version?: string
  apiVersion?: string
}

export interface StateResponse {
  ok: boolean
  apiVersion?: string
  worldId?: string
  tick?: number
  day?: number
  time?: string
  gameShell: GameShell
  playerSnapshot?: { money?: number; reputation?: number; energy?: number }
}

export interface CommandResult {
  ok: boolean
  text?: string
  result?: {
    ok: boolean
    text?: string
    gameShell?: GameShell
    playerSnapshot?: { money?: number; reputation?: number; energy?: number }
    leno?: { summary?: string }
    majorDecisionPrompt?: { id: string; label: string; command: string }
  }
}

function corePath(path: string) {
  return `${CORE_URL}${path}`
}

export function assetUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null
  if (/^https?:\/\//.test(relativePath)) return relativePath
  const normalized = relativePath.startsWith('/') ? relativePath : `/${relativePath}`
  return `${CORE_URL}${normalized}`
}

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(corePath('/api/health'))
  if (!res.ok) throw new Error(`Health check failed (${res.status})`)
  const data = (await res.json()) as HealthResponse
  if (!data.ok) throw new Error('Core reported unhealthy')
  return data
}

export async function fetchState(): Promise<StateResponse> {
  const res = await fetch(corePath('/api/state'))
  if (!res.ok) throw new Error(`State fetch failed (${res.status})`)
  const data = (await res.json()) as StateResponse
  if (!data.ok || !data.gameShell) throw new Error('Invalid state payload')
  return data
}

export async function postCommand(text: string): Promise<CommandResult> {
  const res = await fetch(corePath('/api/command'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error(`Command failed (${res.status})`)
  return (await res.json()) as CommandResult
}
