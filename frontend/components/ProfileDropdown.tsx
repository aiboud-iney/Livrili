"use client"

import { forwardRef } from "react"
import { useRouter } from "next/navigation"
import { useLang } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"

interface Props {
  show: boolean
}

const translations = {
  en: {
    profile: "My Profile",
    home:"Home",
    dashboard: "Dashboard",
    logout: "Log Out",
  },
  fr: {
    profile: "Mon Profil",
    home:"Accueil",
    dashboard: "Tableau de Bord",
    logout: "Déconnexion",
  },
}

const ProfileDropdown = forwardRef<HTMLDivElement, Props>(({ show }, ref) => {
  const router   = useRouter()
  const { lang } = useLang()
  const { role, logout } = useAuth()
  const t        = translations[lang ?? "en"]

  const menuItems = [
    {
      label: t.home,
      href: role === 'admin' ? "/Admin-Dashboard/feed" : "/feed",
      icon:"/icons/home dropdown.png",
    },
    {
      label: t.profile,
      href: "/profile",
      icon: "/icons/me.png",
    },
    {
      label: t.dashboard,
      href: role === 'admin' ? "/Admin-Dashboard" : "/Dashboard",
      icon: "/icons/dashboard.png",
    },
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          backgroundColor: "white",
          color: "#846E98",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          border: "1px solid #7E52FF",
          zIndex: 100,
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(-8px)",
          pointerEvents: show ? "auto" : "none",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          width: "200px",
          overflow: "hidden",
          padding: "8px 0",
        }}
      >
        {}
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            style={{
              width: "100%",
              padding: "11px 20px",
              textAlign: "left",
              background: "none",
              border: "none",
              fontSize: "14px",
              fontWeight: 500,
              color: "#6b7280",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "background 0.15s",
              borderBottom: index < menuItems.length - 1 ? "1px solid #f3f4f6" : "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f3ff")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <img src={item.icon} alt="" width={18} height={18} style={{ opacity: 0.6 }} />
            {item.label}
          </button>
        ))}

        {}
        <div style={{ borderTop: "1px solid #f3f4f6", margin: "4px 0" }} />

        {}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "11px 20px",
            textAlign: "left",
            background: "none",
            border: "none",
            fontSize: "14px",
            fontWeight: 500,
            color: "#846E98",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f3ff")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <img src="/icons/out.png" alt="" width={18} height={18} style={{ opacity: 0.6 }} /> {}
          {t.logout}
        </button>
      </div>
    </div>
  )
})

ProfileDropdown.displayName = "ProfileDropdown"
export default ProfileDropdown