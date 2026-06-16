import { DISTRICT_BRAND } from '../components/play/3d/district-brand-colors'

export type BuildingStyle = 'residential' | 'cafe' | 'market' | 'industrial' | 'civic'

export type BuildingPresetId =
  | 'apartment'
  | 'cafe'
  | 'market'
  | 'workshop'
  | 'district_square'
  | 'default'

export interface BuildingPreset {
  id: BuildingPresetId
  footprint: [number, number, number]
  wallColor: string
  trimColor: string
  emissive: string
  roofHeight: number
  style: BuildingStyle
}

const PRESETS: Record<BuildingPresetId, BuildingPreset> = {
  apartment: {
    id: 'apartment',
    footprint: [3.2, 4.8, 2.6],
    wallColor: '#3d4f6a',
    trimColor: DISTRICT_BRAND.cyan,
    emissive: DISTRICT_BRAND.amberGlow,
    roofHeight: 0.35,
    style: 'residential',
  },
  cafe: {
    id: 'cafe',
    footprint: [3.6, 2.4, 3.0],
    wallColor: '#5c3d2e',
    trimColor: DISTRICT_BRAND.amber,
    emissive: '#fbbf24',
    roofHeight: 0.2,
    style: 'cafe',
  },
  market: {
    id: 'market',
    footprint: [4.2, 2.2, 3.4],
    wallColor: '#1e4d4a',
    trimColor: DISTRICT_BRAND.cyanGlow,
    emissive: DISTRICT_BRAND.cyan,
    roofHeight: 0.15,
    style: 'market',
  },
  workshop: {
    id: 'workshop',
    footprint: [3.8, 3.2, 3.2],
    wallColor: '#3f4654',
    trimColor: '#94a3b8',
    emissive: '#f97316',
    roofHeight: 0.5,
    style: 'industrial',
  },
  district_square: {
    id: 'district_square',
    footprint: [4.5, 1.6, 4.5],
    wallColor: '#1a3d2e',
    trimColor: DISTRICT_BRAND.civic,
    emissive: DISTRICT_BRAND.civic,
    roofHeight: 0.12,
    style: 'civic',
  },
  default: {
    id: 'default',
    footprint: [3, 2.8, 2.8],
    wallColor: '#334155',
    trimColor: DISTRICT_BRAND.cyan,
    emissive: DISTRICT_BRAND.cyanGlow,
    roofHeight: 0.25,
    style: 'residential',
  },
}

export function presetForLocation(locationId: string, zone?: string): BuildingPreset {
  const id = locationId as BuildingPresetId
  if (PRESETS[id]) return PRESETS[id]
  if (zone === 'commerce') return PRESETS.market
  if (zone === 'industrial') return PRESETS.workshop
  if (zone === 'social') return PRESETS.cafe
  if (zone === 'civic') return PRESETS.district_square
  if (zone === 'residential') return PRESETS.apartment
  return PRESETS.default
}
