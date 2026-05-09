'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/contexts/LanguageContext'
import NotificationDropdown from '@/components/NotificationDropdown'
import ProfileDropdown from "@/components/ProfileDropdown";
import { LanguageSwitcher } from "@/components/language-switcher";
import { API_BASE_URL as API_BASE, getAuthHeaders } from '@/lib/api';

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

export default function Header() {
  const { lang } = useLang()
  const router = useRouter()
  const [showNotifs, setShowNotifs] = useState(false)
  const [showPublish, setShowPublish] = useState(false)
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null)
  const publishRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications`, { headers: getAuthHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      const mapped: Notification[] = (data.notifications || []).map((n: any) => {
        const meta = n.meta || {};
        const details: Record<string, string> = {};

        if (meta.reserver_name) {
          details['Reserver'] = meta.reserver_name;
        }
        if (meta.reserver_phone) {
          details['Phone'] = meta.reserver_phone;
        }

        return {
          id: String(n.id),
          type: n.type as Notification['type'],
          title: n.title,
          description: n.message,
          timestamp: new Date(n.created_at),
          read: n.is_read,
          details: Object.keys(details).length > 0 ? details : undefined,
        };
      });
      setNotifications(mapped);
    } catch {}
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  }, []);

  const handleClearAll = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/notifications`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      setNotifications([]);
    } catch {}
  }, []);

  const handleAction = useCallback(async (id: string) => {
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch {}
  }, []);

  const translations = {
    en: {
      publish: "Publish",
      postShipment: "Post a Shipment",
      publishRoute: "Publish a Route",
    },
    fr: {
      publish: "Publier",
      postShipment: "Publier une expédition",
      publishRoute: "Publier un itinéraire",
    },
  }

  const t = translations[lang]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false)
      }
      if (publishRef.current && !publishRef.current.contains(e.target as Node)) {
        setShowPublish(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-white border-b border-[#e0e0e0] px-8 py-4 flex items-center justify-end">
      <div className="flex items-center gap-4">

        <div ref={publishRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowPublish(prev => !prev)}
            style={{ backgroundColor: '#7C3AED', color: 'white', borderRadius: '999px', padding: '10px 20px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#6D28D9')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#7C3AED')}
          >
            <img src="/icons/plus.png" alt="publish" className="w-4 h-4 object-contain" />
            {t.publish}
          </button>
          {showPublish && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #e5e7eb', overflow: 'hidden', minWidth: '200px', zIndex: 100 }}>
              <button
                onClick={() => { router.push('/post-shipment'); setShowPublish(false) }}
                style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#111', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f4f0ff')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7C3AED', flexShrink: 0 }} />
                {t.postShipment}
              </button>
              <button
                onClick={() => { router.push('/post-route'); setShowPublish(false) }}
                style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#111', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f4ffe0')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#B8FF00', flexShrink: 0 }} />
                {t.publishRoute}
              </button>
            </div>
          )}
        </div>

        <div ref={notifRef} style={{ position: "relative" }}>
                    <button
                      onClick={() => {
                        setShowNotifs((prev) => !prev);
                        setShowProfile(false);
                      }}
                      style={{
                        position: "relative",
                        padding: "8px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "999px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f3f4f6")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <img
                        src="/icons/bell.png"
                        alt="notifications"
                        className="w-5 h-5 object-contain"
                      />
                      {}
                      {notifications.filter(n => !n.read).length > 0 && (
                        <span
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            backgroundColor: "#EF4444",
                            color: "white",
                            fontSize: "10px",
                            fontWeight: "700",
                            minWidth: "16px",
                            height: "16px",
                            borderRadius: "999px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 4px",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                          }}
                        >
                          {notifications.filter(n => !n.read).length > 9 ? '9+' : notifications.filter(n => !n.read).length}
                        </span>
                      )}
                    </button>
                    <NotificationDropdown
                      show={showNotifs}
                      lang={lang}
                      notifications={notifications}
                      onMarkAllRead={handleMarkAllRead}
                      onClearAll={handleClearAll}
                      onAction={handleAction}
                    />
                  </div>

        <div ref={profileRef} style={{ position: "relative" }}>
                    <button
                      title="show profile"
                      onClick={() => {
                        setShowProfile((prev) => !prev);
                        setShowNotifs(false);
                      }}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "#F5A962",
                        border: "none",
                        cursor: "pointer",
                      }}
                    />
                    <ProfileDropdown show={showProfile} />
                  </div>

                  <LanguageSwitcher />

      </div>
    </header>
  )
}
