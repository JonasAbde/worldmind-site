export const PRODUCT = {
  name: 'WorldMind',
  tagline: 'Enter the Simulation',
  version: 'v1.0-rc7',
  testCount: '188/188',
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
  { label: 'Live Web Play', variant: 'cyan' as const },
] as const

export const PLAYABLE_FEATURES = [
  {
    title: 'Inspect locations',
    description: 'Walk the district and read what the simulation records at each site.',
  },
  {
    title: 'Talk to agents',
    description: 'Speak with Sara, Malik, Nadia, Rune and others — each with their own memory.',
  },
  {
    title: 'Ask about topics',
    description: 'Probe agents on delivery, Registry, rumors, and relationships.',
  },
  {
    title: 'Collect evidence',
    description: 'Gather what you witness and what agents reveal under pressure.',
  },
  {
    title: 'Trace rumors',
    description: 'Follow how a story spreads through the social layer of the district.',
  },
  {
    title: 'Counter rumors',
    description: 'Push back against false narratives once you know their source.',
  },
  {
    title: 'Ask Leno',
    description: 'Your companion helps interpret the world — with evidence guardrails.',
  },
  {
    title: 'Save, branch & restore',
    description: 'Freeze a timeline, try another path, and compare consequences.',
  },
] as const

export const MISSING_DELIVERY = {
  title: 'The Missing Delivery',
  subtitle: 'Playable vertical slice — New Aarhus District 01',
  setup: [
    "Sara's Café is missing supplies.",
    'Malik refuses delivery.',
    'Nadia planted a false Registry rumor.',
    'Rune saw something.',
    'Leno can help — but only with evidence.',
  ],
  commandCount: 14,
} as const

export const RESOLUTION_PATHS = [
  {
    id: 'peaceful',
    title: 'Peaceful mediation',
    description:
      'Broker trust between Sara and Malik. De-escalate suspicion and reopen the supply line without force.',
    accent: 'amber' as const,
    icon: '◈',
  },
  {
    id: 'investigation',
    title: 'Investigation & counter-rumor',
    description:
      'Trace Nadia\'s false Registry rumor to its source. Collect evidence and dismantle the narrative.',
    accent: 'cyan' as const,
    icon: '◎',
  },
  {
    id: 'negotiation',
    title: 'Founder / business negotiation',
    description:
      'Use economy and permissions to negotiate a deal that satisfies founders, agents, and the district.',
    accent: 'registry' as const,
    icon: '◇',
  },
] as const

export const SIMULATION_SYSTEMS = [
  {
    name: 'Event Log',
    role: 'what happened',
    description: 'The canonical record of every action, consequence, and state change in the world.',
    color: 'cyan' as const,
  },
  {
    name: 'Memory',
    role: 'what agents believe',
    description: 'Each agent stores their own interpretation — incomplete, biased, and updateable.',
    color: 'amber' as const,
  },
  {
    name: 'Rumor',
    role: 'what spreads socially',
    description: 'Stories travel between agents. They can be true, distorted, or deliberately false.',
    color: 'registry' as const,
  },
  {
    name: 'Relationship',
    role: 'emotional consequence',
    description: 'Trust, suspicion, and affinity shift with every interaction and betrayal.',
    color: 'amber' as const,
  },
  {
    name: 'Economy',
    role: 'pressure and trade',
    description: 'Credits, debts, and trade create leverage — and desperation.',
    color: 'cyan' as const,
  },
  {
    name: 'Incident',
    role: 'gameplay opportunity',
    description: 'Emergent crises like the missing delivery become playable story arcs.',
    color: 'registry' as const,
  },
  {
    name: 'Permission',
    role: 'action boundary',
    description: 'Agents can only act within their role, location, and granted capabilities.',
    color: 'cyan' as const,
  },
] as const

export const LENO = {
  title: 'Leno Companion',
  headline: 'Understand the world — not cheat it.',
  paragraphs: [
    'Leno helps you navigate New Aarhus: interpret events, suggest angles, and surface what your evidence supports.',
    'Hidden truth requires evidence. Leno is a companion and UI-brain — not an all-knowing narrator. The simulation guardrails enforce this at runtime, not just in prompts.',
  ],
  guardrails: [
    'Evidence-gated answers',
    'No hidden-truth leaks',
    'Runtime guardrails',
    'Companion, not oracle',
  ],
} as const

export const TIMELINE = {
  title: 'Timeline Branches',
  headline: 'Try a path. Save the world. Compare consequences.',
  steps: [
    { label: 'Try a path', description: 'Make a decision and see the simulation respond.' },
    { label: 'Save the world', description: 'Snapshot the current state to the Save Browser.' },
    { label: 'Branch the timeline', description: 'Fork from a save and explore an alternate choice.' },
    { label: 'Restore a decision', description: 'Roll back to a prior branch and continue from there.' },
    { label: 'Compare consequences', description: 'Diff snapshots and read what changed in the Event Log.' },
  ],
  features: ['Save Browser', 'Branch Restore', 'Snapshot Diff'],
} as const

export const ENGINE_PROOF = [
  { label: PRODUCT.version, icon: '◆' },
  { label: `${PRODUCT.testCount} tests passing`, icon: '✓' },
  { label: 'Live Web Play UI', icon: '▶' },
  { label: 'Save Browser', icon: '◈' },
  { label: 'Branch Restore', icon: '↺' },
  { label: 'Snapshot Diff', icon: '≠' },
  { label: 'Leno Evidence Guard', icon: '◎' },
  { label: 'Event Log Source of Truth', icon: '≡' },
  { label: 'Strict TypeScript Runtime', icon: '⌘' },
] as const

export const DISTRICT = {
  title: 'New Aarhus District 01',
  headline: 'A near-future Nordic district',
  description:
    'Cafés glowing with amber warmth. Cold Registry kiosks on rain-slick concrete. Underground repair shops humming with agent-tech. People surviving a world run by memory, trust, and permissions.',
  locations: [
    { name: "Sara's Café", mood: 'warm', description: 'Amber light, missing supplies, community heart' },
    { name: 'Registry Kiosk', mood: 'cold', description: 'Blue authority, rumor origin, permissions gate' },
    { name: 'Repair Workshop', mood: 'neutral', description: 'Underground tech, Malik\'s domain' },
    { name: 'Harbour Market', mood: 'neutral', description: 'Trade pressure, social crossroads' },
    { name: 'Agent Underground', mood: 'cold', description: 'Neon cyan overlays, simulation edge' },
  ],
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
    'Living AI-world simulation prototype in New Aarhus District 01.',
    'The Missing Delivery playable vertical slice.',
    'Agents with memory, goals, relationships, rumors, economy, permissions, and consequences.',
    '14 structured player commands, validated by the World Engine.',
    'Live Web Play UI generated locally from the core repo.',
    'Save Browser, Branch Restore, and Snapshot Diff to inspect timelines.',
    'Event Log as the canonical source of truth.',
    'Leno companion with evidence guard — hidden truth requires evidence.',
    'WorldMind v1.0-rc7 with strict TypeScript runtime and 188/188 tests passing in the core repo.',
  ],
  comesLater: [
    'More districts and incidents built on the same simulation foundation.',
    'Additional player-facing UI layers on top of the existing Web Play and saves tooling.',
    'Richer progression and long-run campaigns across multiple timelines.',
    'Publishing and sharing of emergent runs once the sandbox story surface is stable.',
  ],
} as const
