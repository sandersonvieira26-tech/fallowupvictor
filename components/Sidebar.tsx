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
      className="hidden md:flex h-screen w-60 shrink-0 flex-col"
      style={{ background: '#0F0F12', borderRight: '1px solid #1E1E24' }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid #1E1E24' }}>
        <Logo spinCount={spinCount} />
      </div>

      {/* Navigation */}
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

      {/* Footer */}
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
