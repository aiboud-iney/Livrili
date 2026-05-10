'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'

interface SidebarProps {
  currentPage: 'dashboard' | 'trucks' | 'routes' | 'shipments' | 'subscriptions' | 'settings'
  onPageChange: (page: 'dashboard' | 'trucks' | 'routes' | 'shipments' | 'subscriptions' | 'settings') => void
}

const menuItems = [
  { id: 'shipments', labelKey: 'myShipments', iconPath: '/icons/shipments sidebar.png', activeIconPath: '/icons/shipments sidebar active.png' },
  { id: 'routes',    labelKey: 'myRoutes',    iconPath: '/icons/route sidebar.png',     activeIconPath: '/icons/route sidebar active.png'     },
  { id: 'trucks',    labelKey: 'myTrucks',    iconPath: '/icons/trucks sidebar.png',    activeIconPath: '/icons/trucks sidebar active.png'    },
  { id: 'localisation', labelKey: 'myRouteMap', iconPath: '/icons/route map.png', activeIconPath: '/icons/route map active.png' },
  { id: 'subscriptions', labelKey: 'subscriptions', iconPath: '', activeIconPath: '' },
]

const SettingsIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke={active ? "#1a1a1a" : "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.4 15.05L18.3 15.65C18.1 15.75 17.9 15.75 17.7 15.65L16.7 15.05C16.2 14.75 15.9 14.25 15.9 13.65V11.35C15.9 10.75 16.2 10.25 16.7 9.95L17.7 9.35C17.9 9.25 18.1 9.25 18.3 9.35L19.4 9.95C19.9 10.25 20.1 10.85 19.9 11.45L19.4 12.55C19.3 12.85 19.3 13.15 19.4 13.45L19.9 14.55C20.1 15.15 19.9 15.75 19.4 16.05V15.05Z" stroke={active ? "#1a1a1a" : "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.6 15.05L5.7 15.65C5.9 15.75 6.1 15.75 6.3 15.65L7.3 15.05C7.8 14.75 8.1 14.25 8.1 13.65V11.35C8.1 10.75 7.8 10.25 7.3 9.95L6.3 9.35C6.1 9.25 5.9 9.25 5.7 9.35L4.6 9.95C4.1 10.25 3.9 10.85 4.1 11.45L4.6 12.55C4.7 12.85 4.7 13.15 4.6 13.45L4.1 14.55C3.9 15.15 4.1 15.75 4.6 16.05V15.05Z" stroke={active ? "#1a1a1a" : "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.4 17.15L11.6 17.75C11.8 17.85 12.2 17.85 12.4 17.75L13.6 17.15C14.1 14.85 14.1 9.15 12.4 6.85L11.6 6.25C11.4 6.15 11.2 6.15 11 6.25L9.8 6.85C9.3 7.15 9 7.65 9 8.25V15.75C9 16.35 9.3 16.85 9.8 17.15H10.4Z" stroke={active ? "#1a1a1a" : "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SubscriptionIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z"
      stroke={active ? "#1a1a1a" : "white"}
      strokeWidth="1.5"
      fill={active ? "#B8FF00" : "none"}
    />
  </svg>
);

export default function SidebarMobile({ currentPage, onPageChange }: SidebarProps) {
  const { t } = useLang()
  const router = useRouter()
  const { logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handlePageChange = (page: 'dashboard' | 'trucks' | 'routes' | 'shipments' | 'subscriptions' | 'settings') => {
    onPageChange(page)
    setDrawerOpen(false)
  }

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes drawerSlideIn {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        .mob-sidebar-drawer { animation: drawerSlideIn 0.28s cubic-bezier(0.4,0,0.2,1) both; }
        .sidebar-nav-item {
          display: flex; align-items: center; gap: 14px;
          padding: 11px 16px; border-radius: 12px;
          background: transparent; border: none;
          color: rgba(255,255,255,0.85); cursor: pointer; width: 100%;
          font-size: 14px; font-weight: 500;
          transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
          text-align: left;
        }
        .sidebar-nav-item:hover { background: rgba(255,255,255,0.13); color: #fff; transform: translateX(4px); }
        .sidebar-nav-item.active { background: #B8FF00; color: #1a1a1a; font-weight: 700; }
        .sidebar-nav-item img { flex-shrink: 0; width: 22px; height: 22px; min-width: 22px; object-fit: contain; }
        .sidebar-bottom-item {
          display: flex; align-items: center; gap: 14px;
          padding: 10px 16px; border-radius: 12px;
          background: transparent; border: none;
          color: rgba(255,255,255,0.7); cursor: pointer; width: 100%;
          font-size: 14px; font-weight: 500;
          transition: background 0.18s ease, color 0.18s ease;
          text-align: left;
        }
        .sidebar-bottom-item:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.9); }
        .sidebar-bottom-item img { flex-shrink: 0; width: 20px; height: 20px; object-fit: contain; }
        .sidebar-logout-btn {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 12px 16px; border-radius: 14px;
          background: rgba(255,255,255,0.12); border: none; color: white;
          cursor: pointer; font-size: 14px; font-weight: 700;
        }
        .sidebar-logout-btn img { width: 20px; height: 20px; flex-shrink: 0; object-fit: contain; }
        .sidebar-divider { height: 1px; background: rgba(255,255,255,0.15); margin: 12px 8px; }
      `}</style>

      {}
      <div style={{ position: 'fixed', top: 0, left: 0, width: 44, height: '100dvh', background: '#7E52FF', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0 16px', zIndex: 50, overflowY: 'auto' }}>
        <button onClick={() => setDrawerOpen(true)} style={{ marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#B8FF00', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/icons/logo green.png" alt="Livrili" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </button>

        {menuItems.map((item) => (
          <button key={item.id} onClick={() => { if (item.id === 'localisation') router.push('/localisation'); else onPageChange(item.id as any) }} title={t(item.labelKey)}
            style={{ width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: currentPage === item.id ? '#B8FF00' : 'transparent', transition: 'background 0.18s ease', flexShrink: 0 }}>
            {item.id === 'subscriptions' ? (
              <SubscriptionIcon active={currentPage === item.id} />
            ) : (
              <img src={currentPage === item.id ? item.activeIconPath : item.iconPath} alt={t(item.labelKey)} style={{ width: 20, height: 20, objectFit: 'contain' }} />
            )}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        {}
        <button onClick={() => onPageChange('settings')} title={t('settings')}
          style={{ width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: currentPage === 'settings' ? '#B8FF00' : 'transparent', transition: 'background 0.18s ease', flexShrink: 0 }}>
          <SettingsIcon active={currentPage === 'settings'} />
        </button>

        {[
          { src: '/icons/feedback sidebar.png', labelKey: 'giveFeedback', path: '/feedback' },
          { src: '/icons/help sidebar.png',     labelKey: 'help', path: '/help' },
        ].map((btn) => (
          <button key={btn.labelKey} onClick={() => router.push(btn.path)} title={t(btn.labelKey)} style={{ width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', transition: 'background 0.18s ease', flexShrink: 0 }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <img src={btn.src} alt={t(btn.labelKey)} style={{ width: 20, height: 20, objectFit: 'contain' }} />
          </button>
        ))}
        <button onClick={logout} title={t('logout')} style={{ width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.12)', flexShrink: 0 }}>
          <img src="/icons/logout.png" alt={t('logout')} style={{ width: 18, height: 18, objectFit: 'contain' }} />
        </button>
      </div>

      {}
      {drawerOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
          <div className="mob-sidebar-drawer" style={{ width: 260, height: '100%', background: '#7E52FF', display: 'flex', flexDirection: 'column', padding: '20px 12px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, paddingLeft: 4 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#B8FF00', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/icons/logo green.png" alt="Livrili" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#1a1a1a' }}>Livrili</span>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', paddingLeft: 12, marginBottom: 6 }}>
                {t('dashboard').toUpperCase()}
              </span>
              {menuItems.map((item) => (
                <button key={item.id} onClick={() => { if (item.id === 'localisation') { router.push('/localisation'); setDrawerOpen(false) } else handlePageChange(item.id as any) }} className={`sidebar-nav-item${currentPage === item.id ? ' active' : ''}`}>
                  {item.id === 'subscriptions' ? (
                    <SubscriptionIcon active={currentPage === item.id} />
                  ) : (
                    <img src={currentPage === item.id ? item.activeIconPath : item.iconPath} alt={t(item.labelKey)} />
                  )}
                  <span>{t(item.labelKey)}</span>
                </button>
              ))}
            </nav>

            <div>
              <div className="sidebar-divider" />
              <button onClick={() => { router.push('/feedback'); setDrawerOpen(false) }} className="sidebar-bottom-item"><img src="/icons/feedback sidebar.png" alt="Feedback" /><span>{t('giveFeedback')}</span></button>
              <button onClick={() => { router.push('/help'); setDrawerOpen(false) }} className="sidebar-bottom-item"><img src="/icons/help sidebar.png" alt="Help" /><span>{t('help')}</span></button>
              <button onClick={() => handlePageChange('settings')} className={`sidebar-bottom-item ${currentPage === 'settings' ? 'active' : ''}`}>
                <SettingsIcon active={currentPage === 'settings'} />
                <span>{t('settings')}</span>
              </button>
              <div style={{ height: 8 }} />
              <button onClick={logout} className="sidebar-logout-btn"><img src="/icons/logout.png" alt="Logout" /><span>{t('logout')}</span></button>
            </div>
          </div>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)' }} onClick={() => setDrawerOpen(false)} />
        </div>
      )}
    </>
  )
}