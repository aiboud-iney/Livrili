'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useLang } from '@/contexts/LanguageContext';
import { Header } from "@/app/feed/components/header";

interface MobileIcons {
  logo?: string;
  bell?: string;
  location?: string;
  star?: string;
  help?: string;
  helpBubbleColor?: string;
  feedback?: string;
  feedbackBubbleColor?: string;
  logout?: string;
  logoutBubbleColor?: string;
  navHome?: string;
  navSettings?: string;
  navDashboard?: string;
  navProfile?: string;
  navHomeActive?: string;
  navSettingsActive?: string;
  navDashboardActive?: string;
  navProfileActive?: string;
}

interface ProfilePageMobileProps {
  companyName: string;
  location: string;
  rating: number;
  reviews: number;
  bioContent: string;
  profileImage?: string;
  userImage?: string;
  onEditProfile?: () => void;
  icons?: MobileIcons;
}

export function ProfilePageMobile({
  companyName,
  location,
  rating,
  reviews,
  bioContent,
   profileImage = '/icons/avatar.png',
  userImage = '/icons/profile.png',
  onEditProfile,
  icons = {},
}: ProfilePageMobileProps) {
  const { t } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const [showPublish, setShowPublish] = useState(false);
  const publishRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (publishRef.current && !publishRef.current.contains(e.target as Node)) setShowPublish(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;

  const ACTIVE_COLOR   = '#7E52FF';
  const INACTIVE_COLOR = '#4D4D4D';

  const ic = {
    logo:            icons.logo              ?? '/icons/logo purple.png',
    bell:            icons.bell              ?? '/icons/bell.png',
    location:        icons.location          ?? '/icons/localisation.png',
    star:            icons.star              ?? '/icons/yellowstar.png',
    help:            icons.help              ?? '/icons/help phone.png',
    helpBubble:      icons.helpBubbleColor   ?? '#f3f0ff',
    feedback:        icons.feedback          ?? '/icons/phone feedback.png',
    feedbackBubble:  icons.feedbackBubbleColor ?? '#f3f0ff',
    logout:          icons.logout            ?? '/icons/logout phone.png',
    logoutBubble:    icons.logoutBubbleColor ?? '#fff0f0',
    navHome:      isActive('/')          ? (icons.navHomeActive      ?? icons.navHome      ?? '/icons/home phone.png')      : (icons.navHome      ?? '/icons/home phone.png'),
    navSettings:  isActive('/settings') ? (icons.navSettingsActive  ?? icons.navSettings  ?? '/icons/settings phone.png')  : (icons.navSettings  ?? '/icons/settings phone.png'),
    navDashboard: isActive('/dashboard')? (icons.navDashboardActive ?? icons.navDashboard ?? '/icons/dashboard phone.png') : (icons.navDashboard ?? '/icons/dashboard phone.png'),
    navProfile:   isActive('/profile')  ? (icons.navProfileActive   ?? icons.navProfile   ?? '/icons/profile phone.png')   : (icons.navProfile   ?? '/icons/profile phone.png'),
  };

  const navColor  = (path: string) => isActive(path) ? ACTIVE_COLOR : INACTIVE_COLOR;
  const navWeight = (path: string) => isActive(path) ? 700 : 500;

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.82); }
          65%  { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }

        .mob-avatar  { animation: popIn 0.55s cubic-bezier(0.4,0,0.2,1) both; animation-delay: 0.05s; }
        .mob-name    { animation: fadeSlideUp 0.45s ease both; animation-delay: 0.15s; }
        .mob-loc     { animation: fadeSlideUp 0.45s ease both; animation-delay: 0.22s; }
        .mob-rating  { animation: fadeSlideUp 0.45s ease both; animation-delay: 0.28s; }
        .mob-editbtn { animation: fadeSlideUp 0.45s ease both; animation-delay: 0.34s; }
        .mob-bio     { animation: fadeSlideUp 0.45s ease both; animation-delay: 0.40s; }
        .mob-cards   { animation: fadeSlideUp 0.45s ease both; animation-delay: 0.46s; }

        .mob-edit-btn { transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease; }
        .mob-edit-btn:active { transform: scale(0.97); }

        .mob-nav-item {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          background: none; border: none; cursor: pointer; padding: 4px 12px;
          font-family: 'Kamerik 105', sans-serif;
          font-size: 11px; transition: color 0.15s ease;
        }
        .mob-nav-item img { width: 22px; height: 22px; object-fit: contain; }

        .mob-menu-card {
          display: flex; align-items: center; justify-content: space-between;
          background: white; border-radius: 16px; padding: 16px 20px;
          border: none; cursor: pointer; width: 100%;
          transition: background 0.15s ease; font-family: 'Kamerik 105', sans-serif;
        }
        .mob-menu-card:active { background: #f9fafb; }

        .mob-fab {
          width: 56px; height: 56px; border-radius: 50%;
          background: #7C3AED; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(124,58,237,0.4);
          transition: transform 0.15s ease, box-shadow 0.15s ease; flex-shrink: 0;
        }
        .mob-fab:active { transform: scale(0.93); box-shadow: 0 2px 8px rgba(124,58,237,0.3); }
      `}</style>

      <div style={{
        backgroundColor: '#f3f4f6', height: '100vh', maxWidth: '480px',
        margin: '0 auto', display: 'flex', flexDirection: 'column',
        fontFamily: "'Kamerik 105', sans-serif", overflow: 'hidden',
      }}>

        {}

       <div>
            <Header />
         </div>

        {}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '90px' }}>

          <div style={{ padding: '24px 20px 0' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111', margin: 0 }}>
              {t('myProfile') || 'My Profile'}
            </h1>
          </div>

          <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="mob-avatar" style={{
              width: '110px', height: '110px', borderRadius: '50%',
              border: '4px solid #B8FF00', backgroundColor: '#e5e7eb',
              overflow: 'hidden', marginBottom: '16px',
            }}>
              <img src={profileImage} alt={companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <h2 className="mob-name" style={{
              fontSize: '24px', fontWeight: 800, color: '#111',
              margin: '0 0 10px', letterSpacing: '-0.4px', textAlign: 'center',
            }}>
              {companyName}
            </h2>

            <div className="mob-loc" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <img src={ic.location} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
              <span style={{ fontSize: '14px', color: '#7C3AED', fontWeight: 500 }}>{location}</span>
            </div>

            <div className="mob-rating" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: 'white', padding: '6px 14px',
              borderRadius: '999px', border: '1px solid #e5e7eb', marginBottom: '20px',
            }}>
              <img src={ic.star} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#111' }}>{rating}</span>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>({reviews} {t('reviews')})</span>
            </div>

            <button
              className="mob-editbtn mob-edit-btn"
              aria-label="Edit profile"
              onClick={onEditProfile}
              style={{
                width: '100%', backgroundColor: '#7C3AED', color: 'white',
                border: 'none', borderRadius: '14px', padding: '15px',
                fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginBottom: '24px',
                fontFamily: "'Kamerik 105', sans-serif",
              }}
            >
              {t('editProfile')}
            </button>
          </div>

          {}
          <div className="mob-bio" style={{ padding: '0 20px 20px' }}>
            <h3 style={{
              fontSize: '11px', fontWeight: 700, color: '#7C3AED',
              letterSpacing: '0.12em', marginBottom: '12px', textTransform: 'uppercase',
            }}>
              {t('myBio')}
            </h3>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.85', margin: 0 }}>
                {bioContent}
              </p>
            </div>
          </div>

          {}
          <div className="mob-cards" style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="mob-menu-card" aria-label="Help">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: ic.helpBubble, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={ic.help} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#111' }}>{t('help')}</span>
              </div>
              <span style={{ color: '#9ca3af', fontSize: '20px', lineHeight: 1 }}>›</span>
            </button>

            <button className="mob-menu-card" aria-label="Feedback">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: ic.feedbackBubble, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={ic.feedback} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#111' }}>{t('feedback')}</span>
              </div>
              <span style={{ color: '#9ca3af', fontSize: '20px', lineHeight: 1 }}>›</span>
            </button>

            <button className="mob-menu-card" aria-label="Logout">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: ic.logoutBubble, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={ic.logout} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#B41340' }}>{t('logout')}</span>
              </div>
              <span style={{ color: '#B41340', fontSize: '20px', lineHeight: 1 }}>›</span>
            </button>
          </div>
        </div>

        {}
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: '480px', backgroundColor: 'white',
          borderTop: '1px solid #f0f0f0', display: 'flex',
          alignItems: 'center', justifyContent: 'space-around',
          padding: '10px 8px 16px', zIndex: 50,
        }}>
          <button aria-label="Home" className="mob-nav-item" onClick={() => router.push('/feed')}
            style={{ color: navColor('/feed'), fontWeight: navWeight('/feed') }}>
            <img src={ic.navHome} alt="" />
            <span>{t('home') || 'Home'}</span>
          </button>

          <button aria-label="Settings" className="mob-nav-item" onClick={() => router.push('/profile?tab=settings')}
            style={{ color: navColor('/profile'), fontWeight: navWeight('/profile') }}>
            <img src={ic.navSettings} alt="" />
            <span>{t('settings')}</span>
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
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f4ffe0')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#B8FF00', flexShrink: 0 }} />
                  {t('publishRoute')}
                </button>
              </div>
            )}
          </div>

          <button aria-label="Dashboard" className="mob-nav-item" onClick={() => router.push('/dashboard')}
            style={{ color: navColor('/dashboard'), fontWeight: navWeight('/dashboard') }}>
            <img src={ic.navDashboard} alt="" />
            <span>{t('dashboard') || 'Dashboard'}</span>
          </button>

          <button aria-label="Profile" className="mob-nav-item" onClick={() => router.push('/profile')}
            style={{ color: navColor('/profile'), fontWeight: navWeight('/profile') }}>
            <img src={ic.navProfile} alt="" />
            <span>{t('profile') || 'Profile'}</span>
          </button>
        </div>

      </div>
    </>
  );
}
