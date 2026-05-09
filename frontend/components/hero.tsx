"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./hero.module.css"
import { useLang } from "@/contexts/LanguageContext"
import { useRouter } from "next/navigation"

const ROUTES = {
  login: "/login",
} as const

const translations = {
  en: {
    badge: "LOGISTICS REIMAGINED",
    titleConnect: "Connect",
    titleShipments: "Shipments",
    titleTrucks: "Trucks",
    titleIntelligently: "Intelligently",
    subtitle: "Eliminate empty return trips and optimize your logistics across Algeria with our direct freight marketplace. No middleman, no extra costs.",
    btn1: "Post a Shipment",
    btn2: "Post a Route",
  },
  fr: {
    badge: "LA LOGISTIQUE RÉINVENTÉE",
    titleConnect: "Connectez",
    titleShipments: "Expéditions",
    titleTrucks: "Camions",
    titleIntelligently: "Intelligemment",
    subtitle: "Éliminez les trajets à vide et optimisez votre logistique en Algérie avec notre marketplace de fret direct. Sans intermédiaire, sans frais supplémentaires.",
    btn1: "Publier une Expédition",
    btn2: "Publier un Trajet",
  },
}

export function Hero() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { lang } = useLang()
  const t = translations[lang]
  const router = useRouter()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden bg-white py-12 md:py-20 ${styles.section}`}
      style={{ fontFamily: "'Kamerik 105', sans-serif" }}
    >
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center lg:gap-10">

          {}
          <div className={`flex flex-col gap-6 order-1 lg:col-start-1 lg:row-start-1 ${styles.leftContent}`}>

            {}
            <div
              className={`inline-flex w-fit items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-widest ${styles.badge}`}
              style={{
                fontFamily: "'Kamerik 105', sans-serif",
                fontWeight: 700,
                color: '#202020',
                backgroundColor: '#f4ffe0',
                border: '1.5px solid #BFFF00',
                borderRadius: '15px',
                letterSpacing: '1px',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0px)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#BFFF00', display: 'inline-block', flexShrink: 0 }} />
              {t.badge}
            </div>

            {}
            <h1
              style={{
                fontFamily: "'Kamerik 105', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(32px, 7vw, 45px)',
                lineHeight: 1.3,
                color: '#202020',
                margin: 0,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0px)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease 0.25s, transform 0.5s ease 0.25s',
              }}
            >
              <span style={{ display: 'block' }}>
                {t.titleConnect}{' '}
                <span style={{ color: '#7C3AED' }}>{t.titleShipments}</span>
                {' '}&amp;
              </span>
              <span style={{ display: 'block' }}>
                <span style={{ color: '#7C3AED' }}>{t.titleTrucks}</span>
                {' '}{t.titleIntelligently}
              </span>
            </h1>

            {}
            <p
              style={{
                fontFamily: "'Kamerik 105', sans-serif",
                fontWeight: 400,
                fontSize: '15px',
                color: '#666666',
                lineHeight: 1.75,
                maxWidth: '500px',
                margin: 0,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0px)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s',
              }}
            >
              {t.subtitle}
            </p>
          </div>

          {}
          <div
            className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:flex lg:items-center"
            style={{
              position: 'relative',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0px)' : 'translateX(40px)',
              transition: 'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s',
            }}
          >
            <div className={styles.glowGreen} style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(191,255,0,0.25)', filter: 'blur(48px)', zIndex: 0 }} />
            <div className={styles.glowPurple} style={{ position: 'absolute', bottom: '-24px', left: '-24px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(124,58,237,0.15)', filter: 'blur(36px)', zIndex: 0 }} />

            <div
              className={styles.imageWrapper}
              style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e5e7eb', zIndex: 1, transition: 'box-shadow 0.3s ease, transform 0.3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 60px rgba(124,58,237,0.15)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0px)' }}
            >
              <img src="/images/trucks-hero.png" alt="Trucks on highway" className={styles.truckImage} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.08), transparent)' }} />
            </div>

            <div className={styles.decorSquare} style={{ position: 'absolute', bottom: '-18px', right: '-18px', width: '72px', height: '72px', backgroundColor: '#BFFF00', borderRadius: '12px', zIndex: 0 }} />
          </div>

          {}
          <div
            className={`flex flex-wrap gap-4 mt-2 order-3 lg:col-start-1 lg:row-start-2 lg:mt-0 ${styles.ctaButtons}`}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0px)' : 'translateY(20px)',
              transition: 'opacity 0.5s ease 0.55s, transform 0.5s ease 0.55s',
            }}
          >
            {}
            <button
              className={styles.ctaButton}
              onClick={() => router.push(ROUTES.login)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: "'Kamerik 105', sans-serif", fontWeight: 700, fontSize: '15px', color: '#ffffff', backgroundColor: '#7C3AED', border: 'none', borderRadius: '10px', padding: '14px 26px', cursor: 'pointer', transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor = '#6D28D9'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.4)' }}
              onMouseOut={e => { e.currentTarget.style.backgroundColor = '#7C3AED'; e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <img src="/icons/plus.png" alt="Plus icon" className="w-[18px] h-[18px]" />
              {t.btn1}
            </button>

            {}
            <button
              className={styles.ctaButton}
              onClick={() => router.push(ROUTES.login)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: "'Kamerik 105', sans-serif", fontWeight: 700, fontSize: '15px', color: '#111111', backgroundColor: 'transparent', border: '2px solid #BFFF00', borderRadius: '10px', padding: '14px 26px', cursor: 'pointer', transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor = '#f4ffe0'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(191,255,0,0.35)' }}
              onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <img src="/icons/route.png" alt="Route icon" className="w-[18px] h-[18px]" />
              {t.btn2}
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}