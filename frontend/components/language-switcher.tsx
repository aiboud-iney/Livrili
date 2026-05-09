"use client"

import { useState, useRef, useEffect } from "react"
import { useLang } from "@/contexts/LanguageContext"

export function LanguageSwitcher() {
  const { lang, setLang } = useLang()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        style={{
          fontFamily: "'Kamerik 105', sans-serif",
          fontWeight: 700,
          fontSize: "13px",
          cursor: "pointer",
          border: "1.5px solid #e5e7eb",
          borderRadius: "8px",
          padding: "6px 12px",
          background: "none",
          color: "#111111",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          transition: "border-color 0.2s, color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#7C3AED"
          e.currentTarget.style.color = "#7C3AED"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#e5e7eb"
          e.currentTarget.style.color = "#111111"
        }}
      >
        {lang === "en" ? "EN" : "FR"}
        <img src="/icons/icon down 1.png" alt="down" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
      </button>

      {dropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            backgroundColor: "#ffffff",
            border: "1.5px solid #e5e7eb",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            overflow: "hidden",
            minWidth: "120px",
            zIndex: 9999,
          }}
        >
          {[
            { code: "en" as const, label: "English" },
            { code: "fr" as const, label: "Français" },
          ].map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => {
                setLang(option.code)
                setDropdownOpen(false)
              }}
              style={{
                width: "100%",
                padding: "10px 16px",
                textAlign: "left",
                background: lang === option.code ? "#f4f0ff" : "none",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: lang === option.code ? 700 : 500,
                color: lang === option.code ? "#7C3AED" : "#333333",
                transition: "background 0.15s",
                fontFamily: "'Kamerik 105', sans-serif",
              }}
              onMouseEnter={(e) => {
                if (lang !== option.code) e.currentTarget.style.backgroundColor = "#f9f9f9"
              }}
              onMouseLeave={(e) => {
                if (lang !== option.code) e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
