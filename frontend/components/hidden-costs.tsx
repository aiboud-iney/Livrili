"use client"

import { useEffect, useRef, useState } from "react"
import { useLang } from "@/contexts/LanguageContext"

const translations = {
  en: {
    title: "The Hidden Cost of Road Freight in Algeria",
    stats: [
      {
        title: "Road Freight Usage",
        value: "85%+",
        description: "The vast majority of logistics in Algeria depends on road infrastructure, making efficiency critical.",
      },
      {
        title: "Empty Return Trips",
        value: "25-40%",
        description: "A massive portion of trucks drive back empty, causing wasted fuel and lost revenue for transporters.",
      },
      {
        title: "Inefficiency Cost",
        value: "High",
        description: "Inefficient matching leads to high prices for shippers and low margins for truck owners.",
      },
    ],
  },
  fr: {
    title: "Le Coût Caché du Fret Routier en Algérie",
    stats: [
      {
        title: "Utilisation du Fret Routier",
        value: "85%+",
        description: "La grande majorité de la logistique en Algérie dépend des infrastructures routières, rendant l'efficacité essentielle.",
      },
      {
        title: "Trajets Retour à Vide",
        value: "25-40%",
        description: "Une grande partie des camions reviennent à vide, causant un gaspillage de carburant et une perte de revenus.",
      },
      {
        title: "Coût d'Inefficacité",
        value: "Élevé",
        description: "Une correspondance inefficace entraîne des prix élevés pour les expéditeurs et de faibles marges pour les propriétaires de camions.",
      },
    ],
  },
}

const staticStats = [
  {
    iconSrc: "/icons/Road Freight Usage.png",
    bg: "rgba(126, 82, 255, 0.30)",
    border: "#7E52FF",
    accentColor: "#7E52FF",
  },
  {
    iconSrc: "/icons/Empty Return Trips.png",
    bg: "rgba(184, 255, 0, 0.30)",
    border: "#B8FF00",
    accentColor: "#B8FF00",
  },
  {
    iconSrc: "/icons/Inefficiency Cost.png",
    bg: "rgba(126, 82, 255, 0.30)",
    border: "#7E52FF",
    accentColor: "#7E52FF",
  },
]

export function HiddenCosts() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const { lang } = useLang()
  const t = translations[lang]

  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleCards(prev => {
                const next = [...prev]
                next[index] = true
                return next
              })
            }, index * 150)
          }
        },
        { threshold: 0.2 }
      )
      observer.observe(ref)
      return observer
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#F4F4F4' }}>
      <div className="container px-4 md:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-5 text-balance">
          {t.title}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
          <div style={{
            width: '100px',
            height: '4px',
            backgroundColor: '#7C3AED',
            borderRadius: '999px',
          }} />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {t.stats.map((stat, index) => {
            const s = staticStats[index]
            return (
              <div
                key={index}
                ref={el => { cardRefs.current[index] = el }}
                style={{
                  backgroundColor: s.bg,
                  border: `1.5px solid ${s.border}`,
                  borderRadius: '16px',
                  padding: '24px',
                  height: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  gap: '14px',
                  opacity: visibleCards[index] ? 1 : 0,
                  transform: visibleCards[index] ? 'translateY(0px)' : 'translateY(32px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.2s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 8px 32px ${s.accentColor}40`
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0px)'
                }}
              >
                <img
                  src={s.iconSrc}
                  alt={stat.title}
                  style={{ width: '36px', height: '36px', objectFit: 'contain', flexShrink: 0 }}
                />
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#000000', lineHeight: 1.2, margin: 0 }}>
                  {stat.title}
                </p>
                <div style={{ width: '40px', height: '2px', backgroundColor: s.border, borderRadius: '999px', flexShrink: 0 }} />
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#000000', lineHeight: 1, margin: 0 }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: '12px', fontWeight: 400, color: '#000000', lineHeight: 1.6, margin: 0 }}>
                  {stat.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}