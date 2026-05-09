"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLang } from "@/contexts/LanguageContext"
import { PLANS, BillingCycle } from "@/lib/mock/plans"

interface PlanSelectionModalProps {
  isOpen: boolean
  onClose: () => void
}

const translations = {
  en: {
    title: "Select Your Plan to Get Started",
    subtitle: "Join 10,000+ architects building the digital future.",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "SAVE 17%",
    free: "Free",
    forever: "/ forever",
    billedAnnually: "/ mo (billed annually)",
    perMonth: "/ month",
    continueHome: "Continue to Home",
    continuePayment: "Continue to Payment",
    terms: "By signing up, you agree to our",
    termsLink: "Terms of Service",
    and: "and",
    privacyLink: "Privacy Policy",
    recommended: "RECOMMENDED",
  },
  fr: {
    title: "Sélectionnez votre plan pour commencer",
    subtitle: "Rejoignez 10 000+ entreprises qui construisent l'avenir digital.",
    monthly: "Mensuel",
    yearly: "Annuel",
    save: "-17%",
    free: "Gratuit",
    forever: "/ pour toujours",
    billedAnnually: "/ mois (facturé annuellement)",
    perMonth: "/ mois",
    continueHome: "Continuer vers l'accueil",
    continuePayment: "Continuer vers le paiement",
    terms: "En vous inscrivant, vous acceptez nos",
    termsLink: "Conditions d'utilisation",
    and: "et",
    privacyLink: "Politique de confidentialité",
    recommended: "RECOMMANDÉ",
  },
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 }).format(amount)
}

const CHECK_ICON = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="9" fill="#7C3AED" fillOpacity="0.15" />
    <path d="M5 9.5l3 3 5-5.5" stroke="#7C3AED" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CROSS_ICON = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="9" fill="#F3F4F6" />
    <path d="M6 6l6 6M12 6l-6 6" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

