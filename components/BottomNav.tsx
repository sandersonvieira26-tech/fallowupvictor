'use client'

import { Calendar, CalendarDays, Users, AlertCircle } from 'lucide-react'

type Tab = 'hoje' | 'semana' | 'clientes' | 'faltas'

const NAV_ITEMS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'hoje', label: 'Hoje', Icon: Calendar },
  { id: 'semana', label: 'Semana', Icon: CalendarDays },
  { id: 'clientes', label: 'Clientes', Icon: Users },
  { id: 'faltas', label: 'Faltas', Icon: AlertCircle },
]

interface BottomNavProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="flex md:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: 'rgba(15,15,18,0.9)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(249,115,22,0.12)',
      }}
    >
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const active = activeTab === id
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex flex-1 flex-col items-center justify-center py-2.5 gap-1 transition-colors"
            style={{ color: active ? '#F97316' : '#6B6B78' }}
          >
            <Icon size={20} strokeWidth={active ? 2 : 1.5} />
            <span
              className="text-[9px] font-semibold uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
