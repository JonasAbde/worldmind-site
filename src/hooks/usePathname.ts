import { useEffect, useState } from 'react'

export function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    const onNavigate = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onNavigate)
    return () => window.removeEventListener('popstate', onNavigate)
  }, [])

  return pathname
}

export function isPlayRoute(pathname: string) {
  return pathname === '/play' || pathname === '/play/'
}
