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
