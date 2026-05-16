'use client'

import { useState, useEffect, useCallback } from 'react'
import Sidebar from '@/components/Sidebar'
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

function formatHeaderDate(): string {
  return new Date()
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase()
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('hoje')
  const [todayAppointments, setTodayAppointments] = useState<AppointmentData[]>([])
  const [weekAppointments, setWeekAppointments] = useState<AppointmentData[]>([])
  const [noShowAppointments, setNoShowAppointments] = useState<AppointmentData[]>([])
  const [clients, setClients] = useState<ClientWithAppointments[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [spinCount, setSpinCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  const fetchData = useCallback(async (triggerGear = false) => {
    setFetchError(null)
    try {
      const [todayRes, weekRes, noShowRes, clientsRes] = await Promise.all([
        fetch('/api/appointments?mode=day'),
        fetch('/api/appointments?mode=week'),
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
    setTimeout(() => {
      setMounted(true)
      setSpinCount(1)
      fetchData()
    }, 150)
  }, [fetchData])

  async function handleStatusChange(id: string, status: AppointmentStatus) {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      await fetchData(res.ok)
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
      await fetchData(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const todayAttended = todayAppointments.filter((a) => a.status === 'attended').length
  const todayNoShows = todayAppointments.filter((a) => a.status === 'no-show').length
  const todayNewClients = todayAppointments.filter((a) => a.client.isNew).length

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: '#08080A',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 200ms ease',
      }}
    >
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} spinCount={spinCount} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Section header */}
        <div
          className="flex items-center px-6 py-3.5"
          style={{ borderBottom: '1px solid #1E1E24' }}
        >
          <h1
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: '#F0F0F3' }}
          >
            {TAB_TITLES[activeTab]} — {formatHeaderDate()}
          </h1>
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
        <main className="flex-1 overflow-y-auto p-6">
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
          {activeTab === 'clientes' && <ClientsTab clients={clients} />}
          {activeTab === 'faltas' && (
            <NoShowsTab
              appointments={noShowAppointments}
              onStatusChange={handleStatusChange}
              updatingId={updatingId}
            />
          )}
        </main>
      </div>

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
