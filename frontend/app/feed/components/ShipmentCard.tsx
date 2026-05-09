"use client";

import { useState } from "react";
import type { Shipment } from "@/lib/mock-data";
import { fmtWeight, fmtVolume, fmtPostedAgoFromDate } from "@/lib/mock-data";
import { useLang } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getShipmentTypeLabel,
  getShipmentTypeColor,
  SHIPMENT_TYPES,
  normalizeShipmentType,
} from "@/app/constants/shipment-types";
import {
  getTruckTypeLabel,
  getTruckTypeColor,
  TRUCK_TYPES,
  normalizeTruckType,
} from "@/app/constants/truck-types";
import { getWilayaDisplayName } from "@/app/constants/wilayas";

const translations = {
  en: {
    badge: "Shipment",
    moreDetails: "More Details",
    reserve: "Reserve",
    reserved: "Reserved",
    date: "Date",
    truckType: "Truck",
    productType: "Product",
    tonnage: "Tonnage",
    volume: "Volume",
    postedBy: "Posted by",
    phone: "Phone",
    from: "From",
    to: "To",
    delete: "Delete",
  },
  fr: {
    badge: "Expédition",
    moreDetails: "Plus de détails",
    reserve: "Réserver",
    reserved: "Réservé",
    date: "Date",
    truckType: "Camion",
    productType: "Produit",
    tonnage: "Tonnage",
    volume: "Volume",
    postedBy: "Publié par",
    phone: "Téléphone",
    from: "Départ",
    to: "Arrivée",
    delete: "Supprimer",
  },
};

function InfoCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: 0 }}>
      <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "4px" }}>
        {icon}
        {label}
      </span>
      <div style={{ fontSize: "12px", fontWeight: 700, color: "#111", lineHeight: 1.4 }}>
        {value}
      </div>
    </div>
  );
}

const CalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="2.5" width="12" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.5" />
    <path d="M1 6h12" stroke="#9ca3af" strokeWidth="1.5" />
    <path d="M4.5 1v3M9.5 1v3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const TruckIcon = () => (
  <svg width="13" height="11" viewBox="0 0 16 14" fill="none">
    <rect x="1" y="3" width="9" height="7" rx="1.5" stroke="#9ca3af" strokeWidth="1.4" />
    <path d="M10 5h2.5L14 8v2h-4V5z" stroke="#9ca3af" strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="3.5" cy="11" r="1.5" stroke="#9ca3af" strokeWidth="1.3" />
    <circle cx="11.5" cy="11" r="1.5" stroke="#9ca3af" strokeWidth="1.3" />
  </svg>
);

const WeightIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <path d="M7 1L13 5v4L7 13 1 9V5L7 1z" stroke="#7C3AED" strokeWidth="1.5" />
  </svg>
);

const VolumeIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="4" width="10" height="8" rx="1.5" stroke="#7C3AED" strokeWidth="1.4" />
    <path d="M4 4V3a3 3 0 016 0v1" stroke="#7C3AED" strokeWidth="1.4" />
  </svg>
);

const UserIcon = ({ white = false }: { white?: boolean }) => (
  <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
    <circle cx="6.5" cy="4.5" r="2.5" stroke={white ? "#fff" : "#9ca3af"} strokeWidth="1.3" />
    <path d="M1.5 11.5a5 5 0 0110 0" stroke={white ? "#fff" : "#9ca3af"} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const BoxIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <path d="M7 1l6 3v6L7 13 1 10V4L7 1z" stroke="#9ca3af" strokeWidth="1.3" />
    <path d="M7 1v12M1 4l6 3 6-3" stroke="#9ca3af" strokeWidth="1.3" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 3.5a2 2 0 012-2h1.5l2 3.5-2 1.5a7 7 0 003.5 3.5l1.5-2 3.5 2v1.5a2 2 0 01-2 2h-.5a6.5 6.5 0 01-6.5-6.5V4" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface ShipmentCardProps {
  shipment: Shipment;
  onDelete?: (id: number) => void;
  isAdminView?: boolean;
}

