function resolveCoreUrl(): string {
  const configured = import.meta.env.VITE_WORLDMIND_CORE_URL
  if (configured) return configured.replace(/\/$/, '')
  // Same-origin: Vite dev + production Worker proxy /api and /assets/{locations,characters,models,audio,...}.
  return ''
}

export const CORE_URL = resolveCoreUrl()

export interface HotspotOverlayPosition {
  x: number
  y: number
}

export interface GameShellHotspot {
  id: string
  label: string
  command: string
  preview?: string
  description?: string
  risk?: number
  possibleEvidence?: string[]
  icon?: string | null
  overlayPosition?: HotspotOverlayPosition | null
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
  upfrontCost?: number
  reputationGain?: number
  minBaseLevel?: number
  tierLabel?: string
  tierRequired?: number
  status?: 'locked' | 'available' | 'active'
  locked?: boolean
  isDelivery?: boolean
  reward?: string
}

export interface FounderActiveContract {
  id?: string | null
  templateId?: string | null
  label?: string
  customer?: string | null
  payout?: number | null
  upfrontCost?: number
  reputationGain?: number | null
  status?: string
  deliveryStage?: 'idle' | 'ready_to_deliver' | string
}

export interface FounderDeliveryMilestone {
  id: string
  label: string
  level?: number
  contractsRequired?: number
  reached?: boolean
  current?: boolean
  done?: boolean
}

export interface FounderDeliveryProgress {
  contractsCompleted?: number
  baseLevel?: number
  nextTierLabel?: string | null
  contractsToNextTier?: number
  hasActiveDelivery?: boolean
  activeTemplateId?: string | null
  tierMilestones?: FounderDeliveryMilestone[]
  workflowSteps?: FounderDeliveryMilestone[]
}

export interface GameShellFounder {
  unlocked: boolean
  baseLevel?: number
  tierLabel?: string
  contractsCompleted?: number
  activeContract?: FounderActiveContract | null
  contracts: FounderContract[]
  reputation?: number
  money?: number
  unlockText?: string
  deliveryProgress?: FounderDeliveryProgress | null
  catalogSize?: number
}

export interface MajorDecision {
  id: string
  label: string
  command?: string
  branchSuggested?: boolean
  requiredEvidence?: string[]
  reason?: string
}

export interface LenoPayload {
  summary?: string | null
  suggestions?: string[]
}

export interface ConsequenceBeat {
  categories: string[]
  bullets: { category: string; text: string }[]
  summary: string
}

export interface CaseBoardCard {
  id: string
  label: string
  type?: string
  inspectCommand?: string | null
  truthLevel?: string
  sourceRedacted?: boolean
  traceCommand?: string
  counterCommand?: string
}

export interface CaseBoard {
  evidenceCards: CaseBoardCard[]
  rumorCards: CaseBoardCard[]
  suspectCards?: { id: string; label: string; status?: string }[]
  links?: { from: string; to: string; relation?: string; redacted?: boolean }[]
  unresolvedQuestions?: string[]
}

export interface RumorTrailEntry {
  id: string
  claim: string
  truthLevel?: string
  distortion?: string
  spreadRisk?: string
  trustConfidence?: string
  traceState?: string
  sourceRedacted?: boolean
  sourceLabel?: string | null
  backfireWarning?: boolean
  traceCommand?: string
  counterCommand?: string
}

export interface NpcCard {
  id: string
  name: string
  role?: string
  mood?: string
  locationId?: string | null
  locationName?: string
  atPlayerLocation?: boolean
  avatar?: string
  portrait?: string
  topics?: string[]
  lockedTopics?: { topic: string; minTrust: number }[]
  trust?: number
  suspicion?: number
  fear?: number
  actions?: { label: string; command: string }[]
}

export interface QuestPathStep {
  step: string
  done: boolean
}

export interface QuestPath {
  id: string
  label: string
  steps: QuestPathStep[]
  progress?: number
  complete?: boolean
}

export interface QuestProgress {
  questId?: string
  title?: string
  objective?: string
  incidentStatus?: string
  resolvedPathId?: string | null
  paths?: QuestPath[]
}

