"use client"

import { useState } from "react"
import { useLang } from "@/contexts/LanguageContext"
import { BillingCycle } from "@/lib/mock/plans"
import { PricingToggle } from "@/components/subscription/PricingToggle"
import { PlanList } from "@/components/subscription/PlanList"
import { FAQSection } from "@/components/subscription/FAQSection"

const translations = {
  en: {
    title: "Choose Your Plan",
    subtitle: "Select the plan that matches your business needs. Scales from solo entrepreneurs to global enterprises.",
    toggle: { monthly: "Monthly", yearly: "Yearly", discount: "SAVE 17%" },
  },
  fr: {
    title: "Choisissez votre plan",
    subtitle: "Sélectionnez le plan adapté à vos besoins. De l'entrepreneur solo aux grandes entreprises.",
    toggle: { monthly: "Mensuel", yearly: "Annuel", discount: "-17%" },
  },
}

export function PricingSection() {
  const { lang } = useLang()
  const typedLang = lang as "en" | "fr"
  const t = translations[typedLang]
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")

  return (
    <section style={{ width: "100%", backgroundColor: "#F5F5F5", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: "#111111", letterSpacing: "-1px", lineHeight: 1.1, marginBottom: "16px" }}>
            {t.title}
          </h1>
          <p style={{ fontSize: "16px", color: "#6B7280", maxWidth: "480px", margin: "0 auto 32px auto", lineHeight: 1.6 }}>
            {t.subtitle}
          </p>
          <PricingToggle value={billingCycle} onChange={setBillingCycle} labels={t.toggle} />
        </div>

        {}
        <PlanList billingCycle={billingCycle} lang={typedLang} />

        {}
        <FAQSection lang={typedLang} />

      </div>
    </section>
  )
}