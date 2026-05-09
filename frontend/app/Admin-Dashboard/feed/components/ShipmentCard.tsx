"use client";

import { useState } from "react";
import type { Shipment } from "@/lib/mock-data";
import { fmtWeight, fmtVolume, fmtPostedAgoFromDate } from "@/lib/mock-data";
import { useLang } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { getShipmentTypeLabel, getShipmentTypeColor } from "@/app/constants/shipment-types";
import { getTruckTypeLabel, getTruckTypeColor } from "@/app/constants/truck-types";

const translations = {
  en: { badge: "Shipment", moreDetails: "More Details", reserve: "Reserve", reserved: "Reserved" },
  fr: { badge: "Expédition", moreDetails: "Plus de détails", reserve: "Réserver", reserved: "Réservé" },
};

export function ShipmentCard({ shipment }: { shipment: Shipment }) {
  const { lang } = useLang();
  const t = translations[lang];
  const router = useRouter();

  const [isReserving, setIsReserving] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [error, setError] = useState("");

  const handleReserve = async () => {
    setIsReserving(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/routes/${shipment.id}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ id: shipment.id }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 409) {
          throw new Error("This shipment is already assigned to another route");
        }
        throw new Error(errorData.message || "Failed to reserve shipment");
      }
      setIsReserved(true);
    } catch (err: any) {
      setError(err.message || "Error reserving shipment");
    } finally {
      setIsReserving(false);
    }
  };

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
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.10)";
          e.currentTarget.style.borderColor = "#c4b5fd";
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
          {fmtPostedAgoFromDate(shipment.created_at)}
        </span>

        {}
        <div
          style={{
            minWidth: "200px",
            paddingRight: "24px",
            borderRight: "1px solid #f0f0f0",
          }}
        >
          <span
            style={{
              display: "inline-block",
              backgroundColor: "#7C3AED",
              color: "#fff",
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
              fontSize: "15px",
              fontWeight: 700,
              color: "#111",
              lineHeight: 1.3,
            }}
          >
            {shipment.title}
          </div>
        </div>

        {}
        <div
          style={{
            minWidth: "140px",
            padding: "0 16px",
            borderRight: "1px solid #f0f0f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#7C3AED",
                  border: "2px solid #e5e7eb",
                }}
              />
              <div
                style={{
                  width: "1.5px",
                  height: "18px",
                  backgroundColor: "#d1d5db",
                }}
              />
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#B8FF00",
                  border: "2px solid #e5e7eb",
                }}
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <span
                style={{ fontSize: "13px", fontWeight: 600, color: "#111" }}
              >
                {shipment.origin}
              </span>
              <span
                style={{ fontSize: "13px", fontWeight: 600, color: "#111" }}
              >
                {shipment.destination}
              </span>
            </div>
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
            lineHeight: "20px",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
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
            {shipment.dateRange}
          </span>
        </div>

        {}
        <div
          style={{
            minWidth: "70px",
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
              stroke="#9ca3af"
              strokeWidth="1.4"
            />
          </svg>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>
            {fmtWeight(shipment.weight)}
          </span>
        </div>

        {}
        <div
          style={{
            minWidth: "70px",
            padding: "0 16px",
            borderRight: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <rect
              x="2"
              y="4"
              width="10"
              height="8"
              rx="1.5"
              stroke="#9ca3af"
              strokeWidth="1.4"
            />
            <path d="M4 4V3a3 3 0 016 0v1" stroke="#9ca3af" strokeWidth="1.4" />
          </svg>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>
            {fmtVolume(shipment.volume)}
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
          {shipment.truck_type ? (
            <span
              style={{
                display: "inline-block",
                backgroundColor: getTruckTypeColor(shipment.truck_type).bg,
                color: getTruckTypeColor(shipment.truck_type).text,
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "4px",
                border: `1px solid ${getTruckTypeColor(shipment.truck_type).border || "transparent"}`,
                whiteSpace: "nowrap",
              }}
            >
              ({shipment.truck_type}) {getTruckTypeLabel(shipment.truck_type, lang)}
            </span>
          ) : (
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#9ca3af" }}>—</span>
          )}
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
          {shipment.shipment_type ? (
            <span
              style={{
                display: "inline-block",
                backgroundColor: getShipmentTypeColor(shipment.shipment_type).bg,
                color: getShipmentTypeColor(shipment.shipment_type).text,
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "4px",
                border: `1px solid ${getShipmentTypeColor(shipment.shipment_type).border || "transparent"}`,
                whiteSpace: "nowrap",
              }}
            >
              ({shipment.shipment_type}) {getShipmentTypeLabel(shipment.shipment_type, lang)}
            </span>
          ) : (
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#9ca3af" }}>—</span>
          )}
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
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              backgroundColor: "#f3f4f6",
              border: "1.5px solid #e5e7eb",
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
                stroke="#9ca3af"
                strokeWidth="1.3"
              />
              <path
                d="M1.5 11.5a5 5 0 0110 0"
                stroke="#9ca3af"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: "13px", color: "#374151", fontWeight: 500 }}>
            {shipment.company}
          </span>
        </div>

        {}
        <div style={{ marginLeft: "auto", paddingLeft: "16px", display: "flex", gap: "8px", flexShrink: 0 }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: isReserved ? "1.5px solid #D1D5DB" : "1.5px solid #7C3AED",
              borderRadius: "8px",
              padding: "7px 14px",
              background: isReserved ? "#F3F4F6" : "#7C3AED",
              fontSize: "12px",
              fontWeight: 700,
              color: isReserved ? "#6B7280" : "#fff",
              cursor: isReserved ? "default" : "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              opacity: isReserving ? 0.7 : 1,
            }}
            onClick={handleReserve}
            disabled={isReserving || isReserved}
            onMouseEnter={(e) => {
              if (!isReserving && !isReserved) {
                e.currentTarget.style.borderColor = "#6d28d9";
                e.currentTarget.style.background = "#6d28d9";
              }
            }}
            onMouseLeave={(e) => {
              if (!isReserving && !isReserved) {
                e.currentTarget.style.borderColor = "#7C3AED";
                e.currentTarget.style.background = "#7C3AED";
              }
            }}
          >
            {isReserving ? "..." : isReserved ? t.reserved : t.reserve}
          </button>
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
            onClick={() => router.push(`/shipment-listing/${shipment.id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#7C3AED";
              e.currentTarget.style.color = "#7C3AED";
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
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              backgroundColor: "#7C3AED",
              color: "#fff",
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
            {fmtPostedAgoFromDate(shipment.created_at)}
          </span>
        </div>

        {}
        <div
          style={{
            fontSize: "17px",
            fontWeight: 800,
            color: "#111",
            marginBottom: "14px",
            lineHeight: 1.3,
          }}
        >
          {shipment.title}
        </div>

        {}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              marginTop: "3px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#7C3AED",
              }}
            />
            <div
              style={{
                width: "1.5px",
                height: "20px",
                backgroundColor: "#d1d5db",
              }}
            />
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#B8FF00",
              }}
            />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#111" }}>
              {shipment.origin}
            </span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#111" }}>
              {shipment.destination}
            </span>
          </div>
        </div>

        {}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
            lineHeight: "20px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
              fontSize: "13px",
              fontWeight: 600,
              color: "#374151",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            {shipment.dateRange}
          </span>
        </div>

        {}
        <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1L13 5v4L7 13 1 9V5L7 1z"
                stroke="#9ca3af"
                strokeWidth="1.4"
              />
            </svg>
            <span
              style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}
            >
              {shipment.weight != null ? fmtWeight(shipment.weight) : "—"}
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
                stroke="#9ca3af"
                strokeWidth="1.4"
              />
              <path
                d="M4 4V3a3 3 0 016 0v1"
                stroke="#9ca3af"
                strokeWidth="1.4"
              />
            </svg>
            <span
              style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}
            >
              {shipment.volume != null ? fmtVolume(shipment.volume) : "—"}
            </span>
          </div>
        </div>

        {}
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
          {shipment.truck_type ? (
            <span
              style={{
                display: "inline-block",
                backgroundColor: getTruckTypeColor(shipment.truck_type).bg,
                color: getTruckTypeColor(shipment.truck_type).text,
                fontSize: "11px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "6px",
                border: `1px solid ${getTruckTypeColor(shipment.truck_type).border || "transparent"}`,
              }}
            >
              ({shipment.truck_type}) {getTruckTypeLabel(shipment.truck_type, lang)}
            </span>
          ) : (
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#9ca3af" }}>—</span>
          )}
          {shipment.shipment_type ? (
            <span
              style={{
                display: "inline-block",
                backgroundColor: getShipmentTypeColor(shipment.shipment_type).bg,
                color: getShipmentTypeColor(shipment.shipment_type).text,
                fontSize: "11px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "6px",
                border: `1px solid ${getShipmentTypeColor(shipment.shipment_type).border || "transparent"}`,
              }}
            >
              ({shipment.shipment_type}) {getShipmentTypeLabel(shipment.shipment_type, lang)}
            </span>
          ) : (
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#9ca3af" }}>—</span>
          )}
        </div>

        {}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #f0f0f0",
            paddingTop: "12px",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                backgroundColor: "#f3f4f6",
                border: "1.5px solid #e5e7eb",
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
                  stroke="#9ca3af"
                  strokeWidth="1.3"
                />
                <path
                  d="M1.5 11.5a5 5 0 0110 0"
                  stroke="#9ca3af"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span
              style={{ fontSize: "13px", color: "#374151", fontWeight: 500 }}
            >
              {shipment.company}
            </span>
          </div>
          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                border: isReserved ? "1.5px solid #D1D5DB" : "1.5px solid #7C3AED",
                borderRadius: "8px",
                padding: "6px 10px",
                background: isReserved ? "#F3F4F6" : "#7C3AED",
                fontSize: "11px",
                fontWeight: 700,
                color: isReserved ? "#6B7280" : "#fff",
                cursor: isReserved ? "default" : "pointer",
                whiteSpace: "nowrap",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                opacity: isReserving ? 0.7 : 1,
              }}
              onClick={handleReserve}
              disabled={isReserving || isReserved}
            >
              {isReserving ? "..." : isReserved ? t.reserved : t.reserve}
            </button>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                border: "1.5px solid #e5e7eb",
                borderRadius: "8px",
                padding: "6px 10px",
                background: "#fff",
                fontSize: "11px",
                fontWeight: 700,
                color: "#374151",
                cursor: "pointer",
                whiteSpace: "nowrap",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
              onClick={() => router.push(`/shipment-listing/${shipment.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#7C3AED";
                e.currentTarget.style.color = "#7C3AED";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.color = "#374151";
              }}
            >
              {t.moreDetails}
              <svg width="9" height="9" viewBox="0 0 11 11" fill="none">
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
      </div>
    </>
  );
}
