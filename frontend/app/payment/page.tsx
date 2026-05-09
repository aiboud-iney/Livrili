"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLang } from "@/contexts/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"
import NotificationDropdown from "@/components/NotificationDropdown"
import ProfileDropdown from "@/components/ProfileDropdown"
import { PAYMENT_METHODS, WHAT_HAPPENS_NEXT } from "@/lib/mock/payment"
import { PLANS } from "@/lib/mock/plans"
import { PlanSelectionModal } from "@/components/subscription/PlanSelectionModal"

const translations = {
  en: {
    title: "Complete Your Subscription",
    subtitle: "Make your payment and upload your receipt to activate your account",
    planName: "PRO Monthly",
    changePlan: "Change Plan",
    perMonth: "/month",
    allPaymentMethods: "All Available Payment Methods",
    needAssistance: "NEED ASSISTANCE?",
    call: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    uploadReceipt: "Upload Your Receipt",
    paymentMethodUsed: "Payment Method Used",
    selectPaymentMethod: "Select Payment Method",
    receiptDocument: "Receipt Document",
    uploadReceiptLabel: "Upload Receipt",
    uploadReceiptSub: "or Tap to select a photo or PDF",
    note: "Note",
    notePlaceholder: "Any details we should know...",
    contactInfo: "Contact Information",
    fullName: "Full Name",
    fullNamePlaceholder: "Abdelrahman Brahimi",
    phoneNumber: "Phone Number",
    phonePlaceholder: "+213 550 123 456",
    emailAddress: "Email Address",
    emailPlaceholder: "abdel@livrili-logistics.com",
    submitButton: "Submit Payment for Verification",
    submitting: "Submitting...",
    whatHappensNext: "WHAT HAPPENS NEXT",
    copied: "Copied!",
    paymentOptions: ["Baridi Mob", "Algérie Poste (CCP)", "Bank Transfer", "Other"],
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    support: "Support",
    copyright: "© 2026 LIVRILI LOGISTICS SOLUTIONS. DZ",
    goBack: "Go Back",
    features: [
      "Unlimited active listings",
      "Live GPS tracking",
      "Analytics dashboard",
      "Full access to premium features",
    ],
    errors: {
      missingFile: "Please upload your payment receipt.",
      missingMethod: "Please select a payment method.",
    }
  },
  fr: {
    title: "Complétez votre abonnement",
    subtitle: "Effectuez votre paiement et uploadez votre reçu pour activer votre compte",
    planName: "PRO Mensuel",
    changePlan: "Changer de plan",
    perMonth: "/mois",
    allPaymentMethods: "Tous les moyens de paiement",
    needAssistance: "BESOIN D'AIDE ?",
    call: "Appeler",
    whatsapp: "WhatsApp",
    email: "Email",
    uploadReceipt: "Uploader votre reçu",
    paymentMethodUsed: "Moyen de paiement utilisé",
    selectPaymentMethod: "Sélectionner le moyen de paiement",
    receiptDocument: "Document de reçu",
    uploadReceiptLabel: "Uploader le reçu",
    uploadReceiptSub: "ou appuyez pour sélectionner une photo ou un PDF",
    note: "Note",
    notePlaceholder: "Tout détail que nous devrions savoir...",
    contactInfo: "Informations de contact",
    fullName: "Nom complet",
    fullNamePlaceholder: "Abdelrahman Brahimi",
    phoneNumber: "Numéro de téléphone",
    phonePlaceholder: "+213 550 123 456",
    emailAddress: "Adresse e-mail",
    emailPlaceholder: "abdel@livrili-logistics.com",
    submitButton: "Soumettre le paiement pour vérification",
    submitting: "Envoi en cours...",
    whatHappensNext: "CE QUI SE PASSE ENSUITE",
    copied: "Copié !",
    paymentOptions: ["Baridi Mob", "Algérie Poste (CCP)", "Virement bancaire", "Autre"],
    privacy: "Politique de confidentialité",
    terms: "Conditions d'utilisation",
    support: "Support",
    copyright: "© 2026 LIVRILI SOLUTIONS LOGISTIQUES. DZ",
    goBack: "Retour",
    features: [
      "Annonces illimitées",
      "Suivi GPS en temps réel",
      "Tableau de bord analytique",
      "Accès complet aux fonctionnalités",
    ],
    errors: {
      missingFile: "Veuillez uploader votre reçu de paiement.",
      missingMethod: "Veuillez sélectionner un moyen de paiement.",
    }
  },
}

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#7C3AED" fillOpacity="0.15" />
    <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="#9CA3AF" strokeWidth="1.3" />
    <path d="M3 11V3h8" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 18V10M14 10l-4 4M14 10l4 4" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 20a4 4 0 01-.5-7.96A7 7 0 0119.5 11H20a4 4 0 010 8H6z" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const BankSVG = () => (
  <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M3 8h14M5 8V15M10 8V15M15 8V15M3 15h14M10 4l7 4H3l7-4z" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
)

