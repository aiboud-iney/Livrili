"use client"

import { forwardRef, useState, useMemo } from "react"

interface Notification {
  id: string
  type: "warning" | "success" | "subscription" | "info"
  title: string
  description: string
  timestamp: Date
  read: boolean
  actionLabel?: string
  details?: Record<string, string>
}

interface Props {
  show: boolean
  lang: 'en' | 'fr'
  isMobile?: boolean
  notifications?: Notification[]
  onMarkAllRead?: () => void
  onClearAll?: () => void
  onAction?: (notificationId: string) => void
  notificationCount?: number
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 9V13M12 17H12.01" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 3L2 19H22L12 3Z" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  Success: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="1.5"/>
      <path d="M8 12L11 15L16 9" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Subscription: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" stroke="#7C3AED" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  Info: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="1.5"/>
      <path d="M12 8V12M12 16H12.01" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Bell: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#9CA3AF" strokeWidth="1.5"/>
      <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  ShipmentIcon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4H20V20H4V4Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8 7H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 17H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  RouteIcon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5" cy="5" r="2" stroke="#1a1a1a" strokeWidth="1.5"/>
      <circle cx="19" cy="19" r="2" stroke="#1a1a1a" strokeWidth="1.5"/>
      <path d="M5 7L5 17C5 18.1046 5.89543 19 7 19H19" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9L12 15L18 9" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ChevronUp: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 15L12 9L6 15" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "warning": return <Icons.Warning />
    case "success": return <Icons.Success />
    case "subscription": return <Icons.Subscription />
    case "info": return <Icons.Info />
    default: return <Icons.Info />
  }
}

const getNotificationColors = (type: string) => {
  switch (type) {
    case "warning": return { bg: "bg-yellow-50", border: "border-l-yellow-500", button: "#D97706" }
    case "success": return { bg: "bg-green-50", border: "border-l-green-500", button: "#10B981" }
    case "subscription": return { bg: "bg-purple-50", border: "border-l-purple-500", button: "#7C3AED" }
    case "info": return { bg: "bg-blue-50", border: "border-l-blue-500", button: "#3B82F6" }
    default: return { bg: "bg-gray-50", border: "border-l-gray-500", button: "#6B7280" }
  }
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return new Date(date).toLocaleDateString()
}

