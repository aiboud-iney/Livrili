'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProfilePage } from './components/ProfilePage';
import Parametres from './components/parametres';
import { Sidebar } from './components/sidebar';
import { Header } from './components/header';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const SERVER_URL = API_BASE_URL.replace('/api', '');

type ProfileData = {
  companyName: string;
  userEmail: string;
  phone: string;
  tinNif: string;
  tradeRegister: string;
  userType: string;
  verified: boolean;
  verification: boolean;
  createdAt: string;
  bioContent: string;
  profilePicture?: string;
  category?: string;
  headquartersAddress?: string;
  id?: string;
};

type LoadingState = 'loading' | 'success' | 'error';

export default function Profile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [error, setError] = useState<string>('');
  const [visible, setVisible] = useState(false);

  const showSettings = searchParams.get('tab') === 'settings';

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoadingState('loading');

        const userStr = localStorage.getItem('user');
        if (!userStr) {
          router.push('/login');
          return;
        }

        const localUser = JSON.parse(userStr);
        const token = localStorage.getItem('authToken');

        if (!token || !localUser.id) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/users/${localUser.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        const user = data.user;

        const formatImageUrl = (path?: string) => {
          if (!path) return undefined;
          if (path.startsWith('http')) return path;

          const fileName = path.split(/[\\/]/).pop();

          return `${SERVER_URL}/uploads/profile-pictures/${fileName}`;
        };

        setProfileData({
          companyName:   user.business_name,
          userEmail:     user.email,
          phone:         user.phone_number,
          tinNif:        user.tin_nif,
          tradeRegister: user.trade_register,
          userType:      user.user_type,
          verified:      user.verified,
          verification:  user.verification,
          createdAt:     user.created_at,
          bioContent:    user.more_details || '',
          profilePicture: formatImageUrl(user.profile_picture),
          category:      user.category || '',
          headquartersAddress: user.headquarters_address || '',
          id:            user.id,
        });

        setLoadingState('success');
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
        setLoadingState('error');
      }
    };

    fetchProfileData();
    setVisible(true);
  }, [router]);

  if (loadingState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (loadingState === 'error' || !profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load profile'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease, transform 0.5s ease"
        }}
      >
        <Parametres />
      </div>
    );
  }

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease"
      }}
    >
      <ProfilePage
        companyName={profileData.companyName}
        userEmail={profileData.userEmail}
        phone={profileData.phone}
        tinNif={profileData.tinNif}
        tradeRegister={profileData.tradeRegister}
        userType={profileData.userType}
        verified={profileData.verified}
        verification={profileData.verification}
        createdAt={profileData.createdAt}
        location={profileData.headquartersAddress || "Algiers, Algeria"}
        bioContent={profileData.bioContent}
        profilePicture={profileData.profilePicture}
        category={profileData.category}
        userId={profileData.id}
        rating={4.8}
        reviews={128}
      />
    </div>
  );
}