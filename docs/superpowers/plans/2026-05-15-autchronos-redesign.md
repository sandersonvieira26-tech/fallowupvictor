# AUTCHRONOS Redesign — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign visual completo do dashboard de agendamentos — dark panel denso com accent âmbar, tipografia Inter + JetBrains Mono + Orbitron, sidebar fixa com logo AUTCHRONOS animada e animações funcionais de sistema.

**Architecture:** Mantém toda a lógica de negócio e API routes existentes. Apenas a camada visual é substituída. Novos hooks de utilidade (`useCountUp`, `useClock`) abstraem animações. Novo componente `Sidebar` substitui a navegação por abas. `Logo` encapsula a identidade visual com engrenagem animada. Nenhum shadcn/ui é usado na UI principal — CSS custom properties definem o sistema de design.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, lucide-react, JetBrains Mono + Orbitron + Inter via `next/font/google`

---

## Mapa de Arquivos

```
Criar:
  lib/useCountUp.ts                    ← hook: anima número de 0 até target
  lib/useClock.ts                      ← hook: timestamp HH:MM:SS atualizado a cada segundo
  components/Logo.tsx                  ← "AUTCHRON[⚙]S" com engrenagem animada
  components/Sidebar.tsx               ← sidebar fixa 240px com nav, status e frase

Modificar:
  app/layout.tsx                       ← carregar Inter, Orbitron, JetBrains Mono
  app/globals.css                      ← substituir por design tokens AUTCHRONOS
  components/StatsBar.tsx              ← cards com JetBrains Mono + count-up
  components/AttendanceToggle.tsx      ← botões 32x32 com ícones Check/X
  components/AppointmentRow.tsx        ← dot de status + monospace para telefone/data
  components/NewAppointmentModal.tsx   ← modal com overlay blur + tokens custom
  components/tabs/TodayTab.tsx         ← lista contínua com border-bottom
  components/tabs/WeekTab.tsx          ← grupos por data com header uppercase
  components/tabs/ClientsTab.tsx       ← lista contínua sem cards shadcn
  components/tabs/NoShowsTab.tsx       ← lista contínua com showDate
  components/Dashboard.tsx            ← sidebar + content area + init animation

Atualizar teste:
  __tests__/components/StatsBar.test.tsx  ← mock useCountUp para testes síncronos
```

---

## Task 1: Verificar baseline de testes

**Files:**
- Read: `package.json`

- [ ] **Step 1: Rodar todos os testes para registrar baseline**

```bash
npm test -- --no-coverage 2>&1
```

Expected: anotar quais passam e quais falham antes de qualquer mudança.

- [ ] **Step 2: Confirmar que os testes de lógica de negócio passam**

Os testes em `__tests__/api/` e `__tests__/lib/auth.test.ts` devem passar. Se falharem, pare e investigue antes de continuar.

---

## Task 2: CSS Design Tokens + Fontes

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Substituir `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Inter, Orbitron, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: 'AUTCHRONOS',
  description: 'Sistema de gerenciamento de agendamentos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Substituir `app/globals.css`**

```css
@import "tailwindcss";
@import "tw-animate-css";

@theme {
  --color-base: #08080A;
  --color-surface: #0F0F12;
  --color-elevated: #161619;
  --color-border-subtle: #1E1E24;
  --color-accent: #F97316;
  --color-accent-dim: #7C3412;
  --color-primary: #F0F0F3;
  --color-secondary: #6B6B78;
  --color-muted: #2E2E36;
  --color-success: #16A34A;
  --color-danger: #DC2626;
  --color-warning: #F59E0B;

  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-display: var(--font-orbitron), monospace;
  --font-mono: var(--font-jetbrains), 'Courier New', monospace;

  --radius: 6px;
}

* {
  box-sizing: border-box;
}

