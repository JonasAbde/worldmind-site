/** WorldMind site brand palette for 3D district (matches index.css @theme). */
export const DISTRICT_BRAND = {
  void: '#04060a',
  deep: '#07090f',
  surface: '#0d1219',
  elevated: '#141c26',
  border: '#1e2d3d',
  cyan: '#22d3ee',
  cyanGlow: '#67e8f9',
  cyanDim: '#0a3d4a',
  amber: '#f59e0b',
  amberGlow: '#fbbf24',
  civic: '#4ade80',
  civicDim: '#166534',
  fog: '#0a0e14',
  sky: '#0c1219',
  sun: '#c4e4f8',
} as const

export type DistrictEnvironment = {
  fogColor?: string
  fogNear?: number
  fogFar?: number
  groundColor?: string
  gridColor?: string
  ambientIntensity?: number
  sunIntensity?: number
  skyColor?: string
}

export function resolveDistrictEnvironment(env: DistrictEnvironment = {}) {
  return {
    fogColor: env.fogColor ?? DISTRICT_BRAND.fog,
    fogNear: env.fogNear ?? 16,
    fogFar: env.fogFar ?? 44,
    groundColor: env.groundColor ?? DISTRICT_BRAND.surface,
    gridColor: env.gridColor ?? DISTRICT_BRAND.border,
    ambientIntensity: env.ambientIntensity ?? 0.28,
    sunIntensity: env.sunIntensity ?? 1.15,
    skyColor: env.skyColor ?? DISTRICT_BRAND.sky,
  }
}
