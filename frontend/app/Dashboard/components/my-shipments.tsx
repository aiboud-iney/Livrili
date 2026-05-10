"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { getVisiblePages } from "./pagination-utils";
import { WILAYAS } from "@/app/constants/wilayas";
import {
  getTruckTypeLabel,
  getTruckTypeColor,
} from "@/app/constants/truck-types";
import {
  getShipmentTypeLabel,
  getShipmentTypeColor,
} from "@/app/constants/shipment-types";

type ShipmentStatus = "all" | "active" | "completed";

interface Shipment {
  id: string;
  title: string;
  origin: string;
  destination: string;
  dateRange?: string;
  from_pickup_date?: string;
  to_pickup_date?: string;
  shipment_type: string;
  truck_type: string;
  weight: number;
  volume: number;
  company?: string;
  status: "posted" | "in_transit" | "completed" | "cancelled";
  created_at: string;
  shipment_pictures?: string[];
}

const ICONS = {
  calendar: "/icons/ship dashboard calendar.png",
  weight: "/icons/ship dashboard weight.png",
  volume: "/icons/ship dashboard volume.png",
  edit: "/icons/edit dashboard.png",
  delete: "/icons/delete dashboard.png",
  arrowRight: "/icons/fleche details.png",
  chevronLeft: "/icons/go left dashboard.png",
  chevronRight: "/icons/go right dashboard.png",
  user: "/icons/user.png",
};

