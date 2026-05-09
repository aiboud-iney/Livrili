"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLang } from "@/contexts/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"

const translations = {
  en: {
    title: "About Us",
    tagline: "Connecting Algeria's freight, one load at a time.",
    intro: "Livrili is an academic project born at the Higher National School of Computer Science (ESI) in Algiers. Our mission is to simplify and optimize road freight in Algeria by connecting shippers and truck owners directly no middlemen, no extra costs",
    missionTitle: "Our Mission",
    missionText: "We aim to reduce empty return trips, lower transport costs, and make logistics more transparent and efficient across Algeria. By bringing supply and demand together on one platform, we help transporters fill their trucks and shippers find reliable capacity.",
    visionTitle: "Our Vision",
    visionText: "A logistics sector where every truck runs full, every shipment finds a ride, and businesses communicate directly. Livrili is a step toward that future built for Algeria, by Algerians.",
    teamTitle: "Behind Livrili",
    teamText: "Livrili was developed by a team of ESI students and supervised by our teachers. It is intended for demonstration and educational purposes, showcasing how technology can address real logistics challenges.",
    region: "We focus exclusively on Algeria understanding local routes, wilayas, and the needs of Algerian transporters and shippers.",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
  },
  fr: {
    title: "À propos",
    tagline: "Connecter le fret algérien, un chargement à la fois.",
    intro: "Livrili est un projet académique né à l'École nationale supérieure d'informatique (ESI) d'Alger. Notre mission est de simplifier et d'optimiser le fret routier en Algérie en mettant en relation directe expéditeurs et propriétaires de camions sans intermédiaires, sans frais supplémentaires.",
    missionTitle: "Notre mission",
    missionText: "Nous voulons réduire les trajets à vide, baisser les coûts de transport et rendre la logistique plus transparente et efficace en Algérie. En regroupant l'offre et la demande sur une seule plateforme, nous aidons les transporteurs à remplir leurs camions et les expéditeurs à trouver des capacités fiables.",
    visionTitle: "Notre vision",
    visionText: "Un secteur logistique où chaque camion roule plein, chaque expédition trouve un véhicule, et les acteurs communiquent directement. Livrili est un pas vers cet avenir conçu pour l'Algérie, par des Algériens.",
    teamTitle: "Derrière Livrili",
    teamText: "Livrili a été développé par une équipe d'étudiants de l'ESI sous la supervision d'enseignants. Il est destiné à la démonstration et à l'enseignement, pour montrer comment la technologie peut répondre aux défis logistiques réels.",
    region: "Nous nous concentrons exclusivement sur l'Algérie comprendre les trajets locaux, les wilayas et les besoins des transporteurs et expéditeurs algériens.",
    privacyPolicy: "Politique de confidentialité",
    termsConditions: "Conditions générales",
  },
}

export default function AboutUs() {
  const router = useRouter()
  const { lang } = useLang()
  const t = translations[lang]

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

      <main className="flex-1 flex justify-center px-4 md:px-6 py-10 md:py-16">
        <div className="w-full max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#f4ffe0] border border-[#BFFF00] rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#BFFF00] inline-block" />
            <span className="text-xs font-bold tracking-widest text-[#202020]">LIVRILI</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#111111] mb-2" style={{ fontFamily: "'Kamerik 105', sans-serif" }}>
            {t.title}
          </h1>
          <p className="text-lg text-[#7C3AED] font-semibold mb-8" style={{ fontFamily: "'Kamerik 105', sans-serif" }}>
            {t.tagline}
          </p>
          <div className="w-14 h-1 bg-[#7C3AED] rounded-full mb-8" />

          <div className="space-y-8 text-[#333333]">
            <p className="text-base leading-relaxed">{t.intro}</p>
            <div>
              <h2 className="text-xl font-bold text-[#111111] mb-3" style={{ fontFamily: "'Kamerik 105', sans-serif" }}>
                {t.missionTitle}
              </h2>
              <p className="text-base leading-relaxed">{t.missionText}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#111111] mb-3" style={{ fontFamily: "'Kamerik 105', sans-serif" }}>
                {t.visionTitle}
              </h2>
              <p className="text-base leading-relaxed">{t.visionText}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#111111] mb-3" style={{ fontFamily: "'Kamerik 105', sans-serif" }}>
                {t.teamTitle}
              </h2>
              <p className="text-base leading-relaxed">{t.teamText}</p>
            </div>
            <p className="text-base leading-relaxed border-l-4 border-[#7C3AED] pl-4 py-2 bg-white/60 rounded-r-lg">
              {t.region}
            </p>
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
