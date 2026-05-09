"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, ArrowLeft, CheckCircle, XCircle, Package, Calendar, Weight, Box } from "lucide-react";

export const dynamic = "force-dynamic";

type Coords = { lat: number; lng: number };

type Route = {
  id: string;
  origin: string;
  destination: string;
  status: string;
};

type AssignedShipment = {
  id: string | number;
  title: string;
  origin: string;
  destination: string;
  status: string;
  assignment_status?: "assigned" | "picked_up" | "delivered";
  current_lat: number | null;
  current_lng: number | null;
  from_pickup_date?: string | null;
  to_pickup_date?: string | null;
  weight?: number | null;
  volume?: number | null;
  phone_number?: string | null;
  description?: string | null;
  route_id?: string;
  route_name?: string;
  origin_lat?: number | null;
  origin_lng?: number | null;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const WILAYA_COORDS: Record<string, { lat: number; lng: number }> = {
  "algiers": { lat: 36.7538, lng: 3.0588 },
  "oran": { lat: 35.6971, lng: -0.6308 },
  "constantine": { lat: 36.3650, lng: 6.6147 },
  "annaba": { lat: 36.8028, lng: 7.7386 },
  "blida": { lat: 36.4800, lng: 2.8300 },
  "batna": { lat: 35.5559, lng: 6.1741 },
  "setif": { lat: 36.1898, lng: 5.4108 },
  "tlemcen": { lat: 34.8783, lng: -1.3150 },
  "bejaia": { lat: 36.7519, lng: 5.0556 },
  "biskra": { lat: 34.8500, lng: 5.7333 },
  "tiaret": { lat: 35.3710, lng: 1.3150 },
  "tebessa": { lat: 35.4042, lng: 8.1242 },
  "jijel": { lat: 36.8206, lng: 5.7667 },
  "bordj bou arreridj": { lat: 36.0732, lng: 4.7608 },
  "skikda": { lat: 36.8764, lng: 6.9092 },
  "sidi bel abbes": { lat: 35.1899, lng: -0.6308 },
  "ouargla": { lat: 31.9493, lng: 5.3240 },
  "laghouat": { lat: 33.8000, lng: 2.8833 },
  "mostaganem": { lat: 35.9310, lng: 0.0892 },
  "msila": { lat: 35.7186, lng: 4.5407 },
  "guelma": { lat: 36.4625, lng: 7.4331 },
  "relizane": { lat: 35.7367, lng: 0.5549 },
  "tipaza": { lat: 36.5892, lng: 2.4474 },
  "medea": { lat: 36.2676, lng: 2.7548 },
  "chlef": { lat: 36.1653, lng: 1.3345 },
  "bouira": { lat: 36.3749, lng: 3.8960 },
  "tizi ouzou": { lat: 36.7118, lng: 4.0456 },
  "djelfa": { lat: 34.6728, lng: 3.2636 },
  "souk ahras": { lat: 36.2864, lng: 7.9511 },
  "saida": { lat: 34.8303, lng: 0.1517 },
  "mascara": { lat: 35.3966, lng: 0.1402 },
  "ain temouchent": { lat: 35.2975, lng: -1.1400 },
  "el oued": { lat: 33.3568, lng: 6.8632 },
  "khenchela": { lat: 35.4167, lng: 7.1333 },
  "oued souf": { lat: 33.3333, lng: 5.8667 },
  "tamanghasset": { lat: 22.7850, lng: 5.5228 },
  "illizi": { lat: 26.4833, lng: 8.4667 },
  "adrar": { lat: 27.8731, lng: -0.2800 },
  "naama": { lat: 33.2667, lng: -0.3167 },
  "tindouf": { lat: 27.6742, lng: -8.1472 },
  "tissemsilt": { lat: 35.6072, lng: 1.8106 },
  "el bayadh": { lat: 33.6803, lng: 1.0192 },
  "ain defla": { lat: 36.2642, lng: 1.9679 },
  "ghardaia": { lat: 32.4839, lng: 3.6764 },
  "mila": { lat: 36.4500, lng: 6.2644 },
  "boumerdes": { lat: 36.7592, lng: 3.4742 },
  "ain taya": { lat: 36.7933, lng: 3.2900 },
};

function getWilayaCoords(wilayaName: string): { lat: number; lng: number } | null {
  if (!wilayaName) return null;
  const normalized = wilayaName.toLowerCase().trim();
  if (WILAYA_COORDS[normalized]) return WILAYA_COORDS[normalized];
  for (const [name, coords] of Object.entries(WILAYA_COORDS)) {
    if (normalized.includes(name) || name.includes(normalized)) {
      return coords;
    }
  }
  return null;
}

function formatDateRange(start?: string | null, end?: string | null) {
  if (!start && !end) return "Pickup date pending";
  if (!start) return end?.slice(0, 10) || "Pickup date pending";
  if (!end || start === end) return start.slice(0, 10);
  return `${start.slice(0, 10)} to ${end.slice(0, 10)}`;
}

function ShipmentListItem({
  shipment,
  onStatusChange,
  updatingId,
}: {
  shipment: AssignedShipment;
  onStatusChange: (shipment: AssignedShipment, newStatus: "assigned" | "picked_up") => void;
  updatingId: string | number | null;
}) {
  const isDone = shipment.assignment_status === "picked_up" || shipment.assignment_status === "delivered";
  const isPending = shipment.assignment_status === "assigned";
  const isUpdating = updatingId === shipment.id;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7C3AED]">
            {shipment.id}
          </p>
          <h3 className="mt-1 text-sm font-bold text-gray-900">
            {shipment.title}
          </h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
          isDone
            ? "bg-green-100 text-green-700"
            : "bg-[#EDFFD0] text-[#4a6600]"
        }`}>
          {shipment.assignment_status?.replace("_", " ") || "assigned"}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-gray-500">From</span>
          <span className="font-semibold text-gray-800">{shipment.origin}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-gray-500">To</span>
          <span className="font-semibold text-gray-800">{shipment.destination}</span>
        </div>
        {shipment.route_name && (
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium text-gray-500">Route</span>
            <span className="text-xs text-gray-600">{shipment.route_name}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <Calendar className="w-3 h-3" />
          {formatDateRange(shipment.from_pickup_date, shipment.to_pickup_date)}
        </div>
        {(shipment.weight || shipment.volume) && (
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {shipment.weight && (
              <span className="flex items-center gap-1">
                <Weight className="w-3 h-3" />
                {shipment.weight} kg
              </span>
            )}
            {shipment.volume && (
              <span className="flex items-center gap-1">
                <Box className="w-3 h-3" />
                {shipment.volume} m³
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {isPending ? (
          <button
            onClick={() => onStatusChange(shipment, "picked_up")}
            disabled={isUpdating}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-green-700 disabled:opacity-50"
          >
            {isUpdating ? "..." : <><CheckCircle className="w-4 h-4" /> Mark Done</>}
          </button>
        ) : (
          <button
            onClick={() => onStatusChange(shipment, "assigned")}
            disabled={isUpdating}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
          >
            {isUpdating ? "..." : <><XCircle className="w-4 h-4" /> Mark Not Done</>}
          </button>
        )}
      </div>
    </div>
  );
}

export default function TruckMapWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">Loading...</div>}>
      <TruckMap />
    </Suspense>
  );
}

function TruckMap() {
  const router = useRouter();
  const [coords, setCoords] = useState<Coords | null>(null);
  const [shipments, setShipments] = useState<AssignedShipment[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"assigned" | "picked_up">("assigned");
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Location error:", err);
        setCoords({ lat: 36.75, lng: 3.06 });
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const routesRes = await fetch(
        `${API_BASE_URL}/routes/my-routes?page=1&limit=1000`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!routesRes.ok) throw new Error("Failed to fetch routes");

      const routesData = await routesRes.json();
      const routesArray: Route[] = Array.isArray(routesData)
        ? routesData
        : routesData?.routes ?? routesData?.data?.routes ?? [];

      setRoutes(routesArray);

      const allShipments: AssignedShipment[] = [];
      for (const route of routesArray) {
        try {
          const shipmentsRes = await fetch(
            `${API_BASE_URL}/routes/${route.id}/shipments`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (shipmentsRes.ok) {
            const data = await shipmentsRes.json();
            const routeShipments: AssignedShipment[] = Array.isArray(data?.shipments)
              ? data.shipments
              : [];

            routeShipments.forEach((s) => {
              s.route_id = route.id;
              s.route_name = `${route.origin} → ${route.destination}`;

              const originCoords = getWilayaCoords(s.origin);
              if (originCoords) {
                s.origin_lat = originCoords.lat;
                s.origin_lng = originCoords.lng;
              }
            });
            allShipments.push(...routeShipments);
          }
        } catch (err) {
          console.error(`Failed to fetch shipments for route ${route.id}:`, err);
        }
      }

      setShipments(allShipments);
    } catch (err: any) {
      setError(err?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (shipment: AssignedShipment, newStatus: "assigned" | "picked_up") => {
    if (!shipment.route_id) return;

    const actionText = newStatus === "picked_up" ? "mark as done" : "mark as not done";
    if (!window.confirm(`Are you sure you want to ${actionText} for "${shipment.title}"?`)) return;

    try {
      setUpdatingId(shipment.id);
      const token = localStorage.getItem("authToken");

      if (newStatus === "picked_up") {

        const response = await fetch(
          `${API_BASE_URL}/routes/${shipment.route_id}/shipments/${shipment.id}/pickup`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token || ""}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to update status");
      } else {

        const response = await fetch(
          `${API_BASE_URL}/shipments/${shipment.id}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token || ""}`,
            },
            body: JSON.stringify({ status: "assigned" }),
          }
        );
        if (!response.ok) throw new Error("Failed to revert status");
      }

      setShipments((prev) =>
        prev.map((s) =>
          s.id === shipment.id ? { ...s, assignment_status: newStatus } : s
        )
      );
    } catch (err: any) {
      alert(err?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredShipments = useMemo(() => {
    let result = shipments.filter((s) => s.assignment_status === activeTab);
    if (selectedRouteId) {
      result = result.filter((s) => s.route_id === selectedRouteId);
    }
    return result;
  }, [shipments, activeTab, selectedRouteId]);

  const mapShipments = useMemo(() => {
    let result = shipments.filter(
      (s) =>
        s.origin_lat != null &&
        s.origin_lng != null &&
        Number.isFinite(Number(s.origin_lat)) &&
        Number.isFinite(Number(s.origin_lng))
    );
    if (selectedRouteId) {
      result = result.filter((s) => s.route_id === selectedRouteId);
    }
    return result;
  }, [shipments, selectedRouteId]);

  const mapViewState = useMemo(() => {
    const points: Coords[] = [];
    if (coords) points.push(coords);
    for (const s of mapShipments) {
      if (s.origin_lat != null && s.origin_lng != null) {
        points.push({ lat: Number(s.origin_lat), lng: Number(s.origin_lng) });
      }
    }

    if (points.length === 0) {
      return { latitude: 36.75, longitude: 3.06, zoom: 6 };
    }

    const lats = points.map((p) => p.lat);
    const lngs = points.map((p) => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    const latSpan = maxLat - minLat;
    const lngSpan = maxLng - minLng;
    const maxSpan = Math.max(latSpan, lngSpan);

    let zoom = 6;
    if (maxSpan < 0.02) zoom = 14;
    else if (maxSpan < 0.1) zoom = 12;
    else if (maxSpan < 0.5) zoom = 10;
    else if (maxSpan < 2) zoom = 8;

    return { latitude: centerLat, longitude: centerLng, zoom };
  }, [coords, mapShipments]);

  const pendingCount = useMemo(() =>
    shipments.filter((s) => s.assignment_status === "assigned").length,
  [shipments]);
  const pickedUpCount = useMemo(() =>
    shipments.filter((s) => s.assignment_status === "picked_up").length,
  [shipments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#7C3AED] mb-3"></div>
          <p className="text-gray-600">Loading your shipments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-red-900 mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex gap-2">
            <button onClick={fetchData} className="flex-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4">Retry</button>
            <button onClick={() => router.push("/dashboard")} className="flex-1 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4">Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-3 md:p-4">
      {}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">My Route Map</h1>
        </div>
      </div>

      {}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("assigned")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === "assigned"
              ? "bg-[#7C3AED] text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab("picked_up")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === "picked_up"
              ? "bg-[#7C3AED] text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
          }`}
        >
          Picked Up ({pickedUpCount})
        </button>

        {}
        <select
          value={selectedRouteId || ""}
          onChange={(e) => setSelectedRouteId(e.target.value || null)}
          className="rounded-full px-4 py-2 text-sm font-semibold bg-white border border-gray-200 hover:border-gray-300 text-gray-700 cursor-pointer focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
        >
          <option value="">All Routes</option>
          {routes.map((route) => (
            <option key={route.id} value={route.id}>
              {route.origin} → {route.destination}
            </option>
          ))}
        </select>
      </div>

      {}
      <div className="flex min-h-[calc(100vh-280px)] flex-col gap-3 lg:grid lg:h-[calc(100vh-280px)] lg:grid-cols-[minmax(0,1fr)_380px]">
        {}
        <section className="relative min-h-[50vh] overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm lg:h-full lg:min-h-0">
          <div className="absolute left-4 top-4 z-20 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7C3AED]">All Reserved Shipments</p>
            <p className="mt-1 text-sm font-medium text-gray-700">
              {mapShipments.length} total shipment{mapShipments.length !== 1 ? "s" : ""} on map
            </p>
            <p className="text-xs text-gray-500 mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#B8FF00] mr-1"></span> Pending
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 ml-2 mr-1"></span> Picked Up
            </p>
          </div>

          <Map
            initialViewState={{
              longitude: mapViewState.longitude,
              latitude: mapViewState.latitude,
              zoom: mapViewState.zoom,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          >
            {}
            {coords && (
              <Marker longitude={coords.lng} latitude={coords.lat} anchor="bottom">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-blue-500 border-3 border-white shadow-lg" style={{ border: '3px solid white' }} />
                  <span className="mt-1 whitespace-nowrap rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-md">
                    You
                  </span>
                </div>
              </Marker>
            )}

            {}
            {mapShipments.map((shipment) => {
              const isPickedUp = shipment.assignment_status === "picked_up" || shipment.assignment_status === "delivered";
              return (
                <Marker
                  key={`origin-${shipment.id}`}
                  longitude={Number(shipment.origin_lng)}
                  latitude={Number(shipment.origin_lat)}
                  anchor="bottom"
                >
                  <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <div
                      className={`rounded-full border-2 border-white shadow-md transition-transform hover:scale-110 ${
                        isPickedUp ? "bg-green-500" : "bg-[#B8FF00]"
                      }`}
                      style={{ width: 14, height: 14 }}
                    />
                    <span className={`whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-semibold shadow-md border ${
                      isPickedUp
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-[#EDFFD0] text-[#4a6600] border-[#B8FF00]"
                    }`}>
                      {shipment.origin.slice(0, 12)}{shipment.origin.length > 12 ? "..." : ""}
                    </span>
                  </div>
                </Marker>
              );
            })}
          </Map>
        </section>

        {}
        <aside className="flex min-h-[40vh] flex-col overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm lg:h-full lg:min-h-0">
          <div className="border-b border-gray-100 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7C3AED]">Shipments</p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">Reserved Shipments</h2>
              </div>
              <span className="rounded-full bg-[#EDFFD0] px-3 py-1 text-[11px] font-semibold text-[#4a6600]">
                {filteredShipments.length}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {filteredShipments.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No shipments found</p>
                <p className="text-sm text-gray-400 mt-1">
                  No {activeTab.replace("_", " ")} shipments.
                </p>
              </div>
            ) : (
              filteredShipments.map((shipment) => (
                <ShipmentListItem
                  key={shipment.id}
                  shipment={shipment}
                  onStatusChange={handleStatusChange}
                  updatingId={updatingId}
                />
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
