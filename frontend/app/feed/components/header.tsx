"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import NotificationDropdown from "@/components/NotificationDropdown";
import ProfileDropdown from "@/components/ProfileDropdown";
import { LanguageSwitcher } from "@/components/language-switcher";

const MOBILE_BREAKPOINT = 768;

const getRoutes = (role: string | null) => ({
  home: role === 'admin' ? "/Admin-Dashboard/feed" : "/feed",
  postShipment: "/post-shipment",
  publishRoute: "/publish-route",
});

type Routes = ReturnType<typeof getRoutes>;

const translations = {
  en: {
    publish: "Publish",
    postShipment: "Post a Shipment",
    publishRoute: "Publish a Route",
  },
  fr: {
    publish: "Publier",
    postShipment: "Publier une expédition",
    publishRoute: "Publier un itinéraire",
  },
};

export function Header() {
  const router = useRouter();
  const { lang } = useLang();
  const { role } = useAuth();
  const t = translations[lang];

  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const publishBtnRef = useRef<HTMLButtonElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handlePublishBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (
      e.relatedTarget !== publishBtnRef.current &&
      !(e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget))
    ) {
      setShowPublish(false);
    }
  };

  const NotifButton = ({ padding = 8 }: { padding?: number }) => (
    <div ref={notifRef} style={{ position: "relative" }}>
      <button
        onClick={() => { setShowNotifs((p) => !p); setShowProfile(false); }}
        style={{ position: "relative", padding: `${padding}px`, background: "none", border: "none", cursor: "pointer", borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <img src="/icons/bell.png" alt="notifications" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
      </button>
      <NotificationDropdown show={showNotifs} lang={lang} />
    </div>
  );

  const AvatarButton = ({ size = 36 }: { size?: number }) => (
    <div ref={profileRef} style={{ position: "relative" }}>
      <button
        title="show profile"
        onClick={() => { setShowProfile((p) => !p); setShowNotifs(false); }}
        style={{ width: `${size}px`, height: `${size}px`, borderRadius: "50%", backgroundColor: "#F5A962", border: "none", cursor: "pointer" }}
      />
      <ProfileDropdown show={showProfile} />
    </div>
  );

  return (
    <header style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {}
        <button onClick={() => router.push(getRoutes(role).home)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "36px", height: "36px", backgroundColor: "#7C3AED", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <img src="/icons/logo.png" alt="Livrili" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
          </div>
          <span style={{ fontSize: "20px", fontWeight: 600, color: "#000" }}>Livrili</span>
          {mounted && role === "admin" && (
            <span style={{
              backgroundColor: "#DC2626",
              color: "white",
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "999px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              marginLeft: "6px",
            }}>
              Admin
            </span>
          )}
        </button>

        {}
        {!mounted ? (

          <div style={{ width: "120px" }} />
        ) : isMobile ? (

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <LanguageSwitcher />
            <NotifButton padding={6} />
            <AvatarButton size={32} />
          </div>
        ) : (

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ position: "relative" }}>
              <button
                title="click to publish"
                type="button"
                ref={publishBtnRef}
                onClick={() => setShowPublish((p) => !p)}
                aria-haspopup="menu"
                aria-expanded={showPublish}
                style={{ backgroundColor: "#7C3AED", color: "white", borderRadius: "999px", padding: "10px 20px", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "background-color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6D28D9")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#7C3AED")}
              >
                <img src="/icons/plus.png" alt="publish" style={{ width: "16px", height: "16px", objectFit: "contain" }} />
                {t.publish}
              </button>

              {showPublish && (
                <div tabIndex={-1} onBlur={handlePublishBlur} style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, backgroundColor: "white", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb", overflow: "hidden", minWidth: "200px", zIndex: 100, outline: "none" }}>
                  <button onClick={() => { router.push("/post-shipment"); setShowPublish(false); }} style={{ width: "100%", padding: "12px 16px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 600, color: "#111", display: "flex", alignItems: "center", gap: "10px" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f4f0ff")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#7C3AED", flexShrink: 0 }} />
                    {t.postShipment}
                  </button>
                  <button onClick={() => { router.push("/post-route"); setShowPublish(false); }} style={{ width: "100%", padding: "12px 16px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 600, color: "#111", display: "flex", alignItems: "center", gap: "10px" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f4ffe0")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#B8FF00", flexShrink: 0 }} />
                    {t.publishRoute}
                  </button>
                </div>
              )}
            </div>

            <NotifButton padding={8} />
            <AvatarButton size={36} />
            <LanguageSwitcher />
          </div>
        )}
      </div>
    </header>
  );
}
