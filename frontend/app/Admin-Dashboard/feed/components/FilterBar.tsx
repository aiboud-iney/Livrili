"use client";

import { useState, useRef, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { Slider } from "@/components/ui/slider";
import { CalendarMonth } from "../../../post-shipment/components/CalendarMonth";
import { formatDate } from "../../../post-shipment/types";
import { SHIPMENT_TYPES, getShipmentTypeLabel } from "@/app/constants/shipment-types";
import { TRUCK_TYPES, getTruckTypeLabel } from "@/app/constants/truck-types";
import { WILAYAS, getWilayaDisplayName } from "@/app/constants/wilayas";

const ALGERIAN_WILAYAS = [...WILAYAS]

function WilayaDropdown({ values, onChange, placeholder, icon }: {
  values: string[];
  onChange: (vals: string[]) => void;
  placeholder: string;
  icon: React.ReactNode;
}) {
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
            width: "100%", padding: "8px 14px 8px 38px", border: "1.5px solid #B8FF00",
            borderRadius: "10px", fontSize: "14px", color: "#fff", backgroundColor: "transparent",
            minHeight: "38px", display: "flex", flexWrap: "wrap", gap: "4px",
            alignItems: "center", cursor: "text",
          }}
          onClick={() => setOpen(true)}
        >
          {values.map(w => (
            <span key={w} style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              backgroundColor: "rgba(184,255,0,0.15)", color: "#B8FF00",
              padding: "2px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
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
            style={{ flex: 1, minWidth: "110px", border: "none", outline: "none", backgroundColor: "transparent", color: "#fff", fontSize: "14px", padding: "2px 0" }}
          />
        </div>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ position: "absolute", right: "12px", top: "50%", transform: `translateY(-50%) ${open ? "rotate(180deg)" : ""}`, pointerEvents: "none", transition: "transform 0.2s" }}>
          <path d="M2 4l4 4 4-4" stroke="#B8FF00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200,
          backgroundColor: "#1a1a2e", border: "1.5px solid #B8FF00", borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.30)", overflow: "hidden",
        }}>
          <div style={{ maxHeight: "220px", overflowY: "auto" }}>
            {filtered.length > 0 ? filtered.map(w => (
              <button key={w} onClick={() => addWilaya(w)} style={{
                width: "100%", padding: "10px 14px", textAlign: "left",
                background: "none", border: "none", cursor: "pointer",
                fontSize: "13px", fontWeight: 400, color: "#fff", transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(184,255,0,0.1)"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >{w}</button>
            )) : (
              <div style={{ padding: "12px 14px", fontSize: "13px", color: "#6b7280" }}>No wilayas found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ShipmentTypeMultiDropdown({
  values,
  onChange,
  lang = "en",
}: {
  values: string[];
  onChange: (vals: string[]) => void;
  lang?: string;
}) {
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
  const P = "#7C3AED";
  const P_LIGHT = "#f3f0ff";
  const BORDER = "#e2e8f0";
  const TEXT = "#111827";
  const MUTED = "#6b7280";

  const toggleShipmentType = (typeValue: string) => {
    if (values.includes(typeValue)) {
      onChange(values.filter(v => v !== typeValue));
    } else {
      onChange([...values, typeValue]);
    }
  };

  const groupedTypes = SHIPMENT_TYPES.reduce((acc, type) => {
    if (!acc[type.category]) {
      acc[type.category] = [];
    }
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
        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = P; e.currentTarget.style.color = TEXT; } }}
        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; } }}
      >
        {values.length === 0 ? (lang === "fr" ? "Type d'expédition" : "Shipment Type") : (
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {values.length} {lang === "fr" ? (values.length === 1 ? "sélectionné" : "sélectionnés") : (values.length === 1 ? "selected" : "selected")}
          </span>
        )}
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}
        >
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
            if (!types || types.length === 0) return null;
            return (
              <div key={category}>
                <div style={{
                  padding: "8px 14px",
                  backgroundColor: "#f9fafb",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: MUTED,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}>
                  {category}
                </div>
                {types.map(type => {
                  const isSelected = values.includes(type.value);
                  return (
                    <button
                      key={type.value}
                      onClick={() => toggleShipmentType(type.value)}
                      style={{
                        width: "100%", padding: "10px 14px", textAlign: "left",
                        background: isSelected ? P_LIGHT : "none",
                        border: "none", cursor: "pointer", fontSize: "13px",
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? P : TEXT, transition: "background 0.15s",
                        display: "flex", alignItems: "center", gap: "8px",
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = "#f9fafb"; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      <span style={{
                        width: "16px", height: "16px", borderRadius: "4px",
                        border: `1.5px solid ${isSelected ? P : BORDER}`,
                        backgroundColor: isSelected ? P : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {isSelected && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
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

function TruckTypeMultiDropdown({
  values,
  onChange,
  lang = "en",
}: {
  values: string[];
  onChange: (vals: string[]) => void;
  lang?: string;
}) {
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
  const P = "#7C3AED";
  const P_LIGHT = "#f3f0ff";
  const BORDER = "#e2e8f0";
  const TEXT = "#111827";
  const MUTED = "#6b7280";

  const toggleTruckType = (typeValue: string) => {
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
          transition: "all 0.2s ease",
        }}
        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = P; e.currentTarget.style.color = TEXT; } }}
        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; } }}
      >
        {values.length === 0 ? (lang === "fr" ? "Type de camion" : "Truck Type") : (
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {values.length} {lang === "fr" ? (values.length === 1 ? "sélectionné" : "sélectionnés") : (values.length === 1 ? "selected" : "selected")}
          </span>
        )}
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}
        >
          <path d="M2 3l3 4 3-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
              <button
                key={type.value}
                onClick={() => toggleTruckType(type.value)}
                style={{
                  width: "100%", padding: "10px 14px", textAlign: "left",
                  background: isSelected ? P_LIGHT : "none",
                  border: "none", cursor: "pointer", fontSize: "13px",
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? P : TEXT, transition: "background 0.15s",
                  display: "flex", alignItems: "center", gap: "8px",
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = "#f9fafb"; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <span style={{
                  width: "16px", height: "16px", borderRadius: "4px",
                  border: `1.5px solid ${isSelected ? P : BORDER}`,
                  backgroundColor: isSelected ? P : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
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
  dateRange: string;
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
    origin: "Origin",
    destination: "Destination",
    dateRange: "Date range",
    search: "Search",
    weight: "Weight (T)",
    volume: "Volume (M³)",
    sortBy: "Sort by",
    clear: "Clear All",
    to: "to",
    min: "MIN",
    max: "MAX",
    sortOptions: [
      "Newest",
      "Oldest",
      "Weight ↑",
      "Weight ↓",
      "Volume ↑",
      "Volume ↓",
    ],
  },
  fr: {
    origin: "Origine",
    destination: "Destination",
    dateRange: "Intervalle de date",
    search: "Rechercher",
    weight: "Tonnage (T)",
    volume: "Volume (M³)",
    sortBy: "Trié par",
    clear: "Tout effacer",
    to: "à",
    min: "MIN",
    max: "MAX",
    sortOptions: [
      "Nouveau",
      "Ancien",
      "Tonnage ↑",
      "Tonnage ↓",
      "Volume ↑",
      "Volume ↓",
    ],
  },
};

const SORT_KEYS = [
  "Newest",
  "Oldest",
  "Weight ↑",
  "Weight ↓",
  "Volume ↑",
  "Volume ↓",
];

export const defaultFilters: FilterValues = {
  origin: [],
  destination: [],
  dateRange: "",
  weightMin: 0,
  weightMax: WEIGHT_MAX,
  volumeMin: 0,
  volumeMax: VOLUME_MAX,
  sortBy: "Newest",
  shipmentTypes: [],
  truckTypes: [],
};

interface FilterBarProps {
  filters: FilterValues;
  onChange: (key: keyof FilterValues, value: any) => void;
  onClear: () => void;
}

export function FilterBar({
  filters,
  onChange,
  onClear,
}: FilterBarProps) {
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
  const [showDateCalendar, setShowDateCalendar] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const [datePopoverRect, setDatePopoverRect] = useState<{ top: number; left: number } | null>(null);
  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLElement | null>(null);
  const datePopoverRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

  const rightMonth = calMonth === 11 ? 0 : calMonth + 1;
  const rightYear = calMonth === 11 ? calYear + 1 : calYear;

  const handleRangeSelect = (date: Date) => {
    if (!dateStart || (dateStart && dateEnd)) {
      setDateStart(date);
      setDateEnd(null);
      applyDateRange(date, date);
    } else {
      if (date < dateStart) {
        setDateStart(date);
        setDateEnd(dateStart);
        applyDateRange(date, dateStart);
      } else {
        setDateEnd(date);
        applyDateRange(dateStart, date);
      }
      setShowDateCalendar(false);
    }
  };

  const openDateCalendar = (el: HTMLElement | null) => {
    if (!el) {
      setDatePopoverRect({ top: 120, left: 12 });
      setDateAnchorEl(null);
      setShowDateCalendar(true);
      return;
    }
    const r = el.getBoundingClientRect();
    const desiredWidth = isMobile ? Math.min(window.innerWidth - 48, 420) : 620;
    const left = Math.max(12, Math.min(r.left, window.innerWidth - desiredWidth - 12));
    const top = r.bottom + 8;
    setDatePopoverRect({ top, left });
    setDateAnchorEl(el);
    setShowDateCalendar(true);
  };

  useEffect(() => {
    if (!showDateCalendar) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (datePopoverRef.current?.contains(target)) return;
      if (dateAnchorEl && dateAnchorEl.contains(target)) return;
      setShowDateCalendar(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showDateCalendar, dateAnchorEl]);

  const applyDateRange = (start: Date | null, end: Date | null) => {
    if (!start) {
      onChange("dateRange", "");
      return;
    }
    if (!end) {
      onChange("dateRange", `${formatDate(start)} ${t.to} ${formatDate(end)}`);
      return;
    }
    onChange("dateRange", `${formatDate(start)} ${t.to} ${formatDate(end)}`);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px 10px 36px",
    border: "1.5px solid #B8FF00",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#111",
    backgroundColor: "#fff",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    left: "11px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "15px",
    height: "15px",
    pointerEvents: "none",
  };

  const SortDropdown = () => (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setShowSort((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 600,
          color: "#111",
          whiteSpace: "nowrap",
        }}
      >
        {t.sortBy}: {t.sortOptions[SORT_KEYS.indexOf(filters.sortBy)]}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 4l4 4 4-4"
            stroke="#111"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {showSort && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 50,
            backgroundColor: "#fff",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            overflow: "hidden",
            minWidth: "140px",
          }}
        >
          {t.sortOptions.map((opt, i) => {
            const key = SORT_KEYS[i];
            const isSelected = filters.sortBy === key;
            return (
              <button
                key={key}
                onClick={() => {
                  onChange("sortBy", key);
                  setShowSort(false);
                }}
                style={{
                  width: "100%",
                  padding: "9px 14px",
                  textAlign: "left",
                  background: isSelected ? "#f4f0ff" : "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? "#7C3AED" : "#333",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor = "#f9f9f9";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {}
      <div
        style={{ display: isMobile ? "none" : "flex", gap: "10px", alignItems: "center" }}
      >

       <WilayaDropdown
  values={filters.origin}
  onChange={(v) => onChange("origin", v)}
  placeholder={t.origin}
  icon={<svg style={iconStyle} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="7" r="4" stroke="#B8FF00" strokeWidth="1.8" /><path d="M8 11v4" stroke="#B8FF00" strokeWidth="1.8" strokeLinecap="round" /></svg>}
/>

    <WilayaDropdown
  values={filters.destination}
  onChange={(v) => onChange("destination", v)}
  placeholder={t.destination}
  icon={<svg style={iconStyle} viewBox="0 0 16 16" fill="none"><path d="M8 2L14 8L8 14" stroke="#B8FF00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 8h12" stroke="#B8FF00" strokeWidth="1.8" strokeLinecap="round" /></svg>}
/>

        <div style={{ position: "relative", flex: 1 }}>
          <svg style={iconStyle} viewBox="0 0 16 16" fill="none">
            <rect
              x="1"
              y="3"
              width="14"
              height="12"
              rx="2"
              stroke="#B8FF00"
              strokeWidth="1.8"
            />
            <path d="M1 7h14" stroke="#B8FF00" strokeWidth="1.8" />
            <path
              d="M5 1v4M11 1v4"
              stroke="#B8FF00"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              ...inputStyle,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              paddingRight: "14px",
              zIndex: showDateCalendar ? 300 : 1,
            }}
            title={t.dateRange}
            onClick={(e) => (showDateCalendar ? setShowDateCalendar(false) : openDateCalendar(e.currentTarget))}
          >
            {dateStart ? (
  <>
    <span style={{ fontSize: "14px", color: "#111", fontWeight: 600 }}>
      {formatDate(dateStart)}
    </span>
    <span style={{ margin: "0 12px", color: "#111", fontWeight: 700, fontSize: "14px" }}>
      {t.to}
    </span>
    <span style={{ fontSize: "14px", color: dateEnd ? "#111" : "#9ca3af", fontWeight: dateEnd ? 600 : 400 }}>
      {formatDate(dateEnd)}
    </span>
  </>
) : (
  <span style={{ fontSize: "14px", color: "#9ca3af", fontWeight: 400 }}>
    {t.dateRange}
  </span>
)}
          </div>
        </div>
        <button
          onClick={onClear}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            color: "#6b7280",
            transition: "color 0.2s",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#111")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
        >
          {t.clear}
        </button>
      </div>

      {}
      <div
        style={{ display: isMobile ? "none" : "flex", alignItems: "center", gap: "24px" }}
      >
        {}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flex: 1,
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "#111",
              whiteSpace: "nowrap",
            }}
          >
            {t.weight}
          </span>
          <div style={{ flex: 1, minWidth: "120px" }}>
            <Slider
              min={0}
              max={WEIGHT_MAX}
              step={1}
              value={[filters.weightMin, filters.weightMax]}
              onValueChange={([min, max]) => {
                onChange("weightMin", min);
                onChange("weightMax", max);
              }}
              className="[&_[role=slider]]:bg-[#B8FF00] [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-sm [&_[data-orientation=horizontal]>.bg-primary]:bg-[#B8FF00]"
            />
          </div>
          <span
            style={{ fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap" }}
          >
            {t.min} {filters.weightMin}T- {t.max} {filters.weightMax}T
          </span>
        </div>

        {}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flex: 1,
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "#111",
              whiteSpace: "nowrap",
            }}
          >
            {t.volume}
          </span>
          <div style={{ flex: 1, minWidth: "120px" }}>
            <Slider
              min={0}
              max={VOLUME_MAX}
              step={1}
              value={[filters.volumeMin, filters.volumeMax]}
              onValueChange={([min, max]) => {
                onChange("volumeMin", min);
                onChange("volumeMax", max);
              }}
              className="[&_[role=slider]]:bg-[#B8FF00] [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-sm [&_[data-orientation=horizontal]>.bg-primary]:bg-[#B8FF00]"
            />
          </div>
          <span
            style={{ fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap" }}
          >
            {t.min} {filters.volumeMin}M³- {t.max} {filters.volumeMax}M³
          </span>
        </div>

        {}
        <ShipmentTypeMultiDropdown
          values={filters.shipmentTypes}
          onChange={v => onChange("shipmentTypes", v)}
          lang={lang}
        />

        {}
        <TruckTypeMultiDropdown
          values={filters.truckTypes}
          onChange={v => onChange("truckTypes", v)}
          lang={lang}
        />

        {}
        <SortDropdown />
      </div>

      {}
      <div style={{ display: isMobile ? "flex" : "none", flexDirection: "column", gap: "10px" }}>

       <WilayaDropdown
  values={filters.origin}
  onChange={(v) => onChange("origin", v)}
  placeholder={t.origin}
  icon={<svg style={iconStyle} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="7" r="4" stroke="#B8FF00" strokeWidth="1.8" /><path d="M8 11v4" stroke="#B8FF00" strokeWidth="1.8" strokeLinecap="round" /></svg>}
/>

  <WilayaDropdown
  values={filters.destination}
  onChange={(v) => onChange("destination", v)}
  placeholder={t.destination}
  icon={<svg style={iconStyle} viewBox="0 0 16 16" fill="none"><path d="M8 2L14 8L8 14" stroke="#B8FF00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 8h12" stroke="#B8FF00" strokeWidth="1.8" strokeLinecap="round" /></svg>}
/>

        <div style={{ position: "relative" }}>
          <svg style={iconStyle} viewBox="0 0 16 16" fill="none">
            <rect
              x="1"
              y="3"
              width="14"
              height="12"
              rx="2"
              stroke="#B8FF00"
              strokeWidth="1.8"
            />
            <path d="M1 7h14" stroke="#B8FF00" strokeWidth="1.8" />
            <path
              d="M5 1v4M11 1v4"
              stroke="#B8FF00"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              ...inputStyle,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              paddingRight: "14px",
              zIndex: showDateCalendar ? 300 : 1,
            }}
            title={t.dateRange}
            onClick={(e) => (showDateCalendar ? setShowDateCalendar(false) : openDateCalendar(e.currentTarget))}
          >
           {dateStart ? (
  <>
    <span style={{ fontSize: "14px", color: "#111", fontWeight: 600 }}>
      {formatDate(dateStart)}
    </span>
    <span style={{ margin: "0 12px", color: "#111", fontWeight: 700, fontSize: "14px" }}>
      {t.to}
    </span>
    <span style={{ fontSize: "14px", color: dateEnd ? "#111" : "#9ca3af", fontWeight: dateEnd ? 600 : 400 }}>
      {formatDate(dateEnd)}
    </span>
  </>
) : (
  <span style={{ fontSize: "14px", color: "#9ca3af", fontWeight: 400 }}>
    {t.dateRange}
  </span>
)}
          </div>
        </div>

        {}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "#111",
              }}
            >
              {t.weight}
            </span>
            <span style={{ fontSize: "11px", color: "#6b7280" }}>
              {t.min} {filters.weightMin}T – {t.max} {filters.weightMax}T
            </span>
          </div>
          <Slider
            min={0}
            max={WEIGHT_MAX}
            step={1}
            value={[filters.weightMin, filters.weightMax]}
            onValueChange={([min, max]) => {
              onChange("weightMin", min);
              onChange("weightMax", max);
            }}
            className="[&_[role=slider]]:bg-[#B8FF00] [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-sm [&_[data-orientation=horizontal]>.bg-primary]:bg-[#B8FF00]"
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "#111",
              }}
            >
              {t.volume}
            </span>
            <span style={{ fontSize: "11px", color: "#6b7280" }}>
              {t.min} {filters.volumeMin}M³ – {t.max} {filters.volumeMax}M³
            </span>
          </div>
          <Slider
            min={0}
            max={VOLUME_MAX}
            step={1}
            value={[filters.volumeMin, filters.volumeMax]}
            onValueChange={([min, max]) => {
              onChange("volumeMin", min);
              onChange("volumeMax", max);
            }}
            className="[&_[role=slider]]:bg-[#B8FF00] [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-sm [&_[data-orientation=horizontal]>.bg-primary]:bg-[#B8FF00]"
          />
        </div>

        {}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <ShipmentTypeMultiDropdown values={filters.shipmentTypes} onChange={v => onChange("shipmentTypes", v)} lang={lang} />
          <TruckTypeMultiDropdown values={filters.truckTypes} onChange={v => onChange("truckTypes", v)} lang={lang} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flex: 1 }}>
            <SortDropdown />
          </div>
          <button
            onClick={onClear}
            style={{
              border: "1.5px solid #e5e7eb",
              borderRadius: "8px",
              padding: "9px 18px",
              fontSize: "13px",
              fontWeight: 700,
              color: "#374151",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            {t.clear}
          </button>
        </div>
      </div>

{mounted && showDateCalendar && datePopoverRect && (
        <div
          ref={datePopoverRef}
          style={{
            position: "fixed",
            top: isMobile ? "50%" : datePopoverRect.top,
            left: isMobile ? "50%" : datePopoverRect.left,
            transform: isMobile ? "translate(-50%, -50%)" : undefined,            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            padding: "20px",
            width: isMobile ? Math.min(window.innerWidth - 48, 420) : "620px",
            maxWidth: "95vw",
            zIndex: 99999,
            maxHeight: "80vh",
overflowY: "auto",
          }}
        >
          {isMobile ? (
            <CalendarMonth
              year={calYear}
              month={calMonth}
              showPrev
              showNext
              onPrev={() => {
                if (calMonth === 0) {
                  setCalMonth(11);
                  setCalYear((y) => y - 1);
                } else setCalMonth((m) => m - 1);
              }}
              onNext={() => {
                if (calMonth === 11) {
                  setCalMonth(0);
                  setCalYear((y) => y + 1);
                } else setCalMonth((m) => m + 1);
              }}
              startDate={dateStart}
              endDate={dateEnd}
              hoveredDate={hoveredDate}
              onHover={setHoveredDate}
              onSelect={handleRangeSelect}
              lang={lang as any}
            />
          ) : (
            <div style={{ display: "flex", gap: "32px" }}>
              <CalendarMonth
                year={calYear}
                month={calMonth}
                showPrev
                showNext={false}
                onPrev={() => {
                  if (calMonth === 0) {
                    setCalMonth(11);
                    setCalYear((y) => y - 1);
                  } else setCalMonth((m) => m - 1);
                }}
                startDate={dateStart}
                endDate={dateEnd}
                hoveredDate={hoveredDate}
                onHover={setHoveredDate}
                onSelect={handleRangeSelect}
                lang={lang as any}
              />
              <CalendarMonth
                year={rightYear}
                month={rightMonth}
                showPrev={false}
                showNext
                onNext={() => {
                  if (calMonth === 11) {
                    setCalMonth(0);
                    setCalYear((y) => y + 1);
                  } else setCalMonth((m) => m + 1);
                }}
                startDate={dateStart}
                endDate={dateEnd}
                hoveredDate={hoveredDate}
                onHover={setHoveredDate}
                onSelect={handleRangeSelect}
                lang={lang as any}
              />
            </div>
          )}

          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              marginTop: "16px",
              paddingTop: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", gap: "12px", alignItems: "center", justifyContent: "center" }}>
              <div
                style={{
                  padding: "8px 16px",
                  border: `1.5px solid ${dateStart ? "#B8FF00" : "#e5e7eb"}`,
                  borderRadius: "10px",
                  fontSize: "13px",
                  color: dateStart ? "#4a6600" : "#9ca3af",
                  fontWeight: dateStart ? 600 : 400,
                  minWidth: "110px",
                  textAlign: "center",
                  backgroundColor: dateStart ? "#EDFFD0" : "white",
                }}
              >
                {formatDate(dateStart)}
              </div>
              <span style={{ color: "#111", fontWeight: 700, fontSize: "14px" }}>{t.to}</span>
              <div
                style={{
                  padding: "8px 16px",
                  border: `1.5px solid ${dateEnd ? "#B8FF00" : "#e5e7eb"}`,
                  borderRadius: "10px",
                  fontSize: "13px",
                  color: dateEnd ? "#4a6600" : "#9ca3af",
                  fontWeight: dateEnd ? 600 : 400,
                  minWidth: "110px",
                  textAlign: "center",
                  backgroundColor: dateEnd ? "#EDFFD0" : "white",
                }}
              >
                {formatDate(dateEnd)}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
