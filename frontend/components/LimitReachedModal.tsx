"use client"

import { useState } from "react"
import { PlanSelectionModal } from "./subscription/PlanSelectionModal"

const translations = {
  en: {
    title: "Limit Reached",
    message: "You've reached your",
    listings: "5 listings",
    messageEnd: "limit for this month. Upgrade to PRO for unlimited listings!",
    upgradeNow: "Upgrade Now",
    cancel: "Cancel",
    note: "Our monthly plans are pay-as-you-go, cancel anytime.",
  },
  fr: {
    title: "Limite atteinte",
    message: "Vous avez atteint votre limite de",
    listings: "5 annonces",
    messageEnd: "pour ce mois. Passez au PRO pour des annonces illimitées !",
    upgradeNow: "Mettre à niveau",
    cancel: "Annuler",
    note: "Nos plans mensuels sont sans engagement, annulez à tout moment.",
  },
}

interface LimitReachedModalProps {
  isOpen: boolean
  onClose: () => void
  lang: string
}

export function LimitReachedModal({ isOpen, onClose, lang }: LimitReachedModalProps) {
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const t = translations[lang as "en" | "fr"] ?? translations.en

  if (!isOpen) return null

  const handleUpgrade = () => {

    setIsPlanModalOpen(true)
  }

  return (
    <>
      {}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
        }}
      />

      {}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1001,
          width: "90%",
          maxWidth: "480px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "40px 36px 32px 36px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
          textAlign: "center",
        }}
      >
        {}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            color: "#6B7280",
            lineHeight: 1,
            padding: "4px 8px",
          }}
        >

        </button>

        {}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            backgroundColor: "#BFFF00",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px auto",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14.5 9.5H22L16 14L18.5 22L12 17.5L5.5 22L8 14L2 9.5H9.5L12 2Z" fill="#111111" stroke="#111111" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </div>

        {}
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "#111111",
            marginBottom: "14px",
            lineHeight: 1.2,
          }}
        >
          {t.title}
        </h2>

        {}
        <p
          style={{
            fontSize: "15px",
            color: "#374151",
            marginBottom: "32px",
            lineHeight: 1.6,
          }}
        >
          {t.message}{" "}
          <strong style={{ color: "#111111" }}>{t.listings}</strong>{" "}
          {t.messageEnd}
        </p>

        {}
        <button
          onClick={handleUpgrade}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 700,
            backgroundColor: "#111111",
            color: "#ffffff",
            marginBottom: "14px",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          {t.upgradeNow}
        </button>

        {}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: 600,
            backgroundColor: "transparent",
            color: "#6B7280",
            marginBottom: "20px",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#111111"}
          onMouseLeave={e => e.currentTarget.style.color = "#6B7280"}
        >
          {t.cancel}
        </button>

        {}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="11" rx="2" stroke="#7C3AED" strokeWidth="2"/>
            <path d="M8 11V8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8V11" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1.5" fill="#7C3AED"/>
          </svg>
          <p style={{ fontSize: "12px", color: "#9CA3AF" }}>{t.note}</p>
        </div>
      </div>

      {}
      {isPlanModalOpen && (
        <PlanSelectionModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
        />
      )}
    </>
  )
}