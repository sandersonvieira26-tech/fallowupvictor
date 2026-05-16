import type { ClientWithAppointments } from '@/app/types'

interface ClientsTabProps {
  clients: ClientWithAppointments[]
}

export default function ClientsTab({ clients }: ClientsTabProps) {
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
    <div style={{ border: '1px solid #1E1E24', borderRadius: '6px', overflow: 'hidden' }}>
      {clients.map((client, i) => (
        <div
          key={client.id}
          className="flex items-center gap-4 px-4 py-3 transition-colors"
          style={{
            background: '#0F0F12',
            borderBottom: i < clients.length - 1 ? '1px solid #1E1E24' : 'none',
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
        </div>
      ))}
    </div>
  )
}
