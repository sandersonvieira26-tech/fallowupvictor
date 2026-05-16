import { renderHook, act } from '@testing-library/react'
import { useCountUp } from '@/lib/useCountUp'

describe('useCountUp', () => {
  it('começa em 0', () => {
    const { result } = renderHook(() => useCountUp(10))
    expect(result.current).toBe(0)
  })

  it('atualiza ao trocar target', () => {
    const { result, rerender } = renderHook(({ t }) => useCountUp(t), {
      initialProps: { t: 0 },
    })
    expect(result.current).toBe(0)
    act(() => {
      rerender({ t: 5 })
    })
    expect(typeof result.current).toBe('number')
  })
})
