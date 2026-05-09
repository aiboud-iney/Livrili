"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import NotificationDropdown from "@/components/NotificationDropdown";
import ProfileDropdown from "@/components/ProfileDropdown";
import { LanguageSwitcher } from "@/components/language-switcher";

interface HeaderProps {
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  showProfile: boolean;
  setShowProfile: (show: boolean) => void;
}

export function Header({
  showNotifications,
  setShowNotifications,
  showProfile,
  setShowProfile,
}: HeaderProps) {
  const router = useRouter();
  const { lang } = useLang();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          title="Go to home"
          onClick={() => router.push("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: 0,
          }}
        >
          <div className="w-9 h-9 bg-[#7C3AED] rounded-lg flex items-center justify-center">
            <img
              src="/icons/logo.png"
              alt="Livrili"
              style={{ width: "20px", height: "20px", objectFit: "contain" }}
            />
          </div>
          <span className="text-xl font-semibold text-black">Livrili</span>
        </button>

        <div className="flex items-center gap-3">
          <div ref={notifRef} style={{ position: "relative" }}>
            <button
              title="Notifications"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              style={{
                position: "relative",
                padding: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                borderRadius: "50%",
              }}
            >
              <img
                src="/icons/bell.png"
                alt="Notifications"
                style={{
                  width: "20px",
                  height: "20px",
                  objectFit: "contain",
                }}
              />
            </button>
            <NotificationDropdown show={showNotifications} lang={lang} />
          </div>
          <div ref={profileRef} style={{ position: "relative" }}>
            <button
              title="Profile"
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              style={{
                width: "34px",
                height: "34px",
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
      </div>
    </header>
  );
}
