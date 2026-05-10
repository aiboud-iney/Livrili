'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useLang } from '@/contexts/LanguageContext'

const translations = {
  en: {
    home: 'Home',
    settings: 'Settings',
    dashboard: 'Dashboard',
    profile: 'Profile',
    postShipment: 'Post a Shipment',
    publishRoute: 'Post a Route',
  },
  fr: {
    home: 'Accueil',
    settings: 'Paramètres',
    dashboard: 'Tableau de bord',
    profile: 'Profil',
    postShipment: 'Publier une expédition',
    publishRoute: 'Publier un trajet',
  },
} as const

export default function BottomNav() {
  const router   = useRouter()
  const pathname = usePathname()
  const { lang } = useLang()
  const t = (key: keyof (typeof translations)['en']) => translations[lang]?.[key] ?? key
  const [showPublish, setShowPublish] = useState(false)
  const publishRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => {
    if (typeof window === 'undefined') return false
    return pathname === path || (path === '/feed' && pathname.startsWith('/feed'))
  }

  const ACTIVE_COLOR   = '#7E52FF'
  const INACTIVE_COLOR = '#4D4D4D'

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (publishRef.current && !publishRef.current.contains(e.target as Node)) {
        setShowPublish(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const NAV = [
    { label: t('home'),      path: '/feed',      icon: '/icons/home gray phone.png',       iconActive: '/icons/home-active phone.png'      },
    { label: t('settings'),  path: '/settings',   icon: '/icons/settings gray phone.png',     iconActive: '/icons/settings-active phone.png'  },
    { label: t('dashboard'), path: '/Dashboard', icon: '/icons/dashboard gray phone.png',  iconActive: '/icons/dashboard-active phone.png' },
    { label: t('profile'),   path: '/profile',   icon: '/icons/profile gray phone.png',    iconActive: '/icons/profile-active phone.png'   },
  ]

  return (
    <>
      <style suppressHydrationWarning>{`
        .mob-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 6px;
          font-family: 'Kamerik 105', sans-serif;
          font-size: 10px;
          transition: color 0.15s ease;
          -webkit-tap-highlight-color: transparent;
          flex: 1;
        }
        .mob-nav-item img {
          width: 22px; height: 22px; object-fit: contain;
          transition: transform 0.15s ease;
        }
        .mob-nav-item:active img { transform: scale(0.88); }
        .mob-nav-item .active-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: #7E52FF; margin-bottom: 2px;
        }
        .mob-fab {
          width: 52px; height: 52px; border-radius: 50%;
          background: #7C3AED; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(124,58,237,0.4);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          flex-shrink: 0;
          margin-bottom: 10px;
          -webkit-tap-highlight-color: transparent;
        }
        .mob-fab:active { transform: scale(0.93); box-shadow: 0 2px 8px rgba(124,58,237,0.3); }
      `}</style>

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          backgroundColor: 'white',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          zIndex: 40,
          paddingLeft: 44,
          paddingRight: 8,
          paddingBottom: 6,
          paddingTop: 4,
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>

          <button className="mob-nav-item" aria-label="Home" onClick={() => router.push('/feed')}
            style={{ color: isActive('/feed') ? ACTIVE_COLOR : INACTIVE_COLOR, fontWeight: isActive('/feed') ? 700 : 500 }}>
            <img src={isActive('/feed') ? NAV[0].iconActive : NAV[0].icon} alt="Home" />
            <span>{NAV[0].label}</span>
          </button>

          <button className="mob-nav-item" aria-label="Settings" onClick={() => router.push('/settings')}
            style={{ color: isActive('/settings') ? ACTIVE_COLOR : INACTIVE_COLOR, fontWeight: isActive('/settings') ? 700 : 500 }}>
            <img src={isActive('/support') ? NAV[1].iconActive : NAV[1].icon} alt="Settings" />
            <span>{NAV[1].label}</span>
          </button>

          <div ref={publishRef} style={{ position: 'relative' }}>
            <button
              className="mob-fab"
              aria-label="New shipment"
              onClick={() => setShowPublish(prev => !prev)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
            {showPublish && (
              <div style={{
                position: 'fixed',
                bottom: '90px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                minWidth: '200px',
                zIndex: 100,
              }}>
                <button
                  onClick={() => { router.push('/post-shipment'); setShowPublish(false) }}
                  style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#111', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f4f0ff')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7C3AED', flexShrink: 0 }} />
                  {t('postShipment')}
                </button>
                <button
                  onClick={() => { router.push('/post-route'); setShowPublish(false) }}
                  style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#111', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0fff0')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#B8FF00', flexShrink: 0 }} />
                  {t('publishRoute')}
                </button>
              </div>
            )}
          </div>

          <button className="mob-nav-item" aria-label="Dashboard" onClick={() => router.push('/Dashboard')}
            style={{ color: isActive('/Dashboard') ? ACTIVE_COLOR : INACTIVE_COLOR, fontWeight: isActive('/Dashboard') ? 700 : 500 }}>
            <img src={isActive('/dashboard') ? NAV[2].iconActive : NAV[2].icon} alt="Dashboard" />
            <span>{NAV[2].label}</span>
          </button>

          <button className="mob-nav-item" aria-label="Profile" onClick={() => router.push('/profile')}
            style={{ color: isActive('/profile') ? ACTIVE_COLOR : INACTIVE_COLOR, fontWeight: isActive('/profile') ? 700 : 500 }}>
            <img src={isActive('/profile') ? NAV[3].iconActive : NAV[3].icon} alt="Profile" />
            <span>{NAV[3].label}</span>
          </button>

        </div>
      </div>

      <div style={{ height: 80 }} />
    </>
  )
}
