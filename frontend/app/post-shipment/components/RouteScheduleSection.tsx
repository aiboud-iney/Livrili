import { useRef, useState } from "react"
import { CalendarMonth } from "./CalendarMonth"
import { ALGERIAN_WILAYAS, formatDate } from "../types"
import type { Translations, Lang } from "../translations"

type Props = {
  t:                   Translations
  lang:                Lang
  visible:             boolean
  originWilaya:        string
  destinationWilaya:   string
  startDate:           Date | null
  endDate:             Date | null
  formErrors:          Record<string, string>
  isMobile:            boolean
  onOriginChange:      (v: string) => void
  onDestinationChange: (v: string) => void
  onDateChange:        (start: Date | null, end: Date | null) => void
  onClearDateError:    () => void
}

export function RouteScheduleSection({
  t, lang, visible,
  originWilaya, destinationWilaya,
  startDate, endDate,
  formErrors, isMobile,
  onOriginChange, onDestinationChange, onDateChange, onClearDateError,
}: Props) {
  const [showCalendar, setShowCalendar] = useState(false)
  const [hoveredDate, setHoveredDate]   = useState<Date | null>(null)
  const [calYear, setCalYear]           = useState(new Date().getFullYear())
  const [calMonth, setCalMonth]         = useState(new Date().getMonth())

  const calendarRef = useRef<HTMLDivElement>(null)

  const rightMonth = calMonth === 11 ? 0 : calMonth + 1
  const rightYear  = calMonth === 11 ? calYear + 1 : calYear

  const handleDateSelect = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      onDateChange(date, null)
    } else {
      if (date < startDate) {
        onDateChange(date, startDate)
      } else {
        onDateChange(startDate, date)
      }
      setShowCalendar(false)
    }
    onClearDateError()
  }

  const fields = [
    { label: t.origin,      val: originWilaya,      setVal: onOriginChange,      errKey: "origin" },
    { label: t.destination, val: destinationWilaya, setVal: onDestinationChange, errKey: "destination" },
  ]

  return (
    <div
      className="bg-white rounded-xl p-6 shadow-sm"
      style={{
        position: "relative",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
        zIndex: showCalendar ? 50 : "auto",
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-7 h-7 bg-[#7C3AED] rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
        <h2 className="text-xl font-semibold text-gray-900">{t.routeSchedule}</h2>
      </div>

      {}
      <div className="flex">
        <div className="flex flex-col items-center mr-3 py-1">
          <div className="w-4 h-4 rounded-full border-2 border-[#7C3AED] bg-white mt-6" />
          <div className="w-0.5 flex-1 bg-[#7C3AED] my-1" style={{ minHeight: "80px" }} />
          <div className="mb-3">
            <img src="/icons/Pin.png" alt="pin" style={{ width: "16px", height: "20px", objectFit: "contain" }} />
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {fields.map(({ label, val, setVal, errKey }) => (
            <div key={label}>
              <label className="block text-sm font-bold text-gray-900 mb-2">{label}</label>
              <div style={{ position: "relative" }}>
                <select
                  title={label}
                  value={val}
                  onChange={e => { setVal(e.target.value) }}
                  style={{ paddingRight: "40px", border: formErrors[errKey] ? "1.5px solid #fca5a5" : "none" }}
                  className={`w-full px-4 py-3 bg-[#F3EAFF] rounded-full focus:outline-none focus:ring-2 focus:ring-[#7C3AED] appearance-none cursor-pointer ${val ? "text-gray-700" : "text-gray-400"}`}
                >
                  <option value="">{t.selectWilaya}</option>
                  {ALGERIAN_WILAYAS.map(wilaya => (
                    <option key={wilaya} value={wilaya}>{wilaya}</option>
                  ))}
                </select>
                <img src="/icons/icon down 1.png" alt="select" style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", objectFit: "contain", pointerEvents: "none" }} />
              </div>
              {formErrors[errKey] && (
                <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>{formErrors[errKey]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="pt-6" ref={calendarRef}>
        <label className="block text-sm font-bold text-gray-900 mb-2">{t.pickupDate}</label>
        <div
          className="flex items-center bg-[#F3EAFF] rounded-full px-6 py-4 cursor-pointer"
          style={{ border: formErrors.date ? "1.5px solid #fca5a5" : "none" }}
          onClick={() => setShowCalendar(prev => !prev)}
        >
          <span style={{ fontSize: "14px", color: startDate ? "#111" : "#9ca3af", fontWeight: startDate ? 600 : 400 }}>{formatDate(startDate)}</span>
          <span style={{ margin: "0 20px", color: "#111", fontWeight: 700, fontSize: "14px" }}>{t.to}</span>
          <span style={{ fontSize: "14px", color: endDate ? "#111" : "#9ca3af", fontWeight: endDate ? 600 : 400 }}>{formatDate(endDate)}</span>
          <div className="ml-auto">
            <img src="/icons/calendar.png" alt="Calendar" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
          </div>
        </div>
        {formErrors.date && (
          <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>{formErrors.date}</p>
        )}

        {showCalendar && (
          <div style={{ position: "absolute", zIndex: 9999, marginTop: "8px", backgroundColor: "white", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", padding: "20px", width: isMobile ? "calc(100vw - 48px)" : "620px", maxWidth: "95vw", left: 0 }}>
            {isMobile ? (
              <CalendarMonth
                year={calYear} month={calMonth}
                showPrev showNext
                onPrev={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) } else setCalMonth(m => m - 1) }}
                onNext={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) } else setCalMonth(m => m + 1) }}
                startDate={startDate} endDate={endDate}
                hoveredDate={hoveredDate} onHover={setHoveredDate}
                onSelect={handleDateSelect} lang={lang}
              />
            ) : (
              <div style={{ display: "flex", gap: "32px" }}>
                <CalendarMonth
                  year={calYear} month={calMonth}
                  showPrev showNext={false}
                  onPrev={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) } else setCalMonth(m => m - 1) }}
                  startDate={startDate} endDate={endDate}
                  hoveredDate={hoveredDate} onHover={setHoveredDate}
                  onSelect={handleDateSelect} lang={lang}
                />
                <CalendarMonth
                  year={rightYear} month={rightMonth}
                  showPrev={false} showNext
                  onNext={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) } else setCalMonth(m => m + 1) }}
                  startDate={startDate} endDate={endDate}
                  hoveredDate={hoveredDate} onHover={setHoveredDate}
                  onSelect={handleDateSelect} lang={lang}
                />
              </div>
            )}

            {}
            <div style={{ borderTop: "1px solid #e5e7eb", marginTop: "16px", paddingTop: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", justifyContent: "center" }}>
                <div style={{ padding: "8px 16px", border: `1.5px solid ${startDate ? "#7C3AED" : "#e5e7eb"}`, borderRadius: "10px", fontSize: "13px", color: startDate ? "#7C3AED" : "#9ca3af", fontWeight: startDate ? 600 : 400, minWidth: "110px", textAlign: "center", backgroundColor: startDate ? "#f5f0ff" : "white" }}>{formatDate(startDate)}</div>
                <span style={{ color: "#111", fontWeight: 700, fontSize: "14px" }}>{t.to}</span>
                <div style={{ padding: "8px 16px", border: `1.5px solid ${endDate ? "#7C3AED" : "#e5e7eb"}`, borderRadius: "10px", fontSize: "13px", color: endDate ? "#7C3AED" : "#9ca3af", fontWeight: endDate ? 600 : 400, minWidth: "110px", textAlign: "center", backgroundColor: endDate ? "#f5f0ff" : "white" }}>{formatDate(endDate)}</div>
              </div>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                <button onClick={() => { onDateChange(null, null); setShowCalendar(false) }} style={{ padding: "10px 24px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#555" }}>{t.cancel}</button>
                <button onClick={() => setShowCalendar(false)} style={{ padding: "10px 24px", borderRadius: "10px", border: "none", background: "#7C3AED", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>{t.setDate}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
