"use client";

import { useState } from "react";
import type { Route } from "@/lib/mock-data";
import { fmtWeight, fmtVolume, fmtPostedAgoFromDate } from "@/lib/mock-data";
import { useLang } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getTruckTypeLabel,
  getTruckTypeColor,
  TRUCK_TYPES,
  normalizeTruckType,
} from "@/app/constants/truck-types";
import { getWilayaDisplayName } from "@/app/constants/wilayas";

const translations = {
  en: {
    badge: "Route",
    moreDetails: "More Details",
    available: "avail.",
    date: "Departure",
    truckType: "Truck",
    tripType: "Trip Type",
    tonnage: "Tonnage",
    volume: "Volume",
    postedBy: "Posted by",
    transit: "Via",
    roundTrip: "⇄ Round Trip",
    oneWay: "→ One Way",
    delete: "Delete",
  },
  fr: {
    badge: "Trajet",
    moreDetails: "Plus de détails",
    available: "dispo.",
    date: "Départ",
    truckType: "Camion",
    tripType: "Type de trajet",
    tonnage: "Tonnage",
    volume: "Volume",
    postedBy: "Publié par",
    transit: "Via",
    roundTrip: "⇄ Aller-Retour",
    oneWay: "→ Aller Simple",
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
    <path d="M7 1L13 5v4L7 13 1 9V5L7 1z" stroke="#B8FF00" strokeWidth="1.5" />
  </svg>
);

const VolumeIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="4" width="10" height="8" rx="1.5" stroke="#B8FF00" strokeWidth="1.4" />
    <path d="M4 4V3a3 3 0 016 0v1" stroke="#B8FF00" strokeWidth="1.4" />
  </svg>
);

const UserIcon = () => (
  <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
    <circle cx="6.5" cy="4.5" r="2.5" stroke="#9ca3af" strokeWidth="1.3" />
    <path d="M1.5 11.5a5 5 0 0110 0" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const TripTypeIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <path d="M2 7h10M9 4l3 3-3 3" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DefaultTruckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="6" width="14" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.5" />
    <path d="M17 9h3l2 3v4h-5V9z" stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="7" cy="17" r="2" stroke="#9ca3af" strokeWidth="1.5" />
    <circle cx="18" cy="17" r="2" stroke="#9ca3af" strokeWidth="1.5" />
  </svg>
);

