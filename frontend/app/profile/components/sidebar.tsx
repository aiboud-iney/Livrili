'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export function Sidebar() {
  const { t } = useLang();
  const router = useRouter();
  const { logout } = useAuth();
  const pathname = usePathname();

  const handleSettingsClick = () => {
    router.push('/profile?tab=settings');
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const isSettingsActive = pathname === '/profile' && new URLSearchParams(window.location.search).get('tab') === 'settings';
  const isProfileActive = pathname === '/profile' && !new URLSearchParams(window.location.search).get('tab');

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes sidebarSlideIn {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes itemFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .sidebar-root {
          font-family: 'Kamerik 105', sans-serif !important;
          animation: sidebarSlideIn 0.45s cubic-bezier(0.4,0,0.2,1) both;
          width: 72px;
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
          overflow: hidden;
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          z-index: 50;
          display: flex;
          flex-direction: column;
        }
        .sidebar-root:hover {
          width: 220px;
        }

        .sidebar-label {
          opacity: 0;
          white-space: nowrap;
          overflow: hidden;
          max-width: 0;
          transition: opacity 0.2s ease 0s, max-width 0.3s cubic-bezier(0.4,0,0.2,1) 0s;
          pointer-events: none;
        }
        .sidebar-root:hover .sidebar-label {
          opacity: 1;
          max-width: 160px;
          transition: opacity 0.25s ease 0.1s, max-width 0.3s cubic-bezier(0.4,0,0.2,1) 0s;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 12px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          width: 100%;
          font-family: 'Kamerik 105', sans-serif !important;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s ease;
          text-align: left;
          animation: itemFadeUp 0.4s ease both;
        }
        .sidebar-nav-item:nth-child(1) { animation-delay: 0.18s; }
        .sidebar-nav-item:nth-child(2) { animation-delay: 0.24s; }
        .sidebar-nav-item:nth-child(3) { animation-delay: 0.30s; }
        .sidebar-nav-item:nth-child(4) { animation-delay: 0.36s; }
        .sidebar-nav-item:hover {
          background: rgba(255,255,255,0.15);
          color: white;
        }
        .sidebar-nav-item:active {
          background: rgba(255,255,255,0.1);
        }
        .sidebar-nav-item img {
          transition: transform 0.2s ease;
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          min-width: 20px;
        }
        .sidebar-nav-item:hover img {
          transform: scale(1.08);
        }

        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 12px;
          width: 100%;
          padding: 12px 12px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          font-family: 'Kamerik 105', sans-serif !important;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s ease;
          animation: itemFadeUp 0.4s ease both;
          animation-delay: 0.42s;
          overflow: hidden;
        }
        .sidebar-logout-btn:hover {
          background: rgba(255,255,255,0.15);
        }
        .sidebar-logout-btn:active {
          background: rgba(255,255,255,0.1);
        }
        .sidebar-logout-btn img {
          transition: transform 0.2s ease;
          width: 20px;
          height: 20px;
          min-width: 20px;
          flex-shrink: 0;
        }
        .sidebar-logout-btn:hover img {
          transform: scale(1.08);
        }

        .sidebar-brand-text {
          font-family: 'Kamerik 105', sans-serif !important;
          font-size: 20px;
          font-weight: 800;
          color: #202020;
          letter-spacing: -0.3px;
        }

        .sidebar-divider {
          height: 1px;
          background: rgba(255,255,255,0.2);
          margin: 12px 8px;
        }
      `}</style>

      <div
        className="sidebar-root"
        style={{ backgroundColor: '#7C3AED', padding: '20px 16px 20px' }}
      >
        {}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden', marginBottom: '32px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '14px',
            overflow: 'hidden', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img
              src="/icons/logo green.png"
              alt="logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <span className="sidebar-brand-text sidebar-label">Livrili</span>
        </div>

        {}
        <div style={{ flex: 1 }} />

        {}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {}
          <button
            className="sidebar-nav-item"
            onClick={handleSettingsClick}
            style={{ backgroundColor: isSettingsActive ? 'rgba(255,255,255,0.15)' : 'transparent' }}
          >
            <img src="/icons/settings.png" alt={t('settings')} />
            <span className="sidebar-label">{t('settings')}</span>
          </button>

          {}
          <button className="sidebar-nav-item" onClick={() => router.push('/feedback')}>
            <img src="/icons/feedback.png" alt={t('feedback')} />
            <span className="sidebar-label">{t('feedback')}</span>
          </button>

          {}
          <button className="sidebar-nav-item" onClick={() => router.push('/help')}>
            <img src="/icons/help.png" alt={t('help')} />
            <span className="sidebar-label">{t('help')}</span>
          </button>

          {}
          <div className="sidebar-divider" />

          {}
          <button className="sidebar-logout-btn" onClick={logout}>
            <span style={{ width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src="/icons/logout.png" alt={t('logout')} />
            </span>
            <span className="sidebar-label">{t('logout')}</span>
          </button>
        </div>
      </div>
    </>
  );
}