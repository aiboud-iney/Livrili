"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import NotificationDropdown from "@/components/NotificationDropdown"
import ProfileDropdown from "@/components/ProfileDropdown"
import { useLang } from "@/contexts/LanguageContext"
import { LanguageSwitcher } from "@/components/language-switcher"
import { TRUCK_TYPES } from "@/app/constants/truck-types"

import { translations } from "./translations"
import type { AddTruckPayload } from "./types"

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export default function AddTruckPage() {
  const langContext = useLang()
  const lang = (langContext?.lang ?? "en") as "en" | "fr"
  const t = translations[lang]
  const router = useRouter()

  const [truckType, setTruckType] = useState("")
  const [licensePlate, setLicensePlate] = useState("")
  const [maxTonnage, setMaxTonnage] = useState("")
  const [maxVolume, setMaxVolume] = useState("")

  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])

  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [notificationCount, setNotificationCount] = useState(0)

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setVisible(true)
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)

    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setShowProfile(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleAddPhotos = (files: File[]) => {
    setPhotoFiles((prev) => [...prev, ...files])
    setPhotoPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))])
  }

  const handleRemovePhoto = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index))
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files)
    handleAddPhotos(files as File[])
  }

  const validate = (): boolean => {
    const errors: Record<string, string> = {}
    if (!truckType.trim()) errors.truckType = t.errors.truckType
    if (!licensePlate.trim()) errors.licensePlate = t.errors.licensePlate
    if (!maxTonnage || Number(maxTonnage) <= 0) errors.maxTonnage = t.errors.maxTonnage
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setIsLoading(true)
    setSubmitError("")

    const formData = new FormData()
    formData.append("name", "My Truck")
    formData.append("truck_type", truckType.trim())
    formData.append("license_plate", licensePlate.trim())
    formData.append("max_tonnage", maxTonnage || "5")
    formData.append("max_volume", maxVolume || "50")
    photoFiles.forEach((file) => {
      formData.append("truck_pictures", file)
    })

    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch(`${apiUrl}/trucks`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })

      if (res.ok) {
        window.location.href = "/dashboard"
      } else {
        const errorData = await res.json().catch(() => ({}))
        setSubmitError(
          errorData.message || t.errors.submitFailed
        )
      }
    } catch (error) {
      setSubmitError(t.errors.submitFailed)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  if (!visible) return null

  return (
    <div
      className="min-h-screen bg-[#f5f5f5] flex flex-col"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}
    >
      {}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button title="Go to home" onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", padding: 0 }}>
            <div className="w-9 h-9 bg-[#7C3AED] rounded-lg flex items-center justify-center">
              <img src="/icons/logo.png" alt="Livrili" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
            </div>
            <span className="text-xl font-semibold text-black">Livrili</span>
          </button>

          <div className="flex items-center gap-3">
            <div ref={notifRef} style={{ position: "relative" }}>
              <button title="Notifications" onClick={() => { setShowNotifications(p => !p); setShowProfile(false) }} style={{ position: "relative", padding: "8px", background: "none", border: "none", cursor: "pointer", borderRadius: "50%" }}>
                <img src="/icons/bell.png" alt="Notifications" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                {notificationCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#EF4444",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "700",
                    border: "2px solid white"
                  }}>
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </span>
                )}
              </button>
              <NotificationDropdown show={showNotifications} lang={lang} notificationCount={notificationCount} />
            </div>
            <div ref={profileRef} style={{ position: "relative" }}>
              <button title="Profile" onClick={() => { setShowProfile(p => !p); setShowNotifications(false) }} style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "#F5A962", border: "none", cursor: "pointer" }} />
              <ProfileDropdown show={showProfile} />
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {}
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">

          <button title="Go Back" className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity" style={{ background: "none", border: "none" }} onClick={handleGoBack}>
            <img src="/icons/go back.png" alt="Back" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#94A3B8" }}>{t.goBack}</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-500 mb-8">{t.subtitle}</p>

          <div className="space-y-6">

          {}
          <div
            className="bg-white rounded-xl p-6 shadow-sm"
            style={{
              position: "relative",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: "#B8FF00", color: "#111" }}>1</div>
              <h2 className="text-xl font-semibold text-gray-900">{t.truckDetails}</h2>
            </div>

            <div className="space-y-4">
              {}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  {t.truckType}
                </label>
                <select
                  title="select truck type"
                  value={truckType}
                  onChange={(e) => setTruckType(e.target.value)}
                  className={`w-full px-4 py-3 rounded-full focus:outline-none transition ${
                    formErrors.truckType
                      ? "border-1.5 border-red-500 bg-white"
                      : "bg-[#EDFFD0]"
                  }`}
                  style={{
                    border: formErrors.truckType ? "1.5px solid #fca5a5" : "none",
                  }}
                >
                  <option value="">{t.truckTypePlaceholder}</option>
                  {TRUCK_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {lang === "fr" ? type.labelFr : type.labelEn}
                    </option>
                  ))}
                </select>
                {formErrors.truckType && (
                  <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>
                    {formErrors.truckType}
                  </p>
                )}
              </div>

              {}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  {t.licensePlate}
                </label>
                <input
                  type="text"
                  placeholder={t.licensePlateHint}
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className={`w-full px-4 py-3 rounded-full focus:outline-none transition ${
                    formErrors.licensePlate
                      ? "border-1.5 border-red-500 bg-white"
                      : "bg-[#EDFFD0]"
                  }`}
                  style={{
                    border: formErrors.licensePlate ? "1.5px solid #fca5a5" : "none",
                  }}
                />
                {formErrors.licensePlate && (
                  <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>
                    {formErrors.licensePlate}
                  </p>
                )}
              </div>

              {}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    {t.maxTonnage}
                  </label>
                  <input
                    type="number"
                    placeholder="20"
                    value={maxTonnage}
                    onChange={(e) => setMaxTonnage(e.target.value)}
                    className={`w-full px-4 py-3 rounded-full focus:outline-none transition ${
                      formErrors.maxTonnage
                        ? "border-1.5 border-red-500 bg-white"
                        : "bg-[#EDFFD0]"
                    }`}
                    style={{
                      border: formErrors.maxTonnage ? "1.5px solid #fca5a5" : "none",
                    }}
                  />
                  {formErrors.maxTonnage && (
                    <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>
                      {formErrors.maxTonnage}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    {t.maxVolume}
                  </label>
                  <input
                    type="number"
                    placeholder="50"
                    value={maxVolume}
                    onChange={(e) => setMaxVolume(e.target.value)}
                    className="w-full px-4 py-3 rounded-full focus:outline-none transition bg-[#EDFFD0]"
                  />
                </div>
              </div>
            </div>
          </div>

          {}
          <div
            className="bg-white rounded-xl p-6 shadow-sm mt-6"
            style={{
              position: "relative",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: "#B8FF00", color: "#111" }}>2</div>
              <h2 className="text-xl font-semibold text-gray-900">{t.truckPhotos}</h2>
            </div>

            {}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#B8FF00] rounded-lg p-8 text-center cursor-pointer hover:bg-[#f0ffd0] transition"
            >
              <svg
                className="w-12 h-12 mx-auto mb-2 text-[#B8FF00]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="text-gray-900 font-medium">{t.dragDrop}</p>
              <p className="text-gray-500 text-sm">{t.fileTypes}</p>
              <p className="text-[#B8FF00] text-sm font-medium mt-2">{t.browseFiles}</p>
              <input
                title="file"
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png,image/jpeg,application/pdf"
                onChange={(e) => handleAddPhotos(Array.from(e.target.files || []))}
                className="hidden"
              />
            </div>

            {}
            {photoPreviews.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition"
                      aria-label="Remove photo"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6 mb-6">
              <p className="text-red-700">{submitError}</p>
            </div>
          )}

          {}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full mt-6 bg-[#B8FF00] text-gray-900 py-3 rounded-full font-bold hover:bg-[#a8ee00] transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isLoading ? t.adding : t.addTruck}
          </button>

          {}
          <p className="text-xs text-gray-500 text-center mb-6">
            {t.addNote} <br />
            <a href="/terms" className="text-[#B8FF00] hover:underline cursor-pointer">
              {t.termsConditions}
            </a>
            , <a href="/privacy-policy" className="text-[#B8FF00] hover:underline cursor-pointer">
              {t.privacyPolicy}
            </a>
            , <a href="/support" className="text-[#B8FF00] hover:underline cursor-pointer">
              {t.support}
            </a>

          </p>
          </div>
        </div>
      </main>

      {}
      <footer className="bg-[#202020] py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p style={{ fontSize: "11px", color: "#9CA3AF" }}>© 2026 LIVRILI LOGISTICS SOLUTIONS. DZ</p>
          <div className="flex items-center gap-6">
            <a href="/privacy-policy" style={{ fontSize: "11px", color: "#9CA3AF", textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")} onMouseLeave={e => (e.currentTarget.style.color = "#9CA3AF")}>{t.privacyPolicy}</a>
            <a href="/terms"          style={{ fontSize: "11px", color: "#9CA3AF", textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")} onMouseLeave={e => (e.currentTarget.style.color = "#9CA3AF")}>{t.termsConditions}</a>
            <a href="/support"        style={{ fontSize: "11px", color: "#9CA3AF", textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")} onMouseLeave={e => (e.currentTarget.style.color = "#9CA3AF")}>{t.support}</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
