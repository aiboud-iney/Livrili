"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useLang } from "@/contexts/LanguageContext"

const translations = {
  en: {
    login: "Login",
    signup: "Sign Up",
  },
  fr: {
    login: "Connexion",
    signup: "S'inscrire",
  },
}

export function Header() {
  const router = useRouter()
  const { lang, setLang } = useLang()
  const t = translations[lang]
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">

        {}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7C3AED]">
            <img src="/icons/logo.png" alt="Livrili logo" className="h-5 w-5 object-contain" />
          </div>
          <span
            style={{ fontFamily: "'Kamerik 105', sans-serif", fontWeight: 800 }}
            className="text-xl text-foreground"
          >
            Livrili
          </span>
        </Link>

        <div className="flex items-center gap-3">

          <Button
            variant="ghost"
            onClick={() => router.push('/login')}
            style={{
              fontFamily: "'Kamerik 105', sans-serif",
              fontWeight: 700,
              cursor: 'pointer',
              borderRadius: '10px',
              transition: 'background 0.35s ease, color 0.35s ease',
            }}
            className="text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            {t.login}
          </Button>

          <Button
            onClick={() => router.push('/create-account')}
            style={{
              fontFamily: "'Kamerik 105', sans-serif",
              fontWeight: 700,
              borderRadius: '10px',
              padding: '0 20px',
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
            }}
            className="bg-[#7C3AED] text-white hover:bg-[#6D28D9] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/30"
          >
            {t.signup}
          </Button>

          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              style={{
                fontFamily: "'Kamerik 105', sans-serif",
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                border: '1.5px solid #e5e7eb',
                borderRadius: '8px',
                padding: '6px 12px',
                background: 'none',
                color: '#111111',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#7C3AED'
                e.currentTarget.style.color = '#7C3AED'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.color = '#111111'
              }}
            >
              {lang === "en" ? "EN" : "FR"}
              <img src="/icons/icon down 1.png" alt="down" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            </button>

            {}
            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                backgroundColor: '#ffffff',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                minWidth: '120px',
                zIndex: 100,
              }}>
                {[
                  { code: 'en' as const, label: 'English' },
                  { code: 'fr' as const, label: 'Français' },
                ].map(option => (
                  <button
                    key={option.code}
                    onClick={() => {
                      setLang(option.code)
                      setDropdownOpen(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      textAlign: 'left',
                      background: lang === option.code ? '#f4f0ff' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: lang === option.code ? 700 : 500,
                      color: lang === option.code ? '#7C3AED' : '#333333',
                      transition: 'background 0.15s',
                      fontFamily: "'Kamerik 105', sans-serif",
                    }}
                    onMouseEnter={e => {
                      if (lang !== option.code)
                        e.currentTarget.style.backgroundColor = '#f9f9f9'
                    }}
                    onMouseLeave={e => {
                      if (lang !== option.code)
                        e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}
