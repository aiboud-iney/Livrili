import { useState } from "react"
import { FlagImage } from "./FlagImage"
import type { Country } from "../types"
import type { Translations } from "../translations"

type Props = {
  t:               Translations
  visible:         boolean
  countries:       Country[]
  selectedCountry: Country
  phoneNumber:     string
  formErrors:      Record<string, string>
  onCountryChange: (c: Country) => void
  onPhoneChange:   (v: string) => void
}

export function ContactPhoneSection({
  t, visible,
  countries, selectedCountry, phoneNumber, formErrors,
  onCountryChange, onPhoneChange,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false)
  const isAlgeria = selectedCountry.code === "+213"

  return (
    <div
      className="bg-white rounded-xl p-6 shadow-sm"
      style={{
        position: "relative",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
        zIndex: showDropdown ? 50 : "auto",
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: "#B8FF00", color: "#111" }}>2</div>
        <h2 className="text-xl font-semibold text-gray-900">{t.contactPhone}</h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">{t.contactPhoneDesc}</p>

      <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-900 mb-2">{t.contactPhone}</label>
      <div style={{ position: "relative" }}>
        <div className="flex">
          <button
            title="Select country"
            onClick={() => setShowDropdown(p => !p)}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px", backgroundColor: "#EDFFD0", borderRadius: "8px 0 0 8px", borderRight: "1px solid #bbf7d0", border: "none", cursor: "pointer" } as React.CSSProperties}
          >
            <FlagImage country={selectedCountry} />
            <img src="/icons/icon down green 1.png" alt="open" style={{ width: "12px", height: "12px", objectFit: "contain" }} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, padding: "12px 16px", backgroundColor: "#EDFFD0", borderRadius: "0 8px 8px 0", border: formErrors.phone ? "1.5px solid #fca5a5" : "none" }}>
            <span style={{ color: "#374151", fontWeight: 600, fontSize: "14px" }}>{selectedCountry.code}</span>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              title="Phone Number"
              value={phoneNumber}
              onChange={e => onPhoneChange(e.target.value)}
              placeholder="55856320"
              aria-label={t.contactPhone}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "#374151" }}
            />
          </div>
        </div>

        {formErrors.phone && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>{formErrors.phone}</p>}

        {showDropdown && (
          <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, width: "280px", backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 9999, maxHeight: "240px", overflowY: "auto" }}>
            {countries.map(country => (
              <button
                key={country.code}
                title={country.name}
                onClick={() => { onCountryChange(country); setShowDropdown(false) }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", background: selectedCountry.code === country.code ? "#EDFFD0" : "transparent", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.15s" }}
                onMouseEnter={e => { if (selectedCountry.code !== country.code) e.currentTarget.style.backgroundColor = "#f9fafb" }}
                onMouseLeave={e => { if (selectedCountry.code !== country.code) e.currentTarget.style.backgroundColor = "transparent" }}
              >
                <FlagImage country={country} />
                <span style={{ fontSize: "14px", color: "#111", fontWeight: selectedCountry.code === country.code ? 700 : 400 }}>{country.name}</span>
                <span style={{ fontSize: "13px", color: "#9ca3af", marginLeft: "auto" }}>{country.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {!isAlgeria && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px" }}>{t.algeriaOnly}</p>}
    </div>
  )
}