export function ShipmentCard({ shipment, onDelete, isAdminView = false }: ShipmentCardProps) {
  const { lang } = useLang();
  const t = translations[lang];
  const router = useRouter();
  const { role, userId } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userRoutes, setUserRoutes] = useState<any[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  }
  const currentUser = getCurrentUser()
  const userRole = currentUser?.user_type || currentUser?.role
  const userIdFromStorage = currentUser?.id

  const canDelete = isAdminView || userRole === "ADMIN" || userRole === "admin" || (userIdFromStorage && userIdFromStorage === (shipment as any).created_by);
  const showReserve = !isAdminView;

  const productTypeRaw = (shipment as any).shipment_type;
  const normalizedProductType = normalizeShipmentType(productTypeRaw);
  const validShipmentType = normalizedProductType && SHIPMENT_TYPES.some(t => t.value === normalizedProductType) ? normalizedProductType : null;
  const shipmentColor = validShipmentType ? getShipmentTypeColor(validShipmentType) : null;

  const rawTruckType = shipment.truck_type;
  const normalizedTruckType = normalizeTruckType(rawTruckType ?? "");
  const validTruckType = normalizedTruckType && TRUCK_TYPES.some(t => t.value === normalizedTruckType) ? normalizedTruckType : null;
  const truckColor = validTruckType ? getTruckTypeColor(validTruckType) : null;

  const formatDisplayDate = (d: string) => {
    if (!d) return "";
    const [year, month, day] = d.slice(0, 10).split("-");
    return `${day} / ${month} / ${year}`;
  };

  const formatDateRange = (range: string) => {
    if (!range) return "—";
    return range.split(" to ").map(formatDisplayDate).join(" → ");
  };

  const handleDelete = async () => {
    if (deleting) return;
    if (!confirm(t.delete + " this shipment? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipments/${shipment.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Failed to delete");
        return;
      }
      onDelete?.(shipment.id);
    } catch {
      alert("Failed to delete shipment");
    } finally {
      setDeleting(false);
    }
  };

  const handleReserve = async () => {
    setShowModal(true);
    setSuccessMessage("");
    setError("");
    setIsLoadingRoutes(true);
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/routes/my-routes`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch routes");
      const data = await response.json();
      setUserRoutes(data.routes || []);
    } catch (err: any) {
      setError(err.message || "Error fetching routes");
    } finally {
      setIsLoadingRoutes(false);
    }
  };

  const handleSelectRoute = async (routeId: string) => {
    setIsReserving(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/routes/${routeId}/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ shipment_id: shipment.id }),
        },
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 409) {
          throw new Error("This shipment is already assigned to another route");
        }
        throw new Error(errorData.message || "Failed to reserve shipment");
      }
      setIsReserved(true);
      setSuccessMessage(t.reserved + " successfully!");
    } catch (err: any) {
      setError(err.message || "Error reserving shipment");
    } finally {
      setIsReserving(false);
    }
  };

  const handleCloseModal = () => {
    if (successMessage === "") setShowModal(false);
  };

  return (
    <>
      {}
      <div
        className="hidden md:block"
        style={{
          backgroundColor: "#fff",
          border: "1.5px solid #e5e7eb",
          borderRadius: "14px",
          overflow: "hidden",
          transition: "box-shadow 0.2s, border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.12)";
          e.currentTarget.style.borderColor = "#c4b5fd";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "#e5e7eb";
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "14px 18px", borderBottom: "1px solid #f3f4f6" }}>
          <span style={{ flexShrink: 0, backgroundColor: "#7C3AED", color: "#fff", fontSize: "10px", fontWeight: 800, letterSpacing: "0.8px", padding: "4px 10px", borderRadius: "999px", textTransform: "uppercase", marginTop: "2px" }}>
            {t.badge}
          </span>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#111", lineHeight: 1.3, marginBottom: "6px" }}>
              {shipment.title}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#7C3AED", flexShrink: 0 }} />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>{getWilayaDisplayName(shipment.origin)}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                <div style={{ width: "16px", height: "2px", backgroundColor: "#e5e7eb" }} />
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4h6M4 1l3 3-3 3" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#B8FF00", border: "1.5px solid #d1fae5", flexShrink: 0 }} />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>{getWilayaDisplayName(shipment.destination)}</span>
              </div>
            </div>
          </div>

          <div style={{ flexShrink: 0, textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
            <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 500 }}>{fmtPostedAgoFromDate(shipment.created_at)}</span>
            {shipment.company && (
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <UserIcon white />
                </div>
                <div>
                  <div style={{ fontSize: "9px", color: "#9ca3af", fontWeight: 500, textAlign: "left" }}>{t.postedBy}</div>
                  <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600 }}>{shipment.company}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", padding: "12px 18px" }}>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "12px 20px" }}>
            <InfoCell icon={<CalIcon />} label={t.date} value={formatDateRange(shipment.dateRange) || (shipment.created_at ? formatDisplayDate(shipment.created_at) : "—")} />

            <InfoCell
              icon={<BoxIcon />}
              label={t.productType}
              value={
                validShipmentType && shipmentColor ? (
                  <span style={{ display: "inline-block", backgroundColor: shipmentColor.bg, color: shipmentColor.text, fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", border: `1px solid ${shipmentColor.border}`, whiteSpace: "nowrap" }}>
                    {getShipmentTypeLabel(validShipmentType, lang)}
                  </span>
                ) : <span style={{ color: "#9ca3af" }}>—</span>
              }
            />

            <InfoCell
              icon={<TruckIcon />}
              label={t.truckType}
              value={
                validTruckType && truckColor ? (
                  <span style={{ display: "inline-block", backgroundColor: truckColor.bg, color: truckColor.text, fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", border: `1px solid ${truckColor.border}`, whiteSpace: "nowrap" }}>
                    {getTruckTypeLabel(validTruckType, lang)}
                  </span>
                ) : <span style={{ color: "#9ca3af" }}>—</span>
              }
            />

            <InfoCell icon={<WeightIcon />} label={t.tonnage} value={shipment.weight != null ? fmtWeight(shipment.weight) : "—"} />
            <InfoCell icon={<VolumeIcon />} label={t.volume} value={shipment.volume != null ? fmtVolume(shipment.volume) : "—"} />
            {shipment.phone_number && (
              <InfoCell
                icon={<PhoneIcon />}
                label={t.phone}
                value={<span style={{ color: "#7C3AED", fontWeight: 700 }}>{shipment.phone_number}</span>}
              />
            )}
          </div>

          <div style={{ marginLeft: "20px", flexShrink: 0, display: "flex", gap: "10px", alignItems: "center" }}>
            {canDelete && (
              <button onClick={handleDelete} disabled={deleting} title={t.delete} style={{ padding: "8px 10px", borderRadius: "8px", border: "1.5px solid #FEE2E2", background: "#FEE2E2", color: "#DC2626", cursor: deleting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: deleting ? 0.6 : 1 }}>
                {deleting ? "..." : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M12 4v11H4V4M5 4V2h6v2M7 7v6M9 7v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </button>
            )}
            {showReserve && (
              <button
                style={{ display: "flex", alignItems: "center", gap: "6px", border: `1.5px solid ${isReserved ? "#D1D5DB" : "#7C3AED"}`, borderRadius: "8px", padding: "8px 14px", background: isReserved ? "#F3F4F6" : "#7C3AED", fontSize: "11px", fontWeight: 800, color: isReserved ? "#6B7280" : "#fff", cursor: isReserved ? "default" : "pointer", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.6px", opacity: isReserving ? 0.7 : 1 }}
                onClick={handleReserve} disabled={isReserving || isReserved}
              >
                {isReserving ? "..." : isReserved ? t.reserved : t.reserve}
              </button>
            )}
            <button
              style={{ display: "flex", alignItems: "center", gap: "6px", border: "1.5px solid #7C3AED", borderRadius: "8px", padding: "8px 14px", background: "#7C3AED", fontSize: "11px", fontWeight: 800, color: "#fff", cursor: "pointer", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.6px" }}
              onClick={() => router.push(`/shipment-listing/${shipment.id}`)}
            >
              {t.moreDetails}
              <svg width="10" height="10" viewBox="0 0 11 11" fill="none"><path d="M2 9L9 2M9 2H4M9 2v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </div>

      {}
      <div className="flex md:hidden flex-col" style={{ backgroundColor: "#fff", border: "1.5px solid #e5e7eb", borderRadius: "14px", padding: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ backgroundColor: "#7C3AED", color: "#fff", fontSize: "10px", fontWeight: 800, letterSpacing: "0.8px", padding: "3px 10px", borderRadius: "999px", textTransform: "uppercase" }}>{t.badge}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 500 }}>{fmtPostedAgoFromDate(shipment.created_at)}</span>
            {shipment.company && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="3.5" r="2" stroke="#fff" strokeWidth="1" /><path d="M1.5 8.5a3.5 3.5 0 017 0" stroke="#fff" strokeWidth="1" strokeLinecap="round" /></svg>
                </div>
                <span style={{ fontSize: "10px", color: "#374151", fontWeight: 500 }}>{shipment.company}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ fontSize: "16px", fontWeight: 800, color: "#111", marginBottom: "12px", lineHeight: 1.3 }}>{shipment.title}</div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0", flexShrink: 0, marginTop: "4px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#7C3AED" }} />
            <div style={{ width: "2px", height: "22px", backgroundColor: "#d1d5db" }} />
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#B8FF00" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#111" }}>{getWilayaDisplayName(shipment.origin)}</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#111" }}>{getWilayaDisplayName(shipment.destination)}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", padding: "10px 0", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6", marginBottom: "12px" }}>
          <InfoCell icon={<CalIcon />} label={t.date} value={formatDateRange(shipment.dateRange) || (shipment.created_at ? formatDisplayDate(shipment.created_at) : "—")} />

          <InfoCell
            icon={<BoxIcon />}
            label={t.productType}
            value={validShipmentType && shipmentColor ? (
              <span style={{ display: "inline-block", backgroundColor: shipmentColor.bg, color: shipmentColor.text, fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "16px", border: `1px solid ${shipmentColor.border}` }}>
                {getShipmentTypeLabel(validShipmentType, lang)}
              </span>
            ) : <span style={{ color: "#9ca3af" }}>—</span>}
          />

          <InfoCell
            icon={<TruckIcon />}
            label={t.truckType}
            value={validTruckType && truckColor ? (
              <span style={{ display: "inline-block", backgroundColor: truckColor.bg, color: truckColor.text, fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "16px", border: `1px solid ${truckColor.border}` }}>
                {getTruckTypeLabel(validTruckType, lang)}
              </span>
            ) : <span style={{ color: "#9ca3af" }}>—</span>}
          />

          <InfoCell icon={<WeightIcon />} label={t.tonnage} value={fmtWeight(shipment.weight)} />
          <InfoCell icon={<VolumeIcon />} label={t.volume} value={fmtVolume(shipment.volume)} />
          {shipment.phone_number && (
            <InfoCell
              icon={<PhoneIcon />}
              label={t.phone}
              value={<span style={{ color: "#7C3AED", fontWeight: 700 }}>{shipment.phone_number}</span>}
            />
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            {canDelete && (
              <button onClick={handleDelete} disabled={deleting} title={t.delete} style={{ padding: "8px", borderRadius: "8px", border: "1.5px solid #FEE2E2", background: "#FEE2E2", color: "#DC2626", cursor: deleting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: deleting ? 0.6 : 1 }}>
                {deleting ? "..." : <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M12 4v11H4V4M5 4V2h6v2M7 7v6M9 7v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </button>
            )}
            {showReserve && (
              <button style={{ display: "flex", alignItems: "center", gap: "4px", border: `1.5px solid ${isReserved ? "#D1D5DB" : "#7C3AED"}`, borderRadius: "8px", padding: "6px 10px", background: isReserved ? "#F3F4F6" : "#7C3AED", fontSize: "10px", fontWeight: 800, color: isReserved ? "#6B7280" : "#fff", cursor: isReserved ? "default" : "pointer", whiteSpace: "nowrap", textTransform: "uppercase", opacity: isReserving ? 0.7 : 1 }} onClick={handleReserve} disabled={isReserving || isReserved}>
                {isReserving ? "..." : isReserved ? t.reserved : t.reserve}
              </button>
            )}
            <button style={{ display: "flex", alignItems: "center", gap: "4px", border: "1.5px solid #7C3AED", borderRadius: "8px", padding: "6px 10px", background: "#7C3AED", fontSize: "10px", fontWeight: 800, color: "#fff", cursor: "pointer", whiteSpace: "nowrap", textTransform: "uppercase" }} onClick={() => router.push(`/shipment-listing/${shipment.id}`)}>
              {t.moreDetails}
              <svg width="8" height="8" viewBox="0 0 11 11" fill="none"><path d="M2 9L9 2M9 2H4M9 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
        {error && <div style={{ marginTop: "8px", fontSize: "11px", color: "#dc2626", textAlign: "center" }}>{error}</div>}
      </div>

      {}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={handleCloseModal}>
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px", maxWidth: "700px", width: "90%", maxHeight: "80vh", overflow: "auto", border: "1.5px solid #e5e7eb" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#111" }}>{successMessage ? t.reserved : "Select a Route"}</h3>
              {!successMessage && <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#9ca3af" }}></button>}
            </div>
            {successMessage && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", backgroundColor: "#ecfdf5", borderRadius: "8px", marginBottom: "20px", border: "1.5px solid #a7f3d0" }}>
                <span style={{ color: "#059669", fontWeight: 600 }}>{successMessage}</span>
                <button onClick={() => setShowModal(false)} style={{ background: "#059669", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", fontSize: "11px", fontWeight: 700 }}>Close</button>
              </div>
            )}
            {isLoadingRoutes && !successMessage && <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>Loading...</div>}
            {error && !isLoadingRoutes && !successMessage && <div style={{ backgroundColor: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: "8px", padding: "12px", color: "#dc2626", fontSize: "12px", marginBottom: "20px" }}>{error}</div>}
            {!isLoadingRoutes && !successMessage && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {userRoutes.length === 0 ? <div style={{ textAlign: "center", padding: "20px", color: "#9ca3af" }}>No routes available</div> : userRoutes.map((route: any) => (
                  <div key={route.id} style={{ backgroundColor: "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                        <span style={{ fontSize: "12px", fontWeight: 800, color: "#111" }}>{getWilayaDisplayName(route.origin)}</span>
                        <div style={{ width: "20px", height: "2px", backgroundColor: "#e5e7eb" }} />
                        <svg width="10" height="10" viewBox="0 0 8 8" fill="none"><path d="M1 4h6M4 1l3 3-3 3" stroke="#9ca3af" strokeWidth="1.2" /></svg>
                        <div style={{ width: "20px", height: "2px", backgroundColor: "#e5e7eb" }} />
                        <span style={{ fontSize: "12px", fontWeight: 800, color: "#111" }}>{getWilayaDisplayName(route.destination)}</span>
                      </div>
                      <span style={{ fontSize: "10px", color: "#9ca3af" }}>{route.created_at ? fmtPostedAgoFromDate(route.created_at) : "—"}</span>
                    </div>
                    <button onClick={() => handleSelectRoute(route.id)} disabled={isReserving} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", border: "1.5px solid #B8FF00", borderRadius: "8px", padding: "8px 12px", background: "#B8FF00", fontSize: "10px", fontWeight: 800, color: "#111", cursor: isReserving ? "default" : "pointer", textTransform: "uppercase", opacity: isReserving ? 0.6 : 1 }}>
                      {isReserving ? "..." : "Select"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}