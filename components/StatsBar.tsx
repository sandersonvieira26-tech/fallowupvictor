'use client'

import { Calendar, UserCheck, UserX, UserPlus } from 'lucide-react'
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
  icon,
  total,
  showProgress = false,
}: {
  target: number
  label: string
  color: string
  icon: React.ReactNode
  total?: number
  showProgress?: boolean
}) {
  const value = useCountUp(target)
  const pct = showProgress && total && total > 0 ? Math.round((value / total) * 100) : null

  return (
    <div
      className="flex flex-col px-4 py-3 relative"
      style={{
        background: '#0F0F12',
        borderLeft: '1px solid #1E1E24',
        borderRight: '1px solid #1E1E24',
        borderBottom: '1px solid #1E1E24',
        borderTop: `2px solid ${color}`,
        borderRadius: '6px',
      }}
    >
      <div className="absolute top-2.5 right-3" style={{ color: '#2E2E36' }}>
        {icon}
      </div>

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

      {showProgress && pct !== null && (
        <div className="mt-2.5 flex items-center gap-2">
          <div className="flex-1 h-[3px]" style={{ background: '#1E1E24', borderRadius: '2px' }}>
            <div
              style={{
                width: `${pct}%`,
                height: '100%',
                background: color,
                borderRadius: '2px',
                transition: 'width 600ms ease-out',
              }}
            />
          </div>
          <span
            className="text-[10px] tabular-nums shrink-0"
            style={{ fontFamily: 'var(--font-jetbrains), monospace', color: '#6B6B78' }}
          >
            {pct}%
          </span>
        </div>
      )}
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
      className="px-4 md:px-6 py-3 md:py-4 shrink-0"
      style={{ borderBottom: '1px solid #1E1E24' }}
    >
      {/* Stats: 2x2 grid on mobile, flex row on desktop */}
      <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center md:gap-3">
        <StatCard
          target={total}
          label="Hoje"
          color="#F0F0F3"
          icon={<Calendar size={13} />}
        />
        <StatCard
          target={attended}
          label="Compareceram"
          color="#16A34A"
          icon={<UserCheck size={13} />}
          total={total}
          showProgress
        />
        <StatCard
          target={noShows}
          label="Faltaram"
          color="#DC2626"
          icon={<UserX size={13} />}
          total={total}
          showProgress
        />
        <StatCard
          target={newClients}
          label="Novos Clientes"
          color="#F59E0B"
          icon={<UserPlus size={13} />}
        />

        {/* Desktop button — inside flex row for ml-auto */}
        <button
          onClick={onNewAppointment}
          className="hidden md:block ml-auto px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
          style={{ background: '#F97316', color: '#08080A', borderRadius: '6px' }}
        >
          + Novo Agendamento
        </button>
      </div>

      {/* Mobile button — full width below grid */}
      <button
        onClick={onNewAppointment}
        className="md:hidden mt-3 w-full py-2.5 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-80 active:opacity-60"
        style={{ background: '#F97316', color: '#08080A', borderRadius: '6px' }}
      >
        + Novo Agendamento
      </button>
    </div>
  )
}
