import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, type RefObject } from 'react'
import type { Mesh } from 'three'
import { DISTRICT_BRAND } from '../district-brand-colors'

function FullBodySprite({ url, walkSignalRef }: { url: string; walkSignalRef: RefObject<boolean> }) {
  const tex = useTexture(url)
  const meshRef = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const bob = walkSignalRef.current ? 0 : Math.sin(clock.elapsedTime * 2.2) * 0.02
    meshRef.current.position.y = 0.88 + bob
  })

  return (
    <mesh ref={meshRef} position={[0, 0.88, 0.04]} castShadow>
      <planeGeometry args={[0.78, 1.68]} />
      <meshBasicMaterial map={tex} transparent alphaTest={0.06} toneMapped={false} />
    </mesh>
  )
}

function PortraitFace({ url }: { url: string }) {
  const tex = useTexture(url)
  return (
    <mesh position={[0, 1.48, 0.16]} castShadow>
      <planeGeometry args={[0.28, 0.34]} />
      <meshBasicMaterial map={tex} transparent alphaTest={0.06} toneMapped={false} />
    </mesh>
  )
}

interface SpriteCharacterProps {
  bodyUrl: string
  faceUrl: string
  walkSignalRef: RefObject<boolean>
  isPlayer: boolean
  emissive: string
}

function SpriteCharacter({ bodyUrl, faceUrl, walkSignalRef, isPlayer, emissive }: SpriteCharacterProps) {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[0.42, 28]} />
        <meshBasicMaterial color={emissive} transparent opacity={isPlayer ? 0.35 : 0.22} />
      </mesh>
      <mesh visible={false} position={[0, 0.85, 0]}>
        <capsuleGeometry args={[0.32, 1.0, 6, 12]} />
        <meshBasicMaterial />
      </mesh>
      <FullBodySprite url={bodyUrl} walkSignalRef={walkSignalRef} />
      <PortraitFace url={faceUrl} />
      {isPlayer ? (
        <pointLight color={DISTRICT_BRAND.amberGlow} intensity={0.55} distance={3.5} position={[0, 1.5, 0.35]} />
      ) : null}
    </>
  )
}

export { SpriteCharacter, PortraitFace, FullBodySprite }
