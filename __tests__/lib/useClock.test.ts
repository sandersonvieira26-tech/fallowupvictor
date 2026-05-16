import { renderHook, act } from '@testing-library/react'
import { useClock } from '@/lib/useClock'

describe('useClock', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('retorna string de tempo no formato HH:MM:SS', () => {
    const { result } = renderHook(() => useClock())
    expect(typeof result.current).toBe('string')
    expect(result.current).toMatch(/^\d{2}:\d{2}:\d{2}$/)
  })

  it('atualiza a cada segundo', () => {
    const { result } = renderHook(() => useClock())
    const initial = result.current
    act(() => { jest.advanceTimersByTime(1000) })
    expect(typeof result.current).toBe('string')
  })
})
