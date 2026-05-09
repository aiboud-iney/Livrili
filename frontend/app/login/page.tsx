"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLang } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { LanguageSwitcher } from "@/components/language-switcher"
import { GoogleLoginButton } from "@/components/google-login-button"
import styles from "./login.module.css"

const translations = {
  en: {
    welcomeBack: "Welcome Back",
    emailAddress: "Email Address",
    password: "Password",
    forgotPassword: "Forgot password?",
    rememberMe: "Remember me !",
    logIn: "Log In",
    loggingIn: "Logging in...",
    orContinueWith: "or continue with",
    noAccount: "You don't have an account?",
    signUp: "Sign up",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
    errors: {
      emailRequired: "Email is required.",
      emailInvalid: "Please enter a valid email address.",
      passwordRequired: "Password is required.",
      passwordMin: "Password must be at least 8 characters.",
      passwordUppercase: "Password must contain at least one uppercase letter.",
      passwordNumber: "Password must contain at least one number.",
      passwordSpecial: "Password must contain at least one special character (!@#$%^&*).",
      submitFailed: "Invalid email or password. Please try again.",
      accountNotVerified: "Your account is not verified yet. Please wait for admin approval.",
      networkError: "Network error. Please check your connection.",
    },
    success: {
      loginSuccess: "Login successful! Redirecting...",
    },
    hint: "Min 8 chars, 1 uppercase, 1 number, 1 special character",
  },
  fr: {
    welcomeBack: "Bon retour",
    emailAddress: "Adresse e-mail",
    password: "Mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    rememberMe: "Se souvenir de moi !",
    logIn: "Connexion",
    loggingIn: "Connexion en cours...",
    orContinueWith: "ou continuer avec",
    noAccount: "Vous n'avez pas de compte ?",
    signUp: "S'inscrire",
    privacyPolicy: "Politique de confidentialité",
    termsConditions: "Conditions générales",
    errors: {
      emailRequired: "L'e-mail est requis.",
      emailInvalid: "Veuillez entrer une adresse e-mail valide.",
      passwordRequired: "Le mot de passe est requis.",
      passwordMin: "Le mot de passe doit contenir au moins 8 caractères.",
      passwordUppercase: "Le mot de passe doit contenir au moins une majuscule.",
      passwordNumber: "Le mot de passe doit contenir au moins un chiffre.",
      passwordSpecial: "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*).",
      submitFailed: "Email ou mot de passe invalide. Veuillez réessayer.",
      accountNotVerified: "Votre compte n'est pas encore vérifié. Veuillez attendre l'approbation de l'administrateur.",
      networkError: "Erreur réseau. Vérifiez votre connexion.",
    },
    success: {
      loginSuccess: "Connexion réussie ! Redirection...",
    },
    hint: "Min 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial",
  },
}

