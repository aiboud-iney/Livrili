"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { getVisiblePages } from "./pagination-utils";
import { getTruckTypeLabel, getTruckTypeColor } from "@/app/constants/truck-types";
import { getShipmentTypeLabel, getShipmentTypeColor } from "@/app/constants/shipment-types";

type ShipmentStatus = "all" | "active" | "completed";

interface Shipment {
  id: string;
  title: string;
  origin: string;
  destination: string;
  from_pickup_date: string;
  to_pickup_date: string;
  weight: number;
  volume: number;
  status: "posted" | "in_transit" | "completed" | "cancelled";
  created_at: string;
  shipment_pictures?: string[];
  truck_type?: string | null;
  shipment_type?: string | null;
  company?: string;
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
  user: "/icons/user-icon.png",
};

export default function MyShipmentsMobile() {
  const router = useRouter();
  const { t, lang } = useLang();
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingShipmentId, setUpdatingShipmentId] = useState<string | null>(null);
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
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to update shipment (${res.status})`);
      }

      setShipments(prev =>
        prev.map(shipment =>
          shipment.id === shipmentId ? { ...shipment, status: "completed" } : shipment
        )
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
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to reactivate (${res.status})`);
      }

      setShipments(prev =>
        prev.map(shipment =>
          shipment.id === shipmentId ? { ...shipment, status: "in_transit" } : shipment
        )
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
    statusFilter === "all"
      ? shipments
      : shipments.filter((s) => mapStatus(s.status) === statusFilter);

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
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-foreground">My Shipments</h1>
      </div>

      {}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {["all", "active", "completed"].map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setStatusFilter(filter as ShipmentStatus);
              setCurrentPage(1);
            }}
            className={`px-4 py-1.5 rounded-full font-medium capitalize text-sm transition-all whitespace-nowrap cursor-pointer ${
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
            <p className="text-[#666] text-sm">Loading shipments...</p>
          </div>
        </div>
      )}

      {}
      {error && !isLoading && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
          <button onClick={fetchShipments} className="ml-3 text-red-700 underline">Retry</button>
        </div>
      )}

      {}
      {!isLoading && filteredShipments.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-[#666] text-base">
            {statusFilter === "all" ? "No shipments found" : `No ${statusFilter} shipments`}
          </p>
        </div>
      )}

      {}
      {!isLoading && displayedShipments.length > 0 && (
        <div className="space-y-3 mb-6">
          {displayedShipments.map((shipment) => (
            <div
              key={shipment.id}
              className={`border-2 rounded-2xl bg-white p-4 transition-all ${
                mapStatus(shipment.status) === "active"
                  ? "border-[#7E52FF]"
                  : "border-[#e0e0e0] opacity-75"
              }`}
            >
              {}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    mapStatus(shipment.status) === "active"
                      ? "bg-[#7E52FF] text-white"
                      : "bg-[#f0f0f0] text-[#666]"
                  }`}
                >
                  {mapStatus(shipment.status) === "active" ? "ACTIVE" : "COMPLETED"}
                </span>
                <span className="text-xs text-[#7E52FF] font-medium">
                  {formatDate(shipment.created_at)}
                </span>
              </div>

              {}
              {shipment.company && (
                <div className="flex items-center gap-2 mb-2">
                  <img src={ICONS.user} alt="Company" className="w-3 h-3 opacity-60" />
                  <span className="text-xs text-[#666] font-medium">{shipment.company}</span>
                </div>
              )}

              {}
              <h3 className="text-base font-bold text-[#1a1a1a] mb-3">
                {shipment.title || "Untitled Shipment"}
              </h3>

              {}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#B8FF00]" />
                  <div className="w-px h-4 bg-gray-300" />
                  <div className="w-2 h-2 rounded-full bg-[#7E52FF]" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-[#1a1a1a]">{shipment.origin}</span>
                  <span className="text-sm font-semibold text-[#1a1a1a]">{shipment.destination}</span>
                </div>
              </div>

              {}
              <div className="flex items-center gap-1.5 mb-2">
                <img src={ICONS.calendar} alt="Date" className="w-3.5 h-3.5" />
                <span className="text-xs font-medium text-[#1a1a1a]">
                  {formatDate(shipment.from_pickup_date)} - {formatDate(shipment.to_pickup_date)}
                </span>
              </div>

              {}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
                  <img src={ICONS.weight} alt="Weight" className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{shipment.weight} tons</span>
                </div>
                <div className="flex items-center gap-1">
                  <img src={ICONS.volume} alt="Volume" className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{shipment.volume} m³</span>
                </div>
              </div>

              {}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {shipment.shipment_type && (
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: getShipmentTypeColor(shipment.shipment_type).bg,
                      color: getShipmentTypeColor(shipment.shipment_type).text,
                      fontSize: "9px",
                      fontWeight: 700,
                      padding: "2px 5px",
                      borderRadius: "4px",
                      border: `1px solid ${getShipmentTypeColor(shipment.shipment_type).border || "transparent"}`,
                    }}
                  >
                    {getShipmentTypeLabel(shipment.shipment_type, lang)}
                  </span>
                )}
                {shipment.truck_type && (
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: getTruckTypeColor(shipment.truck_type).bg,
                      color: getTruckTypeColor(shipment.truck_type).text,
                      fontSize: "9px",
                      fontWeight: 700,
                      padding: "2px 5px",
                      borderRadius: "4px",
                      border: `1px solid ${getTruckTypeColor(shipment.truck_type).border || "transparent"}`,
                    }}
                  >
                    {getTruckTypeLabel(shipment.truck_type, lang)}
                  </span>
                )}
              </div>

              {}
              <div className="flex items-center justify-between pt-3 border-t border-[#e0e0e0]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.push(`/edit-shipment?id=${shipment.id}`)}
                    className="flex items-center gap-1.5 text-[#666] text-xs font-semibold"
                  >
                    <img src={ICONS.edit} alt="Edit" className="w-4 h-4" />
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDeleteShipment(shipment.id)}
                    className="flex items-center gap-1.5 text-red-500 text-xs font-semibold"
                  >
                    <img src={ICONS.delete} alt="Delete" className="w-4 h-4" />
                    DEL
                  </button>
                  <button
                    onClick={() => router.push(`/shipment-listing/${shipment.id}`)}
                    className="flex items-center gap-1 text-[#7E52FF] text-xs font-semibold"
                  >
                    DETAILS
                    <img src={ICONS.arrowRight} alt="Details" className="w-3 h-3" />
                  </button>
                </div>
                {mapStatus(shipment.status) === "active" ? (
                  <button
                    onClick={() => handleMarkAsCompleted(shipment.id)}
                    disabled={updatingShipmentId === shipment.id}
                    className={`bg-[#B8FF00] text-[#1a1a1a] font-bold rounded-full px-3 py-1.5 text-[10px] transition-all cursor-pointer ${
                      updatingShipmentId === shipment.id ? "opacity-50" : ""
                    }`}
                  >
                    {updatingShipmentId === shipment.id ? "..." : "COMPLETE"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleReactivate(shipment.id)}
                    disabled={updatingShipmentId === shipment.id}
                    className={`bg-[#7E52FF] text-white font-bold rounded-full px-3 py-1.5 text-[10px] transition-all cursor-pointer ${
                      updatingShipmentId === shipment.id ? "opacity-50" : ""
                    }`}
                  >
                    {updatingShipmentId === shipment.id ? "..." : "REACTIVATE"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e0e0e0] cursor-pointer"
            disabled={currentPage === 1}
          >
            <img src={ICONS.chevronLeft} alt="Previous" className="w-2.5 h-2.5" />
          </button>
          {visiblePages.map((page, index) =>
            page === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className="px-1 text-xs">...</span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  page === currentPage
                    ? "bg-[#7E52FF] text-white"
                    : "bg-white text-foreground border border-[#e0e0e0]"
                }`}
              >
                {page}
              </button>
            ),
          )}
          <button
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e0e0e0] cursor-pointer"
            disabled={currentPage === totalPages}
          >
            <img src={ICONS.chevronRight} alt="Next" className="w-2.5 h-2.5" />
          </button>
        </div>
      )}
    </div>
  );
}