const NotificationDropdown = forwardRef<HTMLDivElement, Props>(({
  show,
  lang,
  isMobile,
  notifications = [],
  onMarkAllRead,
  onClearAll,
  onAction,
  notificationCount = 0
}, ref) => {
  const t = translations[lang ?? 'en']
  const [showAll, setShowAll] = useState(false)
  const maxVisible = 3

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

  const displayedNotifications = useMemo(() => {
    return showAll ? notifications : notifications.slice(0, maxVisible)
  }, [notifications, showAll])

  const hasMore = notifications.length > maxVisible && !showAll
  const hasRealNotifications = notifications.length > 0

  return (
    <>
      <style>{`
        @keyframes notif-in {
          from { opacity: 0; transform: ${isMobile ? 'translateX(-50%) translateY(-12px)' : 'translateY(-12px)'}; }
          to   { opacity: 1; transform: ${isMobile ? 'translateX(-50%) translateY(0)' : 'translateY(0)'}; }
        }
        .notif-dropdown-enter {
          animation: notif-in 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .notif-badge {
          display: inline-flex; align-items: center; justify-content: center;
          background: #7C3AED; color: white; font-size: 9px; font-weight: 800;
          border-radius: 999px; padding: 2px 7px; letter-spacing: 0.08em;
        }
        .notif-action-btn {
          width: 100%; padding: 11px 16px;
          border-radius: 12px; cursor: pointer;
          border: none; display: flex; align-items: center;
          justify-content: center; gap: 8px;
          font-family: Kamerik 105, sans-serif;
          font-size: 13px; font-weight: 700;
          transition: filter 0.15s ease, transform 0.1s ease;
        }
        .notif-action-btn:active { transform: scale(0.97); }
        .notif-action-btn:hover  { filter: brightness(0.93); }

        .notif-row {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 20px;
          border-bottom: 1px solid #f3f4f6;
          transition: background 0.15s;
          cursor: pointer;
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
          maxWidth: isMobile ? '380px' : '380px',
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

        {}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#111', fontFamily: "'Kamerik 105', sans-serif" }}>
              {t.title}
            </span>
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '11px', color: '#7C3AED', fontWeight: 700,
                  fontFamily: "'Kamerik 105', sans-serif", padding: '4px 8px',
                  borderRadius: '8px', transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f3f0ff')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                {t.markRead}
              </button>
            )}
            {hasRealNotifications && (
              <button
                onClick={onClearAll}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '11px', color: '#EF4444', fontWeight: 700,
                  fontFamily: "'Kamerik 105', sans-serif", padding: '4px 8px',
                  borderRadius: '8px', transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                {t.clearAll}
              </button>
            )}
          </div>
        </div>

        {}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: '400px',
        }}>

          {}
          <div className="notif-row">
            <div className="notif-icon-wrap" style={{ background: '#f3e8ff' }}>
              <Icons.Subscription />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#111', fontFamily: "'Kamerik 105', sans-serif" }}>
                  {t.welcomeTitle}
                </span>
                <span style={{ fontSize: '11px', color: '#9ca3af', flexShrink: 0, marginLeft: '8px' }}>now</span>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.6, margin: 0, fontFamily: "'Kamerik 105', sans-serif" }}>
                {t.welcomeDesc}
              </p>
            </div>
          </div>

          {}
          {displayedNotifications.map((notification) => {
            const colors = getNotificationColors(notification.type)
            const borderColor = notification.type === 'warning' ? '#D97706' : notification.type === 'success' ? '#10B981' : notification.type === 'subscription' ? '#7C3AED' : '#3B82F6'
            return (
              <div
                key={notification.id}
                className="notif-row"
                style={{
                  borderLeft: `3px solid ${borderColor}`,
                  background: notification.read ? 'white' : '#fefce8'
                }}
                onClick={() => onAction?.(notification.id)}
              >
                <div className="notif-icon-wrap" style={{ background: colors.bg }}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#111', fontFamily: "'Kamerik 105', sans-serif" }}>
                      {notification.title}
                    </span>
                    <span style={{ fontSize: '11px', color: '#9ca3af', flexShrink: 0, marginLeft: '8px' }}>
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5, margin: 0, fontFamily: "'Kamerik 105', sans-serif" }}>
                    {notification.description}
                  </p>
                  {notification.details && (
                    <div style={{ marginTop: '8px', padding: '8px', background: '#f9fafb', borderRadius: '8px' }}>
                      {Object.entries(notification.details).map(([key, value]) => (
                        <div key={key} style={{ fontSize: '11px', color: '#4b5563' }}>
                          <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  )}
                  {notification.actionLabel && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onAction?.(notification.id)
                      }}
                      style={{
                        marginTop: '10px',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: 'none',
                        background: colors.button,
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        const darkerColors: Record<string, string> = {
                          '#D97706': '#B45309',
                          '#10B981': '#059669',
                          '#7C3AED': '#6D28D9',
                          '#3B82F6': '#2563EB',
                          '#6B7280': '#4B5563'
                        }
                        e.currentTarget.style.background = darkerColors[colors.button] || colors.button
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = colors.button
                      }}
                    >
                      {notification.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {}
          {hasRealNotifications && showAll && (
            <div style={{
              padding: '16px 20px',
              textAlign: 'center',
              borderTop: '1px solid #f3f4f6',
            }}>
              <span style={{ fontSize: '12px', color: '#9ca3af', fontFamily: "'Kamerik 105', sans-serif" }}>
                {t.noNotifs}
              </span>
            </div>
          )}

          {!hasRealNotifications && (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <Icons.Bell />
              </div>
              <span style={{ fontSize: '13px', color: '#9ca3af', fontFamily: "'Kamerik 105', sans-serif" }}>
                No notifications yet
              </span>
            </div>
          )}
        </div>

        {}
        {hasRealNotifications && notifications.length > maxVisible && (
          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid #f3f4f6',
            textAlign: 'center',
            background: '#fafafa',
          }}>
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#7C3AED',
                fontWeight: 600,
                fontFamily: "'Kamerik 105', sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                width: '100%',
              }}
            >
              {showAll ? t.showLess : t.viewAll}
              {showAll ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
            </button>
          </div>
        )}

        {}
        {!hasRealNotifications && (
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #f3f4f6' }}>
            <button
              className="notif-action-btn"
              onClick={() => { window.location.href = '/post-shipment' }}
              style={{ backgroundColor: '#7C3AED', color: 'white' }}
            >
              <Icons.ShipmentIcon />
              {t.postShipment}
            </button>

            <button
              className="notif-action-btn"
              onClick={() => { window.location.href = '/post-route' }}
              style={{ backgroundColor: '#B8FF00', color: '#111' }}
            >
              <Icons.RouteIcon />
              {t.postRoute}
            </button>
          </div>
        )}
      </div>
    </>
  )
})

NotificationDropdown.displayName = 'NotificationDropdown'
export default NotificationDropdown