"use client"

import { useLang } from "@/contexts/LanguageContext"

type FeedType = "shipments" | "routes"

interface FeedToggleProps {
  active: FeedType
  onChange: (type: FeedType) => void
}

const translations = {
  en: { shipments: "Shipments", routes: "Routes" },
  fr: { shipments: "Expéditions", routes: "Trajets" },
}

export function FeedToggle({ active, onChange }: FeedToggleProps) {
  const { lang } = useLang()
  const t = translations[lang]

  return (
    <div style={{ display: "inline-flex", backgroundColor: "#ffffff", borderRadius: "999px", padding: "4px", border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      {(["shipments", "routes"] as FeedType[]).map((type) => {
        const isActive = active === type
        const activeColor = type === "routes" ? "#84cc16" : "#7C3AED"
        const activeShadow = type === "routes" ? "rgba(132,204,22,0.3)" : "rgba(124,58,237,0.3)"
        const activeText = type === "routes" ? "#111" : "#ffffff"
        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            style={{ padding: "8px 28px", borderRadius: "999px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 700, transition: "all 0.2s ease", backgroundColor: isActive ? activeColor : "transparent", color: isActive ? activeText : "#6b7280", boxShadow: isActive ? `0 2px 8px ${activeShadow}` : "none" }}
          >
            {type === "shipments" ? t.shipments : t.routes}
          </button>
        )
      })}
    </div>
  )
}
