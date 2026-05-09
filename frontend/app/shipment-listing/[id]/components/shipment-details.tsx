"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Phone,
  MapPin,
  Calendar,
  Package,
  Truck,
  Weight,
  Box,
  User,
  Navigation,
  Image as ImageIcon,
} from "lucide-react";
import type { ShipmentData, PosterData } from "../page";
import {
  getShipmentTypeColor,
  getShipmentTypeLabel,
} from "@/app/constants/shipment-types";
import {
  getTruckTypeColor,
  getTruckTypeLabel,
} from "@/app/constants/truck-types";
import { useLang } from "@/contexts/LanguageContext";

interface ShipmentDetailsProps {
  shipment: ShipmentData;
  poster: PosterData | null;
}

interface UserRoute {
  id: number;
  origin: string;
  destination: string;
  max_weight: number;
  max_volume: number;
}

export function ShipmentDetails({ shipment, poster }: ShipmentDetailsProps) {
  const router = useRouter();
  const { lang } = useLang();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isReserving, setIsReserving] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [reserveError, setReserveError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userRoutes, setUserRoutes] = useState<UserRoute[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const startFormatted = start.toLocaleDateString("en-US", options);
    const endFormatted = end.toLocaleDateString("en-US", options);

    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      const startDay = start.getDate();
      const endDay = end.getDate();
      const month = start.toLocaleDateString("en-US", { month: "short" });
      const year = start.getFullYear();
      return `${month} ${startDay} - ${endDay}, ${year}`;
    }

    return `${startFormatted} - ${endFormatted}`;
  };

  const formatSingleDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleReserve = async () => {
    setShowModal(true);
    setSuccessMessage("");
    setReserveError("");
    setIsLoadingRoutes(true);
    try {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
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
      setReserveError(err.message || "Error fetching routes");
    } finally {
      setIsLoadingRoutes(false);
    }
  };

  const handleSelectRoute = async (routeId: number) => {
    setIsReserving(true);
    setReserveError("");
    try {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
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
      setSuccessMessage("Reserved successfully!");
    } catch (err: any) {
      setReserveError(err.message || "Error reserving shipment");
    } finally {
      setIsReserving(false);
    }
  };

  const handleCloseModal = () => {
    if (successMessage === "") setShowModal(false);
  };

  const getImageUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    return `${API_BASE_URL}/${path}`;
  };

  const images =
    shipment.shipment_pictures && shipment.shipment_pictures.length > 0
      ? shipment.shipment_pictures
      : null;

  const imageSlots =
    images && images.length > 0 ? images : [null, null, null, null];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {}
      <button
        onClick={() => router.push("/feed")}
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
            <span className="inline-block px-3 py-1 bg-[#7E52FF] text-white text-xs font-semibold rounded-full mb-3">
              SHIPMENT
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {shipment.title}
            </h1>
            <p className="text-sm text-gray-500">
              Shipment ID: #{shipment.id} • Posted{" "}
              {formatSingleDate(shipment.created_at)}
            </p>

            {}
            <div className="flex gap-3 mt-4 flex-wrap">
              {shipment.truck_type ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: getTruckTypeColor(shipment.truck_type).bg,
                    color: getTruckTypeColor(shipment.truck_type).text,
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: `1px solid ${getTruckTypeColor(shipment.truck_type).border || "transparent"}`,
                  }}
                >
                  <Truck className="w-3.5 h-3.5" />
                  {getTruckTypeLabel(shipment.truck_type, lang)}
                </span>
              ) : (
                <span className="text-sm text-gray-400">—</span>
              )}
              {shipment.shipment_type ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: getShipmentTypeColor(
                      shipment.shipment_type,
                    ).bg,
                    color: getShipmentTypeColor(shipment.shipment_type).text,
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: `1px solid ${getShipmentTypeColor(shipment.shipment_type).border || "transparent"}`,
                  }}
                >
                  <Package className="w-3.5 h-3.5" />
                  {getShipmentTypeLabel(shipment.shipment_type, lang)}
                </span>
              ) : (
                <span className="text-sm text-gray-400">—</span>
              )}
            </div>
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
                      alt={`Shipment image ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex flex-col items-center justify-center w-full h-full">
                              <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p class="text-xs text-gray-400 mt-1">No image</p>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                      <p className="text-xs text-gray-400 mt-1">No image</p>
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
                  <Weight className="w-5 h-5 text-[#7E52FF]" />
                </div>
                <p className="text-xs text-gray-500 mb-1">WEIGHT</p>
                <p className="text-lg font-bold text-gray-900">
                  {shipment.weight} tons
                  <span className="text-xs text-gray-400 font-normal ml-1">avail.</span>
                </p>
              </div>

              {}
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-center mb-2">
                  <Box className="w-5 h-5 text-[#7E52FF]" />
                </div>
                <p className="text-xs text-gray-500 mb-1">VOLUME</p>
                <p className="text-lg font-bold text-gray-900">
                  {shipment.volume} m³
                  <span className="text-xs text-gray-400 font-normal ml-1">avail.</span>
                </p>
              </div>

              {}
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-center mb-2">
                  <Calendar className="w-5 h-5 text-[#7E52FF]" />
                </div>
                <p className="text-xs text-gray-500 mb-1">PICKUP DATE</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDateRange(
                    shipment.from_pickup_date,
                    shipment.to_pickup_date,
                  )}
                </p>
              </div>
            </div>
          </div>

          {}
          {shipment.description && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#7E52FF]" />
                DESCRIPTION
              </h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {shipment.description}
              </p>
            </div>
          )}
        </div>

        {}
        <div className="space-y-4">
          {}
          <div className="bg-gradient-to-br from-[#7E52FF] to-[#6D28D9] rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm text-purple-200 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              POSTED BY
            </p>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold">
                  {poster?.business_name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="flex-1">
  <h3 className="font-bold text-lg">
    {poster?.business_name || "Loading..."}
  </h3>
</div>

            </div>

            {}
            <div className="mb-4 p-3 bg-white/10 rounded-lg">
              <p className="text-xs text-purple-200 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                PHONE NUMBER
              </p>
              <p className="text-base font-semibold">
                {shipment.phone_number ||
                  poster?.phone_number ||
                  "Not provided"}
              </p>
            </div>

            {}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleReserve}
                disabled={isReserving || isReserved}
                className="w-full bg-white text-[#7E52FF] py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isReserving ? "..." : isReserved ? " Reserved" : "Reserve"}
              </button>
              <button
                onClick={() => {
                  const phoneNumber =
                    shipment.phone_number || poster?.phone_number;
                  if (phoneNumber) {
                    window.location.href = `tel:${phoneNumber}`;
                  }
                }}
                className="w-full bg-white text-[#7E52FF] py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </button>
            </div>
            {reserveError && (
              <div className="text-red-600 text-sm text-center">
                {reserveError}
              </div>
            )}
          </div>

          {}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#7E52FF]" />
              QUICK INFO
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Reference</span>
                <span className="text-sm font-semibold text-gray-900">
                  #{shipment.id}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Posted Date</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatSingleDate(shipment.created_at)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Pickup Window</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatDateRange(
                    shipment.from_pickup_date,
                    shipment.to_pickup_date,
                  )}
                </span>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#7E52FF]" />
              ROUTE DETAILS
            </h2>

            <div className="space-y-4">
              {}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-green-600 font-semibold mb-0.5">
                    ORIGIN
                  </p>
                  <p className="font-semibold text-gray-900">
                    {shipment.origin}
                  </p>
                </div>
              </div>

              {}
              <div className="flex justify-center">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>

              {}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#7E52FF]" />
                </div>
                <div>
                  <p className="text-xs text-[#7E52FF] font-semibold mb-0.5">
                    DESTINATION
                  </p>
                  <p className="font-semibold text-gray-900">
                    {shipment.destination}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Select a Route
            </h2>

            {isLoadingRoutes ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="text-gray-600 mt-2">Loading your routes...</p>
              </div>
            ) : userRoutes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <p className="text-gray-600">No routes available</p>
                <p className="text-sm text-gray-500 mt-2">
                  Create a route first before assigning shipments
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userRoutes.map((route) => (
                  <div
                    key={route.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "12px",
                      cursor: isReserving ? "not-allowed" : "pointer",
                      backgroundColor: isReserving ? "#f9fafb" : "#ffffff",
                    }}
                    onClick={() =>
                      !isReserving && handleSelectRoute(route.id)
                    }
                    className="hover:border-purple-400 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {route.origin} → {route.destination}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Capacity: {route.max_weight}T / {route.max_volume}m³
                        </p>
                      </div>
                      {isReserving && (
                        <div className="ml-2">
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {reserveError && (
              <div
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  marginTop: "16px",
                }}
              >
                {reserveError}
              </div>
            )}

            {successMessage && (
              <div
                style={{
                  backgroundColor: "#dcfce7",
                  color: "#166534",
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  marginTop: "16px",
                  textAlign: "center",
                }}
              >
                {successMessage}
              </div>
            )}

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button
                onClick={handleCloseModal}
                disabled={successMessage !== ""}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: successMessage !== "" ? "not-allowed" : "pointer",
                  opacity: successMessage !== "" ? 0.5 : 1,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
