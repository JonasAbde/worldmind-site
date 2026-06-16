function resolveCoreUrl(): string {
  const configured = import.meta.env.VITE_WORLDMIND_CORE_URL
  if (configured) return configured.replace(/\/$/, '')
  if (import.meta.env.DEV) return 'http://127.0.0.1:8080'
  return ''
}

export const CORE_URL = resolveCoreUrl()

export interface GameShellHotspot {
  id: string
  label: string
  command: string
  preview?: string
  description?: string
  risk?: number
  possibleEvidence?: string[]
  icon?: string | null
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
  customer?: string
  payout?: number
  status?: 'locked' | 'available' | 'active'
  locked?: boolean
  reward?: string
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

export interface MajorDecision {
  id: string
  label: string
  command?: string
  branchSuggested?: boolean
  requiredEvidence?: string[]
}

export interface ConsequenceBeat {
  categories: string[]
  bullets: { category: string; text: string }[]
  summary: string
}

export interface VisualCuesAgent {
  id: string
  name: string
  role?: string
  position: number[]
  commands: { talk: string; ask: string; pay: string; leno: string }
}

export interface VisualCuesLocation {
  id: string
  label: string
  zone: string
  position: number[]
  scale?: number[]
  color?: string
  emissive?: string
  emissiveIntensity?: number
  command: string
  agents?: VisualCuesAgent[]
}

export interface VisualCuesEdge {
  from: string
  to: string
  fromPosition?: number[]
  toPosition?: number[]
}

export interface VisualCues {
  kind: string
  version: number
  playerLocationId?: string | null
  camera?: { target?: number[]; distance?: number }
  environment?: {
    fogColor?: string
    fogNear?: number
    fogFar?: number
    groundColor?: string
    gridColor?: string
    ambientIntensity?: number
    sunIntensity?: number
  }
  locations: VisualCuesLocation[]
  hotspots: { id: string; label: string; command: string; risk?: number; position: number[] }[]
  edges?: VisualCuesEdge[]
}

export interface GameShell {
  topbar: GameShellTopbar
  location: GameShellLocation
  founder: GameShellFounder
  npcCards?: unknown[]
  caseBoard?: unknown
  rumorTrail?: unknown[]
  majorDecisions?: MajorDecision[]
}

export interface DistrictNode {
  id: string
  label: string
  x: number
  y: number
}

export interface DistrictView {
  nodes: DistrictNode[]
  edges?: { from: string; to: string }[]
  playerLocationId?: string | null
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
  districtView?: DistrictView
  visualCues?: VisualCues
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
    majorDecisionPrompt?: MajorDecision
    consequence?: Record<string, unknown>
    consequenceBeat?: ConsequenceBeat
    dialogue?: { message?: string; evidenceIds?: string[] }
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

export function founderContractCommand(
  contract: FounderContract,
  founder: GameShellFounder,
): string | null {
  if (!founder.unlocked) return null
  if (contract.status === 'active') return 'run_delivery_contract'
  if (contract.status === 'available') return `start_delivery_workflow ${contract.id}`
  return null
}

export function matchMajorDecision(cmd: string, decisions: MajorDecision[] = []): MajorDecision | null {
  const n = cmd.trim().toLowerCase()
  if (!n) return null
  for (const d of decisions) {
    const dc = (d.command ?? '').trim().toLowerCase()
    if (dc && (n === dc || n.startsWith(dc))) return d
  }
  return null
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

export async function postSave(body: { branchName?: string; note?: string } = {}) {
  const res = await fetch(corePath('/api/save'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Save failed (${res.status})`)
  return (await res.json()) as { ok: boolean; snapshotId?: string }
}

export async function postBranch(body: { name: string; snapshotId: string; note?: string }) {
  const res = await fetch(corePath('/api/branch'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Branch failed (${res.status})`)
  return (await res.json()) as { ok: boolean; branchId?: string }
}
