import { DISTRICT_BRAND } from '../district-brand-colors'

export interface CharacterPreset {
  jacket: string
  pants: string
  boots: string
  skin: string
  accent: string
  emissive: string
  hair: string
}

const PRESETS: Record<string, CharacterPreset> = {
  player: {
    jacket: '#1e3a5f',
    pants: '#1e293b',
    boots: '#0f172a',
    skin: '#c9a882',
    accent: DISTRICT_BRAND.amberGlow,
    emissive: DISTRICT_BRAND.amber,
    hair: '#3d3d3d',
  },
  sara: {
    jacket: '#4a3728',
    pants: '#334155',
    boots: '#1c1917',
    skin: '#d4a88c',
    accent: '#d97706',
    emissive: '#b45309',
    hair: '#1f2937',
  },
  malik: {
    jacket: '#1e3a5f',
    pants: '#0f172a',
    boots: '#020617',
    skin: '#c49a6c',
    accent: DISTRICT_BRAND.cyanGlow,
    emissive: DISTRICT_BRAND.cyan,
    hair: '#292524',
  },
  amina: {
    jacket: '#4c1d95',
    pants: '#312e81',
    boots: '#1e1b4b',
    skin: '#c4a07a',
    accent: '#a78bfa',
    emissive: '#7c3aed',
    hair: '#171717',
  },
  rune: {
    jacket: '#365314',
    pants: '#1c1917',
    boots: '#0c0a09',
    skin: '#b8956f',
    accent: '#84cc16',
    emissive: '#65a30d',
    hair: '#78716c',
  },
  nadia: {
    jacket: '#831843',
    pants: '#1e293b',
    boots: '#0f172a',
    skin: '#d4a88c',
    accent: '#f472b6',
    emissive: '#db2777',
    hair: '#1c1917',
  },
  omar: {
    jacket: '#374151',
    pants: '#1f2937',
    boots: '#111827',
    skin: '#c4a07a',
    accent: '#94a3b8',
    emissive: '#64748b',
    hair: '#4b5563',
  },
  lina: {
    jacket: '#0e7490',
    pants: '#1e293b',
    boots: '#0f172a',
    skin: '#e8c4a8',
    accent: DISTRICT_BRAND.cyanGlow,
    emissive: DISTRICT_BRAND.cyan,
    hair: '#1f2937',
  },
  yasin: {
    jacket: '#92400e',
    pants: '#292524',
    boots: '#1c1917',
    skin: '#d4a574',
    accent: '#f59e0b',
    emissive: '#d97706',
    hair: '#292524',
  },
  freja: {
    jacket: '#1e3a8a',
    pants: '#1e293b',
    boots: '#0f172a',
    skin: '#e2c9a8',
    accent: '#60a5fa',
    emissive: '#3b82f6',
    hair: '#cbd5e1',
  },
  elias: {
    jacket: '#312e81',
    pants: '#1e293b',
    boots: '#0f172a',
    skin: '#e8c4a8',
    accent: DISTRICT_BRAND.cyanGlow,
    emissive: '#6366f1',
    hair: '#374151',
  },
}

const NPC_DEFAULT: CharacterPreset = {
  jacket: '#0c4a6e',
  pants: '#1e293b',
  boots: '#0f172a',
  skin: '#e2c9a8',
  accent: DISTRICT_BRAND.cyanGlow,
  emissive: DISTRICT_BRAND.cyan,
  hair: '#374151',
}

export function presetForCharacter(characterId: string, variant: 'player' | 'npc'): CharacterPreset {
  if (variant === 'player') return PRESETS.player
  return PRESETS[characterId] ?? NPC_DEFAULT
}
