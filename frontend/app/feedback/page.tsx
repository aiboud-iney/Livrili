"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import NotificationDropdown from "@/components/NotificationDropdown"
import ProfileDropdown from "@/components/ProfileDropdown"
import { useLang } from "@/contexts/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function FeedbackPage() {
  const { lang } = useLang()
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [feedbackType, setFeedbackType] = useState("general")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message, type: feedbackType }),
      })
      if (!res.ok) throw new Error()
      setMessage("")
      setEmail("")
      setFeedbackType("general")
      alert(lang === "en" ? "Thank you for your feedback!" : "Merci pour votre retour!")
    } catch {
      alert(lang === "en" ? "Failed to send. Please try again." : "Échec de l'envoi. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

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
        <div className="max-w-2xl mx-auto">
          <button title="Go Back" className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity" style={{ background: "none", border: "none" }} onClick={() => router.back()}>
            <img src="/icons/go back.png" alt="Back" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#94A3B8" }}>{lang === "en" ? "Go Back" : "Retour"}</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {lang === "en" ? "Send Feedback" : "Envoyer un Retour"}
          </h1>
          <p className="text-gray-500 mb-8">
            {lang === "en" ? "Help us improve by sharing your thoughts and suggestions" : "Aidez-nous à nous améliorer en partageant vos pensées et suggestions"}
          </p>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-[#e0e0e0]">
            {}
            <div className="mb-6">
              <label style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a", display: "block", marginBottom: "8px" }}>
                {lang === "en" ? "Feedback Type" : "Type de Retour"}
              </label>
              <div style={{ position: "relative" }}>
                <select
                  title="feedback type"
                  value={feedbackType}
                  onChange={e => setFeedbackType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    paddingRight: "36px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "#1a1a1a",
                    fontFamily: "inherit",
                    cursor: "pointer",
                    appearance: "none",
                    backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\"><path fill=\"%231a1a1a\" d=\"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\"/></svg>')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 8px center",
                    backgroundSize: "20px",
                  }}
                >
                <option value="general">{lang === "en" ? "General Feedback" : "Retour Général"}</option>
                <option value="bug">{lang === "en" ? "Bug Report" : "Rapport de Bug"}</option>
                <option value="feature">{lang === "en" ? "Feature Request" : "Demande de Fonctionnalité"}</option>
                <option value="other">{lang === "en" ? "Other" : "Autre"}</option>
                </select>
              </div>
            </div>

            {}
            <div className="mb-6">
              <label style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a", display: "block", marginBottom: "8px" }}>
                {lang === "en" ? "Email" : "Email"}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={lang === "en" ? "your.email@example.com" : "votre.email@exemple.com"}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
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
            <div className="mb-6">
              <label style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a", display: "block", marginBottom: "8px" }}>
                {lang === "en" ? "Message" : "Message"}
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={lang === "en" ? "Share your feedback here..." : "Partagez votre retour ici..."}
                required
                rows={6}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#1a1a1a",
                  fontFamily: "inherit",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                type="submit"
                disabled={isLoading || !message.trim() || !email.trim()}
                style={{
                  padding: "14px 24px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#7C3AED",
                  color: "white",
                  cursor: !isLoading && message.trim() && email.trim() ? "pointer" : "not-allowed",
                  fontSize: "14px",
                  fontWeight: 600,
                  opacity: !isLoading && message.trim() && email.trim() ? 1 : 0.6,
                  transition: "all 0.3s ease",
                  width: "100%",
                }}
              >
                {isLoading ? (lang === "en" ? "Sending..." : "Envoi...") : (lang === "en" ? "Send Feedback" : "Envoyer le Retour")}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isLoading}
                style={{
                  padding: "14px 24px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "white",
                  color: "#1a1a1a",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  opacity: isLoading ? 0.6 : 1,
                  transition: "all 0.3s ease",
                  width: "100%",
                }}
              >
                {lang === "en" ? "Cancel" : "Annuler"}
              </button>
            </div>
          </form>
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
