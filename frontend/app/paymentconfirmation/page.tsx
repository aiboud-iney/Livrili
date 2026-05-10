"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLang } from "@/contexts/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"
import NotificationDropdown from "@/components/NotificationDropdown"
import ProfileDropdown from "@/components/ProfileDropdown"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const translations = {
  en: {
    submitted: "Payment Receipt Submitted!",
    subtitle: "Thank you! Your payment is being reviewed",
    ref: "REF:",
    paymentMethod: "Payment Method",
    amount: "Amount",
    receipt: "Receipt",
    noReceipt: "No file uploaded",
    estimation: "Estimated verification: 24 hours (Sunday - Thursday)",
    goToDashboard: "Go to Dashboard →",
    questions: "Questions about your payment?",
    whatsapp: "WhatsApp",
    email: "Email",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    support: "Support",
    copyright: "© 2026 LIVRILI LOGISTICS SOLUTIONS. DZ",
    pendingWarning: "Payment not received yet - please wait for verification",
  },
  fr: {
    submitted: "Reçu de paiement soumis !",
    subtitle: "Merci ! Votre paiement est en cours de vérification",
    ref: "RÉF :",
    paymentMethod: "Moyen de paiement",
    amount: "Montant",
    receipt: "Reçu",
    noReceipt: "Aucun fichier uploadé",
    estimation: "Vérification estimée : 24 heures (Dimanche - Jeudi)",
    goToDashboard: "Aller au tableau de bord →",
    questions: "Des questions sur votre paiement ?",
    whatsapp: "WhatsApp",
    email: "Email",
    privacy: "Politique de confidentialité",
    terms: "Conditions d'utilisation",
    support: "Support",
    copyright: "© 2026 LIVRILI SOLUTIONS LOGISTIQUES. DZ",
    pendingWarning: "Paiement non encore reçu - veuillez attendre la vérification",
  },
}