export default function MyShipments() {
  const { t, lang } = useLang();
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus>("all");
  const [originFilter, setOriginFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingShipmentId, setUpdatingShipmentId] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipments/my-shipments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch shipments (${res.status})`);
      }

      const data = await res.json();
      const shipmentsArray = Array.isArray(data) ? data : data?.shipments;
      setShipments(Array.isArray(shipmentsArray) ? shipmentsArray : []);
    } catch (err) {
      console.error("Failed to fetch shipments:", err);
      setError("Failed to load shipments");
    } finally {
      setIsLoading(false);
    }
  };

  const mapStatus = (status: string): "active" | "completed" => {
    if (status === "in_transit") return "active";
    if (status === "completed") return "completed";
    return "active";
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDisplayDate = (shipment: Shipment): string => {
    if (shipment.dateRange) return shipment.dateRange;
    if (shipment.from_pickup_date && shipment.to_pickup_date) {
      return `${formatDate(shipment.from_pickup_date)} - ${formatDate(shipment.to_pickup_date)}`;
    }
    return formatDate(shipment.created_at);
  };

  const handleMarkAsCompleted = async (shipmentId: string) => {
    if (!window.confirm("Mark this shipment as completed?")) return;

    try {
      setUpdatingShipmentId(shipmentId);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipments/${shipmentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ status: "completed" }),
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to update shipment (${res.status})`);
      }

      setShipments((prev) =>
        prev.map((shipment) =>
          shipment.id === shipmentId
            ? { ...shipment, status: "completed" }
            : shipment,
        ),
      );
      alert("Shipment marked as completed!");
    } catch (err) {
      console.error("Failed to update shipment:", err);
      setError("Failed to update shipment status");
    } finally {
      setUpdatingShipmentId(null);
    }
  };

  const handleReactivate = async (shipmentId: string) => {
    if (!window.confirm("Reactivate this shipment?")) return;

    try {
      setUpdatingShipmentId(shipmentId);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipments/${shipmentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ status: "in_transit" }),
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to reactivate (${res.status})`);
      }

      setShipments((prev) =>
        prev.map((shipment) =>
          shipment.id === shipmentId
            ? { ...shipment, status: "in_transit" }
            : shipment,
        ),
      );
      alert("Shipment reactivated!");
    } catch (err) {
      console.error("Failed to reactivate:", err);
      setError("Failed to reactivate shipment");
    } finally {
      setUpdatingShipmentId(null);
    }
  };

  const handleDeleteShipment = async (shipmentId: string) => {
    if (!window.confirm("Delete this shipment? This cannot be undone.")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipments/${shipmentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to delete shipment (${res.status})`);
      }

      setShipments((prev) =>
        prev.filter((shipment) => shipment.id !== shipmentId),
      );
      alert("Shipment deleted!");
    } catch (err) {
      console.error("Failed to delete shipment:", err);
      setError("Failed to delete shipment");
    }
  };

  const filteredShipments =
    (statusFilter === "all"
      ? shipments
      : shipments.filter((s) => mapStatus(s.status) === statusFilter))
    .filter((s) => {
      if (originFilter && s.origin !== originFilter) return false;
      if (destinationFilter && s.destination !== destinationFilter) return false;
      return true;
    });

  const totalPages = Math.ceil(filteredShipments.length / 3);
  const displayedShipments = filteredShipments.slice(
    (currentPage - 1) * 3,
    currentPage * 3,
  );
  const visiblePages = getVisiblePages(currentPage, totalPages);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="p-10 md:p-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Shipments</h1>
      </div>

      {}
      <div className="flex gap-2 flex-wrap mb-4">
        <select value={originFilter} onChange={e => setOriginFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white cursor-pointer">
          <option value="">All Origins</option>
          {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
        <select value={destinationFilter} onChange={e => setDestinationFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white cursor-pointer">
          <option value="">All Destinations</option>
          {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
        {(originFilter || destinationFilter) && (
          <button onClick={() => { setOriginFilter(""); setDestinationFilter(""); setCurrentPage(1) }}
            className="px-3 py-1.5 rounded-lg text-sm text-red-600 border border-red-200 hover:bg-red-50 cursor-pointer">
            Clear
          </button>
        )}
      </div>

      {}
      <div className="flex gap-2 mb-8">
        {["all", "active", "completed"].map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setStatusFilter(filter as ShipmentStatus);
              setCurrentPage(1);
            }}
            className={`px-5 py-2 rounded-full cursor-pointer font-medium capitalize text-sm transition-colors ${
              statusFilter === filter
                ? filter === "all"
                  ? "bg-[#1a1a1a] text-white"
                  : filter === "active"
                    ? "bg-[#7E52FF] text-white font-bold"
                    : "bg-[#f0f0f0] text-[#666] font-bold"
                : "bg-white text-[#1a1a1a] border border-[#e0e0e0] hover:bg-[#f5f5f5]"
            }`}
          >
            {filter === "all"
              ? "All"
              : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E52FF] mb-2"></div>
            <p className="text-[#666]">Loading shipments...</p>
          </div>
        </div>
      )}

      {}
      {error && !isLoading && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
          <button
            onClick={fetchShipments}
            className="ml-3 text-red-700 underline"
          >
            Retry
          </button>
        </div>
      )}

      {}
      {!isLoading && filteredShipments.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-[#666] text-lg">
            {statusFilter === "all"
              ? "No shipments found"
              : `No ${statusFilter} shipments`}
          </p>
        </div>
      )}

      {}
      {!isLoading && displayedShipments.length > 0 && (
        <>
          <div className="space-y-4 mb-8">
            {displayedShipments.map((shipment) => (
              <div
                key={shipment.id}
                className={`border-2 rounded-2xl p-8 bg-white hover:shadow-lg transition-all ${
                  mapStatus(shipment.status) === "completed" ? "opacity-75" : ""
                }`}
                style={{
                  borderColor:
                    mapStatus(shipment.status) === "active"
                      ? "#7E52FF"
                      : "#e0e0e0",
                }}
              >
                {}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        mapStatus(shipment.status) === "active"
                          ? "bg-[#7E52FF] text-white"
                          : "bg-[#f0f0f0] text-[#666]"
                      }`}
                    >
                      {mapStatus(shipment.status) === "active"
                        ? "ACTIVE"
                        : "COMPLETED"}
                    </span>
                    {shipment.company && (
                      <div className="flex items-center gap-2">
                        <img
                          src={ICONS.user}
                          alt="Company"
                          className="w-3 h-3 opacity-60"
                        />
                        <span className="text-xs text-[#666] font-medium">
                          {shipment.company}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-[#7E52FF] font-medium">
                    Posted: {formatDate(shipment.created_at)}
                  </span>
                </div>

                {}
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-4">
                  {shipment.title || "Untitled Shipment"}
                </h3>

                {}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#B8FF00]"></div>
                    <span className="font-semibold text-[#1a1a1a]">
                      {shipment.origin}
                    </span>
                  </div>
                  <svg
                    width="20"
                    height="12"
                    viewBox="0 0 24 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 6H20"
                      stroke="#9ca3af"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M17 3L20 6L17 9"
                      stroke="#9ca3af"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#7E52FF]"></div>
                    <span className="font-semibold text-[#1a1a1a]">
                      {shipment.destination}
                    </span>
                  </div>
                </div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {}
                  <div className="flex items-center gap-2">
                    <img src={ICONS.calendar} alt="Date" className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Pickup Date</p>
                      <p className="text-sm font-semibold text-[#1a1a1a]">
                        {getDisplayDate(shipment)}
                      </p>
                    </div>
                  </div>

                  {}
                  <div className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L3 7L12 12L21 7L12 2Z"
                        stroke="#7E52FF"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 12L12 17L21 12"
                        stroke="#7E52FF"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 17L12 22L21 17"
                        stroke="#7E52FF"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Product Type</p>
                      {shipment.shipment_type ? (
                        <span
                          style={{
                            display: "inline-block",
                            backgroundColor: getShipmentTypeColor(
                              shipment.shipment_type,
                            ).bg,
                            color: getShipmentTypeColor(shipment.shipment_type)
                              .text,
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: "6px",
                            border: `1px solid ${getShipmentTypeColor(shipment.shipment_type).border || "transparent"}`,
                          }}
                        >
                          {getShipmentTypeLabel(shipment.shipment_type, lang)}
                        </span>
                      ) : (
                        <p className="text-sm font-semibold text-[#9ca3af]">
                          —
                        </p>
                      )}
                    </div>
                  </div>

                  {}
                  <div className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="2"
                        y="5"
                        width="14"
                        height="10"
                        rx="1.5"
                        stroke="#7E52FF"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M16 7.5L19 7.5L21 11V15H16V7.5Z"
                        stroke="#7E52FF"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="6"
                        cy="16"
                        r="2"
                        stroke="#7E52FF"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="18"
                        cy="16"
                        r="2"
                        stroke="#7E52FF"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Truck Type</p>
                      {shipment.truck_type ? (
                        <span
                          style={{
                            display: "inline-block",
                            backgroundColor: getTruckTypeColor(
                              shipment.truck_type,
                            ).bg,
                            color: getTruckTypeColor(shipment.truck_type).text,
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: "6px",
                            border: `1px solid ${getTruckTypeColor(shipment.truck_type).border || "transparent"}`,
                          }}
                        >
                          {getTruckTypeLabel(shipment.truck_type, lang)}
                        </span>
                      ) : (
                        <p className="text-sm font-semibold text-[#9ca3af]">
                          —
                        </p>
                      )}
                    </div>
                  </div>

                  {}
                  <div className="flex items-center gap-2">
                    <img src={ICONS.weight} alt="Weight" className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Tonnage</p>
                      <p className="text-sm font-semibold text-[#1a1a1a]">
                        {shipment.weight} tons
                      </p>
                    </div>
                  </div>

                  {}
                  <div className="flex items-center gap-2">
                    <img src={ICONS.volume} alt="Volume" className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Volume</p>
                      <p className="text-sm font-semibold text-[#1a1a1a]">
                        {shipment.volume} m³
                      </p>
                    </div>
                  </div>
                </div>

                {}
                <div className="flex items-center justify-between pt-4 border-t border-[#e0e0e0]">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() =>
                        router.push(`/edit-shipment?id=${shipment.id}`)
                      }
                      className="flex items-center gap-2 text-[#666] hover:text-[#1a1a1a] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <img src={ICONS.edit} alt="Edit" className="w-5 h-5" />
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteShipment(shipment.id)}
                      className="flex items-center gap-2 text-red-500 hover:text-red-600 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <img
                        src={ICONS.delete}
                        alt="Delete"
                        className="w-5 h-5"
                      />
                      DELETE
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/shipment-listing/${shipment.id}`)
                      }
                      className="flex items-center gap-2 text-[#7E52FF] hover:text-[#6d41ff] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      VIEW DETAILS
                      <img
                        src={ICONS.arrowRight}
                        alt="View"
                        className="w-3 h-3"
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        router.push(`/localisation-shipment/${shipment.id}`)
                      }
                      className="rounded-full px-10 py-2 text-xs font-semibold text-[#7E52FF] bg-white border border-black hover:bg-[#f5f5f5]"
                    >
                      VIEW IN MAP
                    </button>

                    {mapStatus(shipment.status) === "active" ? (
                      <button
                        onClick={() => handleMarkAsCompleted(shipment.id)}
                        disabled={updatingShipmentId === shipment.id}
                        className={`bg-white hover:bg-[#f5f5f5] text-[#1a1a1a] font-bold rounded-full px-6 py-2 text-xs transition-all border border-[#d0d0d0] cursor-pointer ${
                          updatingShipmentId === shipment.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {updatingShipmentId === shipment.id
                          ? "Processing..."
                          : "MARK AS COMPLETED"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivate(shipment.id)}
                        disabled={updatingShipmentId === shipment.id}
                        className={`bg-[#7E52FF] hover:bg-[#6d41ff] text-white font-bold rounded-full px-6 py-2 text-xs transition-all cursor-pointer ${
                          updatingShipmentId === shipment.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {updatingShipmentId === shipment.id
                          ? "Processing..."
                          : "REACTIVATE"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                className="w-10 h-10 flex items-center justify-center hover:bg-[#f0f0f0] rounded-full transition-colors border border-[#e0e0e0] cursor-pointer"
                disabled={currentPage === 1}
              >
                <img
                  src={ICONS.chevronLeft}
                  alt="Previous"
                  className="w-2.5 h-2.5"
                />
              </button>

              {visiblePages.map((page, index) =>
                page === "ellipsis" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-1 text-muted-foreground"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full font-semibold text-sm transition-colors cursor-pointer ${
                      page === currentPage
                        ? "bg-[#7E52FF] text-white"
                        : "bg-white text-foreground hover:bg-[#f0f0f0] border border-[#e0e0e0]"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                className="w-10 h-10 flex items-center justify-center hover:bg-[#f0f0f0] rounded-full transition-colors border border-[#e0e0e0] cursor-pointer"
                disabled={currentPage === totalPages}
              >
                <img
                  src={ICONS.chevronRight}
                  alt="Next"
                  className="w-2.5 h-2.5"
                />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}