"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLang } from "@/contexts/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"

const translations = {
  en: {
    pageTitle: "Support",
    pageSubtitle: "We're here to help. Choose a topic or send us a message.",
    faqTitle: "Frequently Asked Questions",
    contactTitle: "Contact Us",
    contactSubtitle: "Can't find your answer? Send us a message and we'll get back to you within 24 hours.",
    namePlaceholder: "Your full name",
    emailPlaceholder: "Your email address",
    subjectPlaceholder: "What is your question about?",
    messagePlaceholder: "Describe your issue or question in detail...",
    sendMessage: "Send Message",
    sent: "Message sent! We'll get back to you soon.",
    name: "Full Name",
    email: "Email Address",
    subject: "Subject",
    message: "Message",
    faqs: [
      {
        q: "How do I post a shipment?",
        a: "Click 'Post a Shipment' from the homepage or dashboard. Fill in your cargo details, route, contact number and photos, then publish.",
      },
      {
        q: "Is Livrili available outside Algeria?",
        a: "Currently Livrili operates exclusively within Algeria. We plan to expand to neighboring countries in the future.",
      },
      {
        q: "How are truckers verified?",
        a: "All transporters on Livrili go through an identity and document verification process before being allowed to make offers.",
      },
      {
        q: "Is there a fee to post a shipment?",
        a: "Posting a shipment is completely free. Livrili earns a small commission only when a deal is successfully completed.",
      },
      {
        q: "How do I contact a trucker?",
        a: "Once a trucker makes an offer on your shipment, you can view their profile and contact them directly via phone.",
      },
      {
        q: "What if I have a dispute?",
        a: "Please contact our support team immediately. We review all disputes and mediate between shippers and transporters.",
      },
    ],
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    support: "Support",
    copyright: "© 2026 LIVRILI LOGISTICS SOLUTIONS. DZ",
  },
  fr: {
    pageTitle: "Support",
    pageSubtitle: "Nous sommes là pour vous aider. Choisissez un sujet ou envoyez-nous un message.",
    faqTitle: "Questions Fréquemment Posées",
    contactTitle: "Contactez-nous",
    contactSubtitle: "Vous ne trouvez pas votre réponse ? Envoyez-nous un message et nous vous répondrons sous 24 heures.",
    namePlaceholder: "Votre nom complet",
    emailPlaceholder: "Votre adresse e-mail",
    subjectPlaceholder: "De quoi s'agit-il ?",
    messagePlaceholder: "Décrivez votre problème ou question en détail...",
    sendMessage: "Envoyer le Message",
    sent: "Message envoyé ! Nous vous répondrons bientôt.",
    name: "Nom Complet",
    email: "Adresse E-mail",
    subject: "Sujet",
    message: "Message",
    faqs: [
      {
        q: "Comment publier une expédition ?",
        a: "Cliquez sur 'Publier une Expédition' depuis la page d'accueil. Remplissez les détails de la cargaison, l'itinéraire, le numéro de contact et les photos, puis publiez.",
      },
      {
        q: "Livrili est-il disponible en dehors de l'Algérie ?",
        a: "Actuellement, Livrili opère exclusivement en Algérie. Nous prévoyons de nous étendre aux pays voisins à l'avenir.",
      },
      {
        q: "Comment les transporteurs sont-ils vérifiés ?",
        a: "Tous les transporteurs sur Livrili passent par un processus de vérification d'identité et de documents avant de pouvoir faire des offres.",
      },
      {
        q: "Y a-t-il des frais pour publier une expédition ?",
        a: "La publication d'une expédition est entièrement gratuite. Livrili perçoit une petite commission uniquement lorsqu'une transaction est complétée avec succès.",
      },
      {
        q: "Comment contacter un transporteur ?",
        a: "Une fois qu'un transporteur fait une offre sur votre expédition, vous pouvez consulter son profil et le contacter directement par téléphone.",
      },
      {
        q: "Que faire en cas de litige ?",
        a: "Veuillez contacter notre équipe d'assistance immédiatement. Nous examinons tous les litiges et servons de médiateurs entre expéditeurs et transporteurs.",
      },
    ],
    privacyPolicy: "Politique de Confidentialité",
    termsOfService: "Conditions d'Utilisation",
    support: "Support",
    copyright: "© 2026 LIVRILI LOGISTICS SOLUTIONS. DZ",
  },
}