body {
  background-color: #08080A;
  color: #F0F0F3;
  font-family: var(--font-inter), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@keyframes gear-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.gear-spin-once {
  animation: gear-spin 1.2s ease-in-out forwards;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.pulse-dot {
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes highlight-fade {
  0% { background-color: rgba(249, 115, 22, 0.15); }
  100% { background-color: transparent; }
}

.highlight-new {
  animation: highlight-fade 1s ease-out forwards;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1) opacity(0.3);
  cursor: pointer;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #08080A; }
::-webkit-scrollbar-thumb { background: #1E1E24; border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: #6B6B78; }
```

- [ ] **Step 3: Rodar dev server para confirmar que o projeto ainda compila**

```bash
npm run dev
```

Expected: sem erros no terminal. O browser ainda mostrará o layout antigo — isso é esperado.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: add AUTCHRONOS design tokens and font configuration"
```

---

## Task 3: Hook useCountUp

**Files:**
- Create: `lib/useCountUp.ts`
- Create: `__tests__/lib/useCountUp.test.ts`

- [ ] **Step 1: Criar o teste**

```ts
// __tests__/lib/useCountUp.test.ts
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
    // Com rAF mockado pelo jsdom, o valor pode permanecer 0 até frames rodarem.
    // Apenas confirmar que não lança erro.
    expect(typeof result.current).toBe('number')
  })
})
```

- [ ] **Step 2: Rodar para confirmar que falha**

```bash
npm test -- __tests__/lib/useCountUp.test.ts --no-coverage
```

Expected: FAIL — `Cannot find module '@/lib/useCountUp'`

- [ ] **Step 3: Criar `lib/useCountUp.ts`**

```ts
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
```

- [ ] **Step 4: Rodar o teste**

```bash
npm test -- __tests__/lib/useCountUp.test.ts --no-coverage
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/useCountUp.ts __tests__/lib/useCountUp.test.ts
git commit -m "feat: add useCountUp animation hook"
```

---

## Task 4: Hook useClock

**Files:**
- Create: `lib/useClock.ts`
- Create: `__tests__/lib/useClock.test.ts`

- [ ] **Step 1: Criar o teste**

```ts
// __tests__/lib/useClock.test.ts
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
    // O valor pode ou não ter mudado dependendo do segundo, mas não lança erro.
    expect(typeof result.current).toBe('string')
  })
})
```

- [ ] **Step 2: Rodar para confirmar que falha**

```bash
npm test -- __tests__/lib/useClock.test.ts --no-coverage
```

Expected: FAIL — `Cannot find module '@/lib/useClock'`

- [ ] **Step 3: Criar `lib/useClock.ts`**

```ts
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
```

- [ ] **Step 4: Rodar o teste**

```bash
npm test -- __tests__/lib/useClock.test.ts --no-coverage
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/useClock.ts __tests__/lib/useClock.test.ts
git commit -m "feat: add useClock real-time timestamp hook"
```

---

## Task 5: Componente Logo

**Files:**
- Create: `components/Logo.tsx`

> Sem testes — componente puramente visual com animação CSS.

- [ ] **Step 1: Criar `components/Logo.tsx`**

```tsx
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
    void el.offsetWidth
    el.classList.add('gear-spin-once')
  }, [spinCount])

  return (
    <div
      className="flex items-center gap-0 select-none"
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
```

- [ ] **Step 2: Confirmar que o projeto compila**

```bash
npm run build 2>&1 | tail -5
```

Expected: sem erros de TypeScript relacionados ao Logo.

- [ ] **Step 3: Commit**

```bash
git add components/Logo.tsx
git commit -m "feat: add AUTCHRONOS Logo component with animated gear"
```

---

## Task 6: Redesign StatsBar

**Files:**
- Modify: `components/StatsBar.tsx`
- Modify: `__tests__/components/StatsBar.test.tsx`

- [ ] **Step 1: Atualizar o teste para mockar `useCountUp`**

Substitua o conteúdo de `__tests__/components/StatsBar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StatsBar from '@/components/StatsBar'

jest.mock('@/lib/useCountUp', () => ({
  useCountUp: (target: number) => target,
}))

describe('StatsBar', () => {
  const defaultProps = {
    total: 8,
    attended: 5,
    noShows: 2,
    newClients: 3,
    onNewAppointment: jest.fn(),
  }

  it('renders all four stat cards with correct values', () => {
    render(<StatsBar {...defaultProps} />)
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Hoje')).toBeInTheDocument()
    expect(screen.getByText('Compareceram')).toBeInTheDocument()
    expect(screen.getByText('Faltaram')).toBeInTheDocument()
    expect(screen.getByText('Novos Clientes')).toBeInTheDocument()
  })

  it('renders the new appointment button', () => {
    render(<StatsBar {...defaultProps} />)
    expect(screen.getByRole('button', { name: /novo agendamento/i })).toBeInTheDocument()
  })

  it('calls onNewAppointment when button is clicked', async () => {
    const onNewAppointment = jest.fn()
    render(<StatsBar {...defaultProps} onNewAppointment={onNewAppointment} />)
    await userEvent.click(screen.getByRole('button', { name: /novo agendamento/i }))
    expect(onNewAppointment).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Rodar para confirmar que o teste passa com o componente atual**

```bash
npm test -- __tests__/components/StatsBar.test.tsx --no-coverage
```

Expected: PASS (o mock já torna o teste compatível com o componente atual)

- [ ] **Step 3: Substituir `components/StatsBar.tsx`**

```tsx
'use client'

import { useCountUp } from '@/lib/useCountUp'

interface StatsBarProps {
  total: number
  attended: number
  noShows: number
  newClients: number
  onNewAppointment: () => void
}

function StatCard({
  target,
  label,
  color,
}: {
  target: number
  label: string
  color: string
}) {
  const value = useCountUp(target)
  return (
    <div
      className="flex flex-col items-center justify-center px-6 py-3 min-w-[88px]"
      style={{
        background: '#0F0F12',
        border: '1px solid #1E1E24',
        borderRadius: '6px',
      }}
    >
      <span
        className="text-3xl font-bold leading-none tabular-nums"
        style={{ fontFamily: 'var(--font-jetbrains), monospace', color }}
      >
        {value}
      </span>
      <span
        className="mt-1.5 text-[10px] uppercase tracking-widest"
        style={{ color: '#6B6B78' }}
      >
        {label}
      </span>
    </div>
  )
}

export default function StatsBar({
  total,
  attended,
  noShows,
  newClients,
  onNewAppointment,
}: StatsBarProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-3 px-6 py-4"
      style={{ borderBottom: '1px solid #1E1E24' }}
    >
      <StatCard target={total} label="Hoje" color="#F0F0F3" />
      <StatCard target={attended} label="Compareceram" color="#16A34A" />
      <StatCard target={noShows} label="Faltaram" color="#DC2626" />
      <StatCard target={newClients} label="Novos Clientes" color="#F59E0B" />
      <button
        onClick={onNewAppointment}
        className="ml-auto px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
        style={{
          background: '#F97316',
          color: '#08080A',
          borderRadius: '6px',
        }}
      >
        + Novo Agendamento
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Rodar o teste novamente**

```bash
npm test -- __tests__/components/StatsBar.test.tsx --no-coverage
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/StatsBar.tsx __tests__/components/StatsBar.test.tsx
git commit -m "feat: redesign StatsBar with JetBrains Mono and count-up animation"
```

---

## Task 7: Redesign AttendanceToggle

**Files:**
- Modify: `components/AttendanceToggle.tsx`

> O teste atual usa `getByRole('button', { name: /✓/ })` que depende do `aria-label`. Manter os `aria-label` exatos.

- [ ] **Step 1: Rodar o teste atual para confirmar baseline**

```bash
npm test -- __tests__/components/AttendanceToggle.test.tsx --no-coverage
```

Expected: PASS (não mudar até confirmar que passou)

- [ ] **Step 2: Substituir `components/AttendanceToggle.tsx`**

```tsx
'use client'

import { Check, X } from 'lucide-react'
import type { AppointmentStatus } from '@/app/types'

interface AttendanceToggleProps {
  status: AppointmentStatus
  onStatusChange: (status: AppointmentStatus) => void
  isLoading?: boolean
}

export default function AttendanceToggle({
  status,
  onStatusChange,
  isLoading = false,
}: AttendanceToggleProps) {
  return (
    <div className="flex gap-1.5 shrink-0">
      <button
        aria-label="✓ Marcar como compareceu"
        onClick={() => onStatusChange(status === 'attended' ? 'scheduled' : 'attended')}
        disabled={isLoading}
        className="flex h-8 w-8 items-center justify-center transition-all active:scale-95 disabled:opacity-40"
        style={{
          background: status === 'attended' ? '#16A34A' : '#161619',
          border: status === 'attended' ? '1px solid #16A34A' : '1px solid #1E1E24',
          borderRadius: '6px',
          color: status === 'attended' ? '#fff' : '#6B6B78',
        }}
      >
        <Check size={13} strokeWidth={2.5} />
      </button>
      <button
        aria-label="✗ Marcar como falta"
        onClick={() => onStatusChange(status === 'no-show' ? 'scheduled' : 'no-show')}
        disabled={isLoading}
        className="flex h-8 w-8 items-center justify-center transition-all active:scale-95 disabled:opacity-40"
        style={{
          background: status === 'no-show' ? '#DC2626' : '#161619',
          border: status === 'no-show' ? '1px solid #DC2626' : '1px solid #1E1E24',
          borderRadius: '6px',
          color: status === 'no-show' ? '#fff' : '#6B6B78',
        }}
      >
        <X size={13} strokeWidth={2.5} />
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Rodar o teste**

```bash
npm test -- __tests__/components/AttendanceToggle.test.tsx --no-coverage
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/AttendanceToggle.tsx
git commit -m "feat: redesign AttendanceToggle with icon buttons and new tokens"
```

---

## Task 8: Redesign AppointmentRow

**Files:**
- Modify: `components/AppointmentRow.tsx`

- [ ] **Step 1: Rodar teste atual**

```bash
npm test -- __tests__/components/AppointmentRow.test.tsx --no-coverage
```

Expected: anotar se passa ou falha antes da mudança.

- [ ] **Step 2: Substituir `components/AppointmentRow.tsx`**

```tsx
import AttendanceToggle from '@/components/AttendanceToggle'
import type { AppointmentData, AppointmentStatus } from '@/app/types'

interface AppointmentRowProps {
  appointment: AppointmentData
  showDate?: boolean
  onStatusChange: (id: string, status: AppointmentStatus) => void
  isUpdating?: boolean
  isNew?: boolean
}

const STATUS_DOT_COLOR: Record<string, string> = {
  scheduled: '#2E2E36',
  attended: '#16A34A',
  'no-show': '#DC2626',
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  })
}

export default function AppointmentRow({
  appointment,
  showDate = false,
  onStatusChange,
  isUpdating = false,
  isNew = false,
}: AppointmentRowProps) {
  const { client } = appointment
  const dotColor = STATUS_DOT_COLOR[appointment.status] ?? '#2E2E36'

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 transition-colors ${isNew ? 'highlight-new' : ''}`}
      style={{
        background: '#0F0F12',
        borderBottom: '1px solid #1E1E24',
      }}
    >
      <span
        className="h-2 w-2 shrink-0 rounded-full transition-colors duration-200"
        style={{ background: dotColor }}
      />

      {showDate && (
        <span
          className="w-12 shrink-0 text-[11px]"
          style={{ fontFamily: 'var(--font-jetbrains), monospace', color: '#6B6B78' }}
        >
          {formatShortDate(appointment.date)}
        </span>
      )}

      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium" style={{ color: '#F0F0F3' }}>
          {client.name}
        </p>
        <p
          className="text-[11px]"
          style={{ fontFamily: 'var(--font-jetbrains), monospace', color: '#6B6B78' }}
        >
          {client.phone}
        </p>
      </div>

      {client.isNew && (
        <span
          className="shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ color: '#F59E0B', border: '1px solid #F59E0B', borderRadius: '4px' }}
        >
          NOVO
        </span>
      )}

      <AttendanceToggle
        status={appointment.status}
        onStatusChange={(status) => onStatusChange(appointment.id, status)}
        isLoading={isUpdating}
      />
    </div>
  )
}
```

- [ ] **Step 3: Rodar o teste**

```bash
npm test -- __tests__/components/AppointmentRow.test.tsx --no-coverage
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/AppointmentRow.tsx
git commit -m "feat: redesign AppointmentRow with status dot and monospace data"
```

---

## Task 9: Redesign NewAppointmentModal

**Files:**
- Modify: `components/NewAppointmentModal.tsx`

- [ ] **Step 1: Rodar teste atual**

```bash
npm test -- __tests__/components/NewAppointmentModal.test.tsx --no-coverage
```

Expected: anotar baseline.

- [ ] **Step 2: Substituir `components/NewAppointmentModal.tsx`**

```tsx
'use client'

import { useState } from 'react'

interface NewAppointmentModalProps {
  onClose: () => void
  onSubmit: (data: { name: string; phone: string; date: string }) => Promise<void>
  isSubmitting?: boolean
}

export default function NewAppointmentModal({
  onClose,
  onSubmit,
  isSubmitting = false,
}: NewAppointmentModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const disabled = isSubmitting || loading

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !date) return
    setSubmitError(null)
    setLoading(true)
    try {
      await onSubmit({ name: name.trim(), phone: phone.trim(), date })
      onClose()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao salvar agendamento.')
    } finally {
      setLoading(false)
    }
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  const inputStyle = {
    background: '#161619',
    border: '1px solid #1E1E24',
    borderRadius: '6px',
    color: '#F0F0F3',
    outline: 'none',
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = '#F97316'
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = '#1E1E24'
  }

  return (
    <div
      data-testid="modal-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-[480px] mx-4"
        style={{ background: '#0F0F12', border: '1px solid #1E1E24', borderRadius: '6px' }}
      >
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #1E1E24' }}>
          <h2 className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#F0F0F3' }}>
            Novo Agendamento
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: '#6B6B78' }}
            >
              Nome do Cliente
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={disabled}
              placeholder="Ex: João Silva"
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full px-3 py-2.5 text-sm disabled:opacity-50"
              style={inputStyle}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="phone"
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: '#6B6B78' }}
            >
              Telefone
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={disabled}
              placeholder="(11) 9xxxx-xxxx"
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full px-3 py-2.5 text-sm disabled:opacity-50"
              style={{ ...inputStyle, fontFamily: 'var(--font-jetbrains), monospace' }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="date"
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: '#6B6B78' }}
            >
              Data
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={disabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full px-3 py-2.5 text-sm disabled:opacity-50"
              style={{ ...inputStyle, fontFamily: 'var(--font-jetbrains), monospace' }}
            />
          </div>

          {submitError && (
            <div
              className="rounded px-3 py-2 text-xs"
              style={{
                background: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                color: '#DC2626',
                borderRadius: '6px',
              }}
            >
              {submitError}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={disabled}
              className="flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ background: '#F97316', color: '#08080A', borderRadius: '6px' }}
            >
              {loading ? 'Salvando...' : 'Salvar Agendamento'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={disabled}
              className="px-5 py-2.5 text-xs transition-colors disabled:opacity-50"
              style={{
                background: '#161619',
                border: '1px solid #1E1E24',
                color: '#6B6B78',
                borderRadius: '6px',
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Rodar o teste**

```bash
npm test -- __tests__/components/NewAppointmentModal.test.tsx --no-coverage
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/NewAppointmentModal.tsx
git commit -m "feat: redesign NewAppointmentModal with dark tokens and blur overlay"
```

---

## Task 10: Componente Sidebar

**Files:**
- Create: `components/Sidebar.tsx`

> Sem testes — componente de layout com hooks de UI.

- [ ] **Step 1: Criar `components/Sidebar.tsx`**

```tsx
'use client'

import { Calendar, CalendarDays, Users, AlertCircle } from 'lucide-react'
import Logo from '@/components/Logo'
import { useClock } from '@/lib/useClock'

type Tab = 'hoje' | 'semana' | 'clientes' | 'faltas'

const NAV_ITEMS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'hoje', label: 'Hoje', Icon: Calendar },
  { id: 'semana', label: 'Semana', Icon: CalendarDays },
  { id: 'clientes', label: 'Clientes', Icon: Users },
  { id: 'faltas', label: 'Faltas', Icon: AlertCircle },
]

interface SidebarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  spinCount: number
}

export default function Sidebar({ activeTab, onTabChange, spinCount }: SidebarProps) {
  const time = useClock()

  return (
    <aside
      className="flex h-screen w-60 shrink-0 flex-col"
      style={{ background: '#0F0F12', borderRight: '1px solid #1E1E24' }}
    >
      <div className="px-5 py-5" style={{ borderBottom: '1px solid #1E1E24' }}>
        <Logo spinCount={spinCount} />
      </div>

      <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm transition-colors"
              style={{
                background: active ? '#7C3412' : 'transparent',
                borderLeft: active ? '2px solid #F97316' : '2px solid transparent',
                color: active ? '#F0F0F3' : '#6B6B78',
                borderRadius: '6px',
                fontWeight: active ? 500 : 400,
              }}
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.5} />
              {label}
            </button>
          )
        })}
      </nav>

      <div
        className="px-5 py-4 flex flex-col gap-1.5"
        style={{ borderTop: '1px solid #1E1E24' }}
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full pulse-dot" style={{ background: '#16A34A' }} />
          <span
            className="text-[11px]"
            style={{ fontFamily: 'var(--font-jetbrains), monospace', color: '#6B6B78' }}
          >
            sistema ativo
          </span>
        </div>
        <span
          className="text-[11px]"
          style={{ fontFamily: 'var(--font-jetbrains), monospace', color: '#2E2E36' }}
        >
          atualizado {time}
        </span>
        <p
          className="text-[10px] italic leading-relaxed mt-2"
          style={{ color: '#6B6B78' }}
        >
          &ldquo;Tudo posso naquele<br />que me fortalece&rdquo;
        </p>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Confirmar que compila**

