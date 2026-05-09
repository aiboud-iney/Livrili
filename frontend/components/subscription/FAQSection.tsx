"use client"

import { useState } from "react"
import { FAQ_ITEMS } from "@/lib/mock/plans"

interface FAQSectionProps {
  lang: "en" | "fr"
}

const translations = {
  en: { title: "Frequently Asked Questions" },
  fr: { title: "Questions fréquentes" },
}

export function FAQSection({ lang }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 24px 0 24px" }}>
      <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#111111", textAlign: "center", marginBottom: "40px" }}>
        {translations[lang].title}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                gap: "16px",
              }}
            >
              <span style={{ fontSize: "15px", fontWeight: 600, color: "#111111" }}>
                {item.question[lang]}
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                style={{
                  flexShrink: 0,
                  transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              >
                <path d="M5 7.5l5 5 5-5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {openIndex === i && (
              <div style={{ padding: "0 24px 20px 24px" }}>
                <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.7, margin: 0 }}>
                  {item.answer[lang]}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}