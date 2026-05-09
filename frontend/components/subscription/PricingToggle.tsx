"use client"

import { BillingCycle } from "@/lib/mock/plans"

interface PricingToggleProps {
  value: BillingCycle
  onChange: (cycle: BillingCycle) => void
  labels: { monthly: string; yearly: string; discount: string }
}

export function PricingToggle({ value, onChange, labels }: PricingToggleProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
      <span style={{ fontSize: "14px", fontWeight: 500, color: value === "monthly" ? "#111111" : "#6B7280" }}>
        {labels.monthly}
      </span>

      {}
      <div
        onClick={() => onChange(value === "monthly" ? "yearly" : "monthly")}
        style={{
          width: "44px",
          height: "24px",
          borderRadius: "999px",
          backgroundColor: "#7C3AED",
          position: "relative",
          cursor: "pointer",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "3px",
            left: value === "yearly" ? "23px" : "3px",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            transition: "left 0.2s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </div>

      <span style={{ fontSize: "14px", fontWeight: 500, color: value === "yearly" ? "#111111" : "#6B7280" }}>
        {labels.yearly}
      </span>

      {}
      <span style={{
        backgroundColor: "#EDE9FE",
        color: "#7C3AED",
        fontSize: "11px",
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: "999px",
        letterSpacing: "0.3px",
      }}>
        {labels.discount}
      </span>
    </div>
  )
}