'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLang } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { Header } from "@/app/feed/components/header";
import { translations } from './translations';

interface EditProfileMobileProps {
  companyName?: string;
  bioContent?: string;
  profileImage?: string;
  userId?: string;
  userEmail?: string;
  phone?: string;
  tinNif?: string;
  tradeRegister?: string;
  category?: string;
  headquartersAddress?: string;
  onSave?: (data: EditProfileData) => void;
  onDiscard?: () => void;
}

interface EditProfileData {
  legalCompanyName: string;
  category: string;
  tradeRegister: string;
  tin: string;
  phoneNumber: string;
  email: string;
  headquartersAddress: string;
  bio: string;
}

export function EditProfileMobile({
  companyName = 'ATLAS Logistics',
  bioContent = '',
  profileImage = '/icons/avatar.png',
  userId,
  userEmail = '',
  phone = '',
  tinNif = '',
  tradeRegister = '',
  category = '',
  headquartersAddress = '',
  onSave,
  onDiscard,
}: EditProfileMobileProps) {
  const { lang } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const [showPublish, setShowPublish] = useState(false);
  const publishRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState(profileImage);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const t = (key: string): string => {
    const langTranslations = translations[lang as keyof typeof translations];
    return langTranslations?.[key as keyof typeof langTranslations]
      || translations['en'][key as keyof typeof translations['en']]
      || key;
  };

  const [form, setForm] = useState<EditProfileData>({
    legalCompanyName: companyName,
    category: category,
    tradeRegister: tradeRegister,
    tin: tinNif,
    phoneNumber: phone,
    email: userEmail,
    headquartersAddress: headquartersAddress,
    bio: bioContent,
  });

  const filledCount = Object.values(form).filter((v) => (v ?? '').trim() !== '').length;
  const completionPct = Math.round((filledCount / 8) * 100);

  const handleChange = (field: keyof EditProfileData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (!userId) {
      setError('User ID not found');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {

      const updatedUser = await api.updateUserProfile(userId, {
        business_name: form.legalCompanyName,
        phone_number: form.phoneNumber,
        tin_nif: form.tin,
        trade_register: form.tradeRegister,
      });

      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userStr) {
        const currentUser = JSON.parse(userStr);
        const mergedUser = { ...currentUser, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(mergedUser));
        sessionStorage.setItem('user', JSON.stringify(mergedUser));
      }

      setSuccess('Profile saved successfully!');

      setTimeout(() => {
        router.push('/profile');
      }, 1500);

      onSave?.(form);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save profile';
      setError(errorMsg);
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const completionLabel =
    completionPct === 100
      ? t('profileComplete')
      : completionPct >= 75
      ? t('almostComplete')
      : completionPct >= 40
      ? t('keepGoing')
      : t('justStarted');

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (publishRef.current && !publishRef.current.contains(e.target as Node)) setShowPublish(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;
  const ACTIVE_COLOR = '#7E52FF';
  const INACTIVE_COLOR = '#4D4D4D';

  const navColor = (path: string) => isActive(path) ? ACTIVE_COLOR : INACTIVE_COLOR;
  const navWeight = (path: string) => isActive(path) ? 700 : 500;

  const ic = {
    navHome: '/icons/home gray phone.png',
    navSettings: '/icons/settings gray phone.png',
    navDashboard: '/icons/dashboard gray phone.png',
    navProfile: isActive('/profile') ? '/icons/profile-active phone.png' : '/icons/profile gray phone.png',
  };

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.88); }
          65%  { transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }

        .ep-mobile-card { animation: fadeSlideUp 0.45s ease both; }
        .ep-mobile-card-1 { animation-delay: 0.10s; }
        .ep-mobile-card-2 { animation-delay: 0.18s; }
        .ep-mobile-card-3 { animation-delay: 0.26s; }
        .ep-mobile-card-4 { animation-delay: 0.34s; }
        .ep-mobile-avatar { animation: popIn 0.5s cubic-bezier(0.4,0,0.2,1) both; animation-delay: 0.08s; }

        .ep-mobile-input {
          width: 100%;
          background: #ede9fe;
          border: none;
          border-radius: 10px;
          padding: 13px 16px;
          font-family: 'Kamerik 105', sans-serif;
          font-size: 14px;
          color: #111;
          outline: none;
          transition: box-shadow 0.2s ease, background 0.2s ease;
          box-sizing: border-box;
        }
        .ep-mobile-input::placeholder { color: #a78bfa; }
        .ep-mobile-input:focus {
          background: #ddd6fe;
          box-shadow: 0 0 0 2px #7C3AED44;
        }

        .ep-mobile-textarea {
          width: 100%;
          min-height: 120px;
          background: #ede9fe;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 14px 16px;
          font-family: 'Kamerik 105', sans-serif;
          font-size: 14px;
          color: #111;
          outline: none;
          resize: vertical;
          line-height: 1.7;
          transition: box-shadow 0.2s ease, background 0.2s ease;
          box-sizing: border-box;
        }
        .ep-mobile-textarea::placeholder { color: #a78bfa; }
        .ep-mobile-textarea:focus {
          background: #ddd6fe;
          box-shadow: 0 0 0 2px #7C3AED44;
        }

        .ep-mobile-section-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #e5e7eb;
        }

        .ep-mobile-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Kamerik 105', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #111;
          margin-bottom: 20px;
        }

        .ep-mobile-label {
          font-family: 'Kamerik 105', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          display: block;
        }

        .ep-mobile-upload-btn {
          background: #ede9fe;
          color: #7C3AED;
          border: none;
          border-radius: 999px;
          padding: 9px 22px;
          font-family: 'Kamerik 105', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.18s ease;
        }
        .ep-mobile-upload-btn:hover {
          background: #ddd6fe;
          transform: translateY(-1px);
        }

        .ep-mobile-discard-btn {
          background: none;
          border: none;
          font-family: 'Kamerik 105', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          padding: 12px 20px;
          border-radius: 999px;
          transition: background 0.18s, color 0.18s;
          flex: 1;
        }
        .ep-mobile-discard-btn:hover {
          background: #f3f4f6;
          color: #111;
        }

        .ep-mobile-save-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #7C3AED;
          color: white;
          border: none;
          border-radius: 999px;
          padding: 12px 24px;
          font-family: 'Kamerik 105', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.18s ease, box-shadow 0.2s ease;
          flex: 1;
        }
        .ep-mobile-save-btn:hover {
          background: #6D28D9;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(124,58,237,0.32);
        }
        .ep-mobile-save-btn:active { transform: translateY(0); box-shadow: none; }

        .ep-mobile-rich-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 7px;
          border-radius: 6px;
          font-size: 14px;
          color: #37274D;
          font-weight: 700;
          transition: background 0.15s;
          font-family: serif;
          line-height: 1;
        }
        .ep-mobile-rich-btn:hover { background: #f3f4f6; color: #111; }

        .ep-mobile-completion-bar-bg {
          width: 100%;
          height: 7px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
          margin: 10px 0 6px;
        }
        .ep-mobile-completion-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: #B8FF00;
          transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
        }

        .mob-nav-item {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          background: none; border: none; cursor: pointer; padding: 4px 12px;
          font-family: 'Kamerik 105', sans-serif;
          font-size: 11px; transition: color 0.15s ease;
        }
        .mob-nav-item img { width: 22px; height: 22px; object-fit: contain; }

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
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '100px' }}>

          {}
          <div style={{ padding: '24px 20px 0' }}>
            <h1 style={{
              fontFamily: "'Kamerik 105', sans-serif",
              fontSize: '20px', fontWeight: 700, color: '#111',
              margin: 0, letterSpacing: '-0.4px',
            }}>
              {t('editBusinessProfile')}
            </h1>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {}
            <div className="ep-mobile-section-card ep-mobile-card ep-mobile-card-1" style={{ textAlign: 'center' }}>
              <div className="ep-mobile-avatar" style={{
                width: '100px', height: '100px', borderRadius: '50%',
                border: '4px solid #B8FF00', margin: '0 auto 12px',
                backgroundColor: '#e5e7eb', overflow: 'hidden',
              }}>
                <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <input
                title="file"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }} />
              <button
                onClick={handleUploadClick}
                style={{
                  background: '#7C3AED', color: '#fff', border: 'none',
                  borderRadius: '8px', padding: '8px 16px', cursor: 'pointer',
                  fontFamily: "'Kamerik 105', sans-serif", fontSize: '13px', fontWeight: 600,
                }}
              >
                Change photo
              </button>
            </div>
            <div className="ep-mobile-section-card ep-mobile-card ep-mobile-card-2" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontFamily: "'Kamerik 105', sans-serif",
                  fontSize: '11px', fontWeight: 800, color: '#7C3AED',
                  letterSpacing: '0.09em',
                }}>
                  {t('profileCompletion')}
                </span>
                <span style={{
                  fontFamily: "'Kamerik 105', sans-serif",
                  fontSize: '14px', fontWeight: 800, color: '#111',
                }}>
                  {completionPct}%
                </span>
              </div>
              <div className="ep-mobile-completion-bar-bg">
                <div className="ep-mobile-completion-bar-fill" style={{ width: `${completionPct}%` }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <img src="/icons/check circle.png" alt="" style={{ width: '11px', height: '11px' }} onError={e => (e.currentTarget.style.display = 'none')} />
                <span style={{ fontFamily: "'Kamerik 105', sans-serif", fontSize: '12px', color: '#6b7280' }}>
                  {completionLabel}
                </span>
              </div>
            </div>

            {}
            <div className="ep-mobile-section-card ep-mobile-card ep-mobile-card-1">
              <div className="ep-mobile-section-title">
                <img src="/icons/buisness icon.png" alt="" style={{ width: '22px', height: '22px' }} onError={e => (e.currentTarget.style.display = 'none')} />
                {t('businessIdentity')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="ep-mobile-label">{t('legalCompanyName')}</label>
                  <input title={t('legalCompanyName')} className="ep-mobile-input" placeholder={t('legalCompanyName')} value={form.legalCompanyName} onChange={handleChange('legalCompanyName')} />
                </div>
                <div>
                  <label className="ep-mobile-label">{t('category')}</label>
                  <input title={t('category')} className="ep-mobile-input" placeholder={t('category')} value={form.category} onChange={handleChange('category')} />
                </div>
                <div>
                  <label className="ep-mobile-label">{t('tradeRegister')}</label>
                  <input title={t('tradeRegister')} className="ep-mobile-input" placeholder={t('tradeRegister')} value={form.tradeRegister} onChange={handleChange('tradeRegister')} />
                </div>
                <div>
                  <label className="ep-mobile-label">{t('tin')}</label>
                  <input title={t('tin')} className="ep-mobile-input" placeholder={t('tin')} value={form.tin} onChange={handleChange('tin')} />
                </div>
              </div>
            </div>

            {}
            <div className="ep-mobile-section-card ep-mobile-card ep-mobile-card-2">
              <div className="ep-mobile-section-title">
                <img src="/icons/buisness icon.png" alt="" style={{ width: '22px', height: '22px' }} onError={e => (e.currentTarget.style.display = 'none')} />
                {t('contactLocation')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="ep-mobile-label">{t('phoneNumber')}</label>
                  <input title={t('phoneNumber')} className="ep-mobile-input" placeholder={t('phoneNumber')} value={form.phoneNumber} onChange={handleChange('phoneNumber')} type="tel" />
                </div>
                <div>
                  <label className="ep-mobile-label">{t('email')}</label>
                  <input title={t('email')} className="ep-mobile-input" placeholder={t('email')} value={form.email} onChange={handleChange('email')} type="email" />
                </div>
                <div>
                  <label className="ep-mobile-label">{t('headquartersAddress')}</label>
                  <input title={t('headquartersAddress')} className="ep-mobile-input" placeholder={t('headquartersAddress')} value={form.headquartersAddress} onChange={handleChange('headquartersAddress')} />
                </div>
              </div>
            </div>

            {}
            <div className="ep-mobile-section-card ep-mobile-card ep-mobile-card-3">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div className="ep-mobile-section-title" style={{ marginBottom: 0 }}>
                  <img src="/icons/buisness icon.png" alt="" style={{ width: '22px', height: '22px' }} onError={e => (e.currentTarget.style.display = 'none')} />
                  {t('myBio')}
                </div>
                <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                  <button className="ep-mobile-rich-btn" title="Bold"><b>B</b></button>
                  <button className="ep-mobile-rich-btn" title="Italic"><i>I</i></button>
                  <button className="ep-mobile-rich-btn" title="List">
                    <img src="/icons/three points.png" alt="List" style={{ width: '15px', height: '15px', objectFit: 'contain' }} onError={e => (e.currentTarget.style.display = 'none')} />
                  </button>
                  <button className="ep-mobile-rich-btn" title="Link">
                    <img src="/icons/link.png" alt="link" style={{ width: '15px', height: '15px', objectFit: 'contain' }} onError={e => (e.currentTarget.style.display = 'none')} />
                  </button>
                </div>
              </div>
              <label className="ep-mobile-label">{t('description')}</label>
              <textarea
                title={t('description')}
                className="ep-mobile-textarea"
                placeholder={t('description')}
                value={form.bio}
                onChange={handleChange('bio')}
              />
            </div>

            {}
            <div className="ep-mobile-card ep-mobile-card-4" style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', gap: '12px', padding: '8px 0', flexDirection: 'column'
            }}>
              {error && (
                <div style={{
                  color: '#dc2626',
                  fontSize: '13px',
                  fontFamily: "'Kamerik 105', sans-serif",
                  width: '100%',
                  textAlign: 'center',
                  marginBottom: '8px'
                }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{
                  color: '#16a34a',
                  fontSize: '13px',
                  fontFamily: "'Kamerik 105', sans-serif",
                  width: '100%',
                  textAlign: 'center',
                  marginBottom: '8px'
                }}>
                  {success}
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                <button className="ep-mobile-discard-btn" onClick={onDiscard} disabled={isSaving}>
                  {t('discardChanges')}
                </button>
                <button
                  className="ep-mobile-save-btn"
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    opacity: isSaving ? 0.6 : 1,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                  }}
                >
                  <img src="/icons/save icon.png" alt="" style={{ width: '16px', height: '16px' }} onError={e => (e.currentTarget.style.display = 'none')} />
                  {isSaving ? 'Saving...' : t('saveChanges')}
                </button>
              </div>
            </div>

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

          <button aria-label="Settings" className="mob-nav-item" onClick={() => router.push('/settings')}
            style={{ color: navColor('/settings'), fontWeight: navWeight('/settings') }}>
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
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
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

          <button aria-label="Dashboard" className="mob-nav-item" onClick={() => router.push('/Dashboard')}
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
