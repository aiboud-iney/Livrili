"use client"

import { useRouter } from "next/navigation"
import { BillingCycle, Plan } from "@/lib/mock/plans"
import { PLANS } from "@/lib/mock/plans"

interface PlanCardProps {
  plan: Plan
  billingCycle: BillingCycle
  isSelected: boolean
  lang: "en" | "fr"
  onSelect: (planId: string) => void
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 }).format(amount)
}

const CHECK_ICON = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="10" fill="#7C3AED" fillOpacity="0.15" />
    <path d="M6 10.5l2.5 2.5 5.5-5.5" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CROSS_ICON = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="10" fill="#F3F4F6" />
    <path d="M7 7l6 6M13 7l-6 6" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export function PlanCard({ plan, billingCycle, isSelected, lang, onSelect }: PlanCardProps) {
  const router = useRouter()
  const price = plan.price[billingCycle]
  const isFree = plan.price.monthly === 0
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  const handleCTAClick = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (isFree) {

      try {
        const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
        const response = await fetch(`${API_BASE_URL}/userSubs/choose`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
          },
          body: JSON.stringify({ plan: 'free' })
        })

        router.push("/Dashboard")
      } catch (err) {
        console.error('Error selecting free plan:', err)
        router.push("/Dashboard")
      }
    } else {

      const amount = billingCycle === "monthly" ? "60000" : "600000"
      router.push(`/payment?billingCycle=${billingCycle}&amount=${amount}`)
    }
  }

  return (
    <div
      onClick={() => onSelect(plan.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(plan.id)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        padding: "32px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        border: plan.highlighted ? "2px solid #7C3AED" : "2px solid #E5E7EB",
        backgroundColor: "#ffffff",
        boxShadow: plan.highlighted
          ? "0 4px 24px rgba(124, 58, 237, 0.10)"
          : "0 1px 4px rgba(0,0,0,0.05)",
        outline: "none",
        flex: 1,
      }}
    >
      {}
      {plan.badge && (
        <div style={{
          position: "absolute",
          top: "-14px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#7C3AED",
          color: "#ffffff",
          fontSize: "11px",
          fontWeight: 700,
          padding: "4px 16px",
          borderRadius: "999px",
          whiteSpace: "nowrap",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}>
          {plan.badge[lang]}
        </div>
      )}

      {}
      <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#111111", marginBottom: "6px" }}>
        {plan.name[lang]}
      </h3>

      {}
      <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "24px" }}>
        {plan.tagline[lang]}
      </p>

      {}
      {isFree ? (
        <div style={{ marginBottom: "8px" }}>
          <span style={{ fontSize: "42px", fontWeight: 800, color: "#111111", letterSpacing: "-1px" }}>0 DZD</span>
          <span style={{ fontSize: "15px", color: "#6B7280", marginLeft: "4px" }}>/mo</span>
        </div>
      ) : (
        <div style={{ marginBottom: "8px" }}>
          <span style={{ fontSize: "42px", fontWeight: 800, color: "#111111", letterSpacing: "-1px" }}>
            {formatPrice(price)} DZD
          </span>
          <span style={{ fontSize: "15px", color: "#6B7280", marginLeft: "4px" }}>
            {billingCycle === "yearly" ? "/mo (billed annually)" : "/mo"}
          </span>
        </div>
      )}

      {}
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
        {plan.features.map((feature, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: feature.included ? "#111111" : "#9CA3AF", fontWeight: feature.included ? 500 : 400 }}>
            {feature.included ? CHECK_ICON : CROSS_ICON}
            {feature.text[lang]}
          </li>
        ))}
      </ul>

      {}
      <button
        onClick={handleCTAClick}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: plan.highlighted ? "none" : "1.5px solid #E5E7EB",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: 600,
          transition: "all 0.2s ease",
          backgroundColor: plan.highlighted ? "#7C3AED" : "transparent",
          color: plan.highlighted ? "#ffffff" : "#7C3AED",
          marginTop: "auto",
        }}
        onMouseEnter={(e) => {
          if (plan.highlighted) {
            e.currentTarget.style.backgroundColor = "#6D28D9"
          } else {
            e.currentTarget.style.backgroundColor = "#F5F3FF"
          }
        }}
        onMouseLeave={(e) => {
          if (plan.highlighted) {
            e.currentTarget.style.backgroundColor = "#7C3AED"
          } else {
            e.currentTarget.style.backgroundColor = "transparent"
          }
        }}
      >
        {plan.ctaLabel[lang]}
      </button>
    </div>
  )
}
