'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminPage } from '../../lib/Admin_types'

import AdminSidebar from './components/sidebar'
import AdminSidebarMobile from './components/sidebar-mobile'
import AdminHeader from './components/header'
import VerificationsView from './components/verifications-view'
import AuditLogsView from './components/audit-logs-view'
import SubscriptionView from './components/subscription-view'
import PostsView from './components/posts-view'
import ExportDropdown from './components/ExportDropdown'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<AdminPage>('verifications')
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user') || sessionStorage.getItem('user')
    if (!stored) { router.replace('/login'); return }
    try {
      const user = JSON.parse(stored)
      if (user?.user_type === 'admin') {
        setAuthorized(true)
      } else {
        router.replace('/Dashboard')
      }
    } catch {
      router.replace('/login')
    }
  }, [])

  if (!authorized) return null

  const renderContent = () => {
    switch (currentPage) {
      case 'verifications': return <VerificationsView />
      case 'audit-logs':    return <AuditLogsView />
      case 'subscription':  return <SubscriptionView />
      case 'posts':         return <PostsView />
    }
  }

  return (
    <>
      {}
      <div className="hidden md:flex h-screen bg-[#F3F3F3] overflow-hidden">
        <AdminSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <AdminHeader />
          <div className="flex items-center justify-end px-8 py-2 bg-white border-b border-[#e0e0e0]">
            <ExportDropdown />
          </div>
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>

      {}
      <div className="flex md:hidden" style={{ position: 'static', height: '100vh', overflow: 'hidden' }}>
        <AdminSidebarMobile currentPage={currentPage} onPageChange={setCurrentPage} />
        <div
          style={{
            position: 'fixed',
            top: 0, left: 44, right: 0, bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: '#F3F3F3',
            zIndex: 10,
          }}
        >
          <AdminHeader />
          <div className="flex items-center justify-end px-4 py-2 bg-white border-b border-[#e0e0e0]">
            <ExportDropdown />
          </div>
          <main style={{ flex: 1, overflowY: 'auto' }}>
            {renderContent()}
          </main>
        </div>
      </div>
    </>
  )
}