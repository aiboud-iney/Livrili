'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { ProfileCard } from './Profilecard';
import { BioSection } from './BioSection';
import { ProfilePageMobile } from './Profilepagemobile';
import { EditProfilePage } from './edit';
import { EditProfileMobile } from './EditProfileMobile';

interface ProfilePageProps {
  companyName: string;
  location: string;
  rating: number;
  reviews: number;
  bioContent?: string;
  profileImage?: string;
  userImage?: string;
  onEditProfile?: () => void;
  userId?: string;
  onProfileUpdated?: () => void;
  userEmail?: string;
  phone?: string;
  tinNif?: string;
  tradeRegister?: string;
  userType?: string;
  verified?: boolean;
  createdAt?: string;
  profilePicture?: string;
}

export function ProfilePage({
  companyName,
  location,
  rating,
  reviews,
  bioContent = '',
  profileImage = '/icons/avatar.png',
  userImage = '/icons/profile.png',
  onEditProfile,
  userId,
  onProfileUpdated,
  userEmail,
  phone,
  tinNif,
  tradeRegister,
  userType,
  verified,
  createdAt,
  profilePicture,
}: ProfilePageProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile === null) return null;

  const handleEdit = onEditProfile ?? (() => setIsEditing(true));

  const displayImage = profilePicture || profileImage;

  const mobileIcons = {
    logo:                '/icons/logo purple.png',
    bell:                '/icons/bell.png',
    location:            '/icons/localisation.png',
    star:                '/icons/yellowstar.png',
    help:                '/icons/help phone.png',
    helpBubbleColor:     '#f3f0ff',
    feedback:            '/icons/phone feedback.png',
    feedbackBubbleColor: '#f3f0ff',
    logout:              '/icons/logout phone.png',
    logoutBubbleColor:   '#fff0f0',
    navHome:             '/icons/home gray phone.png',
    navSettings:         '/icons/settings gray phone.png',
    navDashboard:        '/icons/dashboard gray phone.png',
    navProfile:          '/icons/profile gray phone.png',
    navHomeActive:       '/icons/home-active phone.png',
    navSettingsActive:   '/icons/settings-active phone.png',
    navDashboardActive:  '/icons/dashboard-active phone.png',
    navProfileActive:    '/icons/profile-active phone.png',
  };

  if (!isMobile && isEditing) {
    return (
      <EditProfilePage
        companyName={companyName}
        profileImage={displayImage}
        bioContent={bioContent}
        userId={userId}
        onDiscard={() => setIsEditing(false)}
        onSave={(data) => {

          setIsEditing(false);
          onProfileUpdated?.();
        }}
      />
    );
  }

  if (isMobile && isEditing) {
    return (
      <EditProfileMobile
        companyName={companyName}
        profileImage={displayImage}
        bioContent={bioContent}
        userId={userId}
        onDiscard={() => setIsEditing(false)}
        onSave={(data) => {

          setIsEditing(false);
          onProfileUpdated?.();
        }}
      />
    );
  }

  if (isMobile) {
    return (
      <ProfilePageMobile
        companyName={companyName}
        location={location}
        rating={rating}
        reviews={reviews}
        bioContent={bioContent}
        profileImage={displayImage}
        userImage={userImage}
        onEditProfile={handleEdit}
        icons={mobileIcons}
      />
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden" style={{ marginLeft: '72px' }}>
        <Header />
        <main className="flex-1 overflow-auto bg-white">
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 32px' }}>
            <ProfileCard
              companyName={companyName}
              location={location}
              rating={rating}
              reviews={reviews}
              profileImage={displayImage}
              onEditProfile={handleEdit}
            />
            <BioSection bioContent={bioContent} />
          </div>
        </main>
      </div>
    </div>
  );
}
