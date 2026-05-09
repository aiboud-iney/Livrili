'use client';

import { useLang } from '@/contexts/LanguageContext'
interface BioSectionProps {
  bioContent: string;
}

export function BioSection({ bioContent }: BioSectionProps) {
  const { t } = useLang();

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bio-label-enter { animation: fadeSlideUp 0.5s ease both; animation-delay: 0.40s; }
        .bio-card-enter  { animation: fadeSlideUp 0.5s ease both; animation-delay: 0.46s; }
      `}</style>

      <div style={{ marginTop: '48px' }}>
        <h2
          className="bio-label-enter"
          style={{
            fontFamily: "'Kamerik 105', sans-serif",
            fontSize: '12px', fontWeight: 700,
            color: '#7C3AED', letterSpacing: '0.1em',
            marginBottom: '20px',
          }}
        >
          {t('myBio')}
        </h2>

        <div
          className="bio-card-enter"
          style={{
            backgroundColor: 'white', borderRadius: '16px',
            padding: '32px', border: '1px solid #e5e7eb',
          }}
        >
          <p style={{
            fontFamily: "'Kamerik 105', sans-serif",
            fontSize: '14px', color: '#6b7280',
            lineHeight: '1.85',
          }}>
            {bioContent}
          </p>
        </div>
      </div>
    </>
  );
}