export interface VisualCuesAgent {
  id: string
  name: string
  role?: string
  position: number[]
  portrait?: string | null
  figureTexture?: string | null
  fullBodyTexture?: string | null
  modelUrl?: string | null
  renderMode?: 'mesh3d' | 'sprite2d'
  idleAnimation?: 'bob' | 'turn'
  commands: { talk: string; ask: string; pay: string; leno: string }
}

export interface VisualCuesLocationCollision {
  shape?: 'box' | 'circle'
  footprint?: [number, number]
  halfExtents: [number, number]
  radius: number
  currentLocationRadius?: number
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
  sceneTexture?: string | null
  modelUrl?: string | null
  renderMode?: 'mesh3d' | 'sprite2d'
  isPlayerHere?: boolean
  walkAnchor?: number[]
  interiorCamera?: { eye: number[]; target: number[] }
  footprint?: [number, number, number]
  buildingStyle?: string
  collision?: VisualCuesLocationCollision
  agents?: VisualCuesAgent[]
}

export interface VisualCuesEdge {
  from: string
  to: string
  fromPosition?: number[]
  toPosition?: number[]
}

export interface WalkGraphNode {
  walkAnchor: number[]
  position: number[]
}

export interface WalkGraph {
  nodes: Record<string, WalkGraphNode>
  edges: { from: string; to: string }[]
}

export interface WalkAnimation {
  kind?: string
  version?: number
  fromLocationId?: string
  toLocationId?: string
  from?: string
  to?: string
  nodePath?: string[]
  path?: string[]
  waypoints: number[][]
  cameraWaypoints?: number[][]
  lookAt?: number[]
  camera?: { eye?: number[]; target?: number[] }
  durationMs: number
}

export interface VisualCuesInterior {
  locationId: string
  label?: string
  sceneTexture?: string | null
  hotspots?: { id: string; label: string; command: string; risk?: number; preview?: string | null }[]
}

export interface VisualCues {
  kind: string
  version: number
  walkGraph?: WalkGraph
  playerLocationId?: string | null
  interior?: VisualCuesInterior | null
  player?: {
    position: number[]
    locationId?: string | null
    figureTexture?: string | null
    fullBodyTexture?: string | null
    modelUrl?: string | null
    renderMode?: 'mesh3d' | 'sprite2d'
  } | null
  camera?: {
    target?: number[]
    distance?: number
    minDistance?: number
    maxDistance?: number
    walkEye?: number[]
    walkTarget?: number[]
  }
  environment?: {
    fogColor?: string
    fogNear?: number
    fogFar?: number
    groundColor?: string
    gridColor?: string
    ambientIntensity?: number
    sunIntensity?: number
    skyColor?: string
  }
  locations: VisualCuesLocation[]
  hotspots: {
    id: string
    label: string
    command: string
    risk?: number
    preview?: string | null
    description?: string | null
    icon?: string | null
    position: number[]
  }[]
  edges?: VisualCuesEdge[]
}

export interface GameShellCapability {
  id: string
  label?: string
  unlocked: boolean
}

export interface GameShellProgression {
  level?: number
  title?: string
  xp?: number
  nextLevelXp?: number | null
  nextLevelAt?: number | null
  xpToNext?: number
  nextUnlock?: {
    type?: string | null
    level?: number | null
    title?: string | null
    label?: string | null
    xpRequired?: number
    capability?: GameShellCapability | null
  } | null
  capabilities?: GameShellCapability[]
  badges?: string[]
  districtInfluence?: number
}

export interface GameShell {
  topbar: GameShellTopbar
  location: GameShellLocation
  founder: GameShellFounder
  npcCards?: NpcCard[]
  caseBoard?: CaseBoard
  rumorTrail?: RumorTrailEntry[]
  questProgress?: QuestProgress
  progression?: GameShellProgression
  leno?: { summary?: string | null; suggestions?: string[] }
  assets?: {
    lenoOverlay?: string
    evidenceIcon?: string
    rumorIcon?: string
    incidentIcon?: string
    commandButton?: string
    founderAction?: string
  }
  majorDecisions?: MajorDecision[]
}

