"use client";

import type { Route } from "@/lib/mock-data";
import { fmtWeight, fmtVolume, fmtPostedAgoFromDate } from "@/lib/mock-data";
import { useLang } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { getTruckTypeLabel, getTruckTypeColor } from "@/app/constants/truck-types";

const translations = {
  en: { badge: "Route", moreDetails: "More Details", available: "available" },
  fr: {
    badge: "Trajet",
    moreDetails: "Plus de détails",
    available: "disponible",
  },
};

export function RouteCard({ route }: { route: Route }) {
  const { lang } = useLang();
  const t = translations[lang];
  const router = useRouter();

  return (
    <>
      {}
      <div
        className="hidden md:flex"
        style={{
          backgroundColor: "#fff",
          border: "1.5px solid #e5e7eb",
          borderRadius: "14px",
          padding: "18px 24px",
          alignItems: "center",
          position: "relative",
          transition: "box-shadow 0.2s, border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(184,255,0,0.12)";
          e.currentTarget.style.borderColor = "#B8FF00";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "#e5e7eb";
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "12px",
            right: "16px",
            fontSize: "11px",
            color: "#9ca3af",
            fontWeight: 500,
          }}
        >
          {route.created_at ? fmtPostedAgoFromDate(route.created_at) : "—"}
        </span>

        {}
        <div
          style={{
            minWidth: "160px",
            paddingRight: "16px",
            borderRight: "1px solid #f0f0f0",
          }}
        >
          <span
            style={{
              display: "inline-block",
              backgroundColor: "#B8FF00",
              color: "#111",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.8px",
              padding: "3px 10px",
              borderRadius: "999px",
              marginBottom: "8px",
              textTransform: "uppercase",
            }}
          >
            {t.badge}
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#111" }}>
              {route.origin}
            </span>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "2px",
              }}
            >
              <div
                style={{ flex: 1, height: "2px", backgroundColor: "#e5e7eb" }}
              />
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#B8FF00",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#B8FF00",
                  flexShrink: 0,
                }}
              />
              <div
                style={{ flex: 1, height: "2px", backgroundColor: "#e5e7eb" }}
              />
            </div>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#111" }}>
              {route.destination}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "4px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                border: "2px solid #B8FF00",
                backgroundColor: "#fff",
              }}
            />
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#7C3AED",
              }}
            />
          </div>
        </div>

        {}
        <div
          style={{
            minWidth: "130px",
            padding: "0 16px",
            borderRight: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ display: "block" }}>
            <rect
              x="1"
              y="2.5"
              width="12"
              height="10"
              rx="2"
              stroke="#9ca3af"
              strokeWidth="1.4"
            />
            <path d="M1 6h12" stroke="#9ca3af" strokeWidth="1.4" />
            <path
              d="M4.5 1v3M9.5 1v3"
              stroke="#9ca3af"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            {route.created_at ? route.created_at.slice(0, 10) : "Date not sent"}
          </span>
        </div>

        {}
        <div
          style={{
            minWidth: "110px",
            padding: "0 16px",
            borderRight: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <svg width="14" height="12" viewBox="0 0 16 14" fill="none">
            <rect
              x="1"
              y="3"
              width="9"
              height="7"
              rx="1.5"
              stroke="#9ca3af"
              strokeWidth="1.4"
            />
            <path
              d="M10 5h2.5L14 8v2h-4V5z"
              stroke="#9ca3af"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <circle
              cx="3.5"
              cy="11"
              r="1.5"
              stroke="#9ca3af"
              strokeWidth="1.3"
            />
            <circle
              cx="11.5"
              cy="11"
              r="1.5"
              stroke="#9ca3af"
              strokeWidth="1.3"
            />
          </svg>
          {route.truck_type_code ? (
            <span
              style={{
                display: "inline-block",
                backgroundColor: getTruckTypeColor(route.truck_type_code).bg,
                color: getTruckTypeColor(route.truck_type_code).text,
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "4px",
                border: `1px solid ${getTruckTypeColor(route.truck_type_code).border || "transparent"}`,
                whiteSpace: "nowrap",
              }}
            >
              ({route.truck_type_code}) {getTruckTypeLabel(route.truck_type_code, lang)}
            </span>
          ) : (
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#9ca3af" }}>—</span>
          )}
        </div>

        {}
        <div
          style={{
            minWidth: "100px",
            padding: "0 16px",
            borderRight: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {(route as any).route_type ? (
            <span
              style={{
                display: "inline-block",
                backgroundColor: (route as any).route_type === "ROUND_TRIP" ? "#fef3c7" : "#e0f2fe",
                color: (route as any).route_type === "ROUND_TRIP" ? "#92400e" : "#0369a1",
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "4px",
                border: `1px solid ${(route as any).route_type === "ROUND_TRIP" ? "#fcd34d" : "#7dd3fc"}`,
                whiteSpace: "nowrap",
              }}
            >
              {(route as any).route_type === "ROUND_TRIP" ? "⇄ Round Trip" : "→ One Way"}
            </span>
          ) : (
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#9ca3af" }}>—</span>
          )}
        </div>

        {}
        <div
          style={{
            minWidth: "100px",
            padding: "0 16px",
            borderRight: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1L13 5v4L7 13 1 9V5L7 1z"
              stroke="#B8FF00"
              strokeWidth="1.4"
            />
          </svg>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>
            {route.max_weight != null ? fmtWeight(route.max_weight) : "—"}{" "}
            {t.available}
          </span>
        </div>

        {}
        <div
          style={{
            minWidth: "130px",
            padding: "0 24px",
            borderRight: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect
              x="2"
              y="4"
              width="10"
              height="8"
              rx="1.5"
              stroke="#B8FF00"
              strokeWidth="1.4"
            />
            <path d="M4 4V3a3 3 0 016 0v1" stroke="#B8FF00" strokeWidth="1.4" />
          </svg>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
            {route.max_volume != null ? fmtVolume(route.max_volume) : "—"}{" "}
            {t.available}
          </span>
        </div>

        {}
        <div
          style={{
            minWidth: "150px",
            padding: "0 24px",
            borderRight: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              backgroundColor: "#B8FF00",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle
                cx="6.5"
                cy="4.5"
                r="2.5"
                stroke="#111"
                strokeWidth="1.3"
              />
              <path
                d="M1.5 11.5a5 5 0 0110 0"
                stroke="#111"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: "13px", color: "#374151", fontWeight: 500 }}>
            {route.company}
          </span>
        </div>

        {}
        <div style={{ marginLeft: "auto", paddingLeft: "16px" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: "1.5px solid #e5e7eb",
              borderRadius: "8px",
              padding: "7px 16px",
              background: "#fff",
              fontSize: "12px",
              fontWeight: 700,
              color: "#374151",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
            onClick={() => router.push(`/route-listing/${route.id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#B8FF00";
              e.currentTarget.style.color = "#111";
              e.currentTarget.style.backgroundColor = "#f7ffe0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.color = "#374151";
              e.currentTarget.style.backgroundColor = "#fff";
            }}
          >
            {t.moreDetails}
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M2 9L9 2M9 2H4M9 2v5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {}
      <div
        className="flex md:hidden flex-col"
        style={{
          backgroundColor: "#fff",
          border: "1.5px solid #e5e7eb",
          borderRadius: "14px",
          padding: "16px",
        }}
      >
        {}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              backgroundColor: "#B8FF00",
              color: "#111",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.8px",
              padding: "3px 10px",
              borderRadius: "999px",
              textTransform: "uppercase",
            }}
          >
            {t.badge}
          </span>
          <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 500 }}>
            {fmtPostedAgoFromDate(route.created_at)}
          </span>
        </div>

        {}
        <div style={{ marginBottom: "12px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "15px", fontWeight: 800, color: "#111" }}>
              {route.origin}
            </span>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "2px",
              }}
            >
              <div
                style={{ flex: 1, height: "2px", backgroundColor: "#e5e7eb" }}
              />
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#B8FF00",
                }}
              />
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#B8FF00",
                }}
              />
              <div
                style={{ flex: 1, height: "2px", backgroundColor: "#e5e7eb" }}
              />
            </div>
            <span style={{ fontSize: "15px", fontWeight: 800, color: "#111" }}>
              {route.destination}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "4px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                border: "2px solid #B8FF00",
                backgroundColor: "#fff",
              }}
            />
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#7C3AED",
              }}
            />
          </div>
        </div>

        {}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: "block" }}>
            <rect
              x="1"
              y="2.5"
              width="12"
              height="10"
              rx="2"
              stroke="#9ca3af"
              strokeWidth="1.4"
            />
            <path d="M1 6h12" stroke="#9ca3af" strokeWidth="1.4" />
            <path
              d="M4.5 1v3M9.5 1v3"
              stroke="#9ca3af"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151", lineHeight: 1, display: "flex", alignItems: "center" }}>
            {route.created_at ? route.created_at.slice(0, 10) : "Date not sent"}
          </span>
        </div>

        {}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
            <rect
              x="1"
              y="3"
              width="9"
              height="7"
              rx="1.5"
              stroke="#9ca3af"
              strokeWidth="1.4"
            />
            <path
              d="M10 5h2.5L14 8v2h-4V5z"
              stroke="#9ca3af"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <circle
              cx="3.5"
              cy="11"
              r="1.5"
              stroke="#9ca3af"
              strokeWidth="1.3"
            />
            <circle
              cx="11.5"
              cy="11"
              r="1.5"
              stroke="#9ca3af"
              strokeWidth="1.3"
            />
          </svg>
          {route.truck_type_code ? (
            <span
              style={{
                display: "inline-block",
                backgroundColor: getTruckTypeColor(route.truck_type_code).bg,
                color: getTruckTypeColor(route.truck_type_code).text,
                fontSize: "11px",
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: "6px",
                border: `1px solid ${getTruckTypeColor(route.truck_type_code).border || "transparent"}`,
                whiteSpace: "nowrap",
              }}
            >
              ({route.truck_type_code}) {getTruckTypeLabel(route.truck_type_code, lang)}
            </span>
          ) : (
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#9ca3af" }}>—</span>
          )}
        </div>

        {}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          {(route as any).route_type ? (
            <span
              style={{
                display: "inline-block",
                backgroundColor: (route as any).route_type === "ROUND_TRIP" ? "#fef3c7" : "#e0f2fe",
                color: (route as any).route_type === "ROUND_TRIP" ? "#92400e" : "#0369a1",
                fontSize: "11px",
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: "6px",
                border: `1px solid ${(route as any).route_type === "ROUND_TRIP" ? "#fcd34d" : "#7dd3fc"}`,
                whiteSpace: "nowrap",
              }}
            >
              {(route as any).route_type === "ROUND_TRIP" ? "⇄ Round Trip" : "→ One Way"}
            </span>
          ) : (
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#9ca3af" }}>—</span>
          )}
        </div>

        {}
        <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1L13 5v4L7 13 1 9V5L7 1z"
                stroke="#B8FF00"
                strokeWidth="1.4"
              />
            </svg>
            <span
              style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}
            >
              {fmtWeight(route.max_weight || "not sent")} {t.available}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect
                x="2"
                y="4"
                width="10"
                height="8"
                rx="1.5"
                stroke="#B8FF00"
                strokeWidth="1.4"
              />
              <path
                d="M4 4V3a3 3 0 016 0v1"
                stroke="#B8FF00"
                strokeWidth="1.4"
              />
            </svg>
            <span
              style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}
            >
              {fmtVolume(route.max_volume || "not sent")} {t.available}
            </span>
          </div>
        </div>

        {}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #f0f0f0",
            paddingTop: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                backgroundColor: "#B8FF00",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle
                  cx="6.5"
                  cy="4.5"
                  r="2.5"
                  stroke="#111"
                  strokeWidth="1.3"
                />
                <path
                  d="M1.5 11.5a5 5 0 0110 0"
                  stroke="#111"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span
              style={{ fontSize: "13px", color: "#374151", fontWeight: 500 }}
            >
              {route.company}
            </span>
          </div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: "1.5px solid #e5e7eb",
              borderRadius: "8px",
              padding: "7px 12px",
              background: "#fff",
              fontSize: "11px",
              fontWeight: 700,
              color: "#374151",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
            onClick={() => router.push(`/route-listing/${route.id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#B8FF00";
              e.currentTarget.style.color = "#111";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.color = "#374151";
            }}
          >
            {t.moreDetails}
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M2 9L9 2M9 2H4M9 2v5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
