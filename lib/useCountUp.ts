'use client'

import { useState, useEffect, useRef } from 'react'

export function useCountUp(target: number, duration = 600): number {
  const [value, setValue] = useState(0)
  const prevTarget = useRef(0)

  useEffect(() => {
    const start = prevTarget.current
    const diff = target - start
    if (diff === 0) return

    const startTime = performance.now()

    function step(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(start + diff * eased))
      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        prevTarget.current = target
      }
    }

    requestAnimationFrame(step)
  }, [target, duration])

  return value
}
