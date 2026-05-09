"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import NotificationDropdown from "@/components/NotificationDropdown"
import ProfileDropdown from "@/components/ProfileDropdown"
import { useLang } from "@/contexts/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"

const FAQ_DATA = {
  en: [
    { q: "How do I create a new shipment?", a: "Go to 'Post Shipment' from your dashboard and fill in the required details about your cargo, pickup location, and delivery destination." },
    { q: "How do I track my shipment?", a: "You can track your shipment in real-time from the 'Shipment Listings' section where you'll see the current status and location." },
    { q: "How do I contact the driver?", a: "Once a driver is assigned to your shipment, you'll be able to contact them directly through the messaging system in your dashboard." },
    { q: "What payment methods do you accept?", a: "We accept multiple payment methods including bank transfers, credit cards, and mobile payments. Check the payment section for more details." },
    { q: "Can I cancel my shipment?", a: "Yes, you can cancel shipments up to 24 hours before pickup. Contact support for assistance." },
    { q: "How are prices calculated?", a: "Prices are based on cargo weight, volume, distance, and type. Use the quote calculator for an estimate." },
  ],
  fr: [
    { q: "Comment créer un nouveau chargement?", a: "Allez à 'Poster un Chargement' depuis votre tableau de bord et remplissez les détails requis sur votre cargaison, le lieu de ramassage et la destination." },
    { q: "Comment suivre mon chargement?", a: "Vous pouvez suivre votre chargement en temps réel dans la section 'Chargements' où vous verrez l'état et la localisation actuels." },
    { q: "Comment contacter le chauffeur?", a: "Une fois qu'un chauffeur est assigné à votre chargement, vous pourrez le contacter directement par le système de messagerie." },
    { q: "Quels modes de paiement acceptez-vous?", a: "Nous acceptons plusieurs modes de paiement incluant les virements bancaires, les cartes de crédit et les paiements mobiles." },
    { q: "Puis-je annuler mon chargement?", a: "Oui, vous pouvez annuler les chargements jusqu'à 24 heures avant le ramassage. Contactez le support pour obtenir de l'aide." },
    { q: "Comment les prix sont-ils calculés?", a: "Les prix sont basés sur le poids, le volume, la distance et le type de cargaison. Utilisez le calculateur de devis pour une estimation." },
  ]
}

export default function HelpPage() {
  const { lang } = useLang()
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisible(true)
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const faqData = lang === "en" ? FAQ_DATA.en : FAQ_DATA.fr
  const filteredFAQ = faqData.filter(item =>
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div
      className="min-h-screen bg-[#f5f5f5] flex flex-col"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}
    >
      {}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button title="Go to home" onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", padding: 0 }}>
            <div className="w-9 h-9 bg-[#7C3AED] rounded-lg flex items-center justify-center">
              <img src="/icons/logo.png" alt="Livrili" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
            </div>
            <span className="text-xl font-semibold text-black">Livrili</span>
          </button>

          <div className="flex items-center gap-3">
            <div ref={notifRef} style={{ position: "relative" }}>
              <button title="Notifications" onClick={() => { setShowNotifications(p => !p); setShowProfile(false) }} style={{ position: "relative", padding: "8px", background: "none", border: "none", cursor: "pointer", borderRadius: "50%" }}>
                <img src="/icons/bell.png" alt="Notifications" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
              </button>
              <NotificationDropdown show={showNotifications} lang={lang} />
            </div>
            <div ref={profileRef} style={{ position: "relative" }}>
              <button title="Profile" onClick={() => { setShowProfile(p => !p); setShowNotifications(false) }} style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "#F5A962", border: "none", cursor: "pointer" }} />
              <ProfileDropdown show={showProfile} />
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {}
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <button title="Go Back" className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity" style={{ background: "none", border: "none" }} onClick={() => router.back()}>
            <img src="/icons/go back.png" alt="Back" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#94A3B8" }}>{lang === "en" ? "Go Back" : "Retour"}</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {lang === "en" ? "Help & FAQ" : "Aide & FAQ"}
          </h1>
          <p className="text-gray-500 mb-6">
            {lang === "en" ? "Find answers to your questions" : "Trouvez les réponses à vos questions"}
          </p>

          {}
          <div className="mb-8 bg-white p-4 rounded-lg border border-[#e0e0e0]">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={lang === "en" ? "Search FAQ..." : "Rechercher FAQ..."}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#1a1a1a",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          {}
          <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
            {filteredFAQ.length > 0 ? (
              filteredFAQ.map((item, idx) => (
                <div key={idx} style={{ borderBottom: idx < filteredFAQ.length - 1 ? "1px solid #e0e0e0" : "none" }}>
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                    style={{
                      width: "100%",
                      padding: "18px 20px",
                      background: "transparent",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f9f9f9")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ fontSize: "15px", fontWeight: 600, color: "#1a1a1a" }}>{item.q}</span>
                    <span style={{ fontSize: "18px", color: "#7C3AED", fontWeight: "bold", transition: "transform 0.3s" }}>
                      {expandedFAQ === idx ? "−" : "+"}
                    </span>
                  </button>
                  {expandedFAQ === idx && (
                    <div style={{ padding: "0 20px 16px", color: "#6b7280", fontSize: "14px", lineHeight: "1.6" }}>
                      {item.a}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ padding: "32px 20px", textAlign: "center", color: "#6b7280" }}>
                {lang === "en" ? "No results found" : "Aucun résultat trouvé"}
              </div>
            )}
          </div>

          {}
          <div className="mt-8 p-6 rounded-lg border" style={{ backgroundColor: "#f3e8ff", borderColor: "#ddd6fe" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1a1a1a", marginBottom: "8px" }}>
              {lang === "en" ? "Need more help?" : "Besoin d'aide supplémentaire?"}
            </h3>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "12px" }}>
              {lang === "en" ? "Contact our support team for assistance" : "Contactez notre équipe d'assistance"}
            </p>
            <button
              onClick={() => router.push("/support")}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#7C3AED",
                color: "white",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                transition: "background 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#6d28d9")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#7C3AED")}
            >
              {lang === "en" ? "Contact Support" : "Contacter le Support"}
            </button>
          </div>
        </div>
      </main>

      {}
      <footer className="bg-[#202020] py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p style={{ fontSize: "11px", color: "#9CA3AF" }}>© 2026 LIVRILI LOGISTICS SOLUTIONS. DZ</p>
          <div className="flex items-center gap-6">
            <a href="/privacy-policy" style={{ fontSize: "11px", color: "#9CA3AF", textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")} onMouseLeave={e => (e.currentTarget.style.color = "#9CA3AF")}>Privacy Policy</a>
            <a href="/terms" style={{ fontSize: "11px", color: "#9CA3AF", textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")} onMouseLeave={e => (e.currentTarget.style.color = "#9CA3AF")}>Terms of Service</a>
            <a href="/support" style={{ fontSize: "11px", color: "#9CA3AF", textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")} onMouseLeave={e => (e.currentTarget.style.color = "#9CA3AF")}>Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
