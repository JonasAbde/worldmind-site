import { Line } from '@react-three/drei'

import type { VisualCues, VisualCuesEdge, VisualCuesLocation } from '../../../lib/play-api'

import type { Selection } from './district-scene-types'

import { DISTRICT_BRAND, resolveDistrictEnvironment } from './district-brand-colors'

import { DistrictGround } from './DistrictGround'

import { DistrictStreetProps } from './assets/DistrictStreetProps'

import { DistrictScene3D, HotspotMarker, PlayerMarker } from './LocationBuildings'

import { ZoneLandmarks } from './ZoneLandmarks'



interface DistrictWorldProps {
  cues: VisualCues
  onSelect: (selection: Selection) => void
  onTravel?: (selection: Selection) => void
  onHotspotInspect?: (selection: Selection) => void
  showPlayer?: boolean
  useLocomotion?: boolean
}

export function DistrictWorld({ cues, onSelect, onTravel, onHotspotInspect, showPlayer = true, useLocomotion = false }: DistrictWorldProps) {

  const env = resolveDistrictEnvironment(cues.environment ?? {})



  const edgeLines = (cues.edges ?? []).map((edge: VisualCuesEdge, i: number) => {

    if (!edge.fromPosition || !edge.toPosition) return null

    return (

      <Line

        key={`${edge.from}-${edge.to}-${i}`}

        points={[

          edge.fromPosition as [number, number, number],

          edge.toPosition as [number, number, number],

        ]}

        color={DISTRICT_BRAND.cyan}

        transparent

        opacity={0.4}

        position={[0, 0.15, 0]}

      />

    )

  })



  const playerPos = cues.player?.position as [number, number, number] | undefined



  return (

    <>

      <color attach="background" args={[env.skyColor]} />

      <fog attach="fog" args={[env.fogColor, env.fogNear, env.fogFar]} />



      <hemisphereLight

        args={[env.skyColor, env.groundColor, env.ambientIntensity + 0.22]}

        position={[0, 24, 0]}

      />

      <ambientLight intensity={env.ambientIntensity} color={DISTRICT_BRAND.cyanGlow} />



      <directionalLight

        castShadow

        position={[10, 22, 7]}

        intensity={env.sunIntensity}

        color={DISTRICT_BRAND.sun}

        shadow-mapSize-width={1024}

        shadow-mapSize-height={1024}

        shadow-camera-far={48}

        shadow-camera-left={-14}

        shadow-camera-right={14}

        shadow-camera-top={14}

        shadow-camera-bottom={-14}

      />

      <directionalLight position={[-8, 10, -6]} intensity={0.32} color={DISTRICT_BRAND.cyan} />



      <DistrictGround environment={cues.environment} />

      <ZoneLandmarks locations={cues.locations} />
      <DistrictStreetProps locations={cues.locations} />



      {edgeLines}

      {cues.locations.map((loc: VisualCuesLocation) => (

        <DistrictScene3D key={loc.id} loc={loc} onSelect={onSelect} onTravel={onTravel} />

      ))}

      {cues.hotspots.map((hs) => (

        <HotspotMarker

          key={hs.id}

          id={hs.id}

          label={hs.label}

          command={hs.command}

          risk={hs.risk}

          preview={hs.preview}

          description={hs.description}

          icon={hs.icon}

          position={hs.position as [number, number, number]}

          onSelect={onSelect}

          onInspect={onHotspotInspect}

        />

      ))}

      {showPlayer && playerPos && (
        <PlayerMarker
          position={playerPos}
          figureTexture={cues.player?.figureTexture ?? 'assets/characters/player/portrait.png'}
          fullBodyTexture={cues.player?.fullBodyTexture}
          modelUrl={cues.player?.modelUrl}
          renderMode={cues.player?.renderMode ?? 'mesh3d'}
          useLocomotion={useLocomotion}
        />
      )}

    </>

  )

}



export type { Selection } from './district-scene-types'

