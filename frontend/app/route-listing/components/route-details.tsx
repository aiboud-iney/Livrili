"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, Phone, MapPin, Calendar, Package, Truck, Weight, Box, User, Navigation, Image as ImageIcon, Clock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getTruckTypeColor, getTruckTypeLabel } from "@/app/constants/truck-types";
import { useLang } from "@/contexts/LanguageContext";

type RouteDetailsProps = {
  routeId: string;
};

type Route = {
  id: number;
  posted_by: number;
  origin: string;
  destination: string;
  transit_cities: string[];
  departure_date: string;
  start_date?: string;
  end_date?: string;
  max_weight: string;
  max_volume: string;
  contact_phone: string;
  status: string;
  created_at: string;
  phonecountrycode: string;
  notes: string;
  truck_type: string | null;
  assigned_truck_id: number | null;
  trip_type?: "aller" | "aller-retour" | null;
  route_type?: "ONE_WAY" | "ROUND_TRIP" | null;
  truck_pictures?: string[] | string | null;
  return_start_date?: string;
  return_end_date?: string;
  assigned_weight: number;
  assigned_volume: number;
  remaining_capacity: number;
  remaining_volume: number;
  assigned_shipments: any[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type UserContact = {
  business_name: string;
  phone_number: string;
  email?: string;
};

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

const getTruckImagesArray = (truckPictures: string[] | string | null | undefined): string[] => {
  if (!truckPictures) return [];
  if (Array.isArray(truckPictures)) return truckPictures;
  if (typeof truckPictures === "string") {
    try {
      const parsed = JSON.parse(truckPictures);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [truckPictures];
    }
  }
  return [];
};

export function RouteDetails({ routeId }: RouteDetailsProps) {
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [truckImages, setTruckImages] = useState<string[]>([]);
  const [truckLoading, setTruckLoading] = useState(false);
  const [userContact, setUserContact] = useState<UserContact | null>(null);
  const [userContactLoading, setUserContactLoading] = useState(false);
  const router = useRouter();
  const { lang } = useLang();

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPostedTime = (dateString: string) => {
    const minutesAgo = Math.floor(
      (Date.now() - new Date(dateString).getTime()) / 60000,
    );
    if (minutesAgo < 60) {
      return `${minutesAgo} min ago`;
    }
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
      return `${hoursAgo} hr ago`;
    }
    const daysAgo = Math.floor(hoursAgo / 24);
    return `${daysAgo} days ago`;
  };

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}/${path.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    async function fetchUserContact() {
      if (!route || !route.posted_by) return;
      setUserContactLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `${API_BASE_URL}/users/${route.posted_by}/contact`,
          { headers: { Authorization: token ? `Bearer ${token}` : "" } }
        );
        if (res.ok) {
          const data = await res.json();
          setUserContact(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user contact:", err);
      } finally {
        setUserContactLoading(false);
      }
    }
    fetchUserContact();
  }, [route]);

  useEffect(() => {
    async function fetchRoute() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_BASE_URL}/routes/${routeId}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (!res.ok) throw new Error("Failed to fetch route details");
        const data = await res.json();
        setRoute(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchRoute();
  }, [routeId]);

  useEffect(() => {
    const r = route;
    if (!r) return;

    const imagesFromRoute = getTruckImagesArray(r.truck_pictures);
    if (imagesFromRoute.length > 0) {
      setTruckImages(imagesFromRoute);
      return;
    }

    async function fetchTruck() {
      if (!r?.assigned_truck_id) return;
      setTruckLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `${API_BASE_URL}/trucks/${r?.assigned_truck_id}`,
          { headers: { Authorization: token ? `Bearer ${token}` : "" } }
        );
        if (res.ok) {
          const data = await res.json();
          const fetchedImages = getTruckImagesArray(data.truck?.truck_pictures);
          setTruckImages(fetchedImages);
        }
      } catch (err) {
        console.error("Failed to fetch truck:", err);
      } finally {
        setTruckLoading(false);
      }
    }
    fetchTruck();
  }, [route]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#7E52FF] mb-4"></div>
          <p className="text-gray-600">Loading route details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!route) {
    return <div className="text-center py-20 text-gray-500">No route found.</div>;
  }

  const outboundStart = formatDate(route.start_date || route.departure_date || "");
  const outboundEnd = formatDate(route.end_date || route.departure_date || "");
  const returnStart = formatDate(route.return_start_date || route.end_date || "");
  const returnEnd = formatDate(route.return_end_date || route.end_date || "");

  const routeTypeValue = route.route_type || null;
  const isRoundTrip = routeTypeValue === "ROUND_TRIP";

  const truckImageUrl = getTruckImageUrl(route.truck_pictures || null);

  const imageSlots = truckImages && truckImages.length > 0 ? truckImages : [null, null, null, null];

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">

      {}
      <button
        onClick={() => router.push('/feed')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="font-semibold">Back to Feed</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {}
        <div className="lg:col-span-2 space-y-6">

          {}
          <div>
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${
              route.status === "active"
                ? "bg-[#B8FF00] text-[#1a1a1a]"
                : "bg-gray-300 text-gray-700"
            }`}>
              {route.status.toUpperCase()}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2 flex-wrap">
              {route.origin}
              <ArrowRight className="w-5 h-5 text-gray-400" />
              {route.destination}
            </h1>
            <p className="text-sm text-gray-500">
              Route ID: #{route.id} • Posted {formatPostedTime(route.created_at)}
            </p>

            {}
            {route.truck_type && (
              <div className="mt-4">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {}
                  <div style={{ width: "48px", height: "48px", borderRadius: "8px", overflow: "hidden", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid #e5e7eb" }}>
                    {truckImageUrl ? (
                      <img
                        src={getImageUrl(truckImageUrl)}
                        alt="Truck"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="14" height="10" rx="2" stroke="#9ca3af" stroke-width="1.5"/><path d="M17 9h3l2 3v4h-5V9z" stroke="#9ca3af" stroke-width="1.5" stroke-linejoin="round"/><circle cx="7" cy="17" r="2" stroke="#9ca3af" stroke-width="1.5"/><circle cx="18" cy="17" r="2" stroke="#9ca3af" stroke-width="1.5"/></svg>`;
                          }
                        }}
                      />
                    ) : (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="6" width="14" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.5" />
                        <path d="M17 9h3l2 3v4h-5V9z" stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round" />
                        <circle cx="7" cy="17" r="2" stroke="#9ca3af" strokeWidth="1.5" />
                        <circle cx="18" cy="17" r="2" stroke="#9ca3af" strokeWidth="1.5" />
                      </svg>
                    )}
                  </div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: getTruckTypeColor(route.truck_type).bg,
                      color: getTruckTypeColor(route.truck_type).text,
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "6px 14px",
                      borderRadius: "8px",
                      border: `1px solid ${getTruckTypeColor(route.truck_type).border || "transparent"}`,
                    }}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    {getTruckTypeLabel(route.truck_type, lang)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {imageSlots.slice(0, 4).map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center"
                >
                  {img ? (
                    <img
                      src={getImageUrl(img)}
                      alt={`Truck image ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex flex-col items-center justify-center w-full h-full">
                              <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect x="3" y="6" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5" />
                                <path d="M17 9h3l2 3v4h-5V9z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                <circle cx="7" cy="17" r="2" stroke="currentColor" stroke-width="1.5" />
                                <circle cx="18" cy="17" r="2" stroke="currentColor" stroke-width="1.5" />
                              </svg>
                              <p class="text-xs text-gray-400 mt-1">Truck</p>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                        <rect x="3" y="6" width="14" height="10" rx="2" />
                        <path d="M17 9h3l2 3v4h-5V9z" strokeLinejoin="round" />
                        <circle cx="7" cy="17" r="2" />
                        <circle cx="18" cy="17" r="2" />
                      </svg>
                      <p className="text-xs text-gray-400 mt-1">
                        {truckLoading ? "Loading..." : "No image"}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {}
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-center mb-2">
                  <Weight className="w-5 h-5 text-[#B8FF00]" />
                </div>
                <p className="text-xs text-gray-500 mb-1">MAX WEIGHT</p>
                <p className="text-lg font-bold text-gray-900">
                  {route.max_weight} tons
                  <span className="text-xs text-gray-400 font-normal ml-1">avail.</span>
                </p>
              </div>

              {}
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-center mb-2">
                  <Box className="w-5 h-5 text-[#B8FF00]" />
                </div>
                <p className="text-xs text-gray-500 mb-1">MAX VOLUME</p>
                <p className="text-lg font-bold text-gray-900">
                  {route.max_volume} m³
                  <span className="text-xs text-gray-400 font-normal ml-1">avail.</span>
                </p>
              </div>

              {}
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-center mb-2">
                  <Navigation className="w-5 h-5 text-[#B8FF00]" />
                </div>
                <p className="text-xs text-gray-500 mb-1">TRIP TYPE</p>
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: routeTypeValue === "ROUND_TRIP" ? "#fef3c7" : "#e0f2fe",
                    color: routeTypeValue === "ROUND_TRIP" ? "#92400e" : "#0369a1",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "20px",
                    border: `1px solid ${routeTypeValue === "ROUND_TRIP" ? "#fcd34d" : "#7dd3fc"}`,
                  }}
                >
                  {routeTypeValue === "ROUND_TRIP" ? "⇄ Round Trip" : "→ One Way"}
                </span>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-[#B8FF00]" />
              <p className="text-xs font-semibold text-gray-500 uppercase">Departure Dates</p>
            </div>
            <p className="text-base font-semibold text-gray-900">
              {outboundStart} - {outboundEnd}
            </p>
          </div>

          {}
          {route.notes && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#B8FF00]" />
                NOTES
              </h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {route.notes}
              </p>
            </div>
          )}

        </div>

        {}
        <div className="space-y-4">

          {}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              POSTED BY
            </p>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#B8FF00] rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-[#1a1a1a]">
                  {userContact?.business_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">
                  {userContactLoading ? "Loading..." : userContact?.business_name || 'Unknown'}
                </h3>
              </div>
            </div>

            {}
            <div className="mb-4 p-3 bg-white/10 rounded-lg">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                PHONE NUMBER
              </p>
              <p className="text-base font-semibold">
                {userContact?.phone_number || route.contact_phone || 'Not provided'}
              </p>
            </div>

            {}
            <button
              onClick={() => {
                const phoneNumber = userContact?.phone_number || route.contact_phone;
                if (phoneNumber) {
                  window.location.href = `tel:${phoneNumber}`;
                }
              }}
              className="w-full bg-[#B8FF00] text-[#1a1a1a] py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#a8ee00] transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </button>

            {}
            <button
              onClick={() => router.push(`/localisation?routeId=${route.id}`)}
              className="w-full bg-[#7C3AED] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#6d41ff] transition-colors cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              Start Tracking
            </button>
          </div>

          {}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#B8FF00]" />
              QUICK INFO
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Reference</span>
                <span className="text-sm font-semibold text-gray-900">#{route.id}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Posted Date</span>
                <span className="text-sm font-semibold text-gray-900">{formatDate(route.created_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  route.status === 'active' ? 'bg-[#B8FF00] text-[#1a1a1a]' : 'bg-gray-200 text-gray-700'
                }`}>
                  {route.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#B8FF00]" />
              ROUTE DETAILS
            </h2>

            <div className="space-y-4">
              {}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-green-600 font-semibold mb-0.5">ORIGIN</p>
                  <p className="font-semibold text-gray-900">{route.origin}</p>
                </div>
              </div>

              {}
              {route.transit_cities && route.transit_cities.length > 0 && (
                <>
                  {route.transit_cities.map((city, idx) => (
                    <div key={idx} className="flex items-start gap-3 pl-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">VIA</p>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151", backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "5px", padding: "2px 7px", whiteSpace: "nowrap" }}>
                          {city}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {}
              {(!route.transit_cities || route.transit_cities.length === 0) && (
                <div className="flex justify-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}

              {}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#7E52FF]" />
                </div>
                <div>
                  <p className="text-xs text-[#7E52FF] font-semibold mb-0.5">DESTINATION</p>
                  <p className="font-semibold text-gray-900">{route.destination}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {}
      {route.assigned_shipments && route.assigned_shipments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-6 h-6 text-[#B8FF00]" />
            ASSIGNED SHIPMENTS ({route.assigned_shipments.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {route.assigned_shipments.map((shipment, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-[#B8FF00] hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{shipment.title}</h3>
                    <p className="text-xs text-gray-500">ID: #{shipment.id}</p>
                  </div>
                  <span className="inline-block px-2 py-1 bg-[#B8FF00] text-[#1a1a1a] text-xs font-semibold rounded">
                    {shipment.status || "assigned"}
                  </span>
                </div>

                <div className="space-y-2">
                  {}
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="w-3 h-3 text-green-600" />
                    <span className="font-medium text-gray-700">{shipment.origin}</span>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="font-medium text-gray-700">{shipment.destination}</span>
                  </div>

                  {}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Weight className="w-3 h-3 text-[#B8FF00]" />
                      <span className="text-gray-600">{shipment.weight}T</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Box className="w-3 h-3 text-[#B8FF00]" />
                      <span className="text-gray-600">{shipment.volume}m³</span>
                    </div>
                  </div>

                  {}
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600">
                      {formatDate(shipment.from_pickup_date)}
                    </span>
                  </div>
                </div>

                {}
                <button
                  onClick={() => router.push(`/shipment-listing/${shipment.id}`)}
                  className="w-full mt-4 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-xs rounded-lg transition-colors cursor-pointer border border-gray-200"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}