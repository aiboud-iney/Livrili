"use client"

import { forwardRef, useState, useEffect, useCallback } from "react"

interface ApiNotification {
  id: number
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

interface Props {
  show: boolean
  lang: 'en' | 'fr'
  isMobile?: boolean
  // legacy props kept for backward compat — ignored, component fetches its own data
  notifications?: unknown[]
  onMarkAllRead?: () => void
  onClearAll?: () => void
  onAction?: (id: string) => void
  notificationCount?: number
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const translations = {
  en: {
    title: "Notifications",
    markRead: "Mark all read",
    clearAll: "Clear all",
    welcomeTitle: "Welcome to Livrili!",
    welcomeDesc: "You're all set. Start by posting your first shipment or route to connect with transporters across Algeria.",
    postShipment: "Post your first shipment",
    postRoute: "Publish your first route",
    noNotifs: "You have no other notifications",
    new: "NEW",
    viewAll: "View all notifications",
    showLess: "Show less",
  },
  fr: {
    title: "Notifications",
    markRead: "Tout marquer comme lu",
    clearAll: "Tout effacer",
    welcomeTitle: "Bienvenue sur Livrili !",
    welcomeDesc: "Vous êtes prêt. Commencez par publier votre première expédition ou itinéraire pour vous connecter avec des transporteurs.",
    postShipment: "Publier une expédition",
    postRoute: "Publier un itinéraire",
    noNotifs: "Vous n'avez pas d'autres notifications",
    new: "NOUVEAU",
    viewAll: "Voir toutes les notifications",
    showLess: "Afficher moins",
  },
}

const Icons = {
  Warning: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 9V13M12 17H12.01" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 3L2 19H22L12 3Z" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round"/></svg>
  ),
  Success: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="1.5"/><path d="M8 12L11 15L16 9" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  Subscription: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" stroke="#7C3AED" strokeWidth="1.5" fill="none"/></svg>
  ),
  Info: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="1.5"/><path d="M12 8V12M12 16H12.01" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
  Bell: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#9CA3AF" strokeWidth="1.5"/><path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
  ShipmentIcon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4H20V20H4V4Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 7H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><path d="M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><path d="M8 17H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
  RouteIcon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="5" cy="5" r="2" stroke="#1a1a1a" strokeWidth="1.5"/><circle cx="19" cy="19" r="2" stroke="#1a1a1a" strokeWidth="1.5"/><path d="M5 7L5 17C5 18.1046 5.89543 19 7 19H19" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
  ChevronDown: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9L12 15L18 9" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  ChevronUp: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 15L12 9L6 15" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
}

const getIcon = (type: string) => {
  switch (type) {
    case 'warning': return <Icons.Warning />
    case 'success': return <Icons.Success />
    case 'subscription': return <Icons.Subscription />
    default: return <Icons.Info />
  }
}

const getColors = (type: string) => {
  switch (type) {
    case 'warning':      return { bg: '#fefce8', border: '#D97706', button: '#D97706' }
    case 'success':      return { bg: '#f0fdf4', border: '#10B981', button: '#10B981' }
    case 'subscription': return { bg: '#f5f3ff', border: '#7C3AED', button: '#7C3AED' }
    default:             return { bg: '#eff6ff', border: '#3B82F6', button: '#3B82F6' }
  }
}

