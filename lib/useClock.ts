'use client'

import { useState, useEffect } from 'react'

export function useClock(): string {
  const [time, setTime] = useState('')

  useEffect(() => {
    function update() {
      setTime(new Date().toLocaleTimeString('pt-BR', { hour12: false }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return time
}
