"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useLang } from "@/contexts/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"
import styles from "./page.module.css"

const translations = {
  en: {
    title: "Verify Your Account",
    subtitle: "Enter the verification code sent to",
    codeSent: "We've sent a 6-digit verification code to",
    codePlaceholder: "Enter 6-digit code",
    verify: "Verify Account",
    verifying: "Verifying...",
    resendCode: "Resend Code",
    resendIn: "Resend code in",
    seconds: "seconds",
    backToLogin: "Back to Login",
    didntReceive: "Didn't receive the code?",
    checkSpam: "Check your spam folder or request a new code.",
    errors: {
      codeRequired: "Verification code is required",
      codeInvalid: "Please enter a valid 6-digit code",
      verificationFailed: "Invalid or expired verification code",
      resendFailed: "Failed to resend code. Please try again.",
      networkError: "Network error. Please check your connection.",
    },
    success: {
      verified: "Account verified successfully! Redirecting...",
    },
  },
  fr: {
    title: "Vérifiez votre compte",
    subtitle: "Entrez le code de vérification envoyé à",
    codeSent: "Nous avons envoyé un code de vérification à 6 chiffres à",
    codePlaceholder: "Entrez le code à 6 chiffres",
    verify: "Vérifier le compte",
    verifying: "Vérification en cours...",
    resendCode: "Renvoyer le code",
    resendIn: "Renvoyer dans",
    seconds: "secondes",
    backToLogin: "Retour à la connexion",
    didntReceive: "Vous n'avez pas reçu le code ?",
    checkSpam: "Vérifiez votre dossier spam ou demandez un nouveau code.",
    errors: {
      codeRequired: "Le code de vérification est requis",
      codeInvalid: "Veuillez entrer un code valide à 6 chiffres",
      verificationFailed: "Code de vérification invalide ou expiré",
      resendFailed: "Échec de l'envoi du code. Veuillez réessayer.",
      networkError: "Erreur réseau. Vérifiez votre connexion.",
    },
    success: {
      verified: "Compte vérifié avec succès ! Redirection...",
    },
  },
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function VerifyAccount() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang } = useLang()
  const t = translations[lang]

  const email = searchParams.get('email') || ''
  const initialCode = searchParams.get('code') || ''

  const [code, setCode] = useState(() => {
    if (initialCode.length === 6) return initialCode.split('')
    return ['', '', '', '', '', '']
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && !canResend) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }

    if (submitError) setSubmitError('')
    if (successMessage) setSuccessMessage('')
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const getFullCode = () => code.join('')

  const handleVerify = async () => {
    const fullCode = getFullCode()

    if (fullCode.length !== 6) {
      setSubmitError(t.errors.codeInvalid)
      return
    }

    setIsLoading(true)
    setSubmitError('')
    setSuccessMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          code: fullCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setSubmitError(data.message || t.errors.verificationFailed)
        return
      }

      setSuccessMessage(t.success.verified)

      if (data.token) {
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      setTimeout(() => {
        router.push('/subscription')
      }, 2000)

    } catch (err) {
      console.error('Verification error:', err)
      setSubmitError(t.errors.networkError)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!canResend) return

    setIsResending(true)
    setSubmitError('')
    setSuccessMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error('Failed to resend code')
      }

      setCountdown(60)
      setCanResend(false)

      const newCode = data.verificationCode
      if (newCode) {
        setCode(newCode.split(''))
        setSuccessMessage(`New verification code: ${newCode}`)
      } else {
        setSuccessMessage('New verification code sent!')
      }

    } catch (err) {
      console.error('Resend error:', err)
      setSubmitError(t.errors.resendFailed)
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
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
        <main className={styles.main}>
          <div className={styles.card}>
            <h1 className={styles.title}>No email provided</h1>
            <p>Please go back to sign up and try again.</p>
            <button onClick={() => router.push('/create-account')} className={styles.sendButton}>
              Back to Sign Up
            </button>
          </div>
        </main>
      </div>
    )
  }

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

          <h1 className={styles.title}>{t.title}</h1>

          <p className={styles.subtitle}>
            {t.codeSent}{' '}
            <span className={styles.subtitleLink}>{email}</span>
          </p>

          <div className={styles.form}>

            {}
            <div className={styles.codeContainer}>
              {code.map((digit, index) => (
                <input
                  title="input here"
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`${styles.codeInput} ${submitError ? styles.inputError : ''}`}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isLoading}
                />
              ))}
            </div>

            {submitError && <p className={styles.errorText}>{submitError}</p>}

            {}
            {successMessage && (
              <div style={{ padding: '12px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px', color: '#155724', textAlign: 'center' }}>
                {successMessage}
              </div>
            )}

            {}
            <div className={styles.buttonWrapper}>
              <button
                type="button"
                className={styles.sendButton}
                onClick={handleVerify}
                disabled={isLoading}
              >
                {isLoading ? t.verifying : t.verify}
              </button>
            </div>

            {}
            <div className={styles.resendSection}>
              <p className={styles.resendText}>{t.didntReceive}</p>
              <p className={styles.resendHint}>{t.checkSpam}</p>

              <button
                type="button"
                className={styles.resendButton}
                onClick={handleResendCode}
                disabled={!canResend || isResending}
                style={{
                  opacity: !canResend || isResending ? 0.6 : 1,
                  cursor: !canResend || isResending ? 'not-allowed' : 'pointer',
                }}
              >
                {isResending
                  ? 'Sending...'
                  : canResend
                    ? t.resendCode
                    : `${t.resendIn} ${countdown} ${t.seconds}`
                }
              </button>
            </div>

            {}
            <div className={styles.backLink}>
              <Link href="/login" className={styles.footerLink}>
                ← {t.backToLogin}
              </Link>
            </div>

          </div>
        </div>
      </main>

      {}
      <footer className={styles.footer}>
        <Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
        <Link href="/terms" className={styles.footerLink}>Terms & Conditions</Link>
      </footer>

    </div>
  )
}