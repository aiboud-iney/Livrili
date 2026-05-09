'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/language-switcher'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const translations = {
  en: {
    title: 'Forgot Password',
    subtitle: 'Enter your email and we\'ll send you a reset link',
    email: 'Email Address',
    emailPlaceholder: 'Enter your email address',
    sendLink: 'Send Reset Link',
    sending: 'Sending...',
    backToLogin: 'Back to Login',
    success: 'If an account exists with that email, you will receive a password reset link.',
    errors: {
      emailRequired: 'Email is required.',
      emailInvalid: 'Please enter a valid email address.',
      networkError: 'Network error. Please try again.',
      serverError: 'Something went wrong. Please try again.',
    },
  },
  fr: {
    title: 'Mot de passe oublié',
    subtitle: 'Entrez votre email et nous vous enverrons un lien de réinitialisation',
    email: 'Adresse e-mail',
    emailPlaceholder: 'Entrez votre adresse e-mail',
    sendLink: 'Envoyer le lien',
    sending: 'Envoi en cours...',
    backToLogin: 'Retour à la connexion',
    success: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.',
    errors: {
      emailRequired: 'L\'e-mail est requis.',
      emailInvalid: 'Veuillez entrer une adresse e-mail valide.',
      networkError: 'Erreur réseau. Veuillez réessayer.',
      serverError: 'Une erreur est survenue. Veuillez réessayer.',
    },
  },
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { lang } = useLang()
  const t = translations[lang as 'en' | 'fr']

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => { setVisible(true) }, [])

  const validateEmail = (value: string) => {
    if (!value) return t.errors.emailRequired
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t.errors.emailInvalid
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailError = validateEmail(email)
    if (emailError) { setError(emailError); return }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || t.errors.serverError)
        return
      }

      setSuccess(t.success)
    } catch {
      setError(t.errors.networkError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {}
      <header className="bg-white px-6 py-4 flex items-center justify-between gap-3 border-b border-gray-100">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-3 cursor-pointer"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7C3AED]">
            <img src="/icons/logo.png" alt="Livrili" className="h-5 w-5 object-contain" />
          </div>
          <span style={{ fontFamily: "'Kamerik 105', sans-serif", fontWeight: 800, fontSize: '20px', color: '#111111' }}>
            Livrili
          </span>
        </button>
        <LanguageSwitcher />
      </header>

      {}
      <main
        className="bg-[#CDFF00] relative overflow-hidden flex flex-1 items-center justify-center px-4 py-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        {}
        <img
          src="/images/circles-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none hidden md:block"
          aria-hidden="true"
        />

        {}
        <div className="relative z-10 w-full max-w-md rounded-3xl shadow-xl bg-white p-8">
          {}
          <button
            onClick={() => router.push('/login')}
            className="mb-6 p-1 rounded-lg cursor-pointer"
            style={{ background: 'none', border: 'none' }}
          >
            <img src="/icons/chevron-left.png" alt="Back" className="w-6 h-6 object-contain" />
          </button>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">{t.title}</h1>
          <p className="text-sm text-gray-500 text-center mb-8">{t.subtitle}</p>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">{t.email}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <img src="/icons/mail.png" alt="" className="w-5 h-5 object-contain opacity-50" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); setSuccess('') }}
                  placeholder={t.emailPlaceholder}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-700 placeholder-[#A8A8C0] focus:outline-none"
                  style={{
                    border: `1px solid ${error ? '#fca5a5' : '#e5e7eb'}`,
                    backgroundColor: '#f9f9f9',
                    fontSize: '14px',
                  }}
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {success && (
              <div style={{
                padding: '12px',
                backgroundColor: '#d4edda',
                border: '1px solid #c3e6cb',
                borderRadius: '8px',
                color: '#155724',
                textAlign: 'center',
              }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 font-semibold rounded-xl transition-colors mt-4 cursor-pointer bg-[#7C5CFC] text-white hover:bg-[#6B4DE8] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? t.sending : t.sendLink}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/login" className="text-sm text-[#7C5CFC] font-medium underline">
              {t.backToLogin}
            </Link>
          </div>
        </div>
      </main>

      {}
      <footer className="bg-[#CDFF00] px-6 py-4 flex items-center gap-8">
        <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
          {lang === 'en' ? 'Privacy Policy' : 'Politique de confidentialité'}
        </Link>
        <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
          {lang === 'en' ? 'Terms & Conditions' : 'Conditions générales'}
        </Link>
      </footer>
    </div>
  )
}
