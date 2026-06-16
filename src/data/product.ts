// All facts sourced from worldmind-core v1.0-rc8 (Project Worldmind)

export const PRODUCT = {
  name: 'WorldMind',
  tagline: 'Enter the Simulation',
  version: 'v1.0-rc8',
  testCount: '200/200',
  githubUrl: 'https://github.com/JonasAbde/worldmind-core',
  playInstructionsUrl: 'https://github.com/JonasAbde/worldmind-core#play-the-vertical-slice',
} as const

export const HERO = {
  headline: 'WorldMind',
  subheadline:
    'A living AI simulation game where every agent remembers, reacts, and changes the world.',
  proof: 'Not scripted quests. Simulated consequences.',
  primaryCta: 'View Play Instructions',
  secondaryCta: 'Explore the Simulation',
} as const

export const PROOF_BADGES = [
  { label: PRODUCT.version, variant: 'cyan' as const },
  { label: `${PRODUCT.testCount} tests`, variant: 'amber' as const },
  { label: '10 agents', variant: 'cyan' as const },
  { label: 'Live Web Play', variant: 'amber' as const },
] as const

// 10 real agents from core state.json
export const AGENTS = [
  { id: 'sara',  name: 'Sara',   role: 'Café owner',             location: "Sara's Café",    color: 'amber'    },
  { id: 'malik', name: 'Malik',  role: 'Mechanic',               location: "Malik's Workshop", color: 'cyan'   },
  { id: 'nadia', name: 'Nadia',  role: 'Black-market coder',     location: 'Market Street',  color: 'registry' },
  { id: 'rune',  name: 'Rune',   role: 'Delivery worker',        location: 'Market Street',  color: 'cyan'     },
  { id: 'omar',  name: 'Omar',   role: 'Ex-Registry investigator', location: "Sara's Café",  color: 'registry' },
  { id: 'lina',  name: 'Lina',   role: 'Young emergent agent',   location: 'Market Street',  color: 'cyan'     },
  { id: 'yasin', name: 'Yasin',  role: 'Market trader',          location: 'Market Street',  color: 'amber'    },
  { id: 'freja', name: 'Freja',  role: 'Registry clerk',         location: 'Market Street',  color: 'registry' },
  { id: 'elias', name: 'Elias',  role: 'Student / tech hobbyist', location: "Sara's Café",   color: 'cyan'     },
  { id: 'amina', name: 'Amina',  role: 'Community organizer',    location: "Sara's Café",    color: 'amber'    },
] as const

// 4 real locations from core state.json
export const LOCATIONS = [
  {
    id: 'cafe',
    name: "Sara's Café",
    mood: 'warm' as const,
    description: 'Amber warmth, missing supplies, community heart. Sara, Omar, Elias, Amina gather here.',
    agents: ['Sara', 'Omar', 'Elias', 'Amina'],
    svgX: 18, svgY: 18,
  },
  {
    id: 'workshop',
    name: "Malik's Workshop",
    mood: 'neutral' as const,
    description: "Underground repair tech — Malik's domain. Delivery disputes trace back here.",
    agents: ['Malik'],
    svgX: 42, svgY: 36,
  },
  {
    id: 'market',
    name: 'Market Street',
    mood: 'neutral' as const,
    description: 'Trade pressure, social crossroads. Nadia, Rune, Yasin, Lina, Freja operate here.',
    agents: ['Nadia', 'Rune', 'Yasin', 'Lina', 'Freja'],
    svgX: 68, svgY: 34,
  },
  {
    id: 'apartment',
    name: 'Player Apartment',
    mood: 'cold' as const,
    description: 'Your base. Leno interface active. Access saves, branches, and the Event Log from here.',
    agents: ['Player'],
    svgX: 58, svgY: 70,
  },
] as const

export const PLAYABLE_FEATURES = [
  { title: 'Inspect locations',     description: 'Walk all 4 districts and read what the simulation records at each site.' },
  { title: 'Talk to 10 agents',     description: 'Each agent — Sara, Malik, Nadia, Rune, Omar and 5 more — has their own memory and goals.' },
  { title: 'Ask about topics',      description: 'Probe agents on delivery, Registry, rumors, and relationships.' },
  { title: 'Collect evidence',      description: 'Gather what you witness and what agents reveal under questioning.' },
  { title: 'Trace rumors',          description: 'Follow how a story spreads through the social layer of the district.' },
  { title: 'Counter rumors',        description: "Push back against false narratives once you know their source (Nadia's false Registry claim)." },
  { title: 'Ask Leno',              description: 'Your companion and evidence guard — helps interpret the world, never leaks hidden truth without proof.' },
  { title: 'Save, branch & restore', description: 'Snapshot the timeline, fork it, compare consequences in the Save Browser.' },
] as const

