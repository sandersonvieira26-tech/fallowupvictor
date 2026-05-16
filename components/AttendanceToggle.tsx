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
