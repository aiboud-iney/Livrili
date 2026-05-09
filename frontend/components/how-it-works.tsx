"use client"

import { useEffect, useRef, useState } from "react"
import { useLang } from "@/contexts/LanguageContext"

const translations = {
  en: {
    title: "How It",
    titleHighlight: "Works",
    steps: [
      { number: "1", title: "Post Your Listing", description: "Whether you have cargo to move or an empty truck looking for a load, post your details in seconds." },
      { number: "2", title: "Browse & Connect", description: "Search for routes or shipments that match your needs. Use filters to find the perfect partner instantly." },
      { number: "3", title: "Direct Negotiation", description: "Call or chat directly. No middlemen. You agree on the price and terms yourself." },
    ],
    leftCards: [
      { iconSrc: "/icons/Real-Time Search.png", title: "Real-Time Search", bg: "#BFFF00", textColor: "#000000" },
      { iconSrc: "/icons/Multi-Truck Management.png", title: "Multi-Truck Management", bg: "#7C3AED", textColor: "#ffffff" },
    ],
    rightCards: [
      { iconSrc: "/icons/All-in-One Workspace.png", title: "All-in-One Workspace", bg: "#7C3AED", textColor: "#ffffff" },
      { iconSrc: "/icons/Verified Profiles.png", title: "Verified Profiles", bg: "#BFFF00", textColor: "#000000" },
    ],
  },
  fr: {
    title: "Comment ça",
    titleHighlight: "marche",
    steps: [
      { number: "1", title: "Publiez votre annonce", description: "Que vous ayez un chargement à transporter ou un camion vide à remplir, publiez vos détails en quelques secondes." },
      { number: "2", title: "Parcourir et connecter", description: "Recherchez des trajets ou des expéditions qui correspondent à vos besoins. Utilisez les filtres pour trouver le partenaire idéal." },
      { number: "3", title: "Négociation directe", description: "Appelez ou discutez directement. Sans intermédiaires. Vous convenez du prix et des conditions vous-même." },
    ],
    leftCards: [
      { iconSrc: "/icons/Real-Time Search.png", title: "Recherche en temps réel", bg: "#BFFF00", textColor: "#000000" },
      { iconSrc: "/icons/Multi-Truck Management.png", title: "Gestion multi-camions", bg: "#7C3AED", textColor: "#ffffff" },
    ],
    rightCards: [
      { iconSrc: "/icons/All-in-One Workspace.png", title: "Espace de travail tout-en-un", bg: "#7C3AED", textColor: "#ffffff" },
      { iconSrc: "/icons/Verified Profiles.png", title: "Profils vérifiés", bg: "#BFFF00", textColor: "#000000" },
    ],
  },
}

export function HowItWorks() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { lang } = useLang()
  const t = translations[lang]
  const steps = t.steps
  const leftCards = t.leftCards
  const rightCards = t.rightCards

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const CardItem = ({ card }: { card: typeof leftCards[0] }) => (
    <div
      style={{
        backgroundColor: card.bg,
        borderRadius: '16px',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        flex: 1,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <img
        src={card.iconSrc}
        alt={card.title}
        style={{ width: '32px', height: '32px', objectFit: 'contain' }}
      />
      <p style={{
        fontSize: '13px',
        fontWeight: 700,
        color: card.textColor,
        textAlign: 'center',
        lineHeight: 1.4,
        margin: 0,
      }}>
        {card.title}
      </p>
    </div>
  )

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white"
    >
      <div className="container px-4 md:px-6">

        <div className="grid gap-12 lg:grid-cols-2" style={{ alignItems: 'stretch', minHeight: '580px' }}>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            {}
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{
                marginBottom: '48px',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              {t.title} <span style={{ color: '#BFFF00' }}>{t.titleHighlight}</span>
            </h2>

            {}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
              {steps.map((step, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'flex-start',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateX(0)' : 'translateX(-24px)',
                    transition: `opacity 0.5s ease ${0.1 + index * 0.15}s, transform 0.5s ease ${0.1 + index * 0.15}s`,
                  }}
                >
                  {}
                  <div
                    style={{
                      minWidth: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: '#BFFF00',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '20px',
                      flexShrink: 0,
                    }}
                  >
                    {step.number}
                  </div>

                  {}
                  <div style={{ paddingTop: '6px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '19px', color: '#111111', marginBottom: '6px' }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: '15px', color: '#666666', lineHeight: 1.7, margin: 0 }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(32px)',
              transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s',
            }}
          >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {leftCards.map((card, i) => <CardItem key={i} card={card} />)}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '40px', marginBottom: '-40px' }}>
              {rightCards.map((card, i) => <CardItem key={i} card={card} />)}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}