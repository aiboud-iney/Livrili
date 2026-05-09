"use client"

import { useEffect, useRef, useState } from "react"
import { useLang } from "@/contexts/LanguageContext"

const translations = {
  en: {
    benefits: [
      { value: "60%", label: "Faster matching" },
      { value: "-30%", label: "Estimated costs" },
      { value: "100%", label: "Direct communication" },
    ],
  },
  fr: {
    benefits: [
      { value: "60%", label: "Correspondance plus rapide" },
      { value: "-30%", label: "Coûts estimés" },
      { value: "100%", label: "Communication directe" },
    ],
  },
}

export function BenefitsBanner() {
  const [visibleItems, setVisibleItems] = useState<boolean[]>([false, false, false])
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const { lang } = useLang()
  const t = translations[lang]

  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleItems(prev => {
                const next = [...prev]
                next[index] = true
                return next
              })
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

  return (
    <section className="bg-[#202020] py-12">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {t.benefits.map((benefit, index) => (
            <div
              key={index}
              ref={el => { itemRefs.current[index] = el }}
              className="text-center"
              style={{
                opacity: visibleItems[index] ? 1 : 0,
                transform: visibleItems[index] ? 'translateY(0px)' : 'translateY(24px)',
                transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <p
                className="text-4xl md:text-5xl font-bold text-[#BFFF00] mb-2"
                style={{ transition: 'transform 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {benefit.value}
              </p>
              <p className="text-[#BFFF00] text-sm font-medium">
                {benefit.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}