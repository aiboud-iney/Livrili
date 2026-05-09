import { useState, useRef, useEffect } from "react"
import { ALGERIAN_WILAYAS } from "../types"
import type { Translations } from "../translations"

type Props = {
  t: Translations
  selectedCities: string[]
  onChange: (cities: string[]) => void
  error?: string
}

export function TransitCitiesSelect({ t, selectedCities, onChange, error }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const normalize = (str: string) =>
    str.normalize('NFD')
       .replace(/[\u0300-\u036f]/g, '')
       .replace(/'/g, '')
       .toLowerCase()
       .trim()

  const filtered = ALGERIAN_WILAYAS.filter(w =>
    normalize(w).includes(normalize(search))
  )

  const handleSelect = (wilaya: string) => {
    if (!selectedCities.includes(wilaya)) {
      onChange([...selectedCities, wilaya])
    }
    setSearch("")
  }

  const handleRemove = (wilaya: string) => {
    onChange(selectedCities.filter(c => c !== wilaya))
  }

  return (
    <div>
      <label className="block text-sm font-bold text-gray-900 mb-2">
        {t.transitCities}
      </label>

      <div ref={ref} style={{ position: "relative" }}>
        {}
        <button
          type="button"
          onClick={() => setOpen(p => !p)}
          className="w-full px-4 py-3 rounded-lg text-left flex items-center justify-between"
          style={{
            backgroundColor: "#EDFFD0",
            border: error ? "1.5px solid #fca5a5" : "none"
          }}
        >
          <span style={{ color: selectedCities.length > 0 ? "#111" : "#9ca3af" }}>
            {selectedCities.length > 0
              ? `${selectedCities.length} city(ies) selected`
              : t.selectTransitCity}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {selectedCities.length > 0 && (
              <span className="bg-[#B8FF00] text-xs px-2 py-0.5 rounded-full">
                {selectedCities.length}
              </span>
            )}
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }}
            >
              <path d="M4 6l4 4 4-4" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>

        {}
        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              zIndex: 200,
              backgroundColor: "#fff",
              border: "1.5px solid #B8FF00",
              borderRadius: "10px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
              overflow: "hidden",
              maxHeight: "250px",
            }}
          >
            {}
            <div style={{ padding: "8px", borderBottom: "1px solid #e5e7eb" }}>
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.searchCity}
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "13px",
                  outline: "none",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#7C3AED"}
                onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
              />
            </div>

            {}
            <div style={{ maxHeight: "180px", overflowY: "auto" }}>
              {filtered.map(wilaya => {
                const isSelected = selectedCities.includes(wilaya)
                return (
                  <label
                    key={wilaya}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                      padding: "9px 14px",
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#f4f0ff" : "transparent",
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "#f9fafb"
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        if (isSelected) {
                          handleRemove(wilaya)
                        } else {
                          handleSelect(wilaya)
                        }
                      }}
                      style={{ width: "16px", height: "16px", accentColor: "#7C3AED" }}
                    />
                    <span style={{
                      fontSize: "13px",
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? "#7C3AED" : "#111",
                    }}>
                      {wilaya}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {}
      {selectedCities.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
          {selectedCities.map(city => (
            <span
              key={city}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                backgroundColor: "#EDFFD0",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 500,
                color: "#111",
              }}
            >
              {city}
              <button
                type="button"
                onClick={() => handleRemove(city)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "16px",
                  height: "16px",
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {}
      <p className="text-xs text-gray-400 mt-2">{t.transitHint}</p>

      {}
      {error && (
        <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>{error}</p>
      )}
    </div>
  )
}