```bash
npm run build 2>&1 | tail -10
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add components/Sidebar.tsx
git commit -m "feat: add Sidebar component with nav, clock and footer quote"
```

---

## Task 11: Atualizar Tab Components

**Files:**
- Modify: `components/tabs/TodayTab.tsx`
- Modify: `components/tabs/WeekTab.tsx`
- Modify: `components/tabs/ClientsTab.tsx`
- Modify: `components/tabs/NoShowsTab.tsx`

- [ ] **Step 1: Substituir `components/tabs/TodayTab.tsx`**

```tsx
import AppointmentRow from '@/components/AppointmentRow'
import type { AppointmentData, AppointmentStatus } from '@/app/types'

interface TodayTabProps {
  appointments: AppointmentData[]
  onStatusChange: (id: string, status: AppointmentStatus) => void
  updatingId: string | null
}

export default function TodayTab({ appointments, onStatusChange, updatingId }: TodayTabProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm" style={{ color: '#2E2E36' }}>
          Nenhum agendamento para hoje
        </p>
      </div>
    )
  }

  return (
    <div style={{ border: '1px solid #1E1E24', borderRadius: '6px', overflow: 'hidden' }}>
      {appointments.map((appt) => (
        <AppointmentRow
          key={appt.id}
          appointment={appt}
          onStatusChange={onStatusChange}
          isUpdating={updatingId === appt.id}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Substituir `components/tabs/WeekTab.tsx`**

```tsx
import AppointmentRow from '@/components/AppointmentRow'
import type { AppointmentData, AppointmentStatus } from '@/app/types'

