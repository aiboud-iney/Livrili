"use client";

import { useState, useRef, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { Slider } from "@/components/ui/slider";
import { CalendarMonth } from "../../post-shipment/components/CalendarMonth";
import { formatDate } from "../../post-shipment/types";
import { SHIPMENT_TYPES, getShipmentTypeLabel } from "@/app/constants/shipment-types";
import { TRUCK_TYPES, getTruckTypeLabel } from "@/app/constants/truck-types";
import { WILAYAS, getWilayaDisplayName } from "@/app/constants/wilayas";
import WilayaInput from "@/components/WilayaInput";

const P = "#7C3AED";
const P_DARK = "#6D28D9";
const P_LIGHT = "#F3E8FF";
const BORDER = "#e2e8f0";
const TEXT = "#111827";
const MUTED = "#6b7280";

const ALGERIAN_WILAYAS = [...WILAYAS];

const normalizeWilaya = (str: string) => {
  return str.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/'/g, "")
    .toLowerCase()
    .trim();
};

function ShipmentTypeMultiDropdown({ values, onChange, lang = "en" }: { values: string[]; onChange: (vals: string[]) => void; lang?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = values.length > 0;

  const toggle = (typeValue: string) => {
    if (values.includes(typeValue)) {
      onChange(values.filter(v => v !== typeValue));
    } else {
      onChange([...values, typeValue]);
    }
  };

  const groupedTypes = SHIPMENT_TYPES.reduce((acc, type) => {
    if (!acc[type.category]) acc[type.category] = [];
    acc[type.category].push(type);
    return acc;
  }, {} as Record<string, typeof SHIPMENT_TYPES>);

  const categoryOrder = ["General", "Food & Perishables", "Industrial", "Special", "Bulk"];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: isActive ? P_LIGHT : "#fff",
          border: `1.5px solid ${isActive ? P : BORDER}`,
          borderRadius: "8px", padding: "8px 12px", cursor: "pointer",
          fontSize: "13px", fontWeight: isActive ? 600 : 400,
          color: isActive ? P : MUTED, whiteSpace: "nowrap",
          transition: "all 0.2s ease",
        }}
      >
        {values.length === 0 ? (lang === "fr" ? "Type d'expédition" : "Shipment Type") : (
          `${values.length} ${lang === "fr" ? (values.length === 1 ? "sélectionné" : "sélectionnés") : (values.length === 1 ? "selected" : "selected")}`
        )}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>
          <path d="M2 3l3 4 3-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
          backgroundColor: "#fff", borderRadius: "10px", border: `1px solid ${BORDER}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.10)", overflow: "hidden",
          minWidth: "260px", maxHeight: "400px", overflowY: "auto",
        }}>
          <div style={{ padding: "10px", borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: MUTED }}>
              {lang === "fr" ? "Sélectionner les types d'expédition" : "Select shipment types"}
            </span>
          </div>
          {categoryOrder.map(category => {
            const types = groupedTypes[category];
            if (!types?.length) return null;
            return (
              <div key={category}>
                <div style={{ padding: "8px 14px", backgroundColor: "#f9fafb", fontSize: "11px", fontWeight: 700, color: MUTED, textTransform: "uppercase" }}>
                  {category}
                </div>
                {types.map(type => {
                  const isSelected = values.includes(type.value);
                  return (
                    <button key={type.value} onClick={() => toggle(type.value)} style={{
                      width: "100%", padding: "10px 14px", textAlign: "left",
                      background: isSelected ? P_LIGHT : "none", border: "none", cursor: "pointer",
                      fontSize: "13px", fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? P : TEXT, display: "flex", alignItems: "center", gap: "8px",
                    }}>
                      <span style={{
                        width: "16px", height: "16px", borderRadius: "4px",
                        border: `1.5px solid ${isSelected ? P : BORDER}`,
                        backgroundColor: isSelected ? P : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {isSelected && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" /></svg>}
                      </span>
                      ({type.value}) {lang === "fr" ? type.labelFr : type.labelEn}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TruckTypeMultiDropdown({ values, onChange, lang = "en" }: { values: string[]; onChange: (vals: string[]) => void; lang?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = values.length > 0;

  const toggle = (typeValue: string) => {
    if (values.includes(typeValue)) {
      onChange(values.filter(v => v !== typeValue));
    } else {
      onChange([...values, typeValue]);
    }
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: isActive ? P_LIGHT : "#fff",
          border: `1.5px solid ${isActive ? P : BORDER}`,
          borderRadius: "8px", padding: "8px 12px", cursor: "pointer",
          fontSize: "13px", fontWeight: isActive ? 600 : 400,
          color: isActive ? P : MUTED, whiteSpace: "nowrap",
        }}
      >
        {values.length === 0 ? (lang === "fr" ? "Type de camion" : "Truck Type") : `${values.length} ${lang === "fr" ? (values.length === 1 ? "sélectionné" : "sélectionnés") : "selected"}`}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>
          <path d="M2 3l3 4 3-4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
          backgroundColor: "#fff", borderRadius: "10px", border: `1px solid ${BORDER}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.10)", overflow: "hidden",
          minWidth: "220px", maxHeight: "320px", overflowY: "auto",
        }}>
          <div style={{ padding: "10px", borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: MUTED }}>
              {lang === "fr" ? "Sélectionner les types de camion" : "Select truck types"}
            </span>
          </div>
          {TRUCK_TYPES.map(type => {
            const isSelected = values.includes(type.value);
            return (
              <button key={type.value} onClick={() => toggle(type.value)} style={{
                width: "100%", padding: "10px 14px", textAlign: "left",
                background: isSelected ? P_LIGHT : "none", border: "none", cursor: "pointer",
                fontSize: "13px", fontWeight: isSelected ? 700 : 500,
                color: isSelected ? P : TEXT, display: "flex", alignItems: "center", gap: "8px",
              }}>
                <span style={{
                  width: "16px", height: "16px", borderRadius: "4px",
                  border: `1.5px solid ${isSelected ? P : BORDER}`,
                  backgroundColor: isSelected ? P : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {isSelected && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" /></svg>}
                </span>
                ({type.value}) {lang === "fr" ? type.labelFr : type.labelEn}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export interface FilterValues {
  origin: string[];
  destination: string[];
  startDate: string;
  endDate: string;
  weightMin: number;
  weightMax: number;
  volumeMin: number;
  volumeMax: number;
  sortBy: string;
  shipmentTypes: string[];
  truckTypes: string[];
}

const WEIGHT_MAX = 25;
const VOLUME_MAX = 100;

const translations = {
  en: {
    origin: "Origin", destination: "Destination", startDate: "Start date", endDate: "End date",
    weight: "Weight (T)", volume: "Volume (M³)", sortBy: "Sort by", clear: "Clear All",
    min: "MIN", max: "MAX", sortOptions: ["Newest", "Oldest", "Weight ↑", "Weight ↓", "Volume ↑", "Volume ↓"],
  },
  fr: {
    origin: "Origine", destination: "Destination", startDate: "Date début", endDate: "Date fin",
    weight: "Tonnage (T)", volume: "Volume (M³)", sortBy: "Trier par", clear: "Tout effacer",
    min: "MIN", max: "MAX", sortOptions: ["Nouveau", "Ancien", "Tonnage ↑", "Tonnage ↓", "Volume ↑", "Volume ↓"],
  },
};

const SORT_KEYS = ["Newest", "Oldest", "Weight ↑", "Weight ↓", "Volume ↑", "Volume ↓"];

export const defaultFilters: FilterValues = {
  origin: [], destination: [], startDate: "", endDate: "",
  weightMin: 0, weightMax: WEIGHT_MAX, volumeMin: 0, volumeMax: VOLUME_MAX,
  sortBy: "Newest", shipmentTypes: [], truckTypes: [],
};

interface FilterBarProps {
  filters: FilterValues;
  onChange: (key: keyof FilterValues, value: any) => void;
  onClear: () => void;
}

export function FilterBar({ filters, onChange, onClear }: FilterBarProps) {
  const { lang } = useLang();
  const t = translations[lang];
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [showSort, setShowSort] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const parseDateStr = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const [tempStartDate, setTempStartDate] = useState<Date | null>(() => filters.startDate ? parseDateStr(filters.startDate) : null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(() => filters.endDate ? parseDateStr(filters.endDate) : null);
  const [startPopoverRect, setStartPopoverRect] = useState<{ top: number; left: number } | null>(null);
  const [endPopoverRect, setEndPopoverRect] = useState<{ top: number; left: number } | null>(null);
  const [startAnchorEl, setStartAnchorEl] = useState<HTMLElement | null>(null);
  const [endAnchorEl, setEndAnchorEl] = useState<HTMLElement | null>(null);
  const startPopoverRef = useRef<HTMLDivElement>(null);
  const endPopoverRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setTempStartDate(filters.startDate ? parseDateStr(filters.startDate) : null);
  }, [filters.startDate]);

  useEffect(() => {
    setTempEndDate(filters.endDate ? parseDateStr(filters.endDate) : null);
  }, [filters.endDate]);

  const rightMonth = calMonth === 11 ? 0 : calMonth + 1;
  const rightYear = calMonth === 11 ? calYear + 1 : calYear;

  const formatDateForApi = (date: Date | null): string => {
    if (!date) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleStartDateSelect = (date: Date) => {
    setTempStartDate(date);
    onChange("startDate", formatDateForApi(date));
    if (tempEndDate && date > tempEndDate) { setTempEndDate(null); onChange("endDate", ""); }
    setShowStartCalendar(false);
  };

  const handleEndDateSelect = (date: Date) => {
    if (!tempStartDate) return;
    if (date >= tempStartDate) { setTempEndDate(date); onChange("endDate", formatDateForApi(date)); }
    setShowEndCalendar(false);
  };

  const handleClearDates = () => {
    setTempStartDate(null); setTempEndDate(null);
    onChange("startDate", ""); onChange("endDate", "");
  };

  const openStartCalendar = (el: HTMLElement | null) => {
    if (!el) { setStartPopoverRect({ top: 120, left: 12 }); setStartAnchorEl(null); setShowStartCalendar(true); return; }
    const r = el.getBoundingClientRect();
    const w = isMobile ? Math.min(window.innerWidth - 48, 420) : 620;
    setStartPopoverRect({ top: r.bottom + 8, left: Math.max(12, Math.min(r.left, window.innerWidth - w - 12)) });
    setStartAnchorEl(el);
    setShowStartCalendar(true);
  };

  const openEndCalendar = (el: HTMLElement | null) => {
    if (!tempStartDate) return;
    if (!el) { setEndPopoverRect({ top: 120, left: 12 }); setEndAnchorEl(null); setShowEndCalendar(true); return; }
    const r = el.getBoundingClientRect();
    const w = isMobile ? Math.min(window.innerWidth - 48, 420) : 620;
    setEndPopoverRect({ top: r.bottom + 8, left: Math.max(12, Math.min(r.left, window.innerWidth - w - 12)) });
    setEndAnchorEl(el);
    setShowEndCalendar(true);
  };

  useEffect(() => {
    if (!showStartCalendar) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (startPopoverRef.current?.contains(target)) return;
      if (startAnchorEl && startAnchorEl.contains(target)) return;
      setShowStartCalendar(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showStartCalendar, startAnchorEl]);

  useEffect(() => {
    if (!showEndCalendar) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (endPopoverRef.current?.contains(target)) return;
      if (endAnchorEl && endAnchorEl.contains(target)) return;
      setShowEndCalendar(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showEndCalendar, endAnchorEl]);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px 10px 36px", border: `1.5px solid ${BORDER}`,
    borderRadius: "10px", fontSize: "14px", color: TEXT, backgroundColor: "#fff",
    outline: "none", transition: "border-color 0.2s",
  };

  const disabledInputStyle: React.CSSProperties = {
    ...inputStyle, color: "#9ca3af", backgroundColor: "#f9fafb", cursor: "not-allowed",
  };

  const iconStyle: React.CSSProperties = {
    position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)",
    width: "15px", height: "15px", pointerEvents: "none",
  };

  const MultiWilayaDropdown = ({ values, onChange, placeholder, icon }: {
    values: string[];
    onChange: (vals: string[]) => void;
    placeholder: string;
    icon: React.ReactNode;
  }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    const normalize = (str: string) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/'/g, "").toLowerCase().trim();

    const filtered = ALGERIAN_WILAYAS.filter(w =>
      normalize(w).includes(normalize(search)) && !values.includes(w)
    );

    const addWilaya = (w: string) => { onChange([...values, w]); setSearch(""); setOpen(true); };
    const removeWilaya = (w: string) => { onChange(values.filter(v => v !== w)); };

    return (
      <div ref={ref} style={{ position: "relative", flex: 1, minWidth: 0 }}>
        <div style={{ position: "relative" }}>
          {icon}
          <div
            style={{
              width: "100%", padding: "8px 14px 8px 38px", border: `1.5px solid ${BORDER}`,
              borderRadius: "10px", fontSize: "14px", color: TEXT, backgroundColor: "#fff",
              minHeight: "38px", display: "flex", flexWrap: "wrap", gap: "4px",
              alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", cursor: "text",
            }}
            onClick={() => setOpen(true)}
          >
            {values.map(w => (
              <span key={w} style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                backgroundColor: P_LIGHT, color: P, padding: "2px 8px",
                borderRadius: "6px", fontSize: "12px", fontWeight: 600,
              }}>
                {getWilayaDisplayName(w)}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ cursor: "pointer" }}
                  onClick={e => { e.stopPropagation(); removeWilaya(w); }}>
                  <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            ))}
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              onKeyDown={e => { if (e.key === "Backspace" && search === "" && values.length > 0) removeWilaya(values[values.length - 1]); }}
              placeholder={values.length === 0 ? placeholder : ""}
              style={{ flex: 1, minWidth: "110px", border: "none", outline: "none", backgroundColor: "transparent", color: TEXT, fontSize: "14px", padding: "2px 0" }}
            />
          </div>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
            style={{ position: "absolute", right: "12px", top: "50%", transform: `translateY(-50%) ${open ? "rotate(180deg)" : ""}`, pointerEvents: "none", transition: "transform 0.2s" }}>
            <path d="M2 4l4 4 4-4" stroke={MUTED} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200,
            backgroundColor: "#fff", border: `1.5px solid ${P}`, borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)", overflow: "hidden",
          }}>
            <div style={{ maxHeight: "220px", overflowY: "auto" }}>
              {filtered.length > 0 ? filtered.map(w => (
                <button key={w} onClick={() => addWilaya(w)} style={{
                  width: "100%", padding: "10px 14px", textAlign: "left",
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: "13px", fontWeight: 400, color: TEXT, transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >{w}</button>
              )) : (
                <div style={{ padding: "12px 14px", fontSize: "13px", color: MUTED }}>No wilayas found</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

const DatePicker = ({ isStart }: { isStart: boolean }) => (
    <div style={{ position: "relative", flex: 1 }}>
      <svg style={iconStyle} viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="12" rx="2" stroke={isStart || tempStartDate ? P : "#d1d5db"} strokeWidth="1.6" />
        <path d="M1 7h14" stroke={isStart || tempStartDate ? P : "#d1d5db"} strokeWidth="1.6" />
        <path d="M5 1v4M11 1v4" stroke={isStart || tempStartDate ? P : "#d1d5db"} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <div
        style={isStart ? inputStyle : (tempStartDate ? inputStyle : disabledInputStyle)}
        onClick={(e) => {
          if (isStart) { showStartCalendar ? setShowStartCalendar(false) : openStartCalendar(e.currentTarget); }
          else if (tempStartDate) { showEndCalendar ? setShowEndCalendar(false) : openEndCalendar(e.currentTarget); }
        }}
      >
        {isStart ? (
          tempStartDate ? <span style={{ fontWeight: 600 }}>{formatDate(tempStartDate)}</span>
            : <span style={{ color: MUTED }}>{t.startDate}</span>
        ) : tempEndDate ? <span style={{ fontWeight: 600 }}>{formatDate(tempEndDate)}</span>
          : <span style={{ color: tempStartDate ? MUTED : "#cbd5e1" }}>{t.endDate}</span>}
      </div>
    </div>
  );

  const SortDropdown = () => (
    <div style={{ position: "relative" }}>
      <button onClick={() => setShowSort(p => !p)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: TEXT }}>
        {t.sortBy}: {t.sortOptions[SORT_KEYS.indexOf(filters.sortBy)]}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="#111" strokeWidth="1.5" /></svg>
      </button>
      {showSort && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50, backgroundColor: "#fff", borderRadius: "10px", border: `1px solid ${BORDER}`, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", minWidth: "140px" }}>
          {t.sortOptions.map((opt, i) => {
            const key = SORT_KEYS[i];
            return (
              <button key={key} onClick={() => { onChange("sortBy", key); setShowSort(false); }} style={{
                width: "100%", padding: "9px 14px", textAlign: "left", background: filters.sortBy === key ? P_LIGHT : "none",
                border: "none", cursor: "pointer", fontSize: "13px", fontWeight: filters.sortBy === key ? 700 : 500,
                color: filters.sortBy === key ? P : TEXT,
              }}>{opt}</button>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderCalendar = (isStart: boolean) => (
    <div style={{ display: "flex", gap: "32px" }}>
      <CalendarMonth year={calYear} month={calMonth} showPrev showNext={false} onPrev={() => {
        if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1);
      }} startDate={isStart ? tempStartDate : tempStartDate} endDate={tempEndDate}
        hoveredDate={hoveredDate} onHover={setHoveredDate} onSelect={isStart ? handleStartDateSelect : handleEndDateSelect} lang={lang as any} />
      <CalendarMonth year={rightYear} month={rightMonth} showPrev={false} showNext onNext={() => {
        if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1);
      }} startDate={isStart ? tempStartDate : tempStartDate} endDate={tempEndDate}
        hoveredDate={hoveredDate} onHover={setHoveredDate} onSelect={isStart ? handleStartDateSelect : handleEndDateSelect} lang={lang as any} />
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

      {}
      <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", flexDirection: isMobile ? "column" : "row" }}>
        <MultiWilayaDropdown
            values={filters.origin}
            onChange={(v) => onChange("origin", v)}
            placeholder={t.origin}
            icon={
              <svg style={iconStyle} viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="7" r="4" stroke={filters.origin.length > 0 ? P : "#d1d5db"} strokeWidth="1.6" />
                <path d="M8 11v4" stroke={filters.origin.length > 0 ? P : "#d1d5db"} strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            }
          />
        <MultiWilayaDropdown
            values={filters.destination}
            onChange={(v) => onChange("destination", v)}
            placeholder={t.destination}
            icon={
              <svg style={iconStyle} viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="7" r="4" stroke={filters.destination.length > 0 ? P : "#d1d5db"} strokeWidth="1.6" />
                <path d="M8 11v4" stroke={filters.destination.length > 0 ? P : "#d1d5db"} strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            }
          />
        <DatePicker isStart={true} />
        <DatePicker isStart={false} />
      </div>

      {}
      {(tempStartDate || tempEndDate) && !isMobile && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-8px" }}>
          <button onClick={handleClearDates} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 500, color: MUTED, padding: "4px 8px" }}
            onMouseEnter={e => e.currentTarget.style.color = "#DC2626"} onMouseLeave={e => e.currentTarget.style.color = MUTED}>
             {lang === "fr" ? "Effacer les dates" : "Clear dates"}
          </button>
        </div>
      )}

      {!isMobile && <div style={{ height: "1px", backgroundColor: "#f1f5f9" }} />}

      {}
      <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: "1fr 1fr auto", alignItems: "center", gap: "20px", flexDirection: isMobile ? "column" : "row" }}>

        {}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: TEXT }}>{t.weight}</span>
            <span style={{ fontSize: "11px", color: MUTED }}>{t.min} {filters.weightMin}T – {t.max} {filters.weightMax}T</span>
          </div>
          <Slider min={0} max={WEIGHT_MAX} step={1} value={[filters.weightMin, filters.weightMax]}
            onValueChange={([min, max]) => { onChange("weightMin", min); onChange("weightMax", max); }}
            className="[&_[role=slider]]:bg-[#7C3AED] [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[data-slot=slider-range]]:bg-[#7C3AED]" />
        </div>

        {}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: TEXT }}>{t.volume}</span>
            <span style={{ fontSize: "11px", color: MUTED }}>{t.min} {filters.volumeMin}M³ – {t.max} {filters.volumeMax}M³</span>
          </div>
          <Slider min={0} max={VOLUME_MAX} step={1} value={[filters.volumeMin, filters.volumeMax]}
            onValueChange={([min, max]) => { onChange("volumeMin", min); onChange("volumeMax", max); }}
            className="[&_[role=slider]]:bg-[#7C3AED] [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[data-slot=slider-range]]:bg-[#7C3AED]" />
        </div>

        {}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", justifyContent: isMobile ? "flex-start" : "flex-end" }}>
          <ShipmentTypeMultiDropdown values={filters.shipmentTypes} onChange={v => onChange("shipmentTypes", v)} lang={lang} />
          <TruckTypeMultiDropdown values={filters.truckTypes} onChange={v => onChange("truckTypes", v)} lang={lang} />
          <SortDropdown />
          <button onClick={onClear} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: MUTED, whiteSpace: "nowrap", padding: "0 4px" }}
            onMouseEnter={e => e.currentTarget.style.color = TEXT} onMouseLeave={e => e.currentTarget.style.color = MUTED}>
            {t.clear}
          </button>
        </div>
      </div>

      {}
      {mounted && showStartCalendar && startPopoverRect && (
        <div ref={startPopoverRef} style={{ position: "fixed", top: isMobile ? "50%" : startPopoverRect.top, left: isMobile ? "50%" : startPopoverRect.left, transform: isMobile ? "translate(-50%, -50%)" : undefined, backgroundColor: "white", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", padding: "20px", width: isMobile ? Math.min(window.innerWidth - 48, 420) : "620px", zIndex: 99999 }}>
          {isMobile ? (
            <CalendarMonth year={calYear} month={calMonth} showPrev showNext onPrev={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
              onNext={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
              startDate={tempStartDate} endDate={tempEndDate} hoveredDate={hoveredDate} onHover={setHoveredDate} onSelect={handleStartDateSelect} lang={lang as any} />
          ) : renderCalendar(true)}
          <div style={{ borderTop: "1px solid #e5e7eb", marginTop: "16px", paddingTop: "16px", textAlign: "center" }}>
            <button onClick={() => setShowStartCalendar(false)} style={{ padding: "8px 16px", background: "#f3f4f6", border: "none", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {mounted && showEndCalendar && endPopoverRect && tempStartDate && (
        <div ref={endPopoverRef} style={{ position: "fixed", top: isMobile ? "50%" : endPopoverRect.top, left: isMobile ? "50%" : endPopoverRect.left, transform: isMobile ? "translate(-50%, -50%)" : undefined, backgroundColor: "white", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", padding: "20px", width: isMobile ? Math.min(window.innerWidth - 48, 420) : "620px", zIndex: 99999 }}>
          {isMobile ? (
            <CalendarMonth year={calYear} month={calMonth} showPrev showNext onPrev={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
              onNext={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
              startDate={tempStartDate} endDate={tempEndDate} hoveredDate={hoveredDate} onHover={setHoveredDate} onSelect={handleEndDateSelect} lang={lang as any} minDate={tempStartDate} />
          ) : renderCalendar(false)}
          <div style={{ borderTop: "1px solid #e5e7eb", marginTop: "16px", paddingTop: "16px", textAlign: "center" }}>
            <button onClick={() => setShowEndCalendar(false)} style={{ padding: "8px 16px", background: "#f3f4f6", border: "none", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}