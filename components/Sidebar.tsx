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
      style={{
        background: 'rgba(15,15,18,0.82)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(249,115,22,0.12)',
        boxShadow: '4px 0 40px rgba(249,115,22,0.04)',
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-5 relative overflow-hidden"
        style={{ borderBottom: '1px solid rgba(249,115,22,0.12)' }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 100% at 10% 50%, rgba(249,115,22,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
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
              className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm transition-all duration-200"
              style={{
                background: active
                  ? 'linear-gradient(90deg, rgba(249,115,22,0.2) 0%, rgba(249,115,22,0.05) 100%)'
                  : 'transparent',
                borderLeft: active ? '2px solid #F97316' : '2px solid transparent',
                color: active ? '#F0F0F3' : '#6B6B78',
                borderRadius: '6px',
                fontWeight: active ? 500 : 400,
                boxShadow: active ? 'inset 0 0 20px rgba(249,115,22,0.06)' : 'none',
              }}
            >
              <span style={active ? { filter: 'drop-shadow(0 0 5px rgba(249,115,22,0.7))' } : {}}>
                <Icon size={15} strokeWidth={active ? 2 : 1.5} />
              </span>
              {label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4 flex flex-col gap-1.5"
        style={{ borderTop: '1px solid rgba(249,115,22,0.1)' }}
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full pulse-dot" style={{ background: '#16A34A', boxShadow: '0 0 6px rgba(22,163,74,0.5)' }} />
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