const getTruckImageUrl = (truckPictures: string[] | string | null | undefined): string | null => {
  if (!truckPictures) return null;
  if (Array.isArray(truckPictures) && truckPictures.length > 0) {
    return truckPictures[0];
  }
  if (typeof truckPictures === "string") {
    try {
      const parsed = JSON.parse(truckPictures);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch {
      return truckPictures;
    }
  }
  return null;
};

interface RouteCardProps {
  route: Route;
  onDelete?: (id: number) => void;
  isAdminView?: boolean;
}

export function RouteCard({ route, onDelete, isAdminView = false }: RouteCardProps) {
  const { lang } = useLang();
  const t = translations[lang];
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

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

  const canDelete = isAdminView || userRole === "ADMIN" || userRole === "admin" || (userIdFromStorage && userIdFromStorage === (route as any).posted_by);

  const routeTypeValue = (route as any).route_type;
  const transitWilayas: string[] = Array.isArray(route.transit_cities) ? route.transit_cities : [];
  const hasTransit = transitWilayas.length > 0;

  const rawTruckType = route.truck_type;
  const normalizedTruckType = normalizeTruckType(rawTruckType ?? "");
  const validTruckType = normalizedTruckType && TRUCK_TYPES.some(t => t.value === normalizedTruckType) ? normalizedTruckType : null;
  const truckColor = validTruckType ? getTruckTypeColor(validTruckType) : null;

  const truckImageUrl = getTruckImageUrl((route as any).truck_pictures);

  const formatDisplayDate = (d: string) => {
    if (!d) return "";
    const [year, month, day] = d.slice(0, 10).split("-");
    return `${day} / ${month} / ${year}`;
  };

  const getRouteRangeString = () => {
    const departure = (route as any).departure_date || (route as any).start_date;
    const endDate = (route as any).end_date;
    if (departure && endDate) return `${formatDisplayDate(departure)} - ${formatDisplayDate(endDate)}`;
    if (departure) return formatDisplayDate(departure);
    return "—";
  };

  const handleDelete = async () => {
    if (deleting) return;
    if (!confirm(t.delete + " this route? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/routes/${route.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Failed to delete");
        return;
      }
      onDelete?.(route.id);
    } catch {
      alert("Failed to delete route");
    } finally {
      setDeleting(false);
    }
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
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(184,255,0,0.15)";
          e.currentTarget.style.borderColor = "#B8FF00";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "#e5e7eb";
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "14px 18px", borderBottom: "1px solid #f3f4f6" }}>
          <span style={{ flexShrink: 0, backgroundColor: "#B8FF00", color: "#111", fontSize: "10px", fontWeight: 800, letterSpacing: "0.8px", padding: "4px 10px", borderRadius: "999px", textTransform: "uppercase", marginTop: "2px" }}>
            {t.badge}
          </span>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
              <span style={{ fontSize: "14px", fontWeight: 800, color: "#111" }}>
                {getWilayaDisplayName(route.origin)}
              </span>

              {}
              {hasTransit && (
                <>
                  <span style={{ color: "#d1d5db", fontWeight: 700, fontSize: "14px" }}>→</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>{t.transit}:</span>
                    {transitWilayas.map((w, i) => (
                      <span key={i} style={{ fontSize: "11px", fontWeight: 600, color: "#374151", backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "5px", padding: "2px 7px", whiteSpace: "nowrap" }}>
                        {getWilayaDisplayName(w)}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {}
              {hasTransit ? (
                <span style={{ color: "#d1d5db", fontWeight: 700, fontSize: "14px" }}>→</span>
              ) : (
                <span style={{ color: "#d1d5db", fontWeight: 700, fontSize: "14px", marginLeft: "4px", marginRight: "4px" }}>→</span>
              )}

              <span style={{ fontSize: "14px", fontWeight: 800, color: "#111" }}>
                {getWilayaDisplayName(route.destination)}
              </span>
            </div>
          </div>

          <div style={{ flexShrink: 0, textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
            <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 500 }}>{route.created_at ? fmtPostedAgoFromDate(route.created_at) : "—"}</span>
            {route.company && (
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "4px" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#B8FF00", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <UserIcon />
                </div>
                <div>
                  <div style={{ fontSize: "9px", color: "#9ca3af", fontWeight: 500, textAlign: "left" }}>{t.postedBy}</div>
                  <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600 }}>{route.company}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", padding: "12px 18px" }}>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "12px 20px" }}>
            <InfoCell icon={<CalIcon />} label={t.date} value={getRouteRangeString()} />

            <InfoCell
              icon={null}
              label={t.truckType}
              value={
                validTruckType && truckColor ? (
                  <span style={{ display: "inline-block", backgroundColor: truckColor.bg, color: truckColor.text, fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", border: `1px solid ${truckColor.border}`, whiteSpace: "nowrap" }}>
                    {getTruckTypeLabel(validTruckType, lang)}
                  </span>
                ) : <span style={{ color: "#9ca3af" }}>—</span>
              }
            />

            {routeTypeValue && (
              <InfoCell
                icon={<TripTypeIcon />}
                label={t.tripType}
                value={
                  <span style={{ display: "inline-block", backgroundColor: routeTypeValue === "ROUND_TRIP" ? "#fef3c7" : "#e0f2fe", color: routeTypeValue === "ROUND_TRIP" ? "#92400e" : "#0369a1", fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", border: `1px solid ${routeTypeValue === "ROUND_TRIP" ? "#fcd34d" : "#7dd3fc"}` }}>
                    {routeTypeValue === "ROUND_TRIP" ? t.roundTrip : t.oneWay}
                  </span>
                }
              />
            )}

            <InfoCell icon={<WeightIcon />} label={t.tonnage} value={<span>{route.max_weight != null ? fmtWeight(route.max_weight) : "—"} <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500 }}>{t.available}</span></span>} />
            <InfoCell icon={<VolumeIcon />} label={t.volume} value={<span>{route.max_volume != null ? fmtVolume(route.max_volume) : "—"} <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500 }}>{t.available}</span></span>} />
          </div>

          <div style={{ marginLeft: "20px", flexShrink: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            {canDelete && (
              <button onClick={handleDelete} disabled={deleting} title={t.delete} style={{ padding: "8px 10px", borderRadius: "8px", border: "1.5px solid #FEE2E2", background: "#FEE2E2", color: "#DC2626", cursor: deleting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: deleting ? 0.6 : 1 }}>
                {deleting ? "..." : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M12 4v11H4V4M5 4V2h6v2M7 7v6M9 7v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </button>
            )}
            <button
              style={{ display: "flex", alignItems: "center", gap: "6px", border: "1.5px solid #B8FF00", borderRadius: "8px", padding: "8px 14px", background: "#B8FF00", fontSize: "11px", fontWeight: 800, color: "#111", cursor: "pointer", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.6px" }}
              onClick={() => router.push(`/route-listing/${route.id}`)}
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
          <span style={{ backgroundColor: "#B8FF00", color: "#111", fontSize: "10px", fontWeight: 800, letterSpacing: "0.8px", padding: "3px 10px", borderRadius: "999px", textTransform: "uppercase" }}>{t.badge}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 500 }}>{fmtPostedAgoFromDate(route.created_at)}</span>
            {route.company && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#B8FF00", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <UserIcon />
                </div>
                <span style={{ fontSize: "10px", color: "#374151", fontWeight: 500 }}>{route.company}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, marginTop: "4px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", border: "2.5px solid #B8FF00", backgroundColor: "#fff" }} />
              {hasTransit && <div style={{ width: "2px", height: "14px", backgroundColor: "#e5e7eb" }} />}
              {hasTransit && <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#e5e7eb" }} />}
              <div style={{ width: "2px", height: hasTransit ? "14px" : "20px", backgroundColor: "#e5e7eb" }} />
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#7C3AED" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0", flex: 1 }}>
              <span style={{ fontSize: "15px", fontWeight: 800, color: "#111", lineHeight: "20px" }}>{getWilayaDisplayName(route.origin)}</span>
              {hasTransit && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap", padding: "10px 0 8px" }}>
                  <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>{t.transit}:</span>
                  {transitWilayas.map((w, i) => (
                    <span key={i} style={{ fontSize: "11px", fontWeight: 600, color: "#374151", backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "5px", padding: "2px 7px" }}>{getWilayaDisplayName(w)}</span>
                  ))}
                </div>
              )}
              <span style={{ fontSize: "15px", fontWeight: 800, color: "#111", lineHeight: "20px", marginTop: hasTransit ? "0" : "16px" }}>{getWilayaDisplayName(route.destination)}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", padding: "10px 0", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6", marginBottom: "12px" }}>
          <InfoCell icon={<CalIcon />} label={t.date} value={getRouteRangeString()} />

          <InfoCell
            icon={null}
            label={t.truckType}
            value={
              validTruckType && truckColor ? (
                <span style={{ display: "inline-block", backgroundColor: truckColor.bg, color: truckColor.text, fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "16px", border: `1px solid ${truckColor.border}` }}>
                  {getTruckTypeLabel(validTruckType, lang)}
                </span>
              ) : <span style={{ color: "#9ca3af" }}>—</span>
            }
          />

          {routeTypeValue && (
            <InfoCell
              icon={<TripTypeIcon />}
              label={t.tripType}
              value={
                <span style={{ display: "inline-block", backgroundColor: routeTypeValue === "ROUND_TRIP" ? "#fef3c7" : "#e0f2fe", color: routeTypeValue === "ROUND_TRIP" ? "#92400e" : "#0369a1", fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "16px", border: `1px solid ${routeTypeValue === "ROUND_TRIP" ? "#fcd34d" : "#7dd3fc"}` }}>
                  {routeTypeValue === "ROUND_TRIP" ? t.roundTrip : t.oneWay}
                </span>
              }
            />
          )}

          <InfoCell icon={<WeightIcon />} label={t.tonnage} value={fmtWeight(route.max_weight !== undefined ? route.max_weight : "not sent")} />
          <InfoCell icon={<VolumeIcon />} label={t.volume} value={fmtVolume(route.max_volume !== undefined ? route.max_volume : "not sent")} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
            {canDelete && (
              <button onClick={handleDelete} disabled={deleting} title={t.delete} style={{ padding: "8px", borderRadius: "8px", border: "1.5px solid #FEE2E2", background: "#FEE2E2", color: "#DC2626", cursor: deleting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: deleting ? 0.6 : 1 }}>
                {deleting ? "..." : <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M12 4v11H4V4M5 4V2h6v2M7 7v6M9 7v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </button>
            )}
            <button
              style={{ display: "flex", alignItems: "center", gap: "4px", border: "1.5px solid #B8FF00", borderRadius: "8px", padding: "6px 10px", background: "#B8FF00", fontSize: "10px", fontWeight: 800, color: "#111", cursor: "pointer", whiteSpace: "nowrap", textTransform: "uppercase" }}
              onClick={() => router.push(`/route-listing/${route.id}`)}
            >
              {t.moreDetails}
              <svg width="8" height="8" viewBox="0 0 11 11" fill="none"><path d="M2 9L9 2M9 2H4M9 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}