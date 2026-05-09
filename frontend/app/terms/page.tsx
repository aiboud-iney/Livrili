"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLang } from "@/contexts/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"

const translations = {
  en: {
    legalDocument: "LEGAL DOCUMENT",
    title: "Terms & Conditions",
    lastUpdated: "Last updated: March 2026",
    contactUs: "Contact Us",
    contactIntro: "For any questions regarding these Terms, please contact the Livrili team at ESI Algiers:",
    supervisors: "Supervisors",
    developmentTeam: "Development Team",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
    roleSupervisor: "Supervisor",
    roleStudent: "Student",
    sections: [
      { title: "Acceptance of Terms", text: "By accessing or using the Livrili platform, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the platform. Livrili is an academic project developed at ESI Algiers and is intended for demonstration and educational purposes." },
      { title: "Platform Description", text: "Livrili is a digital freight marketplace that connects shippers and truck owners across Algeria. It enables users to post shipment requests and available truck routes, facilitating direct communication without intermediaries." },
      { title: "User Accounts", text: "To use Livrili, you must create an account with accurate information including your company name, phone number, email, trade register, and TIN (NIF). You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account." },
      { title: "Acceptable Use", text: "You agree to use Livrili only for lawful purposes and in accordance with Algerian law. You must not post false, misleading, or fraudulent listings. You must not use the platform to harass, harm, or deceive other users." },
      { title: "No Guarantee of Service", text: "As an academic project, Livrili is provided as-is without warranties of any kind. We do not guarantee uninterrupted access, accuracy of listings, or successful matches between shippers and transporters." },
      { title: "Intellectual Property", text: "All content, design, and code on the Livrili platform is the intellectual property of the development team at ESI Algiers. You may not reproduce, distribute, or use any part of the platform without explicit permission." },
      { title: "Limitation of Liability", text: "Livrili and its development team shall not be liable for any direct, indirect, or consequential damages arising from the use of the platform. All transactions and agreements made between users are the sole responsibility of those users." },
      { title: "Governing Law", text: "These Terms are governed by the laws of the People's Democratic Republic of Algeria. Any disputes shall be subject to the jurisdiction of the competent courts of Algiers." },
      { title: "Modifications", text: "We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated date. Continued use of the platform after changes constitutes your acceptance of the new Terms." },
    ],
  },
  fr: {
    legalDocument: "DOCUMENT JURIDIQUE",
    title: "Conditions générales",
    lastUpdated: "Dernière mise à jour : mars 2026",
    contactUs: "Nous contacter",
    contactIntro: "Pour toute question concernant ces Conditions, veuillez contacter l'équipe Livrili à l'ESI Alger :",
    supervisors: "Encadrants",
    developmentTeam: "Équipe de développement",
    privacyPolicy: "Politique de confidentialité",
    termsConditions: "Conditions générales",
    roleSupervisor: "Encadrant",
    roleStudent: "Étudiant",
    sections: [
      { title: "Acceptation des conditions", text: "En accédant ou en utilisant la plateforme Livrili, vous acceptez d'être lié par ces Conditions générales. Si vous n'êtes pas d'accord, veuillez ne pas utiliser la plateforme. Livrili est un projet académique développé à l'ESI Alger et destiné à des fins de démonstration et d'enseignement." },
      { title: "Description de la plateforme", text: "Livrili est une marketplace de fret numérique qui met en relation expéditeurs et propriétaires de camions en Algérie. Elle permet aux utilisateurs de publier des demandes d'expédition et des trajets disponibles, facilitant la communication directe sans intermédiaires." },
      { title: "Comptes utilisateurs", text: "Pour utiliser Livrili, vous devez créer un compte avec des informations exactes : nom de l'entreprise, numéro de téléphone, e-mail, registre de commerce et NIF. Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités liées à votre compte." },
      { title: "Usage acceptable", text: "Vous vous engagez à n'utiliser Livrili qu'à des fins légales et conformément au droit algérien. Vous ne devez pas publier d'annonces fausses, trompeuses ou frauduleuses, ni utiliser la plateforme pour harceler, nuire ou tromper d'autres utilisateurs." },
      { title: "Aucune garantie de service", text: "En tant que projet académique, Livrili est fourni tel quel sans garantie d'aucune sorte. Nous ne garantissons pas un accès ininterrompu, l'exactitude des annonces ni des mises en relation réussies entre expéditeurs et transporteurs." },
      { title: "Propriété intellectuelle", text: "Tout le contenu, la conception et le code de la plateforme Livrili sont la propriété intellectuelle de l'équipe de développement de l'ESI Alger. Vous ne pouvez pas reproduire, distribuer ou utiliser une partie de la plateforme sans autorisation explicite." },
      { title: "Limitation de responsabilité", text: "Livrili et son équipe de développement ne sauraient être tenus responsables des dommages directs, indirects ou consécutifs découlant de l'utilisation de la plateforme. Les transactions et accords entre utilisateurs relèvent de leur seule responsabilité." },
      { title: "Droit applicable", text: "Ces Conditions sont régies par les lois de la République algérienne démocratique et populaire. Tout litige relève de la compétence des tribunaux d'Alger." },
      { title: "Modifications", text: "Nous nous réservons le droit de modifier ces Conditions à tout moment. Les modifications seront publiées sur cette page avec une date mise à jour. L'utilisation continue de la plateforme après modification vaut acceptation des nouvelles Conditions." },
    ],
  },
}

