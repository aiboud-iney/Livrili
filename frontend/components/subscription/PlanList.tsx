"use client"

import { useState } from "react"
import { PLANS, CURRENT_USER_PLAN, BillingCycle } from "@/lib/mock/plans"
import { PlanCard } from "@/components/subscription/PlanCard"

interface PlanListProps {
  billingCycle: BillingCycle
  lang: "en" | "fr"
}

export function PlanList({ billingCycle, lang }: PlanListProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(CURRENT_USER_PLAN.planId)

  const handleSelect = (planId: string) => {
    setSelectedPlanId(planId)

  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px",
        maxWidth: "800px",
        width: "100%",
        margin: "0 auto",
        alignItems: "stretch",
      }}
    >
      {PLANS.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          billingCycle={billingCycle}
          isSelected={selectedPlanId === plan.id}
          lang={lang}
          onSelect={handleSelect}
        />
      ))}
    </div>
  )
}