export interface DistrictNode {
  id: string
  label?: string
  name?: string
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

export interface AudioCue {
  kind: string
  path: string
}

export interface CommandResult {
  ok: boolean
  text?: string
  result?: {
    ok: boolean
    text?: string
    gameShell?: GameShell
    playerSnapshot?: { money?: number; reputation?: number; energy?: number }
    leno?: LenoPayload
    majorDecisionPrompt?: MajorDecision & { reason?: string }
    consequence?: Record<string, unknown>
    consequenceBeat?: ConsequenceBeat
    dialogue?: { message?: string; evidenceIds?: string[] }
    walkAnimation?: WalkAnimation | null
    audioCues?: AudioCue[]
    kind?: string
  }
}

export function isMoveCommand(text: string): boolean {
  return /^move\s+\S+/i.test(text.trim())
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

function swapImageExt(path: string): string | null {
  if (path.endsWith('.png')) return path.replace(/\.png$/, '.webp')
  if (path.endsWith('.webp')) return path.replace(/\.webp$/, '.png')
  return null
}

/** Strip UI sheet paths — 3D billboards need portrait art. */
export function normalizeFigureTexture(figureTexture: string | null | undefined): string {
  if (!figureTexture) return 'assets/characters/player/portrait.png'
  if (/character-sheet|player-sheet/i.test(figureTexture)) {
    const id = figureTexture.match(/assets\/characters\/([^/]+)/)?.[1] ?? 'player'
    return `assets/characters/${id}/portrait.png`
  }
  return figureTexture
}

/** Ordered figure URLs for 3D billboards — png/webp alternates. */
export function characterFigureTextureCandidates(figureTexture: string | null | undefined): string[] {
  const normalized = normalizeFigureTexture(figureTexture)
  const expanded: string[] = []
  const primary = assetUrl(normalized)
  if (primary) expanded.push(primary)
  const alt = swapImageExt(normalized)
  if (alt) {
    const altUrl = assetUrl(alt)
    if (altUrl && !expanded.includes(altUrl)) expanded.push(altUrl)
  }
  return expanded
}

/** Ordered scene texture URLs — png/webp alternates for 3D billboards. */
export function locationSceneTextureCandidates(sceneTexture: string | null | undefined): string[] {
  if (!sceneTexture) return []
  const expanded: string[] = []
  const primary = assetUrl(sceneTexture)
  if (primary) expanded.push(primary)
  const alt = swapImageExt(sceneTexture)
  if (alt) {
    const altUrl = assetUrl(alt)
    if (altUrl && !expanded.includes(altUrl)) expanded.push(altUrl)
  }
  return expanded
}

/** Ordered portrait URLs for NPC cards — tries pack paths then png/webp alternates. */
export function npcPortraitCandidates(npc: Pick<NpcCard, 'id' | 'portrait' | 'avatar'>): string[] {
  const raw = [npc.portrait, npc.avatar].filter(Boolean) as string[]
  const expanded: string[] = []
  for (const path of raw) {
    const url = assetUrl(path)
    if (url) expanded.push(url)
    const alt = swapImageExt(path)
    if (alt) {
      const altUrl = assetUrl(alt)
      if (altUrl && !expanded.includes(altUrl)) expanded.push(altUrl)
    }
  }
  if (!expanded.length && npc.id) {
    for (const kind of ['portrait', 'avatar'] as const) {
      for (const ext of ['png', 'webp'] as const) {
        const url = assetUrl(`assets/characters/${npc.id}/${kind}.${ext}`)
        if (url && !expanded.includes(url)) expanded.push(url)
      }
    }
  }
  return expanded
}

export function formatNextUnlock(
  nextUnlock: GameShellProgression['nextUnlock'],
): string | null {
  if (!nextUnlock) return null
  if (nextUnlock.title) return nextUnlock.title
  if (nextUnlock.label) return nextUnlock.label
  if (nextUnlock.capability?.label) return nextUnlock.capability.label
  if (nextUnlock.type === 'level' && nextUnlock.level != null) {
    return `Level ${nextUnlock.level}`
  }
  return null
}

export function progressionXpPercent(progression: GameShellProgression): number {
  const xp = progression.xp ?? 0
  const xpToNext = progression.xpToNext ?? 0
  const nextAt = progression.nextLevelAt
  if (xpToNext > 0 && nextAt != null) {
    const floor = nextAt - xpToNext
    const span = nextAt - floor
    if (span > 0) return Math.min(100, Math.round(((xp - floor) / span) * 100))
  }
  if (nextAt != null && nextAt > 0) return Math.min(100, Math.round((xp / nextAt) * 100))
  return xp > 0 ? 100 : 0
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

export { matchMajorDecision } from './major-decision'

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
