'use client'

import { useState } from 'react'
import AppointmentRow from '@/components/AppointmentRow'
import type { AppointmentData, AppointmentStatus } from '@/app/types'

interface NoShowsTabProps {
  appointments: AppointmentData[]
  onStatusChange: (id: string, status: AppointmentStatus) => void
  updatingId: string | null
}

export default function NoShowsTab({ appointments, onStatusChange, updatingId }: NoShowsTabProps) {
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? appointments.filter(
        (a) =>
          a.client.name.toLowerCase().includes(search.toLowerCase()) ||
          a.client.phone.includes(search)
      )
    : appointments

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
    <div className="flex flex-col gap-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nome ou telefone..."
        className="w-full px-3 py-2.5 text-sm"
        style={{
          background: '#161619',
          border: '1px solid #1E1E24',
          borderRadius: '6px',
          color: '#F0F0F3',
          outline: 'none',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#F97316')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#1E1E24')}
      />

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-sm" style={{ color: '#2E2E36' }}>
            Nenhum resultado para &quot;{search}&quot;
          </p>
        </div>
      ) : (
        <div style={{ border: '1px solid #1E1E24', borderRadius: '6px', overflow: 'hidden' }}>
          {filtered.map((appt) => (
            <AppointmentRow
              key={appt.id}
              appointment={appt}
              showDate
              onStatusChange={onStatusChange}
              isUpdating={updatingId === appt.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
