'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { ClientWithAppointments } from '@/app/types'

interface ClientsTabProps {
  clients: ClientWithAppointments[]
  onDeleteClient: (id: string) => Promise<void>
  deletingId: string | null
}

export default function ClientsTab({ clients, onDeleteClient, deletingId }: ClientsTabProps) {
  const [search, setSearch] = useState('')
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  const filtered = search.trim()
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search)
      )
    : clients

  if (clients.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm" style={{ color: '#2E2E36' }}>
          Nenhum cliente cadastrado
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
          {filtered.map((client, i) => (
            <div
              key={client.id}
              className="flex items-center gap-4 px-4 py-3 transition-colors"
              style={{
                background: '#0F0F12',
                borderBottom: i < filtered.length - 1 ? '1px solid #1E1E24' : 'none',
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium" style={{ color: '#F0F0F3' }}>
                    {client.name}
                  </p>
                  {client.isNew && (
                    <span
                      className="shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
                      style={{ color: '#F59E0B', border: '1px solid #F59E0B', borderRadius: '4px' }}
                    >
                      NOVO
                    </span>
                  )}
                </div>
                <p
                  className="text-[11px]"
                  style={{ fontFamily: 'var(--font-jetbrains), monospace', color: '#6B6B78' }}
                >
                  {client.phone}
                </p>
              </div>

              <span
                className="text-[11px] shrink-0"
                style={{ fontFamily: 'var(--font-jetbrains), monospace', color: '#2E2E36' }}
              >
                {client.appointments.length} consulta{client.appointments.length !== 1 ? 's' : ''}
              </span>

              {confirmingId === client.id ? (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setConfirmingId(null)
                      onDeleteClient(client.id)
                    }}
                    disabled={deletingId === client.id}
                    className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest transition-opacity hover:opacity-80 disabled:opacity-50"
                    style={{ background: '#DC2626', color: '#fff', borderRadius: '4px' }}
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => setConfirmingId(null)}
                    className="px-2 py-1 text-[10px] uppercase tracking-widest transition-opacity hover:opacity-80"
                    style={{
                      background: '#161619',
                      border: '1px solid #1E1E24',
                      color: '#6B6B78',
                      borderRadius: '4px',
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmingId(client.id)}
                  disabled={deletingId === client.id}
                  className="shrink-0 flex items-center justify-center transition-colors hover:opacity-80 disabled:opacity-50"
                  style={{
                    width: '28px',
                    height: '28px',
                    background: '#161619',
                    border: '1px solid #1E1E24',
                    borderRadius: '4px',
                    color: '#6B6B78',
                  }}
                  aria-label="Excluir cliente"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
