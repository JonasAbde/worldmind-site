import { useGLTF } from '@react-three/drei'

import { useFrame } from '@react-three/fiber'

import type { ThreeEvent } from '@react-three/fiber'

import { useMemo, useRef } from 'react'

import type { Group, Mesh } from 'three'

import * as THREE from 'three'

import {

  assetUrl,

  characterFigureTextureCandidates,

  normalizeFigureTexture,

} from '../../../../lib/play-api'

import { shouldUseGltfBody } from '../../../../lib/embodied-3d-render'

import { useResolvedAssetUrl } from '../hooks/useResolvedAssetUrl'

import { usePlayerLocomotionState } from '../PlayerLocomotionContext'

import { DISTRICT_BRAND } from '../district-brand-colors'

import { presetForCharacter } from './character-presets'

import { HologramPortrait } from './HologramPortrait'



export type EmbodiedCharacterVariant = 'player' | 'npc'

export type EmbodiedRenderMode = 'mesh3d' | 'sprite2d'



interface EmbodiedCharacterProps {

  characterId?: string

  figureTexture: string

  fullBodyTexture?: string | null

  modelUrl?: string | null

  renderMode?: EmbodiedRenderMode

  variant?: EmbodiedCharacterVariant

  role?: string

  walking?: boolean

  facing?: number | null

  onClick?: (e: ThreeEvent<MouseEvent>) => void

  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void

  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void

}



