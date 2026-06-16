import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import type { Group } from 'three'
import { assetUrl } from '../../../../lib/play-api'

interface GltfModelProps {
  url: string
  scale?: number
  castShadow?: boolean
  receiveShadow?: boolean
  onLoaded?: (scene: Group) => void
}

/** Load a glTF/GLB district or character model from core assets. */
export function GltfModel({
  url,
  scale = 1,
  castShadow = true,
  receiveShadow = true,
  onLoaded,
}: GltfModelProps) {
  const resolved = assetUrl(url) ?? url
  const { scene } = useGLTF(resolved)

  const clone = useMemo(() => {
    const root = scene.clone(true)
    root.traverse((obj) => {
      if ('castShadow' in obj) obj.castShadow = castShadow
      if ('receiveShadow' in obj) obj.receiveShadow = receiveShadow
    })
    return root
  }, [scene, castShadow, receiveShadow])

  useEffect(() => {
    onLoaded?.(clone)
  }, [clone, onLoaded])

  return <primitive object={clone} scale={scale} />
}

export function preloadGltfModel(url: string) {
  const resolved = assetUrl(url) ?? url
  useGLTF.preload(resolved)
}
