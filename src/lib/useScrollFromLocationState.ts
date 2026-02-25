import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import { scrollToId } from './scrollToId'

type ScrollState = {
  scrollTo?: string
}

export function useScrollFromLocationState(): void {
  const location = useLocation()
  const processedKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (processedKeyRef.current === location.key) {
      return
    }

    processedKeyRef.current = location.key

    const state = location.state as ScrollState | null
    if (state?.scrollTo) {
      scrollToId(state.scrollTo)
      return
    }

    if (location.hash) {
      scrollToId(decodeURIComponent(location.hash.slice(1)))
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.hash, location.key, location.pathname, location.search, location.state])
}
