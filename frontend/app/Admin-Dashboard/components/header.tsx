'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/contexts/LanguageContext'
import NotificationDropdown from '@/components/NotificationDropdown'
import ProfileDropdown from "./ProfileDropdown";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function Header() {
  const { lang } = useLang()
  const router = useRouter()
  const [showNotifs, setShowNotifs] = useState(false)
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-white border-b border-[#e0e0e0] px-8 py-4 flex items-center justify-between">
      <button
       className="h-9 px-4 text-[13px] font-semibold rounded-md bg-[#FFFFFF] text-[#202020] border border-[#7E52FF] "
      >
        Admin View
      </button>

      <div className="flex items-center gap-4">
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            onClick={() => {
              setShowNotifs((prev) => !prev);
              setShowProfile(false);
            }}
            style={{
              position: "relative",
              padding: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f3f4f6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <img
              src="/icons/bell.png"
              alt="notifications"
              className="w-5 h-5 object-contain"
            />
          </button>
          <NotificationDropdown show={showNotifs} lang={lang} />
        </div>

        <div ref={profileRef} style={{ position: "relative" }}>
          <button
            title="show notifications"
            onClick={() => {
              setShowProfile((prev) => !prev);
              setShowNotifs(false);
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

        <LanguageSwitcher />
      </div>
    </header>
  )
}