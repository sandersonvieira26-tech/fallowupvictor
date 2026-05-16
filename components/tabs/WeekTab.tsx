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
      {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([dateKey, appts]) => (
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
