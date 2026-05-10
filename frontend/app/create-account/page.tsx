"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLang } from "@/contexts/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"
import { PlanSelectionModal } from "@/components/subscription/PlanSelectionModal"
import styles from "./page.module.css"

const translations = {
  en: {
    title: "Create Account",
    subtitle: "Connect",
    subtitleShipments: "Shipments",
    subtitleAnd: "&",
    subtitleTrucks: "Trucks",
    subtitleEnd: "intelligently with LIVRILI.",
    companyName: "Company Name",
    phoneNumber: "Phone Number",
    password: "Password",
    confirmPassword: "Confirm password",
    tradeRegister: "Trade Register",
    tin: "TIN (NIF)",
    email: "Email",
    moreDetails: "More Details",
    optional: "(optional)",
    send: "Send",
    sending: "Sending...",
    placeholders: {
      companyName: "Enter company name",
      phoneNumber: "Enter phone number",
      password: "Enter password",
      confirmPassword: "Confirm your password",
      tradeRegister: "Enter trade register number",
      tin: "Enter TIN (NIF)",
      email: "Enter your email address",
      moreDetails: "Any additional details...",
    },
    errors: {
      companyName: "Company name is required.",
      phoneNumber: "Phone number is required.",
      phoneInvalid: "Enter a valid phone number.",
      password: "Password is required.",
      passwordMin: "Password must be at least 8 characters.",
      passwordUppercase: "Password must contain at least one uppercase letter.",
      passwordNumber: "Password must contain at least one number.",
      passwordSpecial: "Password must contain at least one special character (!@#$%^&*).",
      confirmPassword: "Please confirm your password.",
      passwordsMatch: "Passwords do not match.",
      tradeRegister: "Trade register is required.",
      tin: "TIN (NIF) is required.",
      email: "Email is required.",
      emailInvalid: "Please enter a valid email address.",
      submitFailed: "Something went wrong. Please try again.",
      emailExists: "This email is already registered.",
      networkError: "Network error. Please check your connection.",
    },
    success: {
      accountCreated: "Account created successfully!",
    },
    hint: "Min 8 chars, 1 uppercase, 1 number, 1 special character",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
  },
  fr: {
    title: "Créer un compte",
    subtitle: "Connectez",
    subtitleShipments: "Expéditions",
    subtitleAnd: "&",
    subtitleTrucks: "Camions",
    subtitleEnd: "intelligemment avec LIVRILI.",
    companyName: "Nom de l'entreprise",
    phoneNumber: "Numéro de téléphone",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    tradeRegister: "Registre de commerce",
    tin: "NIF",
    email: "E-mail",
    moreDetails: "Détails supplémentaires",
    optional: "(optionnel)",
    send: "Envoyer",
    sending: "Envoi en cours...",
    placeholders: {
      companyName: "Entrez le nom de l'entreprise",
      phoneNumber: "Entrez le numéro de téléphone",
      password: "Entrez le mot de passe",
      confirmPassword: "Confirmez votre mot de passe",
      tradeRegister: "Entrez le numéro du registre de commerce",
      tin: "Entrez le NIF",
      email: "Entrez votre adresse e-mail",
      moreDetails: "Détails supplémentaires...",
    },
    errors: {
      companyName: "Le nom de l'entreprise est requis.",
      phoneNumber: "Le numéro de téléphone est requis.",
      phoneInvalid: "Entrez un numéro de téléphone valide.",
      password: "Le mot de passe est requis.",
      passwordMin: "Le mot de passe doit contenir au moins 8 caractères.",
      passwordUppercase: "Le mot de passe doit contenir au moins une majuscule.",
      passwordNumber: "Le mot de passe doit contenir au moins un chiffre.",
      passwordSpecial: "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*).",
      confirmPassword: "Veuillez confirmer votre mot de passe.",
      passwordsMatch: "Les mots de passe ne correspondent pas.",
      tradeRegister: "Le registre de commerce est requis.",
      tin: "Le NIF est requis.",
      email: "L'e-mail est requis.",
      emailInvalid: "Veuillez entrer une adresse e-mail valide.",
      submitFailed: "Une erreur est survenue. Veuillez réessayer.",
      emailExists: "Cet e-mail est déjà enregistré.",
      networkError: "Erreur réseau. Vérifiez votre connexion.",
    },
    success: {
      accountCreated: "Compte créé avec succès !",
    },
    hint: "Min 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial",
    privacyPolicy: "Politique de confidentialité",
    termsConditions: "Conditions générales",
  },
}

