"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import NotificationDropdown from "@/components/NotificationDropdown";
import ProfileDropdown from "@/components/ProfileDropdown";
import { LanguageSwitcher } from "@/components/language-switcher";

const ROUTES = {
  home: "/feed",
  postShipment: "/post-shipment",
  publishRoute: "/publish-route",
} as const;

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
  const t = translations[lang];

  const [showNotifs, setShowNotifs] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const publishBtnRef = useRef<HTMLButtonElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const isExpanded = showPublish ? "true" : "false" as const;

  const handlePublishBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (
      e.relatedTarget !== publishBtnRef.current &&
      !(
        e.relatedTarget instanceof Node &&
        e.currentTarget.contains(e.relatedTarget)
      )
    ) {
      setShowPublish(false);
    }
  };

  return (
    <header
      className="bg-white border-b border-gray-200 sticky top-0 z-50"

>
      {}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {}
        <button
          onClick={() => router.push(ROUTES.home)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
          className="flex items-center gap-2"
        >
          <div
            className="w-9 h-9 bg-[#7C3AED] flex items-center justify-center"
            style={{ borderRadius: "10px" }}
          >
            <img
              src="/icons/logo.png"
              alt="Livrili"
              className="w-5 h-5 object-contain"
            />
          </div>
          <span className="text-xl font-semibold text-black">Livrili</span>
        </button>

        {}
        <div className="hidden md:flex items-center gap-4">
          {}

          <div style={{ position: "relative" }}>

            <button
  type="button"
  ref={publishBtnRef}
  onClick={() => setShowPublish((prev) => !prev)}
  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full px-5 py-[10px] text-sm font-bold border-0 cursor-pointer flex items-center gap-2 transition-colors"
  aria-haspopup="menu"
  aria-expanded={showPublish}
>
  <img
    src="/icons/plus.png"
    alt="publish"
    className="w-4 h-4 object-contain"
  />
  {t.publish}
</button>

            {showPublish && (
              <div
                tabIndex={-1}
                onBlur={handlePublishBlur}
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  border: "1px solid #e5e7eb",
                  overflow: "hidden",
                  minWidth: "200px",
                  zIndex: 100,
                  outline: "none",
                }}
              >
                <button
                  onClick={() => {
                    router.push("/post-shipment");
                    setShowPublish(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#111",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f4f0ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "#7C3AED",
                      flexShrink: 0,
                    }}
                  />
                  {t.postShipment}
                </button>
                <button
                  onClick={() => {
                    router.push("/post-route");
                    setShowPublish(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#111",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f4ffe0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "#B8FF00",
                      flexShrink: 0,
                    }}
                  />
                  {t.publishRoute}
                </button>
              </div>
            )}
          </div>

          {}
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

          {}
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

        {}
        <div className="flex md:hidden items-center gap-3">
         <LanguageSwitcher />

          {}
          <div ref={notifRef} style={{ position: "relative" }}>
            <button
              onClick={() => {
                setShowNotifs((prev) => !prev);
                setShowProfile(false);
              }}
              style={{
                position: "relative",
                padding: "6px",
                background: "none",
                border: "none",
                cursor: "pointer",
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/icons/bell.png"
                alt="notifications"
                className="w-5 h-5 object-contain"
              />
            </button>
            <NotificationDropdown show={showNotifs} lang={lang} />
          </div>

          {}
          <div ref={profileRef} style={{ position: "relative" }}>
            <button
              title="show profile"
              onClick={() => {
                setShowProfile((prev) => !prev);
                setShowNotifs(false);
              }}
              style={{
                width: "32px",
                height: "32px",
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
