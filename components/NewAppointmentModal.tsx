'use client'

import { useState, useEffect } from 'react'

interface NewAppointmentModalProps {
  onClose: () => void
  onSubmit: (data: { name: string; phone: string; date: string }) => Promise<void>
  isSubmitting?: boolean
}

export default function NewAppointmentModal({
  onClose,
  onSubmit,
  isSubmitting = false,
}: NewAppointmentModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const disabled = isSubmitting || loading

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !disabled) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [disabled, onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !date) return
    setSubmitError(null)
    setLoading(true)
    try {
      await onSubmit({ name: name.trim(), phone: phone.trim(), date })
      onClose()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao salvar agendamento.')
    } finally {
      setLoading(false)
    }
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  const inputStyle = {
    background: '#161619',
    border: '1px solid #1E1E24',
    borderRadius: '6px',
    color: '#F0F0F3',
    outline: 'none',
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = '#F97316'
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = '#1E1E24'
  }

  return (
    <div
      data-testid="modal-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-[480px] mx-4"
        style={{ background: '#0F0F12', border: '1px solid #1E1E24', borderRadius: '6px' }}
      >
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #1E1E24' }}>
          <h2 className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#F0F0F3' }}>
            Novo Agendamento
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#6B6B78' }}>
              Nome do Cliente
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={disabled}
              placeholder="Ex: João Silva"
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoFocus
              className="w-full px-3 py-2.5 text-sm disabled:opacity-50"
              style={inputStyle}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#6B6B78' }}>
              Telefone
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={disabled}
              placeholder="(11) 9xxxx-xxxx"
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full px-3 py-2.5 text-sm disabled:opacity-50"
              style={{ ...inputStyle, fontFamily: 'var(--font-jetbrains), monospace' }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="date" className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#6B6B78' }}>
              Data
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={disabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full px-3 py-2.5 text-sm disabled:opacity-50"
              style={{ ...inputStyle, fontFamily: 'var(--font-jetbrains), monospace' }}
            />
          </div>

          {submitError && (
            <div
              className="rounded px-3 py-2 text-xs"
              style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#DC2626', borderRadius: '6px' }}
            >
              {submitError}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={disabled}
              className="flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ background: '#F97316', color: '#08080A', borderRadius: '6px' }}
            >
              {loading ? 'Salvando...' : 'Salvar Agendamento'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={disabled}
              className="px-5 py-2.5 text-xs transition-colors disabled:opacity-50"
              style={{ background: '#161619', border: '1px solid #1E1E24', color: '#6B6B78', borderRadius: '6px' }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