export type CreateAccountPayload = {
  email: string
  password: string
  business_name: string
  phone_number: string
  tin_nif: string
  trade_register: string
  more_details?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function CreateAccount() {
  const router = useRouter()
  const { lang } = useLang()
  const t = translations[lang]

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [isLoading, setIsLoading]       = useState(false)
  const [submitError, setSubmitError]   = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showModal, setShowModal]       = useState(false)

  const [form, setForm] = useState({
    companyName:     '',
    phoneNumber:     '',
    password:        '',
    confirmPassword: '',
    tradeRegister:   '',
    tin:             '',
    email:           '',
    moreDetails:     '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    if (submitError) setSubmitError('')
    if (successMessage) setSuccessMessage('')
  }

  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {}
    if (!form.companyName.trim()) newErrors.companyName = t.errors.companyName
    if (!form.phoneNumber.trim()) newErrors.phoneNumber = t.errors.phoneNumber
    else if (!/^[0-9+\s\-()]{7,15}$/.test(form.phoneNumber)) newErrors.phoneNumber = t.errors.phoneInvalid
    if (!form.password) newErrors.password = t.errors.password
    else if (form.password.length < 8) newErrors.password = t.errors.passwordMin
    else if (!/[A-Z]/.test(form.password)) newErrors.password = t.errors.passwordUppercase
    else if (!/[0-9]/.test(form.password)) newErrors.password = t.errors.passwordNumber
    else if (!/[!@#$%^&*]/.test(form.password)) newErrors.password = t.errors.passwordSpecial
    if (!form.confirmPassword) newErrors.confirmPassword = t.errors.confirmPassword
    else if (form.confirmPassword !== form.password) newErrors.confirmPassword = t.errors.passwordsMatch
    if (!form.tradeRegister.trim()) newErrors.tradeRegister = t.errors.tradeRegister
    if (!form.tin.trim()) newErrors.tin = t.errors.tin
    if (!form.email.trim()) newErrors.email = t.errors.email
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = t.errors.emailInvalid
    return newErrors
  }

  const handleSubmit = async () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsLoading(true)
    setSubmitError('')
    setSuccessMessage('')

    const payload: CreateAccountPayload = {
      email: form.email.trim(),
      password: form.password,
      business_name: form.companyName.trim(),
      phone_number: form.phoneNumber.trim(),
      tin_nif: form.tin.trim(),
      trade_register: form.tradeRegister.trim(),
      more_details: form.moreDetails.trim() || undefined,
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409 || (response.status === 400 && data.message?.includes('email'))) {
          setSubmitError(t.errors.emailExists)
        } else {
          setSubmitError(data.message || t.errors.submitFailed)
        }
        return
      }

      if (data.token) {
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      const code = data.verificationCode
      setSuccessMessage(
        code
          ? `Account created! Your verification code: ${code}`
          : t.success.accountCreated
      )

      setTimeout(() => {
        const params = new URLSearchParams({ email: form.email })
        if (code) params.set('code', code)
        router.push(`/verify-account?${params.toString()}`)
      }, 2000)

    } catch (err) {
      console.error('Signup error:', err)
      setSubmitError(t.errors.networkError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.page}>

      {}
      <PlanSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

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
            {t.subtitle}{' '}
            <span className={styles.subtitleLink}>{t.subtitleShipments}</span>
            {' '}&amp;{' '}
            <span className={styles.subtitleLink}>{t.subtitleTrucks}</span>
            {' '}{t.subtitleEnd}
          </p>

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium text-center">
              {successMessage}
            </div>
          )}

          <div className={styles.form}>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>{t.companyName}</label>
                <input type="text" className={`${styles.input} ${errors.companyName ? styles.inputError : ''}`} placeholder={t.placeholders.companyName} value={form.companyName} onChange={e => handleChange('companyName', e.target.value)} disabled={isLoading} />
                {errors.companyName && <p className={styles.errorText}>{errors.companyName}</p>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t.phoneNumber}</label>
                <input type="tel" className={`${styles.input} ${errors.phoneNumber ? styles.inputError : ''}`} placeholder={t.placeholders.phoneNumber} value={form.phoneNumber} onChange={e => handleChange('phoneNumber', e.target.value)} disabled={isLoading} />
                {errors.phoneNumber && <p className={styles.errorText}>{errors.phoneNumber}</p>}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>{t.password}</label>
                <div className={styles.passwordWrapper}>
                  <input type={showPassword ? 'text' : 'password'} className={`${styles.inputPassword} ${errors.password ? styles.inputError : ''}`} placeholder={t.placeholders.password} value={form.password} onChange={e => handleChange('password', e.target.value)} disabled={isLoading} />
                  <button type="button" className={styles.eyeButton} onClick={() => setShowPassword(p => !p)} disabled={isLoading}>
                    <img src={showPassword ? '/icons/eye-off.png' : '/icons/eye.png'} alt="toggle" className={styles.eyeIcon} />
                  </button>
                </div>
                {errors.password ? <p className={styles.errorText}>{errors.password}</p> : form.password.length > 0 && <p className={styles.hintText}>{t.hint}</p>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t.confirmPassword}</label>
                <div className={styles.passwordWrapper}>
                  <input type={showConfirm ? 'text' : 'password'} className={`${styles.inputPassword} ${errors.confirmPassword ? styles.inputError : ''}`} placeholder={t.placeholders.confirmPassword} value={form.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} disabled={isLoading} />
                  <button type="button" className={styles.eyeButton} onClick={() => setShowConfirm(p => !p)} disabled={isLoading}>
                    <img src={showConfirm ? '/icons/eye-off.png' : '/icons/eye.png'} alt="toggle" className={styles.eyeIcon} />
                  </button>
                </div>
                {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>{t.tradeRegister}</label>
                <input type="text" className={`${styles.input} ${errors.tradeRegister ? styles.inputError : ''}`} placeholder={t.placeholders.tradeRegister} value={form.tradeRegister} onChange={e => handleChange('tradeRegister', e.target.value)} disabled={isLoading} />
                {errors.tradeRegister && <p className={styles.errorText}>{errors.tradeRegister}</p>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t.tin}</label>
                <input type="text" className={`${styles.input} ${errors.tin ? styles.inputError : ''}`} placeholder={t.placeholders.tin} value={form.tin} onChange={e => handleChange('tin', e.target.value)} disabled={isLoading} />
                {errors.tin && <p className={styles.errorText}>{errors.tin}</p>}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>{t.email}</label>
              <input type="email" className={`${styles.input} ${errors.email ? styles.inputError : ''}`} placeholder={t.placeholders.email} value={form.email} onChange={e => handleChange('email', e.target.value)} disabled={isLoading} />
              {errors.email && <p className={styles.errorText}>{errors.email}</p>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>{t.moreDetails} <span className={styles.optional}>{t.optional}</span></label>
              <textarea rows={5} className={styles.textarea} placeholder={t.placeholders.moreDetails} value={form.moreDetails} onChange={e => handleChange('moreDetails', e.target.value)} disabled={isLoading} />
            </div>

            {submitError && <p className={styles.errorText}>{submitError}</p>}

            <div className={styles.buttonWrapper}>
              <button type="button" className={styles.sendButton} onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? t.sending : t.send}
              </button>
            </div>

          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <Link href="/privacy-policy" className={styles.footerLink}>{t.privacyPolicy}</Link>
        <Link href="/terms" className={styles.footerLink}>{t.termsConditions}</Link>
      </footer>

    </div>
  )
}
