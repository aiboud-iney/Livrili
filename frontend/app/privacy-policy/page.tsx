"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLang } from "@/contexts/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"
import styles from "./page.module.css"

const translations = {
  en: {
    legalDocument: "LEGAL DOCUMENT",
    title: "Privacy Policy",
    lastUpdated: "Last updated: March 2026",
    contactUs: "Contact Us",
    contactIntro: "This project was developed at the Higher National School of Computer Science (ESI), Algiers, Algeria. For any questions regarding this Privacy Policy, please reach out to:",
    supervisors: "Supervisors",
    developmentTeam: "Development Team",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
    roleSupervisor: "Supervisor",
    roleStudent: "Student",
    sections: [
      { title: "Introduction", text: "Livrili is an academic project developed by students of the Higher National School of Computer Science (ESI), Algiers, Algeria. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform." },
      { title: "Information We Collect", text: "We collect information you provide directly when creating an account: full company name, phone number, email address, password, trade register number, and TIN (NIF). We do not collect payment data, precise location, or any sensitive personal information beyond what is listed above." },
      { title: "How We Use Your Information", text: "The information collected is used solely to create and manage your account on the Livrili platform, to facilitate connections between shippers and truck owners across Algeria, and to improve the platform experience. We do not sell, rent, or share your personal data with third parties." },
      { title: "Data Storage & Security", text: "Your data is stored securely and protected against unauthorized access. As this is an academic project, data is handled in accordance with the guidelines of ESI Algiers. We apply reasonable technical measures to protect your information." },
      { title: "Cookies & Analytics", text: "Livrili may use Vercel Analytics to monitor platform performance. This tool collects anonymized usage data and does not identify individual users. No advertising or tracking cookies are used." },
      { title: "Your Rights", text: "You have the right to access, correct, or request deletion of your personal data at any time. To exercise these rights, please contact us using the information provided in the Contact section below." },
      { title: "Scope", text: "Livrili operates exclusively within Algeria. This Privacy Policy applies to all users of the platform located in Algeria." },
      { title: "Changes to This Policy", text: "We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated date. Continued use of the platform after changes constitutes acceptance of the updated policy." },
    ],
  },
  fr: {
    legalDocument: "DOCUMENT JURIDIQUE",
    title: "Politique de confidentialité",
    lastUpdated: "Dernière mise à jour : mars 2026",
    contactUs: "Nous contacter",
    contactIntro: "Ce projet a été développé à l'École nationale supérieure d'informatique (ESI), Alger, Algérie. Pour toute question concernant cette Politique de confidentialité, veuillez nous contacter :",
    supervisors: "Encadrants",
    developmentTeam: "Équipe de développement",
    privacyPolicy: "Politique de confidentialité",
    termsConditions: "Conditions générales",
    roleSupervisor: "Encadrant",
    roleStudent: "Étudiant",
    sections: [
      { title: "Introduction", text: "Livrili est un projet académique développé par des étudiants de l'École nationale supérieure d'informatique (ESI), Alger, Algérie. Cette Politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles lorsque vous utilisez notre plateforme." },
      { title: "Informations que nous collectons", text: "Nous collectons les informations que vous fournissez lors de la création d'un compte : nom complet de l'entreprise, numéro de téléphone, adresse e-mail, mot de passe, numéro du registre de commerce et NIF. Nous ne collectons pas de données de paiement, de localisation précise ni d'autres données personnelles sensibles." },
      { title: "Utilisation de vos informations", text: "Les informations collectées servent uniquement à créer et gérer votre compte sur Livrili, à faciliter les mises en relation entre expéditeurs et propriétaires de camions en Algérie, et à améliorer l'expérience sur la plateforme. Nous ne vendons, ne louons ni ne partageons vos données avec des tiers." },
      { title: "Stockage et sécurité des données", text: "Vos données sont stockées de manière sécurisée et protégées contre tout accès non autorisé. En tant que projet académique, les données sont traitées conformément aux directives de l'ESI Alger. Nous appliquons des mesures techniques raisonnables pour protéger vos informations." },
      { title: "Cookies et analytiques", text: "Livrili peut utiliser Vercel Analytics pour suivre les performances de la plateforme. Cet outil collecte des données d'utilisation anonymisées et n'identifie pas les utilisateurs. Aucun cookie publicitaire ou de suivi n'est utilisé." },
      { title: "Vos droits", text: "Vous avez le droit d'accéder, de corriger ou de demander la suppression de vos données personnelles à tout moment. Pour exercer ces droits, contactez-nous via les coordonnées indiquées dans la section Contact ci-dessous." },
      { title: "Champ d'application", text: "Livrili opère exclusivement en Algérie. Cette Politique de confidentialité s'applique à tous les utilisateurs de la plateforme situés en Algérie." },
      { title: "Modifications de cette politique", text: "Nous pouvons mettre à jour cette Politique de confidentialité. Les modifications seront publiées sur cette page avec une date mise à jour. L'utilisation continue de la plateforme après modification vaut acceptation de la politique mise à jour." },
    ],
  },
}

export default function PrivacyPolicy() {
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
    <div className={styles.page}>

      {}
      <header className={styles.header} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-3 cursor-pointer"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <div className={styles.logoBox}>
            <img src="/icons/logo.png" alt="Livrili" className={styles.logoIcon} />
          </div>
          <span className={styles.brandName}>Livrili</span>
        </button>
        <LanguageSwitcher />
      </header>

      {}
      <main className={styles.main}>
        <div className={styles.card}>

          <div className={styles.badge}>
            <span className={styles.dot} />
            {t.legalDocument}
          </div>

          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.lastUpdated}>{t.lastUpdated}</p>
          <div className={styles.divider} />

          {sections.map((section, index) => (
            <div key={index} className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>{index + 1}</span>
                {section.title}
              </h2>
              <p className={styles.sectionText}>{section.text}</p>
            </div>
          ))}

          {}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>{sections.length + 1}</span>
              {t.contactUs}
            </h2>
            <p className={styles.sectionText}>
              {t.contactIntro}
            </p>

            <p style={{ fontSize: '13px', fontWeight: 700, color: '#7C3AED', margin: '16px 0 8px' }}>{t.supervisors}</p>
            <div className={styles.contactGrid}>
              {teachers.map((teacher, i) => (
                <div key={i} className={styles.contactCard}>
                  <p className={styles.contactRole}>{t[teacher.roleKey]}</p>
                  <p className={styles.contactName}>{teacher.name}</p>
                  <a href={`mailto:${teacher.email}`} className={styles.contactEmail}>{teacher.email}</a>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '13px', fontWeight: 700, color: '#7C3AED', margin: '16px 0 8px' }}>{t.developmentTeam}</p>
            <div className={styles.contactGrid}>
              {students.map((s, i) => (
                <div key={i} className={styles.contactCard}>
                  <p className={styles.contactRole}>{t[s.roleKey]}</p>
                  <p className={styles.contactName}>{s.name}</p>
                  <a href={`mailto:${s.email}`} className={styles.contactEmail}>{s.email}</a>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {}
      <footer className={styles.footer}>
        <Link href="/privacy-policy" className={styles.footerLink}>{t.privacyPolicy}</Link>
        <Link href="/terms" className={styles.footerLink}>{t.termsConditions}</Link>
      </footer>

    </div>
  )
}