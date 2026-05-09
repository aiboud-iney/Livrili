import { useState, useRef, useEffect } from "react"
import { CalendarMonth } from "./CalendarMonth"
import { WeightInput } from "./WeightInput"
import { ALGERIAN_WILAYAS, formatDate } from "../types"
import type { Lang } from "../translations"
import WilayaInput from "@/components/WilayaInput"

type Props = {
  t: any
  lang: Lang
  visible: boolean
  isMobile: boolean
  originWilaya: string
  destinationWilaya: string
  transitCities: string
  tripType: "aller" | "aller-retour"
  startDate: Date | null
  endDate: Date | null
  capacity: string
  volume: string
  formErrors: Record<string, string>
  onOriginChange: (v: string) => void
  onDestinationChange: (v: string) => void
  onTransitChange: (v: string) => void
  onTripTypeChange: (v: "aller" | "aller-retour") => void
  onDateChange: (start: Date | null, end: Date | null) => void
  onCapacityChange: (v: string) => void
  onVolumeChange: (v: string) => void
}

export function RouteDetailsSection({
  t, lang, visible, isMobile,
  originWilaya, destinationWilaya, transitCities,
  tripType,
  startDate, endDate,
  capacity, volume,
  formErrors,
  onOriginChange, onDestinationChange, onTransitChange,
  onTripTypeChange, onDateChange,
  onCapacityChange, onVolumeChange,
}: Props) {
  const [showCalendar, setShowCalendar] = useState(false)
  const [showTransitDropdown, setShowTransitDropdown] = useState(false)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate)
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate)

  const calendarRef = useRef<HTMLDivElement>(null)
  const transitDropdownRef = useRef<HTMLDivElement>(null)

  const rightMonth = calMonth === 11 ? 0 : calMonth + 1
  const rightYear = calMonth === 11 ? calYear + 1 : calYear

  const handleDateSelect = (date: Date) => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(date)
      setTempEndDate(null)
      onDateChange(date, null)
    } else {
      if (date < tempStartDate) {
        setTempStartDate(date)
        setTempEndDate(tempStartDate)
        onDateChange(date, tempStartDate)
      } else {
        setTempEndDate(date)
        onDateChange(tempStartDate, date)
      }
      setShowCalendar(false)
    }
  }

  const selectedTransitCities = transitCities
    .split(",")
    .map((city) => city.trim())
    .filter(Boolean)

  const toggleTransitCity = (wilaya: string) => {
    const nextValues = selectedTransitCities.includes(wilaya)
      ? selectedTransitCities.filter((city) => city !== wilaya)
      : [...selectedTransitCities, wilaya]
    onTransitChange(nextValues.join(", "))
  }

  const removeTransitCity = (wilaya: string) => {
    onTransitChange(
      selectedTransitCities.filter((city) => city !== wilaya).join(", "),
    )
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        transitDropdownRef.current &&
        !transitDropdownRef.current.contains(target)
      ) {
        setShowTransitDropdown(false)
      }
      if (calendarRef.current && !calendarRef.current.contains(target)) {
        setShowCalendar(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getDateDisplayText = () => {
    if (tempStartDate && tempEndDate) {
      return `${formatDate(tempStartDate)}  ${t.to}  ${formatDate(tempEndDate)}`
    }
    if (tempStartDate && !tempEndDate) {
      return `${formatDate(tempStartDate)}  ${t.to}  ___/__/____`
    }
    return `__/__/____  ${t.to}  __/__/____`
  }

  return (
    <div
      className="bg-white rounded-xl p-6 shadow-sm"
      style={{
        position: "relative",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
        zIndex: showCalendar ? 50 : 1,
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: "#B8FF00", color: "#111" }}>1</div>
        <h2 className="text-xl font-semibold text-gray-900">{t.routeDetails}</h2>
      </div>

      <div className="space-y-4">

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WilayaInput
            value={originWilaya}
            onChange={onOriginChange}
            placeholder={t.selectWilaya}
            label={t.originCity}
            error={formErrors.origin}
            required
          />

          <WilayaInput
            value={destinationWilaya}
            onChange={onDestinationChange}
            placeholder={t.selectWilaya}
            label={t.destinationCity}
            error={formErrors.destination}
            required
          />
        </div>

        {}
        <div ref={transitDropdownRef} style={{ position: "relative" }}>
          <label className="block text-sm font-bold text-gray-900 mb-2">{t.transitCities}</label>
          <button
            type="button"
            onClick={() => setShowTransitDropdown(prev => !prev)}
            className="w-full px-4 py-3 rounded-lg text-left focus:outline-none"
            style={{ backgroundColor: "#EDFFD0", border: "none", minHeight: "52px" }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center", paddingRight: "28px" }}>
              {selectedTransitCities.length === 0 ? (
                <span className="text-gray-400">{t.transitPlaceholder}</span>
              ) : (
                selectedTransitCities.map((city) => (
                  <span key={city} style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#B8FF00", color: "#111", borderRadius: "999px", padding: "4px 10px", fontSize: "12px", fontWeight: 600 }}>
                    {city}
                    <span onClick={(e) => { e.stopPropagation(); removeTransitCity(city) }} style={{ cursor: "pointer", lineHeight: 1, fontSize: "14px" }}>×</span>
                  </span>
                ))
              )}
            </div>
            <img src="/icons/icon down green 1.png" alt="select" style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", objectFit: "contain", pointerEvents: "none" }} />
          </button>
          {showTransitDropdown && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, maxHeight: "260px", overflowY: "auto", backgroundColor: "#fff", border: "1px solid #d1d5db", borderRadius: "16px", boxShadow: "0 16px 40px rgba(0,0,0,0.12)", zIndex: 60, padding: "8px" }}>
              {ALGERIAN_WILAYAS.map((wilaya) => {
                const isSelected = selectedTransitCities.includes(wilaya)
                return (
                  <button key={wilaya} type="button" onClick={() => toggleTransitCity(wilaya)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "10px 12px", border: "none", borderRadius: "12px", backgroundColor: isSelected ? "#EDFFD0" : "transparent", color: "#111", cursor: "pointer", textAlign: "left", fontSize: "13px", fontWeight: isSelected ? 700 : 500 }}>
                    <span>{wilaya}</span>
                    <span style={{ color: isSelected ? "#65a30d" : "#9ca3af" }}>{isSelected ? "" : "+"}</span>
                  </button>
                )
              })}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-1">{t.transitHint}</p>
        </div>

        {}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">{t.tripType}</label>
          <div style={{ display: "flex", borderRadius: "999px", overflow: "hidden", border: `1.5px solid ${tripType ? "#B8FF00" : "#e5e7eb"}` }}>
            <button type="button" onClick={() => onTripTypeChange("aller")} style={{ flex: 1, padding: "10px 14px", border: "none", cursor: "pointer", backgroundColor: tripType === "aller" ? "#B8FF00" : "#fff", color: tripType === "aller" ? "#111" : "#6b7280", fontWeight: 800, fontSize: "12px" }}>{t.oneWay}</button>
            <button type="button" onClick={() => onTripTypeChange("aller-retour")} style={{ flex: 1, padding: "10px 14px", border: "none", cursor: "pointer", backgroundColor: tripType === "aller-retour" ? "#B8FF00" : "#fff", color: tripType === "aller-retour" ? "#111" : "#6b7280", fontWeight: 800, fontSize: "12px" }}>{t.roundTrip}</button>
          </div>
        </div>

        {}
        <div ref={calendarRef}>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            {tripType === "aller-retour" ? `${t.departureDates} & ${t.returnDates}` : t.departureDates}
          </label>
          <div className="flex items-center rounded-full px-6 py-4 cursor-pointer" style={{ backgroundColor: "#EDFFD0", border: (formErrors.departureStart || formErrors.departureEnd) ? "1.5px solid #fca5a5" : "none" }} onClick={() => setShowCalendar(prev => !prev)}>
            <span style={{ fontSize: "14px", color: (tempStartDate || tempEndDate) ? "#111" : "#9ca3af", fontWeight: (tempStartDate || tempEndDate) ? 600 : 400 }}>{getDateDisplayText()}</span>
            <div className="ml-auto"><img src="/icons/calendar green.png" alt="Calendar" style={{ width: "20px", height: "20px", objectFit: "contain" }} /></div>
          </div>
          {(formErrors.departureStart || formErrors.departureEnd) && <p className="text-xs text-red-500 mt-1">{formErrors.departureStart || formErrors.departureEnd}</p>}

          {showCalendar && (
            <div style={{ position: "absolute", marginTop: "8px", backgroundColor: "white", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", padding: "20px", width: isMobile ? "calc(100vw - 48px)" : "620px", maxWidth: "95vw", left: 0, zIndex: 50 }}>
              {isMobile ? (
                <CalendarMonth year={calYear} month={calMonth} showPrev showNext onPrev={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) } else setCalMonth(m => m - 1) }} onNext={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) } else setCalMonth(m => m + 1) }} startDate={tempStartDate} endDate={tempEndDate} hoveredDate={hoveredDate} onHover={setHoveredDate} onSelect={handleDateSelect} lang={lang} />
              ) : (
                <div style={{ display: "flex", gap: "32px" }}>
                  <CalendarMonth year={calYear} month={calMonth} showPrev showNext={false} onPrev={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) } else setCalMonth(m => m - 1) }} startDate={tempStartDate} endDate={tempEndDate} hoveredDate={hoveredDate} onHover={setHoveredDate} onSelect={handleDateSelect} lang={lang} />
                  <CalendarMonth year={rightYear} month={rightMonth} showPrev={false} showNext onNext={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) } else setCalMonth(m => m + 1) }} startDate={tempStartDate} endDate={tempEndDate} hoveredDate={hoveredDate} onHover={setHoveredDate} onSelect={handleDateSelect} lang={lang} />
                </div>
              )}
              <div style={{ borderTop: "1px solid #e5e7eb", marginTop: "16px", paddingTop: "16px", display: "flex", justifyContent: "center" }}>
                <button onClick={() => setShowCalendar(false)} style={{ padding: "10px 24px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>Close</button>
              </div>
            </div>
          )}
        </div>

        {}
        <div className="grid grid-cols-2 gap-4">
          <WeightInput id="capacity" name="capacity" label={t.availableCapacity} hint={t.capacityHint} value={capacity} onChange={onCapacityChange} />
          <WeightInput id="volume" name="volume" label={t.availableVolume} hint={t.volumeHint} value={volume} onChange={onVolumeChange} />
        </div>
      </div>
    </div>
  )
}