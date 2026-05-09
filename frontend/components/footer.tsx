"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useLang } from "@/contexts/LanguageContext"
import { useState } from "react"
import { api } from "@/lib/api"

const ROUTES = {
  home: "/",
  privacy: "/privacy-policy",
  terms: "/terms",
  aboutUs: "/about-us",
  contactUs: "/contact-us",
  faq: "/faq",
} as const

const SOCIAL_LINKS = [
  { src: "/icons/instagram.png", alt: "Instagram", href: "#" },
  { src: "/icons/linkedin.png",  alt: "LinkedIn",  href: "#" },
  { src: "/icons/facebook.png",  alt: "Facebook",  href: "#" },
]

const translations = {
  en: {
    description: "Revolutionizing Algeria's logistics through technology. We connect the country's most reliable transport network with the businesses that need it.",
    platform: "Platform",
    platformLinks: ["How It Works", "Features", "Pricing"],
    company: "Company",
    companyLinks: [
      { label: "About Us",    href: ROUTES.aboutUs   },
      { label: "Contact Us",  href: ROUTES.contactUs },
      { label: "FAQ",         href: ROUTES.faq       },
    ],
    newsletter: "Newsletter",
    newsletterDesc: "Get the latest freight opportunities and platform updates.",
    newsletterPlaceholder: "Email address",
    region: "REGION: ALGERIA",
    copyright: "© 2026 LIVRILI LOGISTICS SOLUTIONS. DZ",
    privacy: "Privacy",
    terms: "Terms",
    successMsg: "You're subscribed!",
    errorMsg: "Something went wrong. Try again.",
    invalidEmail: "Please enter a valid email.",
  },
  fr: {
    description: "Révolutionner la logistique algérienne grâce à la technologie. Nous connectons le réseau de transport le plus fiable du pays avec les entreprises qui en ont besoin.",
    platform: "Plateforme",
    platformLinks: ["Comment ça marche", "Fonctionnalités", "Tarifs"],
    company: "Entreprise",
    companyLinks: [
      { label: "À propos",       href: ROUTES.aboutUs   },
      { label: "Contactez-nous", href: ROUTES.contactUs },
      { label: "FAQ",            href: ROUTES.faq       },
    ],
    newsletter: "Newsletter",
    newsletterDesc: "Recevez les dernières opportunités de fret et les mises à jour de la plateforme.",
    newsletterPlaceholder: "Adresse e-mail",
    region: "RÉGION: ALGÉRIE",
    copyright: "© 2026 LIVRILI SOLUTIONS LOGISTIQUES. DZ",
    privacy: "Confidentialité",
    terms: "Conditions",
    successMsg: "Vous êtes abonné !",
    errorMsg: "Une erreur s'est produite. Réessayez.",
    invalidEmail: "Veuillez entrer un email valide.",
  },
}

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export function Footer() {
  const { lang } = useLang()
  const t = translations[lang]

  const [email, setEmail]                     = useState("")
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [statusMsg, setStatusMsg]             = useState("")

  const handleNewsletterSubmit = async () => {
    if (!isValidEmail(email)) {
      setNewsletterStatus("error")
      setStatusMsg(t.invalidEmail)
      return
    }

    setNewsletterStatus("loading")

    try {
      // @ts-expect-error api.newsletter does not exist
      await api.newsletter({ email, lang })
      setNewsletterStatus("success")
      setStatusMsg(t.successMsg)
      setEmail("")
    } catch {
      setNewsletterStatus("error")
      setStatusMsg(t.errorMsg)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleNewsletterSubmit()
  }

  const isDisabled = newsletterStatus === "loading" || newsletterStatus === "success"

  return (
    <footer className="bg-[#1C1C1C] text-white">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

          {}
          <div className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href={ROUTES.home} className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7C3AED]">
                <img src="/icons/logo.png" alt="Livrili logo" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
              </div>
              <span className="text-xl font-bold">Livrili</span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)", maxWidth: "280px" }}>
              {t.description}
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.alt}
                  href={social.href}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "36px", height: "36px", borderRadius: "8px",
                    backgroundColor: "rgba(255,255,255,0.10)",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.20)")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.10)")}
                >
                  <img src={social.src} alt={social.alt} style={{ width: "16px", height: "16px", objectFit: "contain" }} />
                </Link>
              ))}
            </div>
          </div>

          {}
          <div>
            <h3 style={{ fontWeight: 600, fontSize: "11px", letterSpacing: "1.5px", color: "#ffffff", textTransform: "uppercase", marginBottom: "16px" }}>
              {t.platform}
            </h3>
            <ul className="space-y-3">
              {t.platformLinks.map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {}
          <div>
            <h3 style={{ fontWeight: 600, fontSize: "11px", letterSpacing: "1.5px", color: "#ffffff", textTransform: "uppercase", marginBottom: "16px" }}>
              {t.company}
            </h3>
            <ul className="space-y-3">
              {t.companyLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 style={{ fontWeight: 600, fontSize: "11px", letterSpacing: "1.5px", color: "#ffffff", textTransform: "uppercase", marginBottom: "16px" }}>
              {t.newsletter}
            </h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>
              {t.newsletterDesc}
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder={t.newsletterPlaceholder}
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  if (newsletterStatus !== "idle") setNewsletterStatus("idle")
                }}
                onKeyDown={handleKeyDown}
                disabled={isDisabled}
                className="bg-white/10 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[#7C3AED]"
              />
              <button
                onClick={handleNewsletterSubmit}
                disabled={isDisabled}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "40px", height: "40px", minWidth: "40px",
                  backgroundColor: newsletterStatus === "success" ? "#16a34a" : "#7C3AED",
                  borderRadius: "8px", border: "none",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  flexShrink: 0,
                  transition: "background 0.2s",
                  opacity: newsletterStatus === "loading" ? 0.7 : 1,
                }}
                onMouseEnter={e => { if (!isDisabled) e.currentTarget.style.backgroundColor = "#6D28D9" }}
                onMouseLeave={e => { if (newsletterStatus !== "success") e.currentTarget.style.backgroundColor = "#7C3AED" }}
              >
                {newsletterStatus === "loading" ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                    <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <path d="M8 2a6 6 0 0 1 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                  </svg>
                ) : (
                  <img src="/icons/send.png" alt="Send" style={{ width: "16px", height: "16px", objectFit: "contain" }} />
                )}
              </button>
            </div>

            {(newsletterStatus === "success" || newsletterStatus === "error") && (
              <p style={{ marginTop: "8px", fontSize: "12px", color: newsletterStatus === "success" ? "#4ade80" : "#f87171" }}>
                {statusMsg}
              </p>
            )}
          </div>

        </div>
      </div>

      {}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}>
        <div className="container px-4 md:px-6 py-4">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between" style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
            <p className="text-center md:text-left">{t.copyright}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#2a2a2a", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "999px", padding: "6px 14px" }}>
                <img src="/icons/globe.png" alt="Globe" style={{ width: "14px", height: "14px", objectFit: "contain", opacity: 0.7 }} />
                <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.5px", color: "rgba(255,255,255,0.8)" }}>{t.region}</span>
              </div>
              <Link href={ROUTES.privacy} style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>{t.privacy}</Link>
              <Link href={ROUTES.terms}   style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>{t.terms}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}