export const MISSING_DELIVERY = {
  title: 'The Missing Delivery',
  subtitle: 'Playable vertical slice — New Aarhus District 01',
  setup: [
    "Sara's Café is missing supplies. She needs answers.",
    "Malik refuses delivery from his workshop — something blocks it.",
    "Nadia planted a false Registry claim that spread through the district.",
    "Rune witnessed the refusal and logged it. Waiting to be found.",
    "Leno can help interpret — but hidden truth requires evidence.",
  ],
  commandCount: 14,
} as const

export const RESOLUTION_PATHS = [
  {
    id: 'peaceful',
    title: 'Peaceful mediation',
    description: 'Broker trust between Sara and Malik. De-escalate suspicion and reopen the supply line.',
    accent: 'amber' as const,
    icon: '◈',
  },
  {
    id: 'investigation',
    title: 'Investigation & counter-rumor',
    description: "Trace Nadia's false Registry claim. Collect evidence, dismantle the narrative, restore truth.",
    accent: 'cyan' as const,
    icon: '◎',
  },
  {
    id: 'negotiation',
    title: 'Founder / business negotiation',
    description: 'Use economy and permissions to negotiate a deal that satisfies founders, agents, and the district.',
    accent: 'registry' as const,
    icon: '◇',
  },
] as const

export const SIMULATION_SYSTEMS = [
  {
    name: 'Event Log',
    role: 'source of truth',
    description: 'Canonical record of every action, consequence, and state change. 0 violations across 123 events in the 7-day canonical run.',
    color: 'cyan' as const,
  },
  {
    name: 'Memory',
    role: 'agent belief',
    description: 'Each agent stores their own interpretation — incomplete, biased, and updateable. 20+ memories active in the prototype.',
    color: 'amber' as const,
  },
  {
    name: 'Rumor',
    role: 'social spread',
    description: "Stories travel between agents. True, distorted, or deliberately false. Nadia's false Registry claim is a live example.",
    color: 'registry' as const,
  },
  {
    name: 'Relationship',
    role: 'emotional math',
    description: 'Trust, suspicion, fear, affection, influence and debt tracked per agent pair. 10+ relationship changes in 7 days.',
    color: 'amber' as const,
  },
  {
    name: 'Economy',
    role: 'pressure & trade',
    description: 'Credits, debts, and trade create leverage and desperation. 3+ economy changes trigger in the canonical run.',
    color: 'cyan' as const,
  },
  {
    name: 'Incident',
    role: 'emergent quest',
    description: 'Crises like The Missing Delivery emerge from simulation state — not scripted triggers.',
    color: 'registry' as const,
  },
  {
    name: 'Permission',
    role: 'action boundary',
    description: 'Agents can only act within their role, location, and granted capabilities. Validated at runtime.',
    color: 'cyan' as const,
  },
] as const

// Phone tabs from rc8 district view + phone/Leno UI
export const PHONE_TABS = [
  { label: 'Messages',   icon: '💬', desc: 'Agent dialogue history' },
  { label: 'Contacts',   icon: '👤', desc: '10 agent profiles + relationship state' },
  { label: 'Rumors',     icon: '📡', desc: 'Active rumor threads and sources' },
  { label: 'Evidence',   icon: '🔎', desc: 'Collected evidence for Leno guard' },
  { label: 'Incident',   icon: '⚠️', desc: 'The Missing Delivery — status + resolution paths' },
  { label: 'Saves',      icon: '💾', desc: 'Save Browser with snapshot list and diff' },
  { label: 'Branches',   icon: '⑂', desc: 'Timeline branches and restore points' },
  { label: 'Leno',       icon: '◎', desc: 'Evidence-gated companion overlay' },
] as const

export const LENO = {
  title: 'Leno Companion',
  headline: 'Understand the world — not cheat it.',
  paragraphs: [
    "Leno is your UI-brain and companion in New Aarhus. In rc8 it lives as a phone tab overlay alongside Messages, Evidence, Rumors, Saves and Branches.",
    'Hidden truth requires evidence. Leno enforces this at runtime via the evidence guard — not just prompt instructions. The worldmind core validates this with a dedicated CI gate (`validate:leno`).',
  ],
  guardrails: [
    'Evidence-gated answers',
    'No hidden-truth leaks',
    'Runtime CI gate',
    'Companion, not oracle',
    'validate:leno passing',
  ],
} as const

