'use client'

import { useRef, useEffect } from 'react'
import { Settings } from 'lucide-react'

interface LogoProps {
  spinCount?: number
}

export default function Logo({ spinCount = 0 }: LogoProps) {
  const gearRef = useRef<HTMLSpanElement>(null)
  const prevCount = useRef(0)

  useEffect(() => {
    if (!gearRef.current || spinCount === prevCount.current) return
    prevCount.current = spinCount
    const el = gearRef.current
    el.classList.remove('gear-spin-once')
    void el.offsetWidth // force reflow to restart animation
    el.classList.add('gear-spin-once')
  }, [spinCount])

  return (
    <div
      className="flex items-center select-none"
      style={{
        fontFamily: 'var(--font-orbitron), monospace',
        fontWeight: 700,
        fontSize: '13px',
        letterSpacing: '0.12em',
        color: '#F97316',
      }}
    >
      <span>AUTCHRON</span>
      <span
        ref={gearRef}
        className="inline-flex items-center justify-center"
        style={{ color: '#F97316', lineHeight: 1 }}
      >
        <Settings size={13} strokeWidth={2} />
      </span>
      <span>S</span>
    </div>
  )
}