export default function Terms() {
  const router = useRouter()
  const { lang } = useLang()
  const t = translations[lang]

  const teachers = [
    { name: "BOUDI Abderrahmane", email: "a_boudi@esi.dz", roleKey: "roleSupervisor" as const },
    { name: "ZOUANA Seyf Eddine", email: "s_zouana@esi.dz", roleKey: "roleSupervisor" as const },
  ]

  const students = [
    { name: "AIBOUD Ichrak Nour El Yakine", email: "oi_aiboud@esi.dz", roleKey: "roleStudent" as const },
    { name: "BOUDIF Sarah Oumnia", email: "os_boudif@esi.dz", roleKey: "roleStudent" as const },
    { name: "BOUKHEMIA Lyna", email: "ol_boukhemia@esi.dz", roleKey: "roleStudent" as const },
    { name: "TEBANI Rima", email: "or_tebani@esi.dz", roleKey: "roleStudent" as const },
    { name: "BRIZA Mohamed Fouad", email: "om_briza@esi.dz", roleKey: "roleStudent" as const },
    { name: "GAAD Abdellah", email: "oa_gaad@esi.dz", roleKey: "roleStudent" as const },
  ]

  const sections = t.sections

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col">

      {}
      <header className="bg-white px-8 py-4 flex items-center justify-between gap-3 shadow-sm">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-3 cursor-pointer"
          style={{ background: 'none', border: 'none', padding: 0 }}
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

      {}
      <main className="flex-1 flex justify-center px-6 py-10">
        <div className="bg-white rounded-3xl px-14 py-12 w-full max-w-3xl">

          {}
          <div className="inline-flex items-center gap-2 bg-[#f4ffe0] border border-[#BFFF00] rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#BFFF00] inline-block" />
            <span className="text-xs font-bold tracking-widest text-[#202020]">{t.legalDocument}</span>
          </div>

          <h1 className="text-3xl font-extrabold text-[#111111] mb-2">{t.title}</h1>
          <p className="text-xs text-[#aaaaaa] mb-6">{t.lastUpdated}</p>

          {}
          <div className="w-14 h-1 bg-[#7C3AED] rounded-full mb-8" />

          {}
          {sections.map((section, index) => (
            <div key={index} className="mb-8">
              <h2 className="flex items-center gap-3 text-base font-bold text-[#111111] mb-3">
                <span className="w-6 h-6 rounded-full bg-[#7C3AED] text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </span>
                {section.title}
              </h2>
              <p className="text-sm text-[#555555] leading-relaxed pl-9">
                {section.text}
              </p>
            </div>
          ))}

          {}
          <div className="mb-8">
            <h2 className="flex items-center gap-3 text-base font-bold text-[#111111] mb-3">
              <span className="w-6 h-6 rounded-full bg-[#7C3AED] text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0">
                {sections.length + 1}
              </span>
              {t.contactUs}
            </h2>
            <p className="text-sm text-[#555555] leading-relaxed pl-9 mb-4">
              {t.contactIntro}
            </p>

            <p className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider pl-9 mb-3">{t.supervisors}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9 mb-5">
              {teachers.map((teacher, i) => (
                <div key={i} className="bg-[#f9f9f9] border border-[#e5e7eb] rounded-xl p-4">
                  <p className="text-xs text-[#aaaaaa] mb-1">{t[teacher.roleKey]}</p>
                  <p className="text-sm font-bold text-[#111111] mb-1">{teacher.name}</p>
                  <a href={`mailto:${teacher.email}`} className="text-xs text-[#7C3AED] hover:underline">{teacher.email}</a>
                </div>
              ))}
            </div>

            <p className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider pl-9 mb-3">{t.developmentTeam}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9">
              {students.map((s, i) => (
                <div key={i} className="bg-[#f9f9f9] border border-[#e5e7eb] rounded-xl p-4">
                  <p className="text-xs text-[#aaaaaa] mb-1">{t[s.roleKey]}</p>
                  <p className="text-sm font-bold text-[#111111] mb-1">{s.name}</p>
                  <a href={`mailto:${s.email}`} className="text-xs text-[#7C3AED] hover:underline">{s.email}</a>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {}
      <footer className="py-5 flex items-center justify-center gap-6">
        <Link href="/privacy-policy" className="text-xs text-black/40 hover:text-[#7C3AED] transition-colors">
          {t.privacyPolicy}
        </Link>
        <Link href="/terms" className="text-xs text-black/40 hover:text-[#7C3AED] transition-colors">
          {t.termsConditions}
        </Link>
      </footer>

    </div>
  )
}