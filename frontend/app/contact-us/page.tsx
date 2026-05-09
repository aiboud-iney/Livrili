"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLang } from "@/contexts/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"

const translations = {
  en: {
    title: "Contact Us",
    subtitle: "Get in touch with the Livrili team. We're based at ESI Algiers.",
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    send: "Send message",
    placeholders: {
      name: "Your name or company",
      email: "your@email.com",
      subject: "What is this about?",
      message: "Your message...",
    },
    orWrite: "Or reach out directly:",
    projectInfo: "Livrili is an academic project from the Higher National School of Computer Science (ESI), Algiers, Algeria.",
    supervisors: "Supervisors",
    developmentTeam: "Development Team",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
  },
  fr: {
    title: "Contactez-nous",
    subtitle: "Contactez l'équipe Livrili. Nous sommes basés à l'ESI Alger.",
    name: "Nom",
    email: "E-mail",
    subject: "Sujet",
    message: "Message",
    send: "Envoyer le message",
    placeholders: {
      name: "Votre nom ou entreprise",
      email: "votre@email.com",
      subject: "Objet de votre message",
      message: "Votre message...",
    },
    orWrite: "Ou écrivez-nous directement :",
    projectInfo: "Livrili est un projet académique de l'École nationale supérieure d'informatique (ESI), Alger, Algérie.",
    supervisors: "Encadrants",
    developmentTeam: "Équipe de développement",
    privacyPolicy: "Politique de confidentialité",
    termsConditions: "Conditions générales",
  },
}

const supervisors = [
  { name: "BOUDI Abderrahmane", email: "a_boudi@esi.dz" },
  { name: "ZOUANA Seyf Eddine", email: "s_zouana@esi.dz" },
]
const team = [
  { name: "AIBOUD Ichrak Nour El Yakine", email: "oi_aiboud@esi.dz" },
  { name: "BOUDIF Sarah Oumnia", email: "os_boudif@esi.dz" },
  { name: "BOUKHEMIA Lyna", email: "ol_boukhemia@esi.dz" },
  { name: "TEBANI Rima", email: "or_tebani@esi.dz" },
  { name: "BRIZA Mohamed Fouad", email: "om_briza@esi.dz" },
  { name: "GAAD Abdellah", email: "oa_gaad@esi.dz" },
]

export default function ContactUs() {
  const router = useRouter()
  const { lang } = useLang()
  const t = translations[lang]
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col">
      <header className="bg-white px-6 py-4 md:px-8 md:py-4 flex items-center justify-between gap-3 shadow-sm">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-3 cursor-pointer"
          style={{ background: "none", border: "none", padding: 0 }}
        >
          <div className="w-9 h-9 bg-[#7C3AED] rounded-lg flex items-center justify-center">
            <img src="/icons/logo.png" alt="Livrili" className="w-5 h-5 object-contain" />
          </div>
          <span className="text-xl font-extrabold text-[#111111]" style={{ fontFamily: "'Kamerik 105', sans-serif" }}>
            Livrili
          </span>
        </button>
        <LanguageSwitcher />
      </header>

      <main className="flex-1 px-4 md:px-6 py-10 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#111111] mb-2" style={{ fontFamily: "'Kamerik 105', sans-serif" }}>
            {t.title}
          </h1>
          <p className="text-[#555555] mb-8">{t.subtitle}</p>
          <div className="w-14 h-1 bg-[#7C3AED] rounded-full mb-8" />

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e5e7eb]">
              <h2 className="text-lg font-bold text-[#111111] mb-4" style={{ fontFamily: "'Kamerik 105', sans-serif" }}>
                {lang === "en" ? "Send a message" : "Envoyer un message"}
              </h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">{t.name}</label>
                  <input
                    type="text"
                    placeholder={t.placeholders.name}
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] bg-[#f9f9f9] text-[#111] placeholder:text-gray-400 focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">{t.email}</label>
                  <input
                    type="email"
                    placeholder={t.placeholders.email}
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] bg-[#f9f9f9] text-[#111] placeholder:text-gray-400 focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">{t.subject}</label>
                  <input
                    type="text"
                    placeholder={t.placeholders.subject}
                    value={form.subject}
                    onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] bg-[#f9f9f9] text-[#111] placeholder:text-gray-400 focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1">{t.message}</label>
                  <textarea
                    rows={4}
                    placeholder={t.placeholders.message}
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] bg-[#f9f9f9] text-[#111] placeholder:text-gray-400 focus:outline-none focus:border-[#7C3AED] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors"
                  style={{ fontFamily: "'Kamerik 105', sans-serif" }}
                >
                  {t.send}
                </button>
              </form>
            </div>

            <div>
              <p className="text-sm text-[#555] mb-4">{t.orWrite}</p>
              <p className="text-xs text-[#666] mb-6">{t.projectInfo}</p>
              <p className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider mb-3">{t.supervisors}</p>
              <ul className="space-y-2 mb-6">
                {supervisors.map((s) => (
                  <li key={s.email} className="bg-white rounded-xl p-3 border border-[#e5e7eb]">
                    <p className="text-sm font-semibold text-[#111]">{s.name}</p>
                    <a href={`mailto:${s.email}`} className="text-sm text-[#7C3AED] hover:underline">
                      {s.email}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider mb-3">{t.developmentTeam}</p>
              <ul className="space-y-2">
                {team.map((s) => (
                  <li key={s.email} className="bg-white rounded-xl p-3 border border-[#e5e7eb]">
                    <p className="text-sm font-semibold text-[#111]">{s.name}</p>
                    <a href={`mailto:${s.email}`} className="text-sm text-[#7C3AED] hover:underline">
                      {s.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-5 flex items-center justify-center gap-6 bg-[#F4F4F4]">
        <Link href="/privacy-policy" className="text-sm text-black/40 hover:text-[#7C3AED] transition-colors">
          {t.privacyPolicy}
        </Link>
        <Link href="/terms" className="text-sm text-black/40 hover:text-[#7C3AED] transition-colors">
          {t.termsConditions}
        </Link>
      </footer>
    </div>
  )
}