const formatTime = (dateStr: string) => {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMs / 3600000)
  const days  = Math.floor(diffMs / 86400000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m`
  if (hours < 24) return `${hours}h`
  if (days < 7)   return `${days}d`
  return new Date(dateStr).toLocaleDateString()
}

const MAX_VISIBLE = 3

const NotificationDropdown = forwardRef<HTMLDivElement, Props>(({ show, lang, isMobile }, ref) => {
  const t = translations[lang ?? 'en']
  const [notifications, setNotifications] = useState<ApiNotification[]>([])
  const [showAll, setShowAll] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications`, { headers: getAuthHeaders() })
      if (!res.ok) return
      const data = await res.json()
      setNotifications(data.notifications || [])
    } catch {}
  }, [])

  useEffect(() => {
    if (show) fetchNotifications()
  }, [show, fetchNotifications])

  const handleMarkAllRead = async () => {
    try {
      await fetch(`${API_BASE}/notifications/read-all`, { method: 'PATCH', headers: getAuthHeaders() })
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch {}
  }

  const handleClearAll = async () => {
    try {
      await fetch(`${API_BASE}/notifications`, { method: 'DELETE', headers: getAuthHeaders() })
      setNotifications([])
    } catch {}
  }

  const handleMarkRead = async (id: number) => {
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH', headers: getAuthHeaders() })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch {}
  }

  const unreadCount = notifications.filter(n => !n.is_read).length
  const displayed   = showAll ? notifications : notifications.slice(0, MAX_VISIBLE)
  const hasMore     = notifications.length > MAX_VISIBLE

  return (
    <>
      <style>{`
        @keyframes notif-in {
          from { opacity: 0; transform: ${isMobile ? 'translateX(-50%) translateY(-12px)' : 'translateY(-12px)'}; }
          to   { opacity: 1; transform: ${isMobile ? 'translateX(-50%) translateY(0)' : 'translateY(0)'}; }
        }
        .notif-dropdown-enter { animation: notif-in 0.22s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .notif-badge {
          display: inline-flex; align-items: center; justify-content: center;
          background: #7C3AED; color: white; font-size: 9px; font-weight: 800;
          border-radius: 999px; padding: 2px 7px; letter-spacing: 0.08em;
        }
        .notif-action-btn {
          width: 100%; padding: 11px 16px; border-radius: 12px; cursor: pointer;
          border: none; display: flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 13px; font-weight: 700;
          transition: filter 0.15s ease, transform 0.1s ease;
        }
        .notif-action-btn:active { transform: scale(0.97); }
        .notif-action-btn:hover  { filter: brightness(0.93); }
        .notif-row {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 20px; border-bottom: 1px solid #f3f4f6;
          transition: background 0.15s; cursor: pointer;
        }
        .notif-row:hover { background: #fafafa; }
        .notif-icon-wrap {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
      `}</style>

      <div
        ref={ref}
        style={{
          position: isMobile ? 'fixed' : 'absolute',
          top: isMobile ? '64px' : 'calc(100% + 8px)',
          left: isMobile ? '50%' : 'auto',
          right: isMobile ? 'auto' : '0',
          transform: isMobile ? 'translateX(-50%)' : undefined,
          width: isMobile ? '92vw' : '380px',
          maxWidth: '380px',
          maxHeight: '80vh',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.13)',
          border: '1px solid #ede9fe',
          zIndex: 200,
          opacity: show ? 1 : 0,
          pointerEvents: show ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        className={show ? 'notif-dropdown-enter' : ''}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #f3f4f6',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#111' }}>{t.title}</span>
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: '#7C3AED', fontWeight: 700, padding: '4px 8px', borderRadius: '8px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f3f0ff')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                {t.markRead}
              </button>
            )}
            {notifications.length > 0 && (
              <button onClick={handleClearAll} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: '#EF4444', fontWeight: 700, padding: '4px 8px', borderRadius: '8px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                {t.clearAll}
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '400px' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}><Icons.Bell /></div>
              <span style={{ fontSize: '13px', color: '#9ca3af' }}>No notifications yet</span>
            </div>
          ) : (
            displayed.map(n => {
              const colors = getColors(n.type)
              return (
                <div
                  key={n.id}
                  className="notif-row"
                  style={{ borderLeft: `3px solid ${colors.border}`, background: n.is_read ? 'white' : '#fefce8' }}
                  onClick={() => handleMarkRead(n.id)}
                >
                  <div className="notif-icon-wrap" style={{ background: colors.bg }}>
                    {getIcon(n.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>{n.title}</span>
                      <span style={{ fontSize: '11px', color: '#9ca3af', flexShrink: 0, marginLeft: '8px' }}>{formatTime(n.created_at)}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{n.message}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Show more / less */}
        {hasMore && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid #f3f4f6', textAlign: 'center', background: '#fafafa' }}>
            <button
              onClick={() => setShowAll(!showAll)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#7C3AED', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}
            >
              {showAll ? t.showLess : t.viewAll}
              {showAll ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
            </button>
          </div>
        )}

        {/* Empty state actions */}
        {notifications.length === 0 && (
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #f3f4f6' }}>
            <button className="notif-action-btn" onClick={() => { window.location.href = '/post-shipment' }} style={{ backgroundColor: '#7C3AED', color: 'white' }}>
              <Icons.ShipmentIcon />{t.postShipment}
            </button>
            <button className="notif-action-btn" onClick={() => { window.location.href = '/post-route' }} style={{ backgroundColor: '#B8FF00', color: '#111' }}>
              <Icons.RouteIcon />{t.postRoute}
            </button>
          </div>
        )}
      </div>
    </>
  )
})

NotificationDropdown.displayName = 'NotificationDropdown'
export default NotificationDropdown
