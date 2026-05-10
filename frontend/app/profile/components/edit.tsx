'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { translations } from './translations';

interface EditProfilePageProps {
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

export function EditProfilePage({
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
}: EditProfilePageProps) {

  const { lang } = useLang();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(userId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(profileImage);

  const t = (key: string): string => {
    const langTranslations = translations[lang as keyof typeof translations];
    return langTranslations?.[key as keyof typeof langTranslations]
      || translations['en'][key as keyof typeof translations['en']]
      || key;
  };

  useEffect(() => {
    if (!currentUserId && typeof window !== 'undefined') {
      const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (userObj && userObj.id) {
            setCurrentUserId(userObj.id);
          }
        } catch (e) {
          console.error("Failed to parse user object from storage", e);
        }
      }
    }
  }, [currentUserId]);

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

  const filledCount = Object.values(form).filter((v) => v.trim() !== '').length;
  const completionPct = Math.round((filledCount / 8) * 100);

  const handleChange = (field: keyof EditProfileData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (!currentUserId) {
      setError('User ID not found');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload: any = {
        business_name: form.legalCompanyName,
        phone_number: form.phoneNumber,
        email: form.email,
        headquarters_address: form.headquartersAddress,
        more_details: form.bio,
        bio: form.bio,
        category: form.category,
        trade_register: form.tradeRegister,
        tin_nif: form.tin
      };

      const updatedUser = await api.updateUserProfile(currentUserId, payload, selectedFile || undefined);

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

  return (
    <>
      {}
      <style suppressHydrationWarning>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.88); } 65% { transform: scale(1.03); } 100% { opacity: 1; transform: scale(1); } }
        .ep-card { animation: fadeSlideUp 0.45s ease both; }
        .ep-card-1 { animation-delay: 0.10s; }
        .ep-card-2 { animation-delay: 0.18s; }
        .ep-card-3 { animation-delay: 0.26s; }
        .ep-card-4 { animation-delay: 0.34s; }
        .ep-avatar { animation: popIn 0.5s cubic-bezier(0.4,0,0.2,1) both; animation-delay: 0.08s; }
        .ep-input { width: 100%; background: #ede9fe; border: none; border-radius: 10px; padding: 13px 16px; font-family: 'Kamerik 105', sans-serif; font-size: 14px; color: #111; outline: none; transition: box-shadow 0.2s ease, background 0.2s ease; box-sizing: border-box; }
        .ep-input::placeholder { color: #a78bfa; }
        .ep-input:focus { background: #ddd6fe; box-shadow: 0 0 0 2px #7C3AED44; }
        .ep-textarea { width: 100%; min-height: 140px; background: #ede9fe; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; font-family: 'Kamerik 105', sans-serif; font-size: 14px; color: #111; outline: none; resize: vertical; line-height: 1.7; transition: box-shadow 0.2s ease, background 0.2s ease; box-sizing: border-box; }
        .ep-textarea::placeholder { color: #a78bfa; }
        .ep-textarea:focus { background: #ddd6fe; box-shadow: 0 0 0 2px #7C3AED44; }
        .ep-section-card { background: white; border-radius: 16px; padding: 28px 32px; border: 1px solid #e5e7eb; }
        .ep-section-title { display: flex; align-items: center; gap: 10px; font-family: 'Kamerik 105', sans-serif; font-size: 18px; font-weight: 700; color: #111; margin-bottom: 24px; }
        .ep-label { font-family: 'Kamerik 105', sans-serif; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 8px; display: block; }
        .ep-upload-btn { background: #ede9fe; color: #7C3AED; border: none; border-radius: 999px; padding: 9px 22px; font-family: 'Kamerik 105', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s ease, transform 0.18s ease; }
        .ep-upload-btn:hover { background: #ddd6fe; transform: translateY(-1px); }
        .ep-discard-btn { background: none; border: none; font-family: 'Kamerik 105', sans-serif; font-size: 14px; font-weight: 600; color: #6b7280; cursor: pointer; padding: 10px 20px; border-radius: 999px; transition: background 0.18s, color 0.18s; }
        .ep-discard-btn:hover { background: #f3f4f6; color: #111; }
        .ep-save-btn { display: flex; align-items: center; gap: 8px; background: #7C3AED; color: white; border: none; border-radius: 999px; padding: 11px 28px; font-family: 'Kamerik 105', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.2s ease, transform 0.18s ease, box-shadow 0.2s ease; }
        .ep-save-btn:hover { background: #6D28D9; transform: translateY(-2px); box-shadow: 0 8px 22px rgba(124,58,237,0.32); }
        .ep-save-btn:active { transform: translateY(0); box-shadow: none; }
        .ep-rich-btn { background: none; border: none; cursor: pointer; padding: 4px 7px; border-radius: 6px; font-size: 14px; color: #37274D; font-weight: 700; transition: background 0.15s; font-family: serif; line-height: 1; }
        .ep-rich-btn:hover { background: #f3f4f6; color: #111; }
        .ep-completion-bar-bg { width: 100%; height: 7px; background: #e5e7eb; border-radius: 999px; overflow: hidden; margin: 10px 0 6px; }
        .ep-completion-bar-fill { height: 100%; border-radius: 999px; background: #B8FF00; transition: width 0.5s cubic-bezier(0.4,0,0.2,1); }
      `}</style>

      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        <main className="flex-1 overflow-auto" style={{ backgroundColor: '#f3f4f6', padding: '40px 32px 80px' }}>

            {}
            <h1 style={{
              fontFamily: "'Kamerik 105', sans-serif",
              fontSize: '28px', fontWeight: 800, color: '#111',
              marginBottom: '32px', letterSpacing: '-0.4px',
            }}>
              {t('editBusinessProfile')}
            </h1>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

              {}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '260px', flexShrink: 0 }}>

                {}
                <div className="ep-section-card ep-card ep-card-1" style={{ textAlign: 'center' }}>
                  <div className="ep-avatar" style={{
                    width: '120px', height: '120px', borderRadius: '50%',
                    border: '4px solid #B8FF00', margin: '0 auto 16px',
                    backgroundColor: '#e5e7eb', overflow: 'hidden',
                  }}>
                    {}
                    <img src={previewUrl} alt={companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <p style={{
                    fontFamily: "'Kamerik 105', sans-serif",
                    fontWeight: 700, fontSize: '17px', color: '#111',
                    marginBottom: '16px',
                  }}>
                    {companyName}
                  </p>

                  <input
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
                <div className="ep-section-card ep-card ep-card-2" style={{ padding: '20px 24px' }}>
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
                  <div className="ep-completion-bar-bg">
                    <div className="ep-completion-bar-fill" style={{ width: `${completionPct}%` }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img src="/icons/check circle.png" alt="" style={{ width: '11px', height: '11px' }} onError={e => (e.currentTarget.style.display = 'none')} />
                    <span style={{ fontFamily: "'Kamerik 105', sans-serif", fontSize: '12px', color: '#6b7280' }}>
                      {completionLabel}
                    </span>
                  </div>
                </div>
              </div>

              {}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {}
                <div className="ep-section-card ep-card ep-card-1">
                  <div className="ep-section-title">
                    <img src="/icons/buisness icon.png" alt="" style={{ width: '22px', height: '22px' }} onError={e => (e.currentTarget.style.display = 'none')} />
                    {t('businessIdentity')}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label className="ep-label">{t('legalCompanyName')}</label>
                      <input title={t('legalCompanyName')} className="ep-input" placeholder={t('legalCompanyName')} value={form.legalCompanyName} onChange={handleChange('legalCompanyName')} />
                    </div>
                    <div>
                      <label className="ep-label">{t('category')}</label>
                      <input title={t('category')} className="ep-input" placeholder={t('category')} value={form.category} onChange={handleChange('category')} />
                    </div>
                    <div>
                      <label className="ep-label">{t('tradeRegister')}</label>
                      <input title={t('tradeRegister')} className="ep-input" placeholder={t('tradeRegister')} value={form.tradeRegister} onChange={handleChange('tradeRegister')} />
                    </div>
                    <div>
                      <label className="ep-label">{t('tin')}</label>
                      <input title={t('tin')} className="ep-input" placeholder={t('tin')} value={form.tin} onChange={handleChange('tin')} />
                    </div>
                  </div>
                </div>

                {}
                <div className="ep-section-card ep-card ep-card-2">
                  <div className="ep-section-title">
                    <img src="/icons/buisness icon.png" alt="" style={{ width: '22px', height: '22px' }} onError={e => (e.currentTarget.style.display = 'none')} />
                    {t('contactLocation')}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label className="ep-label">{t('phoneNumber')}</label>
                      <input title={t('phoneNumber')} className="ep-input" placeholder={t('phoneNumber')} value={form.phoneNumber} onChange={handleChange('phoneNumber')} type="tel" />
                    </div>
                    <div>
                      <label className="ep-label">{t('email')}</label>
                      <input title={t('email')} className="ep-input" placeholder={t('email')} value={form.email} onChange={handleChange('email')} type="email" />
                    </div>
                  </div>
                  <div>
                    <label className="ep-label">{t('headquartersAddress')}</label>
                    <input title={t('headquartersAddress')} className="ep-input" placeholder={t('headquartersAddress')} value={form.headquartersAddress} onChange={handleChange('headquartersAddress')} />
                  </div>
                </div>

                {}
                <div className="ep-section-card ep-card ep-card-3">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div className="ep-section-title" style={{ marginBottom: 0 }}>
                      <img src="/icons/buisness icon.png" alt="" style={{ width: '22px', height: '22px' }} onError={e => (e.currentTarget.style.display = 'none')} />
                      {t('myBio')}
                    </div>
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                      <button className="ep-rich-btn" title="Bold"><b>B</b></button>
                      <button className="ep-rich-btn" title="Italic"><i>I</i></button>
<button className="ep-rich-btn" title="List">
  <img src="/icons/three points.png" alt="List" style={{ width: '15px', height: '15px', objectFit: 'contain' }} onError={e => (e.currentTarget.style.display = 'none')} />
</button>

<button className="ep-rich-btn" title="Link">
  <img src="/icons/link.png" alt="link" style={{ width: '15px', height: '15px', objectFit: 'contain' }} onError={e => (e.currentTarget.style.display = 'none')} />
</button>
                    </div>
                  </div>
                  <label className="ep-label">{t('description')}</label>
                  <textarea
                    title={t('description')}
                    className="ep-textarea"
                    placeholder={t('description')}
                    value={form.bio}
                    onChange={handleChange('bio')}
                  />
                </div>

                {}
                <div className="ep-card ep-card-4" style={{
                  display: 'flex', justifyContent: 'flex-end',
                  alignItems: 'center', gap: '12px',
                }}>
                  {error && (
                    <div style={{
                      color: '#dc2626',
                      fontSize: '13px',
                      fontFamily: "'Kamerik 105', sans-serif",
                      marginRight: 'auto'
                    }}>
                      {error}
                    </div>
                  )}
                  {success && (
                    <div style={{
                      color: '#16a34a',
                      fontSize: '13px',
                      fontFamily: "'Kamerik 105', sans-serif",
                      marginRight: 'auto'
                    }}>
                      {success}
                    </div>
                  )}
                  <button className="ep-discard-btn" onClick={onDiscard} disabled={isSaving}>
                    {t('discardChanges')}
                  </button>
                  <button
                    className="ep-save-btn"
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
          </main>
      </div>
    </>
  );
}