export const TIMELINE = {
  title: 'Timeline Branches',
  headline: 'Try a path. Save the world. Compare consequences.',
  steps: [
    { label: 'Play a decision', description: 'Make a choice — the simulation responds with real consequences tracked in the Event Log.' },
    { label: 'Save the world state', description: 'Snapshot the current state. Stored in the Save Browser with full agent memory, relationships, and economy.' },
    { label: 'Branch the timeline', description: 'Fork from any save. Explore a parallel path from that exact simulation state.' },
    { label: 'Restore a branch', description: 'Roll back deterministically — byte-identical restore with auditable actor/reason log.' },
    { label: 'Compare consequences', description: 'Diff two snapshots: see what changed in locations, relationships, memories, rumors, economy, incidents.' },
  ],
  features: ['Save Browser', 'Branch Restore', 'Snapshot Diff', 'Deterministic', 'Audit Log'],
} as const

export const ENGINE_PROOF = [
  { label: PRODUCT.version, icon: '◆' },
  { label: `${PRODUCT.testCount} tests passing`, icon: '✓' },
  { label: '10 NPC agents', icon: '◉' },
  { label: '4 locations', icon: '◈' },
  { label: 'Live Web Play UI', icon: '▶' },
  { label: 'Save Browser', icon: '◈' },
  { label: 'Branch Restore (deterministic)', icon: '↺' },
  { label: 'Snapshot Diff', icon: '≠' },
  { label: 'Leno Evidence Guard', icon: '◎' },
  { label: 'Event Log — 0 violations / 123 events', icon: '≡' },
  { label: '2D District View', icon: '⬡' },
  { label: 'Phone/Leno UI (8 tabs)', icon: '📱' },
  { label: 'Strict TypeScript runtime', icon: '⌘' },
  { label: '15-step ci:gate', icon: '⚙' },
] as const

export const DISTRICT = {
  title: 'New Aarhus District 01',
  headline: 'A near-future Nordic district',
  description:
    'Cafés glowing with amber warmth. Cold Registry kiosks on rain-slick concrete. Underground repair shops humming with agent-tech. 10 agents surviving a world run by memory, trust, and permissions.',
  locations: LOCATIONS,
} as const

export const FINAL_CTA = {
  headline: 'Enter New Aarhus District 01',
  primaryCta: 'View Play Instructions',
  secondaryCta: 'Explore the Simulation',
  tertiaryCta: 'View GitHub',
} as const

export const PLAYER_COMMANDS = [
  'look', 'status', 'move', 'talk', 'ask', 'inspect', 'listen_rumors',
  'trace_rumor', 'counter_rumor', 'pay', 'ask_leno', 'save', 'branch', 'quit',
] as const

export const DEMO_COMMAND_STRIP = [
  'inspect cafe',
  'talk sara',
  'listen_rumors market',
  'ask rune nadia',
  'trace_rumor',
  'counter_rumor',
  'ask_leno',
  'save',
  'branch',
] as const

export const PRODUCT_TRUTH = {
  existsToday: [
    'Living AI-world simulation prototype — New Aarhus District 01.',
    'The Missing Delivery playable vertical slice with 3 deterministic resolution paths.',
    '10 NPC agents: Sara, Malik, Nadia, Rune, Omar, Lina, Yasin, Freja, Elias, Amina — each with memory, goals, relationships.',
    '4 locations: Café, Workshop, Market Street, Player Apartment.',
    '14 structured player commands validated by the World Engine.',
    'Live Web Play UI generated from core repo (86KB). Server mode via play:server.',
    'Save Browser, Branch Restore (deterministic), and Snapshot Diff.',
    'Event Log as canonical source of truth — 0 violations across 123 events in canonical 7-day run.',
    'Leno companion with evidence guard — runtime-enforced via validate:leno CI gate.',
    '2D district SVG view + phone/Leno UI with 8 tabs (rc8).',
    'WorldMind v1.0-rc8 — strict TypeScript, 200/200 tests, 15-step ci:gate green.',
  ],
  comesLater: [
    'More districts and incidents built on the same simulation foundation.',
    'Additional player-facing UI layers on top of existing Web Play and saves tooling.',
    'Richer progression and long-run campaigns across multiple timelines.',
    'Publishing and sharing of emergent runs once the sandbox story surface is stable.',
  ],
} as const
