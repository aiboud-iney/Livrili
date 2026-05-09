"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { Slider } from "@/components/ui/slider";
import { CalendarMonth } from "@/app/post-shipment/components/CalendarMonth";
import { formatDate } from "@/app/post-shipment/types";
import { WILAYAS, getWilayaDisplayName } from "@/app/constants/wilayas";
import { TRUCK_TYPES } from "@/app/constants/truck-types";

const P = "#84cc16";
const P_DARK = "#65a30d";
const P_LIGHT = "#f7fee7";
const BORDER = "#e2e8f0";
const TEXT = "#111827";
const MUTED = "#6b7280";

const ALGERIAN_WILAYAS = [...WILAYAS];

const SORT_KEYS = [
  "Newest",
  "Oldest",
  "Weight ↑",
  "Weight ↓",
  "Volume ↑",
  "Volume ↓",
] as const;

export interface RouteFilterValues {
  origin: string[];
  destination: string[];
  start_date: string;
  end_date: string;
  weightMin: number;
  weightMax: number;
  volumeMin: number;
  volumeMax: number;
  sortBy: string;
  truckTypes: string[];
  tripType: "" | "aller" | "aller-retour";
}

const WEIGHT_MAX = 50;
const VOLUME_MAX = 50;

export const defaultRouteFilters: RouteFilterValues = {
  origin: [],
  destination: [],
  start_date: "",
  end_date: "",
  weightMin: 0,
  weightMax: WEIGHT_MAX,
  volumeMin: 0,
  volumeMax: VOLUME_MAX,
  sortBy: "Newest",
  truckTypes: [],
  tripType: "",
};

interface RouteFilterBarProps {
  filters: RouteFilterValues;
  onChange: (
    key: keyof RouteFilterValues,
    value: RouteFilterValues[keyof RouteFilterValues],
  ) => void;
  onClear: () => void;
}

const SLIDER_CLASS =
  "[&_[role=slider]]:bg-[#84cc16] [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[data-slot=slider-range]]:bg-[#84cc16]";

