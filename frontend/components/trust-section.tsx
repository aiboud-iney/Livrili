"use client"

import { useEffect, useRef, useState } from "react"
import { useLang } from "@/contexts/LanguageContext"

const STAT_TARGETS = [400, 1000, 50]

const STAT_ICONS = [
  "/icons/Active Users.png",
  "/icons/Monthly Shipments.png",
  "/icons/Wilayas Covered.png",
]

const translations = {
  en: {
    title: "Trusted by 400+ transporters",
    subtitle: "Our community is growing every day across the country.",
    stats: [
      { label: "ACTIVE USERS" },
      { label: "MONTHLY SHIPMENTS" },
      { label: "WILAYAS COVERED" },
    ],
  },
  fr: {
    title: "Près de 400+ transporteurs nous font confiance",
    subtitle: "Notre communauté grandit chaque jour à travers le pays.",
    stats: [
      { label: "UTILISATEURS ACTIFS" },
      { label: "EXPÉDITIONS MENSUELLES" },
      { label: "WILAYAS COUVERTES" },
    ],
  },
}

export function TrustSection() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false])
  const [counts, setCounts] = useState([0, 0, 0])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const { lang } = useLang()
  const t = translations[lang]

  const stats = t.stats.map((s, i) => ({ ...s, iconSrc: STAT_ICONS[i] }))

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

              const target = STAT_TARGETS[index]
              const duration = 1500
              const steps = 50
              const increment = target / steps
              let current = 0
              const timer = setInterval(() => {
                current += increment
                if (current >= target) {
                  current = target
                  clearInterval(timer)
                }
                setCounts(prev => {
                  const next = [...prev]
                  next[index] = Math.floor(current)
                  return next
                })
              }, duration / steps)
            }, index * 150)
          }
        },
        { threshold: 0.3 }
      )
      observer.observe(ref)
      return observer
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  const formatCount = (index: number) => {
    const c = counts[index]
    if (index === 1) return c.toLocaleString() + "+"
    return c + "+"
  }

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#F4F4F4' }}>
      <div className="container px-4 md:px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-3">
            {t.title}
          </h2>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              ref={el => { cardRefs.current[index] = el }}
              style={{
                borderRadius: '16px',
                border: '1.5px solid #7C3AED',
                padding: '32px',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                cursor: 'default',
                opacity: visibleCards[index] ? 1 : 0,
                transform: visibleCards[index] ? 'translateY(0)' : 'translateY(24px)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.2)'
                e.currentTarget.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <p style={{ fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: 800, color: '#7C3AED', marginBottom: '16px', lineHeight: 1 }}>
                {visibleCards[index] ? formatCount(index) : "0+"}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={stat.iconSrc} alt={stat.label} style={{ width: '16px', height: '16px', objectFit: 'contain', opacity: 0.7 }} />
                <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', color: '#444444' }}>
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}