export function PlanSelectionModal({ isOpen, onClose }: PlanSelectionModalProps) {
  const router = useRouter()
  const { lang } = useLang()
  const t = translations[lang as "en" | "fr"]

  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const [selectedPlanId, setSelectedPlanId] = useState<string>("free")

  if (!isOpen) return null

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  const handleContinue = async () => {
    if (selectedPlanId === "premium") {

      const amount = billingCycle === "monthly" ? "60000" : "600000"
      router.push(`/payment?billingCycle=${billingCycle}&amount=${amount}`)
    } else {

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

        if (!response.ok) {
          const error = await response.json()
          console.error('Failed to select free plan:', error)
        }

        router.push("/Dashboard")
      } catch (err) {
        console.error('Error selecting free plan:', err)
        router.push("/Dashboard")
      }
    }
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
          maxWidth: "860px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          display: "flex",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
        }}
      >
        {}
        <div
          style={{
            width: "280px",
            flexShrink: 0,
            backgroundColor: "#F5F5F5",
            borderRadius: "24px 0 0 24px",
            padding: "40px 32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" }}>
            <div style={{ width: "36px", height: "36px", backgroundColor: "#7C3AED", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/icons/logo.png" alt="Livrili" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
            </div>
            <span style={{ fontFamily: "'Kamerik 105', sans-serif", fontWeight: 800, fontSize: "18px", color: "#111111" }}>
              Livrili
            </span>
          </div>

          <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#111111", lineHeight: 1.2, marginBottom: "16px" }}>
            {t.title}
          </h2>
          <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6 }}>
            {t.subtitle}
          </p>
        </div>

        {}
        <div style={{ flex: 1, padding: "32px", position: "relative" }}>

          {}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
              color: "#6B7280",
              lineHeight: 1,
              padding: "4px",
            }}
          >

          </button>

          {}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "28px" }}>
            <span style={{ fontSize: "14px", fontWeight: 500, color: billingCycle === "monthly" ? "#111111" : "#6B7280" }}>
              {t.monthly}
            </span>
            <div
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              style={{
                width: "44px", height: "24px", borderRadius: "999px",
                backgroundColor: "#7C3AED", position: "relative", cursor: "pointer",
              }}
            >
              <div style={{
                position: "absolute", top: "3px",
                left: billingCycle === "yearly" ? "23px" : "3px",
                width: "18px", height: "18px", borderRadius: "50%",
                backgroundColor: "#ffffff", transition: "left 0.2s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }} />
            </div>
            <span style={{ fontSize: "14px", fontWeight: 500, color: billingCycle === "yearly" ? "#111111" : "#6B7280" }}>
              {t.yearly}
            </span>
            <span style={{
              backgroundColor: "#EDE9FE", color: "#7C3AED",
              fontSize: "11px", fontWeight: 700,
              padding: "3px 10px", borderRadius: "999px",
            }}>
              {t.save}
            </span>
          </div>

          {}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
            {PLANS.map((plan) => {
              const isSelected = selectedPlanId === plan.id
              const isFree = plan.price.monthly === 0
              const price = plan.price[billingCycle]

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  style={{
                    borderRadius: "14px",
                    border: isSelected ? "2px solid #7C3AED" : "2px solid #E5E7EB",
                    backgroundColor: "#ffffff",
                    padding: "20px 24px",
                    cursor: "pointer",
                    transition: "border-color 0.18s",
                    position: "relative",
                  }}
                >
                  {}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "16px", fontWeight: 700, color: "#111111" }}>
                        {plan.name[lang as "en" | "fr"]}
                      </span>
                      {plan.badge && (
                        <span style={{
                          backgroundColor: "#EDE9FE", color: "#7C3AED",
                          fontSize: "10px", fontWeight: 700,
                          padding: "2px 8px", borderRadius: "999px",
                          letterSpacing: "0.5px",
                        }}>
                          {t.recommended}
                        </span>
                      )}
                    </div>

                    {}
                    <div style={{
                      width: "20px", height: "20px", borderRadius: "50%",
                      border: isSelected ? "6px solid #7C3AED" : "2px solid #D1D5DB",
                      transition: "all 0.18s",
                      flexShrink: 0,
                    }} />
                  </div>

                  {}
                  <div style={{ marginBottom: "14px" }}>
                    {isFree ? (
                      <span style={{ fontSize: "28px", fontWeight: 800, color: "#111111" }}>
                        {t.free} <span style={{ fontSize: "14px", fontWeight: 400, color: "#6B7280" }}>{t.forever}</span>
                      </span>
                    ) : billingCycle === "yearly" ? (
                      <div>
                        <span style={{ fontSize: "24px", fontWeight: 800, color: "#111111" }}>
                          {formatPrice(50000)} DZD/month × 12 = {formatPrice(600000)} DZD
                        </span>
                        <span style={{ fontSize: "13px", fontWeight: 400, color: "#6B7280", display: "block", marginTop: "4px" }}>
                          {t.billedAnnually}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: "28px", fontWeight: 800, color: "#111111" }}>
                        {formatPrice(price)} DZD{" "}
                        <span style={{ fontSize: "13px", fontWeight: 400, color: "#6B7280" }}>
                          {t.perMonth}
                        </span>
                      </span>
                    )}
                  </div>

                  {}
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {plan.features.map((feature, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: feature.included ? "#111111" : "#9CA3AF", fontWeight: feature.included ? 500 : 400 }}>
                        {feature.included ? CHECK_ICON : CROSS_ICON}
                        {feature.text[lang as "en" | "fr"]}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {}
          <button
            onClick={handleContinue}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
              color: "#ffffff",
              marginBottom: "12px",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            {selectedPlanId === "premium" ? t.continuePayment : t.continueHome}
          </button>

          {}
          <p style={{ textAlign: "center", fontSize: "12px", color: "#6B7280" }}>
            {t.terms}{" "}
            <a href="/terms" style={{ color: "#7C3AED", textDecoration: "none" }}>{t.termsLink}</a>
            {" "}{t.and}{" "}
            <a href="/privacy-policy" style={{ color: "#7C3AED", textDecoration: "none" }}>{t.privacyLink}</a>.
          </p>

        </div>
      </div>
    </>
  )
}