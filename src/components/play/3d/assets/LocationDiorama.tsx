import { useTexture } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useMemo } from 'react'
import { assetUrl, locationSceneTextureCandidates } from '../../../../lib/play-api'
import { DISTRICT_BRAND } from '../district-brand-colors'
import { presetForLocation } from './building-presets'

interface LocationDioramaProps {
  locationId: string
  zone: string
  isPlayerHere?: boolean
  sceneTexture?: string | null
  onClick?: (e: ThreeEvent<MouseEvent>) => void
}

/** Asset-first location stage — large reviewed scene backdrop, not procedural boxes. */
export function LocationDiorama({
  locationId,
  zone,
  isPlayerHere,
  sceneTexture,
  onClick,
}: LocationDioramaProps) {
  const preset = presetForLocation(locationId, zone)
  const [footW] = preset.footprint
  const stageW = Math.max(footW * 1.35, 3.8)
  const urls = sceneTexture ? locationSceneTextureCandidates(sceneTexture) : []
  const texture = useTexture(urls[0] ?? assetUrl(sceneTexture ?? '') ?? '/assets/locations/cafe.png')
  const aspect = texture.image
    ? (texture.image as HTMLImageElement).width / (texture.image as HTMLImageElement).height
    : 16 / 9
  const backdropH = stageW / aspect

  const trim = useMemo(
    () => (isPlayerHere ? DISTRICT_BRAND.amber : preset.trimColor),
    [isPlayerHere, preset.trimColor],
  )

  return (
    <group onClick={onClick}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[stageW * 0.52, 32]} />
        <meshStandardMaterial
          color={isPlayerHere ? '#1c1917' : '#111827'}
          emissive={isPlayerHere ? DISTRICT_BRAND.amber : '#000000'}
          emissiveIntensity={isPlayerHere ? 0.25 : 0}
          roughness={0.92}
        />
      </mesh>

      <mesh position={[0, backdropH / 2 + 0.08, -0.12]} receiveShadow castShadow>
        <planeGeometry args={[stageW, backdropH]} />
        <meshStandardMaterial map={texture} toneMapped={false} roughness={1} metalness={0} />
      </mesh>

      <mesh position={[0, 0.06, stageW * 0.48]}>
        <boxGeometry args={[stageW + 0.08, 0.1, 0.14]} />
        <meshStandardMaterial color="#1f2937" roughness={0.85} />
      </mesh>

      <mesh position={[0, backdropH + 0.12, -0.12]}>
        <boxGeometry args={[stageW + 0.14, 0.08, 0.1]} />
        <meshStandardMaterial color={trim} emissive={trim} emissiveIntensity={0.35} />
      </mesh>

      <pointLight
        color={isPlayerHere ? DISTRICT_BRAND.amberGlow : preset.emissive}
        intensity={isPlayerHere ? 0.7 : 0.35}
        distance={stageW * 1.4}
        position={[0, backdropH * 0.55, stageW * 0.25]}
      />
    </group>
  )
}