const PosteSVG = () => (
  <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke="#7C3AED" strokeWidth="1.5" />
      <path d="M2 7l8 5 8-5" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </div>
)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang } = useLang()
  const t = translations[lang as "en" | "fr"]

  const billingCycle = searchParams.get("billingCycle") || "monthly"
  const amount = searchParams.get("amount") || "60000"
  const formattedAmount = new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 }).format(Number(amount))

  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile]             = useState(false)
  const [visible, setVisible]                     = useState(false)
  const [copiedId, setCopiedId]                   = useState<string | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [uploadedFile, setUploadedFile]           = useState<File | null>(null)
  const [note, setNote]                           = useState("")
  const [fullName, setFullName]                   = useState("")
  const [phone, setPhone]                         = useState("")
  const [email, setEmail]                         = useState("")
  const [isSubmitting, setIsSubmitting]           = useState(false)
  const [submitError, setSubmitError]             = useState("")
  const [isDragOver, setIsDragOver]               = useState(false)
  const [showModal, setShowModal]                 = useState(false)

  const notifRef     = useRef<HTMLDivElement>(null)
  const profileRef   = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setVisible(true)
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setShowProfile(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCopy = (value: string, id: string) => {
    navigator.clipboard.writeText(value)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleSubmit = async () => {
    setSubmitError("");

    if (!selectedPaymentMethod) {
      setSubmitError(t.errors.missingMethod);
      return;
    }
    if (!uploadedFile) {
      setSubmitError(t.errors.missingFile);
      return;
    }

    setIsSubmitting(true);

    try {

      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user?.id) throw new Error("You must be logged in to submit a payment");

      let planId = "2";
      try {
        const premium = PLANS.find((p) => p.id === "premium");
        if (premium) planId = "2";
      } catch {}

      const formData = new FormData();
      formData.append("user_id", String(user.id));
      formData.append("plan_id", planId);
      formData.append("payment_method", selectedPaymentMethod);
      formData.append("billing_cycle", billingCycle);
      formData.append("amount", amount);
      formData.append("receipt", uploadedFile);

      const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/payments/submit`, {
        method: 'POST',
        headers: {
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit payment");
      }

      const params = new URLSearchParams({
        ref:     data.ref || "",
        method:  selectedPaymentMethod,
        amount:  amount,
        receipt: data.filename || uploadedFile.name,
      });
      router.push(`/paymentconfirmation?${params.toString()}`);

    } catch (err: any) {
      console.error("Submission error:", err);
      setSubmitError(err.message || "An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const getMethodIcon = (icon: string) => {
    if (icon === "baridi") return (
      <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <img src="/icons/BaridiMob.png" alt="Baridi Mob" style={{ width: "18px", height: "18px", objectFit: "contain" }} />
      </div>
    )
    if (icon === "bank") return <BankSVG />
    return <PosteSVG />
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: "12px",
    border: "1.5px solid #DDD6FE", backgroundColor: "#F5F3FF",
    fontSize: "14px", color: "#111111", outline: "none",
    boxSizing: "border-box",
  }

  const labelStyle: React.CSSProperties = {
    fontSize: "13px", fontWeight: 600, color: "#111111",
    display: "block", marginBottom: "8px",
  }

  return (
    <div
      className="min-h-screen bg-[#f5f5f5] flex flex-col font-sans"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >

      {}
      <PlanSelectionModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            title="Go to home"
            onClick={() => router.push("/")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", padding: 0 }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#7C3AED" }}>
              <img src="/icons/logo.png" alt="Livrili" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
            </div>
            <span className="text-xl font-bold text-black">Livrili</span>
          </button>

          <div className="flex items-center gap-3">
            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                title="Notifications"
                onClick={() => { setShowNotifications(p => !p); setShowProfile(false) }}
                style={{ padding: "8px", background: "none", border: "none", cursor: "pointer", borderRadius: "50%" }}
              >
                <img src="/icons/bell.png" alt="Notifications" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
              </button>
              <NotificationDropdown show={showNotifications} lang={lang} />
            </div>
            <div ref={profileRef} style={{ position: "relative" }}>
              <button
                title="Profile"
                onClick={() => { setShowProfile(p => !p); setShowNotifications(false) }}
                style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "#F5A962", border: "none", cursor: "pointer" }}
              />
              <ProfileDropdown show={showProfile} />
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {}
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">

          {}
          <button
            title="Go Back"
            className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: "none", border: "none" }}
            onClick={() => router.back()}
          >
            <img src="/icons/go back.png" alt="Back" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
            <span className="text-sm font-bold text-slate-400">{t.goBack}</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-500 mb-8 text-sm">{t.subtitle}</p>

          <div className="space-y-5">

            {}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1.5px solid #E5E7EB", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">{t.planName}</p>
                  <p style={{ fontSize: "28px", fontWeight: 800, color: "#7C3AED", letterSpacing: "-0.5px" }}>
                    {billingCycle === "yearly" ? (
                      <span>50,000 DZD/month × 12 = {formattedAmount} DZD</span>
                    ) : (
                      <span>{formattedAmount} DZD <span className="text-sm font-normal text-gray-400">{t.perMonth}</span></span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-sm font-semibold text-gray-900 hover:border-purple-500 hover:text-purple-600 transition-colors"
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1.5px solid #E5E7EB", background: "#ffffff", cursor: "pointer" }}
                >
                  {t.changePlan}
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {t.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckIcon />{f}
                  </div>
                ))}
              </div>
            </div>

            {}
            <div style={{ backgroundColor: "#F0EBFF", borderRadius: "16px", border: "1.5px solid #DDD6FE", padding: "24px" }}>
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="1" y="4" width="16" height="11" rx="2" stroke="#7C3AED" strokeWidth="1.5" />
                  <path d="M1 8h16" stroke="#7C3AED" strokeWidth="1.5" />
                </svg>
                {t.allPaymentMethods}
              </h3>

              <div className="flex flex-col gap-3 mb-5">
                {PAYMENT_METHODS.map((method) => (
                  <div key={method.id} style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "14px 16px" }} className="flex items-center gap-3">
                    {getMethodIcon(method.icon)}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-0.5">{method.name[lang as "en" | "fr"]}</p>
                      <p className="text-sm font-medium" style={{ color: "#7C3AED" }}>
                        {method.details[lang as "en" | "fr"]}
                        {method.subDetails && <span className="text-gray-400 font-normal ml-2">{method.subDetails[lang as "en" | "fr"]}</span>}
                      </p>
                    </div>
                    <button onClick={() => handleCopy(method.copyValue, method.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                      {copiedId === method.id
                        ? <span className="text-xs font-semibold" style={{ color: "#7C3AED" }}>{t.copied}</span>
                        : <CopyIcon />}
                    </button>
                  </div>
                ))}
              </div>

              {}
              <p className="text-xs font-bold text-gray-400 tracking-widest mb-3">{t.needAssistance}</p>
              <div className="flex gap-2">
                {[
                  { label: t.call,     bg: "#ffffff",  color: "#111111", icon: "/icons/phoneblack.png",  dark: false },
                  { label: t.whatsapp, bg: "#25D366",  color: "#ffffff", icon: "/icons/sms.png",         dark: true  },
                  { label: t.email,    bg: "#ffffff",  color: "#111111", icon: "/icons/email.png",       dark: false },
                ].map(btn => (
                  <button
                    key={btn.label}
                    className="flex items-center gap-2 text-sm font-semibold cursor-pointer transition-opacity hover:opacity-80"
                    style={{ padding: "8px 14px", borderRadius: "8px", border: "1.5px solid #E5E7EB", backgroundColor: btn.bg, color: btn.color }}
                  >
                    <img
                      src={btn.icon}
                      alt={btn.label}
                      style={{
                        width: "15px", height: "15px", objectFit: "contain",
                        filter: btn.dark ? "brightness(0) invert(1)" : "none",
                      }}
                    />
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-5">{t.uploadReceipt}</h2>

              <div className="mb-4">
                <label style={labelStyle}>{t.paymentMethodUsed}</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={selectedPaymentMethod}
                    onChange={e => {
                      setSelectedPaymentMethod(e.target.value);
                      setSubmitError("");
                    }}
                    title={t.selectPaymentMethod} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  >
                    <option value="" disabled>{t.selectPaymentMethod}</option>
                    {t.paymentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <path d="M4 6l4 4 4-4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div className="mb-4">
                <label style={labelStyle}>{t.receiptDocument}</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={e => { e.preventDefault(); setIsDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) { setUploadedFile(f); setSubmitError(""); } }}
                  style={{ border: `2px dashed ${isDragOver ? "#7C3AED" : "#C4B5FD"}`, borderRadius: "12px", backgroundColor: isDragOver ? "#F5F3FF" : "#FAF8FF", padding: "36px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
                >
                  <div className="flex justify-center mb-3"><UploadIcon /></div>
                  {uploadedFile ? (
                    <p className="text-sm font-semibold" style={{ color: "#7C3AED" }}>{uploadedFile.name}</p>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-gray-900 mb-1">{t.uploadReceiptLabel}</p>
                      <p className="text-xs" style={{ color: "#7C3AED" }}>{t.uploadReceiptSub}</p>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-5">{t.contactInfo}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="mb-4">
                <div>
                  <label style={labelStyle}>{t.fullName}</label>
                  <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder={t.fullNamePlaceholder} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{t.phoneNumber}</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder={t.phonePlaceholder} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>{t.emailAddress}</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder={t.emailPlaceholder} type="email" style={inputStyle} />
              </div>
            </div>

          </div>

          {}
          {submitError && (
            <p className="text-red-500 text-sm font-semibold mt-6 mb-2 text-center">
              {submitError}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full mt-2 mb-10 font-bold text-white transition-colors`}
            style={{ padding: "16px", borderRadius: "14px", border: "none", cursor: isSubmitting ? "not-allowed" : "pointer", fontSize: "15px", backgroundColor: "#7C3AED", opacity: isSubmitting ? 0.7 : 1 }}
            onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = "#6D28D9" }}
            onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = "#7C3AED" }}
          >
            {isSubmitting ? t.submitting : t.submitButton}
          </button>

          {}
          <div className="mb-12" style={{ backgroundColor: "#F0EBFF", borderRadius: "16px", padding: "28px 24px" }}>
            <p className="text-xs font-bold tracking-widest mb-6" style={{ color: "#7C3AED" }}>{t.whatHappensNext}</p>
            <div className="flex flex-col">
              {WHAT_HAPPENS_NEXT.map((step, i) => {
                const s = step[lang as "en" | "fr"]
                const isLast = i === WHAT_HAPPENS_NEXT.length - 1
                return (
                  <div key={i} className="flex gap-4 items-start">
                    {}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className="flex items-center justify-center text-xs font-bold"
                        style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: i === 0 ? "#7C3AED" : "#ffffff", color: i === 0 ? "#ffffff" : "#9CA3AF", border: i === 0 ? "none" : "1.5px solid #DDD6FE", flexShrink: 0 }}
                      >
                        {i + 1}
                      </div>
                      {!isLast && (
                        <div style={{ width: "1.5px", flex: 1, minHeight: "32px", backgroundColor: "#DDD6FE", margin: "4px 0" }} />
                      )}
                    </div>
                    {}
                    <div style={{ paddingBottom: isLast ? "0" : "24px" }}>
                      <p className="text-sm font-semibold mb-1" style={{ color: i === 0 ? "#111111" : "#6B7280" }}>{s.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>{s.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </main>

      {}
      <footer className="bg-[#202020] py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">{t.copyright}</p>
          <div className="flex items-center gap-6">
            {[
              { label: t.privacy, href: "/privacy-policy" },
              { label: t.terms,   href: "/terms" },
              { label: t.support, href: "/support" },
            ].map(link => (
              <a key={link.href} href={link.href}
                className="text-xs text-gray-500 no-underline hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}