export default function SupportPage() {
  const router = useRouter()
  const { lang } = useLang()
  const t = translations[lang]
  const [visible, setVisible] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => { setVisible(true) }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div
      className="min-h-screen bg-[#f5f5f5] flex flex-col"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}
    >
      {}
      <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            title="Go to home"
            onClick={() => router.push('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}
          >
            <div className="w-9 h-9 bg-[#7C3AED] rounded-lg flex items-center justify-center">
              <img src="/icons/logo.png" alt="Livrili" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            </div>
            <span className="text-xl font-semibold text-black">Livrili</span>
          </button>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">

          {}
          <div
            className="text-center mb-14"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#f4ffe0', border: '1.5px solid #BFFF00', borderRadius: '15px', padding: '6px 16px', marginBottom: '20px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#BFFF00', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#202020', letterSpacing: '1px' }}>
                {lang === 'en' ? 'HELP CENTER' : 'CENTRE D\'AIDE'}
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#202020', marginBottom: '12px', lineHeight: 1.2 }}>
              {t.pageTitle}
            </h1>
            <p style={{ fontSize: '16px', color: '#666666', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
              {t.pageSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {}
            <div
              style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s' }}
            >
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#202020', marginBottom: '20px' }}>
                {t.faqTitle}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {t.faqs.map((faq, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '14px',
                      border: `1.5px solid ${openFaq === i ? '#7C3AED' : '#f3f4f6'}`,
                      overflow: 'hidden',
                      transition: 'border-color 0.2s',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    <button
                      title={faq.q}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        gap: '12px',
                      }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: 600, color: openFaq === i ? '#7C3AED' : '#202020', lineHeight: 1.4 }}>
                        {faq.q}
                      </span>
                      <span style={{
                        fontSize: '18px',
                        color: '#7C3AED',
                        flexShrink: 0,
                        transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)',
                        transition: 'transform 0.2s',
                        display: 'inline-block',
                        fontWeight: 300,
                      }}>+</span>
                    </button>
                    {openFaq === i && (
                      <div style={{ padding: '0 20px 16px', borderTop: '1px solid #f3f4f6' }}>
                        <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.7, marginTop: '12px' }}>
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {}
            <div
              style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s' }}
            >
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#202020', marginBottom: '8px' }}>
                {t.contactTitle}
              </h2>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '20px', lineHeight: 1.6 }}>
                {t.contactSubtitle}
              </p>

              <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6' }}>
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}></div>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#059669', marginBottom: '8px' }}>{t.sent}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { key: 'name', label: t.name, placeholder: t.namePlaceholder, type: 'text' },
                      { key: 'email', label: t.email, placeholder: t.emailPlaceholder, type: 'email' },
                      { key: 'subject', label: t.subject, placeholder: t.subjectPlaceholder, type: 'text' },
                    ].map(field => (
                      <div key={field.key}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          title={field.label}
                          placeholder={field.placeholder}
                          required
                          value={formData[field.key as keyof typeof formData]}
                          onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '11px 16px',
                            backgroundColor: '#F3EAFF',
                            borderRadius: '10px',
                            border: 'none',
                            outline: 'none',
                            fontSize: '14px',
                            color: '#374151',
                            boxSizing: 'border-box',
                          } as React.CSSProperties}
                        />
                      </div>
                    ))}

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                        {t.message}
                      </label>
                      <textarea
                        title={t.message}
                        placeholder={t.messagePlaceholder}
                        required
                        rows={4}
                        value={formData.message}
                        onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '11px 16px',
                          backgroundColor: '#F3EAFF',
                          borderRadius: '10px',
                          border: 'none',
                          outline: 'none',
                          fontSize: '14px',
                          color: '#374151',
                          resize: 'none',
                          boxSizing: 'border-box',
                          fontFamily: 'inherit',
                        } as React.CSSProperties}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: '#7C3AED',
                        color: 'white',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '15px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'background 0.2s, transform 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#6D28D9'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#7C3AED'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      {t.sendMessage}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {}
      <footer className="bg-[#202020] py-4 px-6 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p style={{ fontSize: '11px', color: '#9CA3AF' }}>{t.copyright}</p>
          <div className="flex items-center gap-6">
            <a href="/privacy-policy" style={{ fontSize: '11px', color: '#9CA3AF', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')} onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}>{t.privacyPolicy}</a>
            <a href="/terms" style={{ fontSize: '11px', color: '#9CA3AF', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')} onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}>{t.termsOfService}</a>
            <a href="/support" style={{ fontSize: '11px', color: '#ffffff', textDecoration: 'none', fontWeight: 600 }}>{t.support}</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
