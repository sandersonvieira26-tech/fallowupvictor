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
