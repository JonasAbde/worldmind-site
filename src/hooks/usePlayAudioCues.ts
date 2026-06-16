import { useCallback } from 'react'

import { assetUrl, type AudioCue } from '../lib/play-api'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export function usePlayAudioCues() {
  const reducedMotion = usePrefersReducedMotion()

  const playCues = useCallback(
    (cues: AudioCue[] | null | undefined) => {
      if (reducedMotion || !cues?.length) return

      for (const cue of cues) {
        const url = assetUrl(cue.path)
        if (!url) continue
        const audio = new Audio(url)
        audio.volume = 0.45
        void audio.play().catch(() => {})
      }
    },
    [reducedMotion],
  )

  return { playCues }
}