function MeshBody({

  preset,

  isPlayer,

  role,

  walking,

  walkSignalRef,

}: {

  preset: ReturnType<typeof presetForCharacter>

  isPlayer: boolean

  role?: string

  walking: boolean

  walkSignalRef: React.RefObject<boolean>

}) {

  const leftLegRef = useRef<Group>(null)

  const rightLegRef = useRef<Group>(null)

  const leftArmRef = useRef<Group>(null)

  const rightArmRef = useRef<Group>(null)

  const torsoRef = useRef<Mesh>(null)



  useFrame(({ clock }) => {

    const isWalking = walking || walkSignalRef.current

    const t = clock.elapsedTime

    if (isWalking) {

      const swing = Math.sin(t * 9) * 0.55

      if (leftLegRef.current) leftLegRef.current.rotation.x = swing

      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing

      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.45

      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.45

    } else {

      if (leftLegRef.current) leftLegRef.current.rotation.x *= 0.85

      if (rightLegRef.current) rightLegRef.current.rotation.x *= 0.85

      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 1.8) * 0.06

      if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(t * 1.8) * 0.06

      if (torsoRef.current) torsoRef.current.position.y = 1.05 + Math.sin(t * 2.2) * 0.018

    }

  })



  return (

    <>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>

        <circleGeometry args={[0.42, 28]} />

        <meshBasicMaterial color={preset.emissive} transparent opacity={isPlayer ? 0.35 : 0.22} />

      </mesh>

      <group ref={leftLegRef} position={[-0.11, 0.48, 0]}>

        <mesh position={[0, -0.22, 0]} castShadow>

          <capsuleGeometry args={[0.09, 0.38, 4, 8]} />

          <meshStandardMaterial color={preset.pants} roughness={0.82} />

        </mesh>

        <mesh position={[0, -0.52, 0.02]} castShadow>

          <boxGeometry args={[0.12, 0.12, 0.22]} />

          <meshStandardMaterial color={preset.boots} roughness={0.9} />

        </mesh>

      </group>

      <group ref={rightLegRef} position={[0.11, 0.48, 0]}>

        <mesh position={[0, -0.22, 0]} castShadow>

          <capsuleGeometry args={[0.09, 0.38, 4, 8]} />

          <meshStandardMaterial color={preset.pants} roughness={0.82} />

        </mesh>

        <mesh position={[0, -0.52, 0.02]} castShadow>

          <boxGeometry args={[0.12, 0.12, 0.22]} />

          <meshStandardMaterial color={preset.boots} roughness={0.9} />

        </mesh>

      </group>

      <mesh ref={torsoRef} position={[0, 1.05, 0]} castShadow>

        <capsuleGeometry args={[0.2, 0.42, 6, 12]} />

        <meshStandardMaterial color={preset.jacket} roughness={0.74} metalness={0.08} />

      </mesh>

      <mesh position={[0, 1.02, 0.14]}>

        <boxGeometry args={[0.14, 0.32, 0.03]} />

        <meshStandardMaterial

          color={preset.accent}

          emissive={preset.emissive}

          emissiveIntensity={0.55}

          toneMapped={false}

        />

      </mesh>

      <group ref={leftArmRef} position={[-0.26, 1.08, 0]}>

        <mesh position={[0, -0.2, 0]} rotation={[0, 0, 0.12]} castShadow>

          <capsuleGeometry args={[0.06, 0.34, 4, 8]} />

          <meshStandardMaterial color={preset.jacket} />

        </mesh>

      </group>

      <group ref={rightArmRef} position={[0.26, 1.08, 0]}>

        <mesh position={[0, -0.2, 0]} rotation={[0, 0, -0.12]} castShadow>

          <capsuleGeometry args={[0.06, 0.34, 4, 8]} />

          <meshStandardMaterial color={preset.jacket} />

        </mesh>

      </group>

      <mesh position={[0, 1.48, 0]} castShadow>

        <sphereGeometry args={[0.16, 16, 16]} />

        <meshStandardMaterial color={preset.skin} roughness={0.68} />

      </mesh>

      <mesh position={[0, 1.56, -0.02]} castShadow>

        <sphereGeometry args={[0.165, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />

        <meshStandardMaterial color={preset.hair} roughness={0.85} />

      </mesh>

      {isPlayer ? (

        <pointLight color={DISTRICT_BRAND.amberGlow} intensity={0.55} distance={3.5} position={[0, 1.5, 0.35]} />

      ) : null}

      {!isPlayer && role ? (

        <mesh position={[0.2, 1.22, 0.16]}>

          <sphereGeometry args={[0.04, 8, 8]} />

          <meshStandardMaterial color={DISTRICT_BRAND.cyan} emissive={DISTRICT_BRAND.cyanGlow} emissiveIntensity={0.65} />

        </mesh>

      ) : null}

    </>

  )

}



function GltfBody({

  modelUrl,

  preset,

  isPlayer,

}: {

  modelUrl: string

  preset: ReturnType<typeof presetForCharacter>

  isPlayer: boolean

}) {

  const resolved = assetUrl(modelUrl) ?? modelUrl

  const { scene } = useGLTF(resolved)

  const tinted = useMemo(() => {

    const root = scene.clone(true)

    const palette = [preset.jacket, preset.pants, preset.skin, preset.hair, preset.boots]

    let i = 0

    root.traverse((obj) => {

      const mesh = obj as Mesh

      if (!mesh.isMesh || !mesh.material) return

      const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial

      if (!mat.color) return

      mat.color = new THREE.Color(palette[i % palette.length])

      mat.needsUpdate = true

      i += 1

      mesh.castShadow = true

      mesh.receiveShadow = true

    })

    return root

  }, [scene, preset])



  return (

    <>

      <primitive object={tinted} />

      {isPlayer ? (

        <pointLight color={DISTRICT_BRAND.amberGlow} intensity={0.55} distance={3.5} position={[0, 1.5, 0.35]} />

      ) : null}

    </>

  )

}



/** Embodied humanoid — 3D mesh or glTF body with portrait hologram (no flat full-body sprites by default). */

export function EmbodiedCharacter({

  characterId = 'npc',

  figureTexture,

  modelUrl,

  renderMode = 'mesh3d',

  variant = 'npc',

  role,

  walking = false,

  facing = null,

  onClick,

  onPointerOver,

  onPointerOut,

}: EmbodiedCharacterProps) {

  const groupRef = useRef<Group>(null)

  const walkSignalRef = useRef(walking)

  const locomotion = usePlayerLocomotionState()

  const isPlayer = variant === 'player'

  const preset = presetForCharacter(characterId, variant)



  const facePath = normalizeFigureTexture(figureTexture)

  const faceCandidates = characterFigureTextureCandidates(facePath)

  const faceUrl = useResolvedAssetUrl(faceCandidates)

  const useGltf = shouldUseGltfBody(renderMode, modelUrl)



  useFrame(() => {

    walkSignalRef.current = walking || (isPlayer && (locomotion?.isMovingRef.current ?? false))

    if (groupRef.current && facing != null) {

      groupRef.current.rotation.y += (facing - groupRef.current.rotation.y) * 0.18

    }

  })



  return (

    <group ref={groupRef} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>

      {useGltf && modelUrl ? (

        <GltfBody modelUrl={modelUrl} preset={preset} isPlayer={isPlayer} />

      ) : (

        <MeshBody

          preset={preset}

          isPlayer={isPlayer}

          role={role}

          walking={walking}

          walkSignalRef={walkSignalRef}

        />

      )}

      {faceUrl ? <HologramPortrait url={faceUrl} /> : null}

    </group>

  )

}


