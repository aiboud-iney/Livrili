"use client"

import { useEffect, useRef, useState } from "react"
import { useLang } from "@/contexts/LanguageContext"
import { useRouter } from "next/navigation"

const translations = {
  en: {
    title1: "Ready to",
    titleHighlight: "optimize",
    title2: "your transport?",
    subtitle: "Join the fastest growing freight network in Algeria. The best option for transporters and shippers.",
    btn: "Get Started",
  },
  fr: {
    title1: "Prêt à",
    titleHighlight: "optimiser",
    title2: "votre transport?",
    subtitle: "Rejoignez le réseau de fret à la croissance la plus rapide en Algérie. La meilleure option pour les transporteurs et les expéditeurs.",
    btn: "Commencer",
  },
}

export function CTASection() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { lang } = useLang()
  const t = translations[lang]
  const router = useRouter()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div style={{ display: 'flex', justifyContent: 'center' }}>

          {}
          <div
            style={{
              background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 30%, #5B21B6 60%, #3B0764 100%)',
              borderRadius: '24px',
              padding: 'clamp(28px, 5vw, 52px) clamp(20px, 4vw, 40px)',
              overflow: 'hidden',
              position: 'relative' as const,
              maxWidth: '900px',
              width: '100%',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
            className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-10"
          >

            {}
            <div style={{
              position: 'absolute',
              top: '-60px',
              right: '200px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'rgba(191,255,0,0.08)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              left: '100px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(168,85,247,0.2)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }} />

            {}
            <div
              style={{
                flexShrink: 0,
                width: '100%',
                maxWidth: '300px',
                height: 'clamp(200px, 40vw, 300px)',
                borderRadius: '16px',
                overflow: 'hidden',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(-24px)',
                transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
                alignSelf: 'center',
              }}
            >
              <img
                src="/images/cta-warehouse.png"
                alt="Warehouse"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                  transition: 'transform 0.4s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </div>

            {}
            <div
              style={{
                flex: 1,
                zIndex: 1,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(24px)',
                transition: 'opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s',
                width: '100%',
              }}
              className="text-center md:text-left"
            >
              {}
              <h2 style={{
                fontSize: 'clamp(24px, 5vw, 44px)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.15,
                marginBottom: '12px',
              }}>
                {t.title1}{' '}
                <span style={{ color: '#BFFF00' }}>{t.titleHighlight}</span>
                <br />{t.title2}
              </h2>

              {}
              <p
                style={{
                  fontSize: 'clamp(13px, 2vw, 15px)',
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.7,
                  marginBottom: '24px',
                  maxWidth: '380px',
                }}
                className="mx-auto mb-6 md:mx-0 md:mb-6"
              >
                {t.subtitle}
              </p>

              {}
              <div className="flex justify-center md:justify-start">
                <button
                onClick={()=>router.push('/login')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: '#BFFF00',
                    color: '#111111',
                    fontWeight: 700,
                    fontSize: '16px',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 28px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(191,255,0,0.4)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {t.btn}
                  <img
                    src="/icons/Get Started.png"
                    alt="Get Started Icon"
                    style={{ width: '18px', height: '18px', objectFit: 'contain' }}
                  />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}