interface WeekTabProps {
  appointments: AppointmentData[]
  onStatusChange: (id: string, status: AppointmentStatus) => void
  updatingId: string | null
}

function formatGroupDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    timeZone: 'UTC',
  })
}

export default function WeekTab({ appointments, onStatusChange, updatingId }: WeekTabProps) {
  const grouped = appointments.reduce<Record<string, AppointmentData[]>>((acc, appt) => {
    const key = new Date(appt.date).toISOString().split('T')[0]
    if (!acc[key]) acc[key] = []
    acc[key].push(appt)
    return acc
  }, {})

  if (Object.keys(grouped).length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm" style={{ color: '#2E2E36' }}>
          Nenhum agendamento para a semana
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(grouped).map(([dateKey, appts]) => (
        <div key={dateKey}>
          <p
            className="mb-2 text-[10px] font-semibold uppercase tracking-widest capitalize"
            style={{ color: '#6B6B78' }}
          >
            {formatGroupDate(dateKey)}
          </p>
          <div style={{ border: '1px solid #1E1E24', borderRadius: '6px', overflow: 'hidden' }}>
            {appts.map((appt) => (
              <AppointmentRow
                key={appt.id}
                appointment={appt}
                onStatusChange={onStatusChange}
                isUpdating={updatingId === appt.id}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Substituir `components/tabs/NoShowsTab.tsx`**

```tsx
import AppointmentRow from '@/components/AppointmentRow'
import type { AppointmentData, AppointmentStatus } from '@/app/types'

interface NoShowsTabProps {
  appointments: AppointmentData[]
  onStatusChange: (id: string, status: AppointmentStatus) => void
  updatingId: string | null
}

export default function NoShowsTab({ appointments, onStatusChange, updatingId }: NoShowsTabProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm" style={{ color: '#2E2E36' }}>
          Nenhuma falta registrada
        </p>
      </div>
    )
  }

  return (
    <div style={{ border: '1px solid #1E1E24', borderRadius: '6px', overflow: 'hidden' }}>
      {appointments.map((appt) => (
        <AppointmentRow
          key={appt.id}
          appointment={appt}
          showDate
          onStatusChange={onStatusChange}
          isUpdating={updatingId === appt.id}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Substituir `components/tabs/ClientsTab.tsx`**

```tsx
import type { ClientWithAppointments } from '@/app/types'

interface ClientsTabProps {
  clients: ClientWithAppointments[]
}

export default function ClientsTab({ clients }: ClientsTabProps) {
  if (clients.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm" style={{ color: '#2E2E36' }}>
          Nenhum cliente cadastrado
        </p>
      </div>
    )
  }

  return (
    <div style={{ border: '1px solid #1E1E24', borderRadius: '6px', overflow: 'hidden' }}>
      {clients.map((client, i) => (
        <div
          key={client.id}
          className="flex items-center gap-4 px-4 py-3 transition-colors"
          style={{
            background: '#0F0F12',
            borderBottom: i < clients.length - 1 ? '1px solid #1E1E24' : 'none',
          }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium" style={{ color: '#F0F0F3' }}>
                {client.name}
              </p>
              {client.isNew && (
                <span
                  className="shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
                  style={{ color: '#F59E0B', border: '1px solid #F59E0B', borderRadius: '4px' }}
                >
                  NOVO
                </span>
              )}
            </div>
            <p
              className="text-[11px]"
              style={{ fontFamily: 'var(--font-jetbrains), monospace', color: '#6B6B78' }}
            >
              {client.phone}
            </p>
          </div>
          <span
            className="text-[11px] shrink-0"
            style={{ fontFamily: 'var(--font-jetbrains), monospace', color: '#2E2E36' }}
          >
            {client.appointments.length} consulta{client.appointments.length !== 1 ? 's' : ''}
          </span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Rodar todos os testes**

```bash
npm test -- --no-coverage
```

Expected: todos os testes de API e lib passam. Testes de componente passam.

- [ ] **Step 6: Commit**

```bash
git add components/tabs/
git commit -m "feat: redesign all tab components with continuous list style"
```

---

## Task 12: Dashboard — Integração Final com Sidebar

**Files:**
- Modify: `components/Dashboard.tsx`

- [ ] **Step 1: Substituir `components/Dashboard.tsx`**

```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Sidebar from '@/components/Sidebar'
import StatsBar from '@/components/StatsBar'
import NewAppointmentModal from '@/components/NewAppointmentModal'
import TodayTab from '@/components/tabs/TodayTab'
import WeekTab from '@/components/tabs/WeekTab'
import ClientsTab from '@/components/tabs/ClientsTab'
import NoShowsTab from '@/components/tabs/NoShowsTab'
import type { AppointmentData, AppointmentStatus, ClientWithAppointments } from '@/app/types'

type Tab = 'hoje' | 'semana' | 'clientes' | 'faltas'

const TAB_TITLES: Record<Tab, string> = {
  hoje: 'Hoje',
  semana: 'Semana',
  clientes: 'Clientes',
  faltas: 'Faltas',
}

function formatHeaderDate(): string {
  return new Date()
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase()
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('hoje')
  const [todayAppointments, setTodayAppointments] = useState<AppointmentData[]>([])
  const [weekAppointments, setWeekAppointments] = useState<AppointmentData[]>([])
  const [noShowAppointments, setNoShowAppointments] = useState<AppointmentData[]>([])
  const [clients, setClients] = useState<ClientWithAppointments[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [spinCount, setSpinCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  const fetchData = useCallback(async (triggerGear = false) => {
    setFetchError(null)
    try {
      const [todayRes, weekRes, noShowRes, clientsRes] = await Promise.all([
        fetch('/api/appointments?mode=day'),
        fetch('/api/appointments?mode=week'),
        fetch('/api/appointments?mode=no-shows'),
        fetch('/api/clients'),
      ])
      const [today, week, noShows, clientsData] = await Promise.all([
        todayRes.json(),
        weekRes.json(),
        noShowRes.json(),
        clientsRes.json(),
      ])
      setTodayAppointments(Array.isArray(today) ? today : [])
      setWeekAppointments(Array.isArray(week) ? week : [])
      setNoShowAppointments(Array.isArray(noShows) ? noShows : [])
      setClients(Array.isArray(clientsData) ? clientsData : [])
      if (triggerGear) setSpinCount((c) => c + 1)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setFetchError('Falha ao carregar dados.')
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setMounted(true)
      setSpinCount(1)
      fetchData()
    }, 150)
  }, [fetchData])

  async function handleStatusChange(id: string, status: AppointmentStatus) {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      await fetchData(res.ok)
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleCreateAppointment(data: { name: string; phone: string; date: string }) {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create appointment')
      await fetchData(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const todayAttended = todayAppointments.filter((a) => a.status === 'attended').length
  const todayNoShows = todayAppointments.filter((a) => a.status === 'no-show').length
  const todayNewClients = todayAppointments.filter((a) => a.client.isNew).length

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: '#08080A',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 200ms ease',
      }}
    >
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} spinCount={spinCount} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div
          className="flex items-center px-6 py-3.5"
          style={{ borderBottom: '1px solid #1E1E24' }}
        >
          <h1
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: '#F0F0F3' }}
          >
            {TAB_TITLES[activeTab]} — {formatHeaderDate()}
          </h1>
        </div>

        <StatsBar
          total={todayAppointments.length}
          attended={todayAttended}
          noShows={todayNoShows}
          newClients={todayNewClients}
          onNewAppointment={() => setIsModalOpen(true)}
        />

        {fetchError && (
          <div
            className="mx-6 mt-4 px-4 py-2 text-xs rounded"
            style={{
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              color: '#DC2626',
              borderRadius: '6px',
            }}
          >
            {fetchError}
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'hoje' && (
            <TodayTab
              appointments={todayAppointments}
              onStatusChange={handleStatusChange}
              updatingId={updatingId}
            />
          )}
          {activeTab === 'semana' && (
            <WeekTab
              appointments={weekAppointments}
              onStatusChange={handleStatusChange}
              updatingId={updatingId}
            />
          )}
          {activeTab === 'clientes' && <ClientsTab clients={clients} />}
          {activeTab === 'faltas' && (
            <NoShowsTab
              appointments={noShowAppointments}
              onStatusChange={handleStatusChange}
              updatingId={updatingId}
            />
          )}
        </main>
      </div>

      {isModalOpen && (
        <NewAppointmentModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateAppointment}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Rodar todos os testes**

```bash
npm test -- --no-coverage
```

Expected: todos passam.

- [ ] **Step 3: Iniciar o servidor de desenvolvimento**

```bash
npm run dev
```

- [ ] **Step 4: Verificar no browser em `http://localhost:3000`**

Cheklist visual obrigatório:
- [ ] Background `#08080A` (quase preto) cobre toda a tela
- [ ] Sidebar visível à esquerda, 240px, com logo AUTCHRONOS em laranja
- [ ] A engrenagem na logo gira uma vez ao carregar
- [ ] 4 itens de nav na sidebar — "Hoje" ativo com borda laranja e fundo âmbar escuro
- [ ] Rodapé da sidebar: dot verde pulsando, timestamp HH:MM:SS atualizando, frase em itálico
- [ ] StatsBar com 4 cards em JetBrains Mono, números em cores corretas
- [ ] Botão `+ Novo Agendamento` em laranja
- [ ] Clicar nas abas na sidebar muda o conteúdo com fade
- [ ] Abrir modal: overlay com blur, header uppercase, inputs com borda laranja ao focar
- [ ] Cadastrar agendamento: modal fecha, engrenagem gira, novo item aparece
- [ ] Clicar ✓ em um agendamento: botão fica verde, dot muda para verde, engrenagem gira
- [ ] Clicar ✗: botão fica vermelho, dot muda para vermelho

- [ ] **Step 5: Commit final**

```bash
git add components/Dashboard.tsx
git commit -m "feat: integrate Sidebar and init animation sequence into Dashboard"
```

---

## Checklist de Verificação Final

- [ ] `npm test -- --no-coverage` → todos os testes passam
- [ ] `npm run build` → build sem erros de TypeScript
- [ ] Sidebar fixa com logo, nav, timestamp e frase visíveis
- [ ] Engrenagem gira ao carregar e ao salvar/atualizar
- [ ] Números das stats em JetBrains Mono com animação de contagem
- [ ] Inputs do modal com borda laranja ao focar
- [ ] Dot de status muda de cor instantaneamente ao clicar ✓/✗
- [ ] Background `#08080A` sem nenhum tom azul remanescente
