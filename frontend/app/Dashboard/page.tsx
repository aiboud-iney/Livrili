'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import Sidebar from './components/sidebar'
import Header from './components/header'
import DashboardOverview from './components/dashboard-overview'
import MyShipments from './components/my-shipments'
import MyRoutes from './components/my-routes'
import MyTrucks from './components/my-trucks'
import SubscriptionsContent from './components/SubscriptionsContent'
import Parametres from './components/parametres'

import SidebarMobile from './components/sidebar-mobile'
import HeaderMobile from './components/header-mobile'
import BottomNav from './components/bottom-nav'
import DashboardOverviewMobile from './components/dashboard-overview-mobile'
import MyShipmentsMobile from './components/my-shipments-mobile'
import MyRoutesMobile from './components/my-routes-mobile'
import MyTrucksMobile from './components/my-trucks-mobile'

type Page = 'dashboard' | 'trucks' | 'routes' | 'shipments' | 'subscriptions' | 'settings'

export default function Home() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [visible, setVisible] = useState(false)
  const [userId, setUserId] = useState<number>(0)

  useEffect(() => {
    setVisible(true)
    const stored = localStorage.getItem('user') || sessionStorage.getItem('user')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed?.id) setUserId(Number(parsed.id))

        if (parsed?.user_type === 'admin') {
          router.replace('/Admin-Dashboard')
          return
        }
      } catch {}
    }
  }, [router])

  const renderDesktopContent = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardOverview />
      case 'shipments': return <MyShipments />
      case 'routes':    return <MyRoutes />
      case 'trucks':    return <MyTrucks />
      case 'subscriptions': return <SubscriptionsContent />
      case 'settings':  return <Parametres />
      default:          return <DashboardOverview />
    }
  }

  const renderMobileContent = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardOverviewMobile />
      case 'shipments': return <MyShipmentsMobile />
      case 'routes':    return <MyRoutesMobile />
      case 'trucks':    return <MyTrucksMobile />
      case 'subscriptions': return <SubscriptionsContent />
      case 'settings':  return <Parametres />
      default:          return <DashboardOverviewMobile />
    }
  }

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease"
      }}
    >
      <>

        <div className="hidden md:flex h-screen bg-[#f8f8f8] overflow-hidden">
          <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto">
              {renderDesktopContent()}
            </main>
          </div>
        </div>

        {}
        <div className="flex md:hidden" style={{ position: 'static', height: '100vh', overflow: 'hidden' }}>

          {}
          <SidebarMobile currentPage={currentPage} onPageChange={setCurrentPage} />

          {}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 44,
              right: 0,
              bottom: 80,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              background: '#f8f8f8',
              zIndex: 10,
            }}
          >
            <HeaderMobile />
            <main style={{ flex: 1, overflowY: 'auto' }}>
              {renderMobileContent()}
            </main>
          </div>

          {}
          <BottomNav />
        </div>
      </>
    </div>
  )
}