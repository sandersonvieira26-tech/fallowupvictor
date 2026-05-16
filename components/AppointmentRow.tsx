import AttendanceToggle from '@/components/AttendanceToggle'
import type { AppointmentData, AppointmentStatus } from '@/app/types'

interface AppointmentRowProps {
  appointment: AppointmentData
  showDate?: boolean
  onStatusChange: (id: string, status: AppointmentStatus) => void
  isUpdating?: boolean
  isNew?: boolean
}

const STATUS_DOT_COLOR: Record<AppointmentStatus, string> = {
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
  const dotColor = STATUS_DOT_COLOR[appointment.status]

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
