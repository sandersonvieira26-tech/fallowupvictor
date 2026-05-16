'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import BottomNav from '@/components/BottomNav'
import Logo from '@/components/Logo'
import StatsBar from '@/components/StatsBar'
import NewAppointmentModal from '@/components/NewAppointmentModal'
import TodayTab from '@/components/tabs/TodayTab'
import WeekTab from '@/components/tabs/WeekTab'
import ClientsTab from '@/components/tabs/ClientsTab'
import NoShowsTab from '@/components/tabs/NoShowsTab'
import type { AppointmentData, AppointmentStatus, ClientWithAppointments } from '@/app/types'

type Tab = 'hoje' | 'semana' | 'clientes' | 'faltas'

const TAB_TITLES: Record<Tab, string> = {
  hoje: 'Hoje',
  semana: 'Semana',
  clientes: 'Clientes',
  faltas: 'Faltas',
}

function localDateISO(): string {
  const d = new Date()
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

function offsetDate(isoDate: string, days: number): string {
  const d = new Date(isoDate + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().split('T')[0]
}

function formatDateLabel(isoDate: string): string {
  return new Date(isoDate + 'T00:00:00Z')
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
    .toUpperCase()
}

function formatWeekLabel(isoDate: string): string {
  const start = new Date(isoDate + 'T00:00:00Z')
  const end = new Date(isoDate + 'T00:00:00Z')
  end.setUTCDate(end.getUTCDate() + 6)
  const s = start.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' }).toUpperCase()
  const e = end.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).toUpperCase()
  return `${s} – ${e}`
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('hoje')
  const [todayDate, setTodayDate] = useState(localDateISO)
  const [weekDate, setWeekDate] = useState(localDateISO)
  const [todayAppointments, setTodayAppointments] = useState<AppointmentData[]>([])
  const [weekAppointments, setWeekAppointments] = useState<AppointmentData[]>([])
  const [noShowAppointments, setNoShowAppointments] = useState<AppointmentData[]>([])
  const [clients, setClients] = useState<ClientWithAppointments[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [spinCount, setSpinCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  const fetchData = useCallback(async (
    tDate: string,
    wDate: string,
    triggerGear = false
  ) => {
    setFetchError(null)
    try {
      const [todayRes, weekRes, noShowRes, clientsRes] = await Promise.all([
        fetch(`/api/appointments?mode=day&date=${tDate}`),
        fetch(`/api/appointments?mode=week&date=${wDate}`),
        fetch('/api/appointments?mode=no-shows'),
        fetch('/api/clients'),
      ])
      const [today, week, noShows, clientsData] = await Promise.all([
        todayRes.json(),
        weekRes.json(),
        noShowRes.json(),
        clientsRes.json(),
      ])
      setTodayAppointments(Array.isArray(today) ? today : [])
      setWeekAppointments(Array.isArray(week) ? week : [])
      setNoShowAppointments(Array.isArray(noShows) ? noShows : [])
      setClients(Array.isArray(clientsData) ? clientsData : [])
      if (triggerGear) setSpinCount((c) => c + 1)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setFetchError('Falha ao carregar dados.')
    }
  }, [])

  useEffect(() => {
    const init = localDateISO()
    const t = setTimeout(() => {
      setMounted(true)
      setSpinCount(1)
      fetchData(init, init)
    }, 150)
    return () => clearTimeout(t)
  }, [fetchData])

  function navigateToday(delta: number) {
    const newDate = offsetDate(todayDate, delta)
    setTodayDate(newDate)
    fetchData(newDate, weekDate)
  }

  function navigateWeek(delta: number) {
    const newDate = offsetDate(weekDate, delta * 7)
    setWeekDate(newDate)
    fetchData(todayDate, newDate)
  }

  async function handleStatusChange(id: string, status: AppointmentStatus) {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        setFetchError('Erro ao atualizar status.')
        return
      }
      await fetchData(todayDate, weekDate, true)
    } catch (err) {
      console.error('handleStatusChange error:', err)
      setFetchError('Erro ao atualizar status.')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleCreateAppointment(data: { name: string; phone: string; date: string }) {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create appointment')
      await fetchData(todayDate, weekDate, true)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteClient(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        setFetchError('Erro ao excluir cliente.')
        return
      }
      await fetchData(todayDate, weekDate, true)
    } catch (err) {
      console.error('handleDeleteClient error:', err)
      setFetchError('Erro ao excluir cliente.')
    } finally {
      setDeletingId(null)
    }
  }

  const todayAttended = todayAppointments.filter((a) => a.status === 'attended').length
  const todayNoShows = todayAppointments.filter((a) => a.status === 'no-show').length
  const todayNewClients = todayAppointments.filter((a) => a.client.isNew).length

  function renderHeaderTitle() {
    if (activeTab === 'hoje') return `HOJE — ${formatDateLabel(todayDate)}`
    if (activeTab === 'semana') return `SEMANA — ${formatWeekLabel(weekDate)}`
    return TAB_TITLES[activeTab].toUpperCase()
  }

  const navArrowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '22px',
    height: '22px',
    background: 'rgba(22,22,25,0.7)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(249,115,22,0.15)',
    borderRadius: '4px',
    color: '#6B6B78',
    cursor: 'pointer',
    transition: 'color 150ms, border-color 150ms',
  } as React.CSSProperties

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 0% 0%, rgba(249,115,22,0.08) 0%, transparent 55%), radial-gradient(ellipse 40% 40% at 100% 100%, rgba(249,115,22,0.04) 0%, transparent 50%), #08080A',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 200ms ease',
      }}
    >
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} spinCount={spinCount} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div
          className="flex md:hidden items-center justify-between px-4 py-3 shrink-0"
          style={{
            borderBottom: '1px solid rgba(249,115,22,0.12)',
            background: 'rgba(8,8,10,0.5)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Logo spinCount={spinCount} />
          <div className="flex items-center gap-1.5">
            {(activeTab === 'hoje' || activeTab === 'semana') && (
              <button
                onClick={() => activeTab === 'hoje' ? navigateToday(-1) : navigateWeek(-1)}
                style={navArrowStyle}
                aria-label="Anterior"
              >
                <ChevronLeft size={13} />
              </button>
            )}
            <span
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: '#F0F0F3', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {renderHeaderTitle()}
            </span>
            {(activeTab === 'hoje' || activeTab === 'semana') && (
              <button
                onClick={() => activeTab === 'hoje' ? navigateToday(1) : navigateWeek(1)}
                style={navArrowStyle}
                aria-label="Próximo"
              >
                <ChevronRight size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Desktop section header */}
        <div
          className="hidden md:flex items-center gap-2 px-6 py-3.5 shrink-0"
          style={{
            borderBottom: '1px solid rgba(249,115,22,0.12)',
            background: 'rgba(8,8,10,0.4)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {(activeTab === 'hoje' || activeTab === 'semana') && (
            <button
              onClick={() => activeTab === 'hoje' ? navigateToday(-1) : navigateWeek(-1)}
              style={navArrowStyle}
              aria-label="Anterior"
            >
              <ChevronLeft size={13} />
            </button>
          )}
          <h1
            className="text-[11px] font-semibold uppercase"
            style={{ color: '#F0F0F3', letterSpacing: '0.22em' }}
          >
            {renderHeaderTitle()}
          </h1>
          {(activeTab === 'hoje' || activeTab === 'semana') && (
            <button
              onClick={() => activeTab === 'hoje' ? navigateToday(1) : navigateWeek(1)}
              style={navArrowStyle}
              aria-label="Próximo"
            >
              <ChevronRight size={13} />
            </button>
          )}
        </div>

        {/* Stats bar */}
        <StatsBar
          total={todayAppointments.length}
          attended={todayAttended}
          noShows={todayNoShows}
          newClients={todayNewClients}
          onNewAppointment={() => setIsModalOpen(true)}
        />

        {/* Error state */}
        {fetchError && (
          <div
            className="mx-6 mt-4 px-4 py-2 text-xs"
            style={{
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              color: '#DC2626',
              borderRadius: '6px',
            }}
          >
            {fetchError}
          </div>
        )}

        {/* Tab content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {activeTab === 'hoje' && (
            <TodayTab
              appointments={todayAppointments}
              onStatusChange={handleStatusChange}
              updatingId={updatingId}
            />
          )}
          {activeTab === 'semana' && (
            <WeekTab
              appointments={weekAppointments}
              onStatusChange={handleStatusChange}
              updatingId={updatingId}
            />
          )}
          {activeTab === 'clientes' && (
            <ClientsTab
              clients={clients}
              onDeleteClient={handleDeleteClient}
              deletingId={deletingId}
            />
          )}
          {activeTab === 'faltas' && (
            <NoShowsTab
              appointments={noShowAppointments}
              onStatusChange={handleStatusChange}
              updatingId={updatingId}
            />
          )}
        </main>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {isModalOpen && (
        <NewAppointmentModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateAppointment}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