export default function PaymentConfirmationPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const { lang }     = useLang()
  const t            = translations[lang as "en" | "fr"]

  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile]             = useState(false)
  const [visible, setVisible]                     = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)

  const notifRef   = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const ref           = searchParams.get("ref")     || "—"
  const paymentMethod = searchParams.get("method")  || "—"
  const amountParam   = searchParams.get("amount")  || "0"
  const amount        = amountParam !== "0" ? `${new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 }).format(Number(amountParam))} DZD` : "—"
  const receiptName   = searchParams.get("receipt") || ""

  useEffect(() => {
    setVisible(true)

    const checkSubscriptionStatus = async () => {
      try {
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
        const user = userStr ? JSON.parse(userStr) : null
        if (!user?.id) return

        const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
        const response = await fetch(`${API_BASE_URL}/userSubs/user/${user.id}`, {
          headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
        })

        if (response.ok) {
          const data = await response.json()

          if (data.subscriptions && data.subscriptions.length > 0) {
            setSubscriptionStatus(data.subscriptions[0].status)
          }
        }
      } catch (err) {
        console.error('Error checking subscription status:', err)
      }
    }

    checkSubscriptionStatus()

    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setShowProfile(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div
      className="min-h-screen bg-[#f5f5f5] flex flex-col font-sans"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >

      {}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            title="Go to home"
            onClick={() => router.push("/")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", padding: 0 }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#7C3AED" }}>
              <img src="/icons/logo.png" alt="Livrili" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
            </div>
            <span className="text-xl font-bold text-black">Livrili</span>
          </button>

          <div className="flex items-center gap-3">
            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                title="Notifications"
                onClick={() => { setShowNotifications(p => !p); setShowProfile(false) }}
                style={{ padding: "8px", background: "none", border: "none", cursor: "pointer", borderRadius: "50%" }}
              >
                <img src="/icons/bell.png" alt="Notifications" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
              </button>
              <NotificationDropdown show={showNotifications} lang={lang} />
            </div>
            <div ref={profileRef} style={{ position: "relative" }}>
              <button
                title="Profile"
                onClick={() => { setShowProfile(p => !p); setShowNotifications(false) }}
                style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "#F5A962", border: "none", cursor: "pointer" }}
              />
              <ProfileDropdown show={showProfile} />
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          border: "1.5px solid #DDD6FE",
          overflow: "hidden",
        }}>

          {}
          <div style={{ padding: "40px 32px 32px 32px", textAlign: "center" }}>

            {}
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              backgroundColor: "#BFFF00",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px auto",
            }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M6 14l6 6 10-10" stroke="#2D4A00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#111111", marginBottom: "10px", lineHeight: 1.25 }}>
              {t.submitted}
            </h1>
            <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "24px" }}>
              {t.subtitle}
            </p>

            {}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              backgroundColor: "#EFFFB0",
              borderRadius: "999px",
              padding: "8px 20px",
              marginBottom: "28px",
            }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#4B7A00" }}>{t.ref}</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#4B7A00" }}>{ref}</span>
            </div>

            {}
            {subscriptionStatus && subscriptionStatus !== 'pending' && subscriptionStatus !== 'active' && (
              <div style={{
                backgroundColor: '#FEF3C7',
                border: '1.5px solid #F59E0B',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '20px',
                textAlign: 'left',
              }}>
                <p style={{ fontSize: '13px', color: '#92400E', fontWeight: 500 }}>
                  {t.pendingWarning}
                </p>
              </div>
            )}

            {}
            <div style={{ backgroundColor: "#F5F3FF", borderRadius: "14px", padding: "4px 0", marginBottom: "20px", textAlign: "left" }}>
              {[
                { label: t.paymentMethod, value: paymentMethod,                          color: "#111111", isFile: false },
                { label: t.amount,        value: amount,                                 color: "#7C3AED", isFile: false },
                { label: t.receipt,       value: receiptName || t.noReceipt,             color: "#7C3AED", isFile: !!receiptName },
              ].map((row, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 18px",
                  borderBottom: i < 2 ? "1px solid #EDE9FE" : "none",
                }}>
                  <span style={{ fontSize: "13px", color: "#6B7280" }}>{row.label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: row.color, display: "flex", alignItems: "center", gap: "6px" }}>
                    {row.isFile && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="2" y="1" width="8" height="11" rx="1.5" stroke="#7C3AED" strokeWidth="1.2" />
                        <path d="M4 4h4M4 6.5h4M4 9h2" stroke="#7C3AED" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                    )}
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {}
            <div style={{
              display: "flex", alignItems: "flex-start", gap: "10px",
              borderLeft: "3px solid #7C3AED",
              padding: "12px 14px",
              borderRadius: "0 8px 8px 0",
              marginBottom: "24px",
              textAlign: "left",
              backgroundColor: "#FAFAFE",
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
                <circle cx="8" cy="8" r="7" stroke="#7C3AED" strokeWidth="1.3" />
                <path d="M8 5v3.5M8 10.5v.5" stroke="#7C3AED" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.5 }}>{t.estimation}</p>
            </div>

            {}
            <button
              onClick={() => router.push("/Dashboard")}
              className="w-full font-bold text-white"
              style={{ padding: "15px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "15px", backgroundColor: "#7C3AED", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6D28D9"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#7C3AED"}
            >
              {t.goToDashboard}
            </button>
          </div>

          {}
          <div style={{ backgroundColor: "#F0EBFF", padding: "24px 32px", textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "#374151", marginBottom: "16px", fontWeight: 500 }}>
              {t.questions}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "32px" }}>
              <a
                href="https://wa.me/213550123456"
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", textDecoration: "none" }}
              >
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  backgroundColor: "#ffffff", border: "1.5px solid #DDD6FE",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <img src="/icons/sms.png" alt="WhatsApp" style={{ width: "18px", height: "18px", objectFit: "contain" }} />
                </div>
                <span style={{ fontSize: "12px", color: "#374151", fontWeight: 500 }}>{t.whatsapp}</span>
              </a>
              <a
                href={`mailto:livrili.team@gmail.com?subject=Payment%20Inquiry%20-%20Ref%20${encodeURIComponent(ref || '')}`}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", textDecoration: "none" }}
              >
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  backgroundColor: "#ffffff", border: "1.5px solid #DDD6FE",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <img src="/icons/email.png" alt="Email" style={{ width: "18px", height: "18px", objectFit: "contain" }} />
                </div>
                <span style={{ fontSize: "12px", color: "#374151", fontWeight: 500 }}>{t.email}</span>
              </a>
            </div>
          </div>

        </div>
      </main>

      {}
      <footer className="bg-[#202020] py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">{t.copyright}</p>
          <div className="flex items-center gap-6">
            {[
              { label: t.privacy, href: "/privacy-policy" },
              { label: t.terms,   href: "/terms"           },
              { label: t.support, href: "/support"         },
            ].map(link => (
              <a key={link.href} href={link.href}
                className="text-xs text-gray-500 no-underline hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}