'use client';

import { useLang } from '@/contexts/LanguageContext';

interface ProfileCardProps {
  profileImage?: string;
  companyName: string;
  location: string;
  rating: number;
  reviews: number;
  onEditProfile?: () => void;
}

export function ProfileCard({
  profileImage = 'profile-placeholder.jpg',
  companyName,
  location,
  rating,
  reviews,
  onEditProfile,
}: ProfileCardProps) {
  const { t } = useLang();

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.85); }
          65%  { transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          from { background-position: -200% center; }
          to   { background-position:  200% center; }
        }

        .avatar-enter   { animation: popIn 0.55s cubic-bezier(0.4,0,0.2,1) both; animation-delay: 0.1s; }
        .info-enter     { animation: fadeSlideUp 0.5s ease both; animation-delay: 0.18s; }
        .name-enter     { animation: fadeSlideUp 0.5s ease both; animation-delay: 0.22s; }
        .loc-enter      { animation: fadeSlideUp 0.5s ease both; animation-delay: 0.28s; }
        .actions-enter  { animation: fadeSlideUp 0.5s ease both; animation-delay: 0.34s; }

        .edit-btn {
          position: relative;
          overflow: hidden;
          transition: background-color 0.22s ease, transform 0.18s ease, box-shadow 0.22s ease;
          cursor: pointer;
        }
        .edit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%);
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .edit-btn:hover {
          background-color: #6D28D9 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(124,58,237,0.32);
        }
        .edit-btn:hover::after {
          opacity: 1;
          animation: shimmer 0.55s linear;
        }
        .edit-btn:active { transform: translateY(0); box-shadow: none; }
      `}</style>

      <div className="flex items-start gap-8">

        {}
        <div className="flex-shrink-0 avatar-enter">
          <div
            style={{
              width: '160px', height: '160px', borderRadius: '50%',
              border: '4px solid #B8FF00', backgroundColor: '#e5e7eb',
              overflow: 'hidden',
            }}
          >
            {}
            <img
              src={profileImage}
              alt={companyName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.currentTarget.src = '/profile-placeholder.jpg'; }}
            />
          </div>
        </div>

        {}
        <div className="flex-1 pt-4">
          <h1 className="name-enter" style={{
            fontFamily: "'Kamerik 105', sans-serif",
            fontSize: '36px', fontWeight: 700, color: '#111',
            marginBottom: '16px', letterSpacing: '-0.5px',
          }}>
            {companyName}
          </h1>

          <div className="loc-enter flex items-center gap-2" style={{ marginBottom: '24px' }}>
            <img src="/icons/localisation.png" alt="location" className="w-5 h-5 object-contain" />
            <span style={{ fontFamily: "'Kamerik 105', sans-serif", fontSize: '14px', color: '#4b5563' }}>
              {location}
            </span>
          </div>

          <div className="actions-enter flex items-center gap-6" style={{ marginBottom: '32px' }}>
            {}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: 'white', padding: '8px 16px',
              borderRadius: '8px', border: '1px solid #e5e7eb',
            }}>
              <img src="/icons/yellowstar.png" alt="rating" className="w-5 h-5 object-contain" />
              <span style={{ fontFamily: "'Kamerik 105', sans-serif", fontWeight: 700, color: '#111' }}>
                {rating}
              </span>
              <span style={{ fontFamily: "'Kamerik 105', sans-serif", fontSize: '13px', color: '#6b7280' }}>
                ({reviews} {t('reviews')})
              </span>
            </div>

            {}
            <button
              onClick={onEditProfile}
              className="edit-btn"
              style={{
                backgroundColor: '#7E52FF', color: 'white',
                padding: '9px 24px', borderRadius: '999px',
                border: 'none', fontFamily: "'Kamerik 105', sans-serif",
                fontSize: '14px', fontWeight: 600,
              }}
            >
              {t('editProfile')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}