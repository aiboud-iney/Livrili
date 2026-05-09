'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LanguageSwitcher } from '@/components/language-switcher';
import ProfileDropdown from '@/components/ProfileDropdown';
import NotificationDropdown from '@/components/NotificationDropdown';
import { useLang } from '@/contexts/LanguageContext';
import { translations } from './translations';

interface HeaderProps {
  onPublish?: () => void;
}

export function Header({ onPublish }: HeaderProps) {
  const { lang } = useLang();
  const router = useRouter();

  const [showPublish, setShowPublish] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const publishRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (publishRef.current && !publishRef.current.contains(e.target as Node)) setShowPublish(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={{
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div />

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

        {}
        <div ref={publishRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowPublish(prev => !prev); setShowNotif(false); setShowProfile(false); }}
            style={{
              backgroundColor: '#7C3AED', color: 'white', borderRadius: '999px',
              padding: '10px 20px', fontSize: '14px', fontWeight: 700,
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
              gap: '8px', transition: 'background 0.2s',
              fontFamily: "'Kamerik 105', sans-serif",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#6D28D9')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#7C3AED')}
          >
            <img src="/icons/plus.png" alt="publish" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
            {translations[lang]?.publish}
          </button>

          {showPublish && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              backgroundColor: 'white', borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              border: '1px solid #e5e7eb', overflow: 'hidden',
              minWidth: '200px', zIndex: 100,
            }}>
              <button
                onClick={() => { router.push('/post-shipment'); setShowPublish(false); }}
                style={{
                  width: '100%', padding: '12px 16px', textAlign: 'left',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 600, color: '#111',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  transition: 'background 0.15s', fontFamily: "'Kamerik 105', sans-serif",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f4f0ff')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7C3AED', flexShrink: 0 }} />
                {translations[lang]?.postShipment}
              </button>
              <button
                onClick={() => { router.push('/post-route'); setShowPublish(false); }}
                style={{
                  width: '100%', padding: '12px 16px', textAlign: 'left',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 600, color: '#111',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  transition: 'background 0.15s', fontFamily: "'Kamerik 105', sans-serif",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f4ffe0')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#B8FF00', flexShrink: 0 }} />
                {translations[lang]?.publishRoute}
              </button>
            </div>
          )}
        </div>

        {}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowNotif(prev => !prev); setShowPublish(false); setShowProfile(false); }}
            style={{
              padding: '8px', background: 'none', border: 'none',
              cursor: 'pointer', borderRadius: '8px', transition: 'background 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
              <img src="/icons/bell.png" alt="notifications" className="w-5 h-5 object-contain" />
          </button>

            <NotificationDropdown show={showNotif} lang={lang} />
        </div>

        {}
        <div ref={profileRef} style={{ position: "relative" }}>
                   <button
                     title="show notifications"
                     onClick={() => {
                       setShowProfile((prev) => !prev);
                       setShowNotif(false);
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

                  {}
        <LanguageSwitcher />

      </div>
    </header>
  );
}