export type LoginPayload = {
  email: string
  password: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function LoginPage() {
  const router   = useRouter()
  const { lang } = useLang()
  const { setUserAndToken } = useAuth()
  const t        = translations[lang]

  const [visible, setVisible] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe]     = useState(true)
  const [email, setEmail]               = useState("")
  const [password, setPassword]         = useState("")
  const [isLoading, setIsLoading]       = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errors, setErrors]             = useState<{ email?: string; password?: string; general?: string }>({})

  useEffect(() => {
    setVisible(true)
  }, [])

  const validateEmail = (value: string) => {
    if (!value) return t.errors.emailRequired
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t.errors.emailInvalid
    return ""
  }

  const validatePassword = (value: string) => {
    if (!value) return t.errors.passwordRequired
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailError    = validateEmail(email)
    const passwordError = validatePassword(password)
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError })
      return
    }

    setErrors({})
    setIsLoading(true)
    setSuccessMessage("")

    const payload: LoginPayload = {
      email: email.trim(),
      password,
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {

        if (response.status === 401) {
          setErrors({ general: t.errors.submitFailed })
        } else {
          setErrors({ general: data.message || t.errors.submitFailed })
        }
        return
      }

      if (data.token) {
        if (rememberMe) {

          localStorage.setItem('authToken', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
        } else {

          sessionStorage.setItem('authToken', data.token)
          sessionStorage.setItem('user', JSON.stringify(data.user))
        }

        setUserAndToken(data.user, data.token)
      }

      setSuccessMessage(t.success.loginSuccess)

      setTimeout(() => {
        const isAdmin = data.user?.user_type === 'admin'
        router.push(isAdmin ? '/Admin-Dashboard' : '/Dashboard')
      }, 1000)

    } catch (err) {
      console.error(' Login error:', err)
      setErrors({ general: t.errors.networkError })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">

      {}
      <header className={`bg-white px-6 py-4 flex items-center justify-between gap-3 border-b border-gray-100 ${styles.header}`}>
        <button onClick={() => router.push('/')} className="flex items-center gap-3 cursor-pointer" style={{ background: 'none', border: 'none', padding: 0 }}>
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
      <main className={`bg-[#CDFF00] relative overflow-hidden flex flex-col ${styles.main}`} style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease"
      }}>

        <img
          src="/images/circles-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none hidden md:block"
          aria-hidden="true"
        />

        {}
        <div className={`relative z-10 w-full md:max-w-md md:rounded-3xl md:shadow-xl md:bg-white md:p-8 md:my-8 ${styles.card}`}>

          <button
            onClick={() => router.push('/')}
            className="mb-6 p-1 rounded-lg cursor-pointer"
            style={{ background: 'none', border: 'none' }}
          >
            <img src="/icons/chevron-left.png" alt="Back" className="w-6 h-6 object-contain" />
          </button>

          <h1 className={`text-3xl font-bold text-gray-900 text-center mb-8 ${styles.title}`}>
            {t.welcomeBack}
          </h1>

          <form className={`space-y-5 ${styles.form}`} onSubmit={handleSubmit} noValidate>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">{t.emailAddress}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <img src="/icons/mail.png" alt="" className="w-5 h-5 object-contain opacity-50" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
                    if (errors.general) setErrors(prev => ({ ...prev, general: '' }))
                    if (successMessage) setSuccessMessage('')
                  }}
                  placeholder="os_boudif@esi.dz"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-700 placeholder-[#A8A8C0] focus:outline-none ${errors.email ? styles.inputError : ''}`}
                  style={{ border: `1px solid ${errors.email ? '#fca5a5' : '#e5e7eb'}`, backgroundColor: '#f9f9f9', fontSize: '14px' }}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className={styles.errorText}>{errors.email}</p>}
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">{t.password}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <img src="/icons/lock.png" alt="" className="w-5 h-5 object-contain opacity-50" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
                    if (errors.general) setErrors(prev => ({ ...prev, general: '' }))
                    if (successMessage) setSuccessMessage('')
                  }}
                  placeholder={t.password}
                  className={`w-full pl-12 pr-12 py-3.5 rounded-xl text-gray-700 placeholder-[#A8A8C0] focus:outline-none ${errors.password ? styles.inputError : ''}`}
                  style={{ border: `1px solid ${errors.password ? '#fca5a5' : '#e5e7eb'}`, backgroundColor: '#f9f9f9', fontSize: '14px' }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                  disabled={isLoading}
                >
                  <img src={showPassword ? '/icons/eye-off.png' : '/icons/eye.png'} alt="toggle" className="w-5 h-5 object-contain opacity-50" />
                </button>
              </div>
              {errors.password && <p className={styles.errorText}>{errors.password}</p>}
            </div>

            {}
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-[#7C5CFC] font-medium underline">
                {t.forgotPassword}
              </Link>
            </div>

            {}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer ${rememberMe ? "bg-[#7C5CFC]" : "bg-white border-2 border-gray-300"}`}
                disabled={isLoading}
              >
                {rememberMe && <Check className="w-3 h-3 text-white" />}
              </button>
              <span className="text-gray-700">{t.rememberMe}</span>
            </div>

            {}
            {successMessage && (
              <div style={{ padding: '12px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px', color: '#155724', textAlign: 'center' }}>
                {successMessage}
              </div>
            )}

            {}
            {errors.general && <p className={styles.errorText} style={{ textAlign: 'center' }}>{errors.general}</p>}

            {}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 font-semibold rounded-xl transition-colors mt-4 cursor-pointer bg-[#BFFF00] text-[#111111] md:bg-[#7C5CFC] md:text-white md:hover:bg-[#6B4DE8] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? t.loggingIn : t.logIn}
            </button>

          </form>

          {}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">{t.orContinueWith}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {}
          <GoogleLoginButton
            disabled={isLoading}
            onStart={() => { setIsLoading(true); setErrors({}) }}
            onSuccess={(token, user) => {
              localStorage.setItem('authToken', token as string)
              localStorage.setItem('user', JSON.stringify(user))

              setUserAndToken(user as any, token as string)
              const isAdmin = (user as any)?.user_type === 'admin'
              setSuccessMessage(t.success.loginSuccess)
              setTimeout(() => router.push(isAdmin ? '/Admin-Dashboard' : '/Dashboard'), 1000)
              setIsLoading(false)
            }}
            onError={(msg) => { setErrors({ general: msg }); setIsLoading(false) }}
          />

          {}
          <p className="text-center mt-6 text-gray-600">
            {t.noAccount}{" "}
            <Link href="/create-account" className="text-[#7C5CFC] font-medium underline">
              {t.signUp}
            </Link>
          </p>

        </div>
      </main>

      {}
      <footer className={`bg-[#CDFF00] px-6 py-4 flex items-center gap-8 ${styles.footer}`}>
        <Link href="/privacy-policy" className={styles.footerLink}>{t.privacyPolicy}</Link>
        <Link href="/terms" className={styles.footerLink}>{t.termsConditions}</Link>
      </footer>

    </div>
  )
}