import { getDaysInMonth, getFirstDayOfMonth, MONTHS, MONTHS_FR, DAYS, DAYS_FR } from "../types"
import type { Lang } from "../translations"

type Props = {
  year:        number
  month:       number
  onPrev?:     () => void
  onNext?:     () => void
  showPrev:    boolean
  showNext:    boolean
  startDate:   Date | null
  endDate:     Date | null
  hoveredDate: Date | null
  onHover:     (d: Date | null) => void
  onSelect:    (d: Date) => void
  lang:        Lang
  minDate?:    Date
}

export function CalendarMonth({
  year, month, onPrev, onNext, showPrev, showNext,
  startDate, endDate, hoveredDate, onHover, onSelect, lang, minDate,
}: Props) {
  const monthNames  = lang === "fr" ? MONTHS_FR : MONTHS
  const dayNames    = lang === "fr" ? DAYS_FR : DAYS
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay    = getFirstDayOfMonth(year, month)

  const cells = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))
  )
  while (cells.length % 7 !== 0) cells.push(null)

  const isStart   = (d: Date) => startDate && d.toDateString() === startDate.toDateString()
  const isEnd     = (d: Date) => endDate && d.toDateString() === endDate.toDateString()
  const isInRange = (d: Date) => {
    const end = endDate || hoveredDate
    if (!startDate || !end) return false
    const [s, e] = startDate < end ? [startDate, end] : [end, startDate]
    return d > s && d < e
  }

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        {showPrev
          ? <button onClick={onPrev} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: "14px" }}>‹</button>
          : <div style={{ width: "32px" }} />}
        <span style={{ fontWeight: 700, fontSize: "16px", color: "#111" }}>{monthNames[month]}</span>
        {showNext
          ? <button onClick={onNext} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: "14px" }}>›</button>
          : <div style={{ width: "32px" }} />}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "8px" }}>
        {dayNames.map((d, index) => (
          <div key={`day-${index}`} style={{ textAlign: "center", fontSize: "12px", fontWeight: 600, color: "#9ca3af", padding: "4px 0" }}>{d}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
        {cells.map((date, i) => {
          if (!date) return <div key={i} style={{ height: "36px" }} />

          const start        = isStart(date)
          const end          = isEnd(date)
          const inRange      = isInRange(date)
          const isToday      = date.toDateString() === new Date().toDateString()
          const isDisabled   = minDate ? date < minDate : false
          const dayOfWeek    = (date.getDay() + 6) % 7
          const isFirstInRow = dayOfWeek === 0
          const isLastInRow  = dayOfWeek === 6

          return (
            <div
              key={i}
              style={{
                backgroundColor: inRange && !start && !end ? "rgba(124,58,237,0.08)" : "transparent",
                borderRadius: inRange && !start && !end
                  ? isFirstInRow ? "999px 0 0 999px" : isLastInRow ? "0 999px 999px 0" : "0"
                  : "0",
                display: "flex", alignItems: "center", justifyContent: "center", height: "36px",
              }}
            >
              <button
                onClick={() => !isDisabled && onSelect(date)}
                onMouseEnter={() => onHover(date)}
                onMouseLeave={() => onHover(null)}
                style={{
                  width: "34px", height: "34px", borderRadius: "50%",
                  backgroundColor: start || end ? "#7C3AED" : "transparent",
                  color: start || end ? "white" : inRange ? "#7C3AED" : isToday ? "#7C3AED" : "#111",
                  fontWeight: start || end || isToday ? 700 : 400,
                  fontSize: "13px", border: "none", cursor: isDisabled ? "not-allowed" : "pointer",
                  opacity: isDisabled ? 0.35 : 1,
                  transition: "background 0.15s", flexShrink: 0,
                }}
                onMouseOver={e => { if (!start && !end) e.currentTarget.style.backgroundColor = "rgba(124,58,237,0.1)" }}
                onMouseOut={e => { if (!start && !end) e.currentTarget.style.backgroundColor = "transparent" }}
              >
                {date.getDate()}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
