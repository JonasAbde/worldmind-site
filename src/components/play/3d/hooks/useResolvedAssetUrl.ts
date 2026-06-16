import { useEffect, useMemo, useState } from 'react'

/** Picks the first candidate URL that loads in the browser (png/webp fallback). */
export function useResolvedAssetUrl(candidates: string[]): string | null {
  const key = useMemo(() => candidates.join('|'), [candidates])
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const list = candidates.filter(Boolean)
    if (!list.length) {
      setUrl(null)
      return
    }

    const tryAt = (index: number) => {
      if (cancelled) return
      if (index >= list.length) {
        setUrl(list[0])
        return
      }
      const img = new Image()
      img.onload = () => {
        if (!cancelled) setUrl(list[index])
      }
      img.onerror = () => tryAt(index + 1)
      img.src = list[index]
    }

    setUrl(null)
    tryAt(0)
    return () => {
      cancelled = true
    }
  }, [key, candidates])

  return url
}