function MultiWilayaDropdown({
  values,
  onChange,
  placeholder,
  icon,
}: {
  values: string[];
  onChange: (vals: string[]) => void;
  placeholder: string;
  icon: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [keyBuffer, setKeyBuffer] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const keyBufferTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const normalize = (str: string) =>
    str.normalize('NFD')
       .replace(/[\u0300-\u036f]/g, '')
       .replace(/'/g, '')
       .toLowerCase()
       .trim()

  const filtered = ALGERIAN_WILAYAS.filter(
    (w) => {
      return normalize(w).includes(normalize(search)) && !values.includes(w);
    }
  );

  const addWilaya = (w: string) => {
    onChange([...values, w]);
    setSearch("");
    setOpen(true);
    setHighlightedIndex(-1);
  };

  const removeWilaya = (w: string) => {
    onChange(values.filter((v) => v !== w));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => {
        const next = prev < filtered.length - 1 ? prev + 1 : 0;
        scrollToIndex(next);
        return next;
      });
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => {
        const next = prev > 0 ? prev - 1 : filtered.length - 1;
        scrollToIndex(next);
        return next;
      });
      return;
    }
    if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      const selected = filtered[highlightedIndex];
      if (selected) {
        addWilaya(selected);
      }
      return;
    }
    if (e.key === 'Escape') {
      setOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    if ((e.target as HTMLElement).tagName === 'INPUT') {
      return;
    }

    if (e.key.length === 1) {
      const char = e.key.toUpperCase();

      if (keyBufferTimeoutRef.current) {
        clearTimeout(keyBufferTimeoutRef.current);
      }

      const newBuffer = keyBuffer + char;
      setKeyBuffer(newBuffer);

      keyBufferTimeoutRef.current = setTimeout(() => {
        setKeyBuffer("");
      }, 500);

      const index = findWilayaIndex(newBuffer);
      if (index >= 0) {
        setHighlightedIndex(index);
        scrollToIndex(index);
      }
    }
  };

  const findWilayaIndex = (buffer: string): number => {

    const codeMatch = buffer.match(/^\d+$/);
    if (codeMatch) {
      const code = buffer.padStart(2, '0');
      return filtered.findIndex(w => w.startsWith(code + ' -'));
    }

    return filtered.findIndex(w => {
      const namePart = w.split(' - ')[1]?.toUpperCase() || '';
      return namePart.startsWith(buffer);
    });
  };

  const scrollToIndex = (index: number) => {
    if (listRef.current && index >= 0) {
      const buttons = listRef.current.querySelectorAll('button');
      if (buttons[index]) {
        buttons[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  };

  return (
    <div ref={ref} style={{ position: "relative", flex: 1, minWidth: 0 }} onKeyDown={handleKeyDown} tabIndex={0}>
      <div style={{ position: "relative" }}>
        {icon}
        <div
          style={{
            width: "100%",
            padding: "8px 14px 8px 38px",
            border: `1.5px solid ${BORDER}`,
            borderRadius: "10px",
            fontSize: "14px",
            color: TEXT,
            backgroundColor: "#fff",
            minHeight: "38px",
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
            alignItems: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
          onClick={() => setOpen(true)}
        >
          {values.map((w) => (
            <span
              key={w}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                backgroundColor: P_LIGHT,
                color: P,
                padding: "2px 8px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {getWilayaDisplayName(w)}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeWilaya(w);
                }}
              >
                <path
                  d="M3 3l6 6M9 3l-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          ))}
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && search === "" && values.length > 0) {
                removeWilaya(values[values.length - 1]);
              }
            }}
            placeholder={values.length === 0 ? placeholder : ""}
            style={{
              flex: 1,
              minWidth: "110px",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              color: TEXT,
              fontSize: "14px",
              padding: "2px 0",
            }}
          />
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: `translateY(-50%) ${open ? "rotate(180deg)" : ""}`,
            pointerEvents: "none",
            transition: "transform 0.2s",
          }}
        >
          <path
            d="M2 4l4 4 4-4"
            stroke={MUTED}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 200,
            backgroundColor: "#fff",
            border: `1.5px solid ${P}`,
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(132,204,22,0.15)",
            overflow: "hidden",
          }}
        >
          <div ref={listRef} style={{ maxHeight: "220px", overflowY: "auto" }}>
            {filtered.length > 0 ? (
              filtered.map((w, idx) => (
                <button
                  key={w}
                  onClick={() => addWilaya(w)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    textAlign: "left",
                    background: values.includes(w) ? P_LIGHT : (highlightedIndex === idx ? '#f3f4f6' : "none"),
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: values.includes(w) ? 700 : (highlightedIndex === idx ? 600 : 400),
                    color: values.includes(w) ? P : TEXT,
                    outline: highlightedIndex === idx ? `2px solid ${P}` : 'none',
                    outlineOffset: '-2px',
                    transition: "background 0.15s",
                  }}
                >
                  {w}
                </button>
              ))
            ) : (
              <div
                style={{ padding: "12px 14px", fontSize: "13px", color: MUTED }}
              >
                No wilayas found
              </div>
            )}
          </div>
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
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = values.length > 0;

  const toggleTruckType = (truckValue: string) => {
    if (values.includes(truckValue)) {
      onChange(values.filter((v) => v !== truckValue));
    } else {
      onChange([...values, truckValue]);
    }
  };

  const removeTruckType = (truckValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(values.filter((v) => v !== truckValue));
  };

  const getTruckLabel = (value: string) => {
    const truck = TRUCK_TYPES.find((t) => t.value === value);
    return truck
      ? `(${truck.value}) ${lang === "fr" ? truck.labelFr : truck.labelEn}`
      : value;
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: isActive ? P_LIGHT : "#fff",
          border: `1.5px solid ${isActive ? P : BORDER}`,
          borderRadius: "8px",
          padding: "8px 12px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: isActive ? 600 : 400,
          color: isActive ? P : MUTED,
          whiteSpace: "nowrap",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.borderColor = P;
            e.currentTarget.style.color = TEXT;
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.borderColor = BORDER;
            e.currentTarget.style.color = MUTED;
          }
        }}
      >
        {values.length === 0 ? (
          lang === "fr" ? (
            "Type de camion"
          ) : (
            "Truck Type"
          )
        ) : (
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {values.length}{" "}
            {lang === "fr"
              ? values.length === 1
                ? "sélectionné"
                : "sélectionnés"
              : values.length === 1
                ? "selected"
                : "selected"}
          </span>
        )}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0)",
          }}
        >
          <path
            d="M2 3l3 4 3-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 50,
            backgroundColor: "#fff",
            borderRadius: "10px",
            border: `1px solid ${BORDER}`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            overflow: "hidden",
            minWidth: "220px",
            maxHeight: "320px",
            overflowY: "auto",
          }}
        >
          <div style={{ padding: "10px", borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: MUTED }}>
              {lang === "fr"
                ? "Sélectionner les types de camion"
                : "Select truck types"}
            </span>
          </div>
          {TRUCK_TYPES.map((opt) => {
            const isSelected = values.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleTruckType(opt.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  textAlign: "left",
                  background: isSelected ? P_LIGHT : "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? P : TEXT,
                  transition: "background 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "4px",
                    border: `1.5px solid ${isSelected ? P : BORDER}`,
                    backgroundColor: isSelected ? P : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5l2 2 4-4"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                ({opt.value}) {lang === "fr" ? opt.labelFr : opt.labelEn}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "#fff",
          border: `1.5px solid ${BORDER}`,
          borderRadius: "8px",
          padding: "8px 12px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 400,
          color: MUTED,
          whiteSpace: "nowrap",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = P;
          e.currentTarget.style.color = TEXT;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = BORDER;
          e.currentTarget.style.color = MUTED;
        }}
      >
        Sort by: {value}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0)",
          }}
        >
          <path
            d="M2 3l3 4 3-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 50,
            backgroundColor: "#fff",
            borderRadius: "10px",
            border: `1px solid ${BORDER}`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            overflow: "hidden",
            minWidth: "160px",
          }}
        >
          {SORT_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => {
                onChange(key);
                setOpen(false);
              }}
              style={{
                width: "100%",
                padding: "10px 14px",
                textAlign: "left",
                background: value === key ? P_LIGHT : "none",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: value === key ? 700 : 500,
                color: value === key ? P : TEXT,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (value !== key)
                  e.currentTarget.style.backgroundColor = "#f9fafb";
              }}
              onMouseLeave={(e) => {
                if (value !== key)
                  e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {key}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function RouteFilterBar({
  filters,
  onChange,
  onClear,
}: RouteFilterBarProps) {
  const { lang } = useLang();

  const tripTypeOptions: [RouteFilterValues["tripType"], string][] =
    lang === "fr"
      ? [
          ["", "Tous"],
          ["aller", "→ Aller"],
          ["aller-retour", "⇄ A-R"],
        ]
      : [
          ["", "All"],
          ["aller", "→ One Way"],
          ["aller-retour", "⇄ Round Trip"],
        ];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px 11px 38px",
    border: `1.5px solid ${BORDER}`,
    borderRadius: "10px",
    fontSize: "14px",
    color: TEXT,
    backgroundColor: "#fff",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  };

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "16px",
    height: "16px",
    pointerEvents: "none",
  };

  const [showDateCalendar, setShowDateCalendar] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [datePopoverRect, setDatePopoverRect] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLElement | null>(null);
  const datePopoverRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [popoverWidth, setPopoverWidth] = useState(620);

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setPopoverWidth(mobile ? Math.min(window.innerWidth - 48, 420) : 620);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const rightMonth = calMonth === 11 ? 0 : calMonth + 1;
  const rightYear = calMonth === 11 ? calYear + 1 : calYear;

  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setShowDateCalendar(false);

      onChange("start_date", formatDate(date));
    },
    [onChange],
  );

  const openDateCalendar = useCallback((el: HTMLElement | null) => {
    if (!el) {
      setDatePopoverRect({ top: 120, left: 12 });
      setDateAnchorEl(null);
    } else {
      const r = el.getBoundingClientRect();
      const w =
        window.innerWidth < 768 ? Math.min(window.innerWidth - 48, 420) : 620;
      setDatePopoverRect({
        top: r.bottom + 8,
        left: Math.max(12, Math.min(r.left, window.innerWidth - w - 12)),
      });
      setDateAnchorEl(el);
    }
    setShowDateCalendar(true);
  }, []);

  useEffect(() => {
    if (!showDateCalendar) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (datePopoverRef.current?.contains(target)) return;
      if (dateAnchorEl?.contains(target)) return;
      setShowDateCalendar(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showDateCalendar, dateAnchorEl]);

  const applyDateRange = useCallback(
    (date: Date | null) => {
      if (!date) {
        onChange("start_date", "");
        return;
      }
      onChange("start_date", formatDate(date));
    },
    [onChange],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {}

      {}
      <div
        style={{
          display: isMobile ? "none" : "grid",
          gridTemplateColumns: "1fr 1fr 1fr auto",
          gap: "12px",
          alignItems: "center",
        }}
      >
        {}
        <MultiWilayaDropdown
          values={filters.origin}
          onChange={(v) => onChange("origin", v)}
          placeholder="Origin"
          icon={
            <svg style={iconStyle} viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="7" r="3.5" stroke={MUTED} strokeWidth="1.6" />
              <path
                d="M8 10.5v4"
                stroke={MUTED}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          }
        />

        {}
        <MultiWilayaDropdown
          values={filters.destination}
          onChange={(v) => onChange("destination", v)}
          placeholder="Destination"
          icon={
            <svg style={iconStyle} viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h9M8 4l5 4-5 4"
                stroke={MUTED}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />

        {}
        <div style={{ position: "relative" }}>
          <svg style={iconStyle} viewBox="0 0 16 16" fill="none">
            <rect
              x="1"
              y="3"
              width="14"
              height="12"
              rx="2"
              stroke={MUTED}
              strokeWidth="1.6"
            />
            <path d="M1 7h14" stroke={MUTED} strokeWidth="1.6" />
            <path
              d="M5 1v4M11 1v4"
              stroke={MUTED}
              strokeWidth="1.6"
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
            }}
            title="Availability Date"
            onClick={(e) =>
              showDateCalendar
                ? setShowDateCalendar(false)
                : openDateCalendar(e.currentTarget)
            }
          >
            {selectedDate ? (
              <span style={{ fontSize: "14px", color: TEXT, fontWeight: 600 }}>
                {formatDate(selectedDate)}
              </span>
            ) : (
              <span style={{ fontSize: "14px", color: MUTED, fontWeight: 400 }}>
                Availability Date
              </span>
            )}
          </div>
        </div>
      </div>

      {}
      {!isMobile && (
        <div style={{ height: "1px", backgroundColor: "#f1f5f9" }} />
      )}

      {}
      <div
        style={{
          display: isMobile ? "none" : "grid",
          gridTemplateColumns: "1fr 1fr auto",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                color: TEXT,
              }}
            >
              Weight (T)
            </span>
            <span style={{ fontSize: "11px", color: MUTED, fontWeight: 500 }}>
              MIN {filters.weightMin}T – MAX {filters.weightMax}T
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
            className={SLIDER_CLASS}
          />
        </div>

        {}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                color: TEXT,
              }}
            >
              Volume (M³)
            </span>
            <span style={{ fontSize: "11px", color: MUTED, fontWeight: 500 }}>
              MIN {filters.volumeMin}M³ – MAX {filters.volumeMax}M³
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
            className={SLIDER_CLASS}
          />
        </div>

        {}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {}
          <div
            style={{
              display: "flex",
              borderRadius: "8px",
              overflow: "hidden",
              border: `1.5px solid ${filters.tripType ? P : BORDER}`,
            }}
          >
            {tripTypeOptions.map(([val, label]) => (
              <button
                key={val}
                onClick={() => onChange("tripType", val)}
                style={{
                  padding: "7px 11px",
                  fontSize: "12px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: filters.tripType === val ? P : "#fff",
                  color: filters.tripType === val ? "#111" : MUTED,
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <TruckTypeMultiDropdown
            values={filters.truckTypes}
            onChange={(v) => onChange("truckTypes", v)}
            lang={lang}
          />
          <SortDropdown
            value={filters.sortBy}
            onChange={(v) => onChange("sortBy", v)}
          />
          <button
            onClick={onClear}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
              color: MUTED,
              whiteSpace: "nowrap",
              padding: "0 4px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = TEXT;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = MUTED;
            }}
          >
            Clear All
          </button>
        </div>
      </div>

      {}
      <div
        style={{
          display: isMobile ? "flex" : "none",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <MultiWilayaDropdown
          values={filters.origin}
          onChange={(v) => onChange("origin", v)}
          placeholder="Origin"
          icon={
            <svg style={iconStyle} viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="7" r="3.5" stroke={MUTED} strokeWidth="1.6" />
              <path
                d="M8 10.5v4"
                stroke={MUTED}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          }
        />
        <MultiWilayaDropdown
          values={filters.destination}
          onChange={(v) => onChange("destination", v)}
          placeholder="Destination"
          icon={
            <svg style={iconStyle} viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h9M8 4l5 4-5 4"
                stroke={MUTED}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />

        {}
        <div style={{ position: "relative" }}>
          <svg style={iconStyle} viewBox="0 0 16 16" fill="none">
            <rect
              x="1"
              y="3"
              width="14"
              height="12"
              rx="2"
              stroke={MUTED}
              strokeWidth="1.6"
            />
            <path d="M1 7h14" stroke={MUTED} strokeWidth="1.6" />
            <path
              d="M5 1v4M11 1v4"
              stroke={MUTED}
              strokeWidth="1.6"
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
            }}
            title="Availability Date"
            onClick={(e) =>
              showDateCalendar
                ? setShowDateCalendar(false)
                : openDateCalendar(e.currentTarget)
            }
          >
            {selectedDate ? (
              <span style={{ fontSize: "14px", color: TEXT, fontWeight: 600 }}>
                {formatDate(selectedDate)}
              </span>
            ) : (
              <span style={{ fontSize: "14px", color: MUTED, fontWeight: 400 }}>
                Availability Date
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                color: TEXT,
              }}
            >
              Weight (T)
            </span>
            <span style={{ fontSize: "11px", color: MUTED }}>
              MIN {filters.weightMin}T – MAX {filters.weightMax}T
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
            className={SLIDER_CLASS}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                color: TEXT,
              }}
            >
              Volume (M³)
            </span>
            <span style={{ fontSize: "11px", color: MUTED }}>
              MIN {filters.volumeMin}M³ – MAX {filters.volumeMax}M³
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
            className={SLIDER_CLASS}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {}
          <div
            style={{
              display: "flex",
              borderRadius: "8px",
              overflow: "hidden",
              border: `1.5px solid ${filters.tripType ? P : BORDER}`,
            }}
          >
            {tripTypeOptions.map(([val, label]) => (
              <button
                key={val}
                onClick={() => onChange("tripType", val)}
                style={{
                  padding: "7px 10px",
                  fontSize: "11px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: filters.tripType === val ? P : "#fff",
                  color: filters.tripType === val ? "#111" : MUTED,
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <TruckTypeMultiDropdown
            values={filters.truckTypes}
            onChange={(v) => onChange("truckTypes", v)}
            lang={lang}
          />
          <SortDropdown
            value={filters.sortBy}
            onChange={(v) => onChange("sortBy", v)}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onClear}
            style={{
              flex: 1,
              border: `1.5px solid ${BORDER}`,
              borderRadius: "10px",
              padding: "11px",
              fontSize: "13px",
              fontWeight: 600,
              color: MUTED,
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Clear All
          </button>
        </div>
      </div>

      {}
      {showDateCalendar && datePopoverRect && (
        <div
          ref={datePopoverRef}
          style={{
            position: "fixed",
            top: isMobile ? "50%" : datePopoverRect.top,
            left: isMobile ? "50%" : datePopoverRect.left,
            transform: isMobile ? "translate(-50%, -50%)" : undefined,
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            padding: "20px",
            width: popoverWidth,
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
              startDate={selectedDate}
              endDate={null}
              hoveredDate={hoveredDate}
              onHover={setHoveredDate}
              onSelect={handleDateSelect}
              lang={"en"}
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
                startDate={selectedDate}
                endDate={null}
                hoveredDate={hoveredDate}
                onHover={setHoveredDate}
                onSelect={handleDateSelect}
                lang={"en"}
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
                startDate={selectedDate}
                endDate={null}
                hoveredDate={hoveredDate}
                onHover={setHoveredDate}
                onSelect={handleDateSelect}
                lang={"en"}
              />
            </div>
          )}

          {}
          <div
            style={{
              borderTop: `1px solid ${BORDER}`,
              marginTop: "16px",
              paddingTop: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                border: `1.5px solid ${selectedDate ? P : BORDER}`,
                borderRadius: "10px",
                fontSize: "13px",
                color: selectedDate ? P_DARK : MUTED,
                fontWeight: selectedDate ? 600 : 400,
                minWidth: "110px",
                textAlign: "center",
                backgroundColor: selectedDate ? P_LIGHT : "white",
              }}
            >
              {selectedDate ? formatDate(selectedDate) : "—"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
