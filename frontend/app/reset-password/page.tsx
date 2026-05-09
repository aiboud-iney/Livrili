"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useLang } from "@/contexts/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

const translations = {
  en: {
    title: "Reset Password",
    subtitle: "Enter your new password below",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    reset: "Reset Password",
    resetting: "Resetting...",
    backToLogin: "Back to Login",
    success: "Password reset successfully! Redirecting to login...",
    errors: {
      noToken: "Invalid or missing reset token. Please request a new reset link.",
      mismatch: "Passwords do not match.",
      minLength: "Password must be at least 8 characters.",
      failed: "Failed to reset password. The link may have expired.",
      network: "Network error. Please check your connection.",
    },
  },
  fr: {
    title: "Réinitialiser le mot de passe",
    subtitle: "Entrez votre nouveau mot de passe ci-dessous",
    newPassword: "Nouveau mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    reset: "Réinitialiser",
    resetting: "Réinitialisation...",
    backToLogin: "Retour à la connexion",
    success: "Mot de passe réinitialisé ! Redirection...",
    errors: {
      noToken: "Lien invalide ou expiré. Veuillez demander un nouveau lien.",
      mismatch: "Les mots de passe ne correspondent pas.",
      minLength: "Le mot de passe doit contenir au moins 8 caractères.",
      failed: "Échec de la réinitialisation. Le lien a peut-être expiré.",
      network: "Erreur réseau. Vérifiez votre connexion.",
    },
  },
}

export default function ResetPasswordPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const { lang }     = useLang()
  const t            = translations[lang as "en" | "fr"]

  const token = searchParams.get("token") || ""

  const [newPassword, setNewPassword]       = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading]           = useState(false)
  const [error, setError]                   = useState("")
  const [success, setSuccess]               = useState(false)
  const [visible, setVisible]               = useState(false)

  useEffect(() => {
    setVisible(true)
    if (!token) setError(t.errors.noToken)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPassword.length < 8) {
      setError(t.errors.minLength)
      return
    }
    if (newPassword !== confirmPassword) {
      setError(t.errors.mismatch)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || t.errors.failed)
        return
      }

      setSuccess(true)
      setTimeout(() => router.push("/login"), 2000)
    } catch {
      setError(t.errors.network)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => router.push("/")} className="flex items-center gap-3 cursor-pointer" style={{ background: "none", border: "none", padding: 0 }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7C3AED]">
            <img src="/icons/logo.png" alt="Livrili" className="h-5 w-5 object-contain" />
          </div>
          <span className="font-bold text-xl text-black">Livrili</span>
        </button>
        <LanguageSwitcher />
      </header>

      <main className="flex-1 bg-[#CDFF00] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">{t.title}</h1>
          <p className="text-sm text-gray-500 text-center mb-8">{t.subtitle}</p>

          {success ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-center text-sm">
              {t.success}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">{t.newPassword}</label>
                <input
                  title="Must be at least 8 characters"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl text-gray-700 focus:outline-none"
                  style={{ border: "1px solid #e5e7eb", backgroundColor: "#f9f9f9" }}
                  disabled={isLoading || !token}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">{t.confirmPassword}</label>
                <input
                title="must"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl text-gray-700 focus:outline-none"
                  style={{ border: "1px solid #e5e7eb", backgroundColor: "#f9f9f9" }}
                  disabled={isLoading || !token}
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading || !token}
                className="w-full py-4 font-semibold rounded-xl bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? t.resetting : t.reset}
              </button>

              <p className="text-center text-sm text-gray-500">
                <Link href="/login" className="text-[#7C5CFC] font-medium underline">
                  {t.backToLogin}
                </Link>
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
