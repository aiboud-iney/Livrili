"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { ArrowLeft, MapPin, Package, Truck } from "lucide-react";

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

export default function LocalisationShipmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [shipment, setShipment] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken") || "";

        const shipmentRes = await fetch(`${API_BASE_URL}/shipments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!shipmentRes.ok) throw new Error("Failed to fetch shipment");
        const shipmentData = await shipmentRes.json();
        const shipmentObj = shipmentData?.shipment || shipmentData;
        if (!cancelled) setShipment(shipmentObj);

        try {
          const myRoutesRes = await fetch(`${API_BASE_URL}/routes/my-routes?page=1&limit=1000`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (myRoutesRes.ok) {
            const routesData = await myRoutesRes.json();
            const routes = Array.isArray(routesData) ? routesData : routesData?.routes || [];

            for (const route of routes) {
              try {
                const routeShipmentsRes = await fetch(`${API_BASE_URL}/routes/${route.id}/shipments`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (routeShipmentsRes.ok) {
                  const data = await routeShipmentsRes.json();
                  const shipments = data?.shipments || [];
                  const foundShipment = shipments.find((s: any) => s.id == id);
                  if (foundShipment) {
                    if (!cancelled) {
                      setRouteInfo({
                        ...route,
                        current_lat: route.current_lat,
                        current_lng: route.current_lng,
                        assignment_status: foundShipment.assignment_status,
                      });

                      setShipment((prev: any) => ({ ...prev, ...foundShipment }));
                    }
                    break;
                  }
                }
              } catch (e) {

              }
            }
          }
        } catch (e) {
          console.error("Failed to fetch route info:", e);
        }
      } catch (err: any) {
        if (!cancelled) setError(err?.message || "Failed to load shipment");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const originCoords = useMemo(() => {
    if (!shipment?.origin) return null;
    return getWilayaCoords(shipment.origin);
  }, [shipment]);

  const destCoords = useMemo(() => {
    if (!shipment?.destination) return null;
    return getWilayaCoords(shipment.destination);
  }, [shipment]);

  const driverCoords = useMemo(() => {
    if (routeInfo?.current_lat && routeInfo?.current_lng) {
      return { lat: Number(routeInfo.current_lat), lng: Number(routeInfo.current_lng) };
    }
    return null;
  }, [routeInfo]);

  const mapCenter = useMemo(() => {
    if (driverCoords) return { latitude: driverCoords.lat, longitude: driverCoords.lng, zoom: 10 };
    if (originCoords) return { latitude: originCoords.lat, longitude: originCoords.lng, zoom: 8 };
    return { latitude: 36.75, longitude: 3.06, zoom: 6 };
  }, [driverCoords, originCoords]);

  const hasLocationData = driverCoords || originCoords || destCoords;

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-3 md:p-4">
      {}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-xl font-bold text-gray-900">Shipment Location</h1>
      </div>

      <div className="flex min-h-[calc(100vh-120px)] flex-col gap-3 lg:grid lg:h-[calc(100vh-120px)] lg:grid-cols-[minmax(0,1fr)_380px]">
        {}
        <section className="relative min-h-[50vh] overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm lg:h-full lg:min-h-0">
          <div className="absolute left-4 top-4 z-20 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7C3AED]">
              Shipment Map
            </p>
            <p className="mt-1 text-sm font-medium text-gray-700">
              {driverCoords
                ? "Driver location available"
                : originCoords
                ? "Origin & Destination shown"
                : "Location data limited"}
            </p>
          </div>

          {!loading && !hasLocationData && (
            <div className="flex h-full items-center justify-center p-8">
              <div className="text-center max-w-sm">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium mb-2">Location Data Unavailable</p>
                <p className="text-sm text-gray-400">
                  This shipment doesn&apos;t have GPS coordinates yet. Locations are shown when a driver is assigned and shares their position.
                </p>
              </div>
            </div>
          )}

          <Map
            initialViewState={mapCenter}
            style={{ width: "100%", height: "100%" }}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          >
            {}
            {originCoords && (
              <Marker longitude={originCoords.lng} latitude={originCoords.lat} anchor="bottom">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-[#B8FF00] border-2 border-white shadow-md" />
                  <span className="mt-1 whitespace-nowrap rounded-full bg-[#B8FF00] px-2 py-0.5 text-[10px] font-semibold text-gray-900 shadow-md">
                    Origin
                  </span>
                </div>
              </Marker>
            )}

            {}
            {destCoords && (
              <Marker longitude={destCoords.lng} latitude={destCoords.lat} anchor="bottom">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-[#7C3AED] border-2 border-white shadow-md" />
                  <span className="mt-1 whitespace-nowrap rounded-full bg-[#7C3AED] px-2 py-0.5 text-[10px] font-semibold text-white shadow-md">
                    Dest
                  </span>
                </div>
              </Marker>
            )}

            {}
            {driverCoords && (
              <Marker longitude={driverCoords.lng} latitude={driverCoords.lat} anchor="bottom">
                <div className="flex flex-col items-center">
                  <img
                    src="https://w7.pngwing.com/pngs/684/485/png-transparent-address-delivery-location-shipping-transport-transportation-truck-pinpoint-interface-i-icon.png"
                    alt="Driver"
                    width={34}
                    height={34}
                  />
                  <span className="mt-1 whitespace-nowrap rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-md">
                    Driver
                  </span>
                </div>
              </Marker>
            )}
          </Map>
        </section>

        {}
        <aside className="flex min-h-[40vh] flex-col overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm lg:h-full lg:min-h-0">
          <div className="border-b border-gray-100 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7C3AED]">
                  Shipment
                </p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {shipment?.title || `#${id}`}
                </h2>
              </div>
              {routeInfo && (
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                  routeInfo.assignment_status === "picked_up"
                    ? "bg-green-100 text-green-700"
                    : "bg-[#EDFFD0] text-[#4a6600]"
                }`}>
                  {routeInfo.assignment_status?.replace("_", " ") || "assigned"}
                </span>
              )}
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Shipment ID: {id}
              {routeInfo && ` • Assigned to route ${routeInfo.origin} → ${routeInfo.destination}`}
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {loading ? (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#7C3AED] mb-2"></div>
                <p>Loading shipment...</p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                {}
                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                  <div className="w-4 h-4 rounded-full bg-[#B8FF00] border-2 border-white shadow-sm mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Origin</p>
                    <p className="font-semibold text-gray-900">{shipment?.origin || "—"}</p>
                    {originCoords && (
                      <p className="text-xs text-gray-400 mt-1">
                        {originCoords.lat.toFixed(4)}, {originCoords.lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>

                {}
                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                  <div className="w-4 h-4 rounded-full bg-[#7C3AED] border-2 border-white shadow-sm mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Destination</p>
                    <p className="font-semibold text-gray-900">{shipment?.destination || "—"}</p>
                    {destCoords && (
                      <p className="text-xs text-gray-400 mt-1">
                        {destCoords.lat.toFixed(4)}, {destCoords.lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>

                {}
                {driverCoords && (
                  <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-3">
                    <Truck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-blue-600 uppercase">Driver Location</p>
                      <p className="font-semibold text-gray-900">
                        {driverCoords.lat.toFixed(5)}, {driverCoords.lng.toFixed(5)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Live tracking active</p>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-xs text-gray-500 uppercase mb-1">Pickup Date</p>
                  <p className="font-semibold text-gray-900">
                    {shipment?.from_pickup_date
                      ? `${shipment.from_pickup_date} to ${shipment.to_pickup_date || ""}`
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="font-semibold text-gray-900">
                    {shipment?.weight ?? "—"} tons
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Volume</p>
                  <p className="font-semibold text-gray-900">
                    {shipment?.volume ?? "—"} m³
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-semibold text-gray-900">
                    {shipment?.status || "—"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
