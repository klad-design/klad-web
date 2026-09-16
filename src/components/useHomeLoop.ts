'use client'

import { useSyncExternalStore } from 'react'

// Hybrid laptops retain the mouse-driven loop; touch-only devices scroll normally.
const query = '(any-pointer: fine) and (prefers-reduced-motion: no-preference)'

function subscribe(onChange: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

export function useHomeLoop() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}
