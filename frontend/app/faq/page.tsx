"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLang } from "@/contexts/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"

const translations = {
  en: {
    title: "Frequently Asked Questions",
    subtitle: "Quick answers about Livrili and how it works.",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
    faqs: [
      {
        q: "What is Livrili?",
        a: "Livrili is a digital freight marketplace that connects shippers (companies with cargo to move) and truck owners or transporters across Algeria. You can post shipment requests or available routes and connect directly no middlemen.",
      },
      {
        q: "Is Livrili free to use?",
        a: "Livrili is an academic project developed at ESI Algiers. It is intended for demonstration and educational purposes. Registration and basic use of the platform are free.",
      },
      {
        q: "Who can use Livrili?",
        a: "Any business or transporter operating in Algeria can create an account. You need a company name, phone number, email, trade register (RC), and TIN (NIF) to register.",
      },
      {
        q: "How do I post a shipment or a route?",
        a: "Once registered, you can post either a shipment (cargo you need to move) or a route (empty truck looking for a load). Other users can browse and contact you directly to agree on price and terms.",
      },
      {
        q: "Is my data safe?",
        a: "We collect only the information needed to run your account and facilitate connections. We do not sell or share your data with third parties. For details, see our Privacy Policy.",
      },
      {
        q: "Which regions does Livrili cover?",
        a: "Livrili focuses on Algeria. We cover all wilayas and aim to connect transporters and shippers across the country.",
      },
      {
        q: "What if I have a problem or a question?",
        a: "You can contact the Livrili team via the Contact Us page. We are based at ESI Algiers and will respond as soon as possible.",
      },
    ],
  },
  fr: {
    title: "Questions fréquentes",
    subtitle: "Réponses rapides sur Livrili et son fonctionnement.",
    privacyPolicy: "Politique de confidentialité",
    termsConditions: "Conditions générales",
    faqs: [
      {
        q: "Qu'est-ce que Livrili ?",
        a: "Livrili est une marketplace de fret numérique qui met en relation les expéditeurs (entreprises avec des marchandises à transporter) et les propriétaires de camions ou transporteurs en Algérie. Vous pouvez publier des demandes d'expédition ou des trajets disponibles et vous connecter directement sans intermédiaires.",
      },
      {
        q: "Livrili est-il gratuit ?",
        a: "Livrili est un projet académique développé à l'ESI Alger. Il est destiné à la démonstration et à l'enseignement. L'inscription et l'utilisation de base de la plateforme sont gratuites.",
      },
      {
        q: "Qui peut utiliser Livrili ?",
        a: "Toute entreprise ou transporteur opérant en Algérie peut créer un compte. Vous avez besoin d'un nom d'entreprise, d'un numéro de téléphone, d'un e-mail, d'un registre de commerce (RC) et d'un NIF pour vous inscrire.",
      },
      {
        q: "Comment publier une expédition ou un trajet ?",
        a: "Une fois inscrit, vous pouvez publier soit une expédition (marchandises à transporter), soit un trajet (camion vide à remplir). Les autres utilisateurs peuvent parcourir les annonces et vous contacter directement pour convenir du prix et des conditions.",
      },
      {
        q: "Mes données sont-elles protégées ?",
        a: "Nous ne collectons que les informations nécessaires à la gestion de votre compte et aux mises en relation. Nous ne vendons ni ne partageons vos données avec des tiers. Pour plus de détails, consultez notre Politique de confidentialité.",
      },
      {
        q: "Quelles régions Livrili couvre-t-il ?",
        a: "Livrili se concentre sur l'Algérie. Nous couvrons toutes les wilayas et visons à connecter transporteurs et expéditeurs à travers le pays.",
      },
      {
        q: "Que faire en cas de problème ou de question ?",
        a: "Vous pouvez contacter l'équipe Livrili via la page Contactez-nous. Nous sommes basés à l'ESI Alger et répondrons dans les meilleurs délais.",
      },
    ],
  },
}

export default function FAQ() {
  const router = useRouter()
  const { lang } = useLang()
  const t = translations[lang]
  const [openIndex, setOpenIndex] = useState<number | null>(0)

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

          <div className="space-y-3">
            {t.faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-[#111111] hover:bg-[#f9f9f9] transition-colors"
                  style={{ fontFamily: "'Kamerik 105', sans-serif" }}
                >
                  <span>{faq.q}</span>
                  <span className="text-[#7C3AED] text-xl shrink-0">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-4 pt-0">
                    <p className="text-[#555555] leading-relaxed text-sm md:text-base border-t border-[#e5e7eb] pt-4">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
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
