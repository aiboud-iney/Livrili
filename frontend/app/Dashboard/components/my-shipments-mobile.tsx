"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { getVisiblePages } from "./pagination-utils";

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
};

export default function MyShipmentsMobile() {
  const router = useRouter();
  const { t } = useLang();
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchShipments();
  }, []);

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

  const handleDeleteShipment = async (shipmentId: string) => {
    if (!window.confirm("Delete this shipment?")) return;

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
    } catch (err) {
      console.error("Failed to delete shipment:", err);
      setError("Failed to delete shipment");
    }
  };
  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("myShipments")}
        </h1>
      </div>

      {}
      <div className="flex gap-2 mb-6 md:mb-8">
        {["all", "active", "completed"].map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setStatusFilter(filter as ShipmentStatus);
              setCurrentPage(1);
            }}
            className={`px-4 md:px-5 py-2 cursor-pointer rounded-full font-medium capitalize text-sm transition-colors ${
              statusFilter === filter
                ? filter === "all"
                  ? "bg-[#1a1a1a] text-white"
                  : filter === "active"
                    ? "bg-[#7E52FF] text-white font-bold "
                    : "bg-[#f0f0f0] text-[#666]  border-[#1a1a1a] font-bold "
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
        </div>
      )}

      {}
      {!isLoading && filteredShipments.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-[#666] text-lg">No shipments found</p>
        </div>
      )}

      {}
      {!isLoading && displayedShipments.length > 0 && (
        <div className="space-y-4 mb-6 md:mb-8">
          {displayedShipments.map((shipment) => (
            <div
              key={shipment.id}
              className="border border-[#e0e0e0] rounded-2xl bg-white hover:shadow-lg transition-shadow"
            >
              {}
              <div className="md:hidden p-4">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      mapStatus(shipment.status) === "active"
                        ? "bg-[#7E52FF] text-white"
                        : "bg-[#f0f0f0] text-[#666]"
                    }`}
                  >
                    {mapStatus(shipment.status) === "active"
                      ? "ACTIVE"
                      : "COMPLETED"}
                  </span>
                  <span className="text-xs text-[#7E52FF] font-medium">
                    {formatDate(shipment.created_at)}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#1a1a1a] mb-3">
                  {shipment.title}
                </h3>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#B8FF00]" />
                    <div className="w-px h-5 bg-[#e0e0e0]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#7E52FF]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-[#1a1a1a]">
                      {shipment.origin}
                    </span>
                    <span className="text-sm font-semibold text-[#1a1a1a]">
                      {shipment.destination}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mb-3">
                  <img
                    src={ICONS.calendar}
                    alt="Date"
                    style={{
                      width: "14px",
                      height: "14px",
                      objectFit: "contain",
                    }}
                  />
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    {formatDate(shipment.from_pickup_date)} -{" "}
                    {formatDate(shipment.to_pickup_date)}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-1">
                  <div className="flex items-center gap-1.5 border border-[#e0e0e0] rounded-lg px-3 py-1.5">
                    <img
                      src={ICONS.weight}
                      alt="Weight"
                      style={{
                        width: "13px",
                        height: "13px",
                        objectFit: "contain",
                      }}
                    />
                    <span className="text-sm font-medium text-[#1a1a1a]">
                      {shipment.weight}T
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 border border-[#e0e0e0] rounded-lg px-3 py-1.5">
                    <img
                      src={ICONS.volume}
                      alt="Volume"
                      style={{
                        width: "13px",
                        height: "13px",
                        objectFit: "contain",
                      }}
                    />
                    <span className="text-sm font-medium text-[#1a1a1a]">
                      {shipment.volume}m³
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#e0e0e0]">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() =>
                        router.push(`/edit-shipment?id=${shipment.id}`)
                      }
                      className="flex items-center gap-2 text-[#666] hover:text-[#1a1a1a] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <img
                        src={ICONS.edit}
                        alt="Edit"
                        style={{
                          width: "20px",
                          height: "20px",
                          objectFit: "contain",
                        }}
                      />
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteShipment(shipment.id)}
                      className="flex items-center gap-2 text-red-500 hover:text-red-600 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <img
                        src={ICONS.delete}
                        alt="Delete"
                        style={{
                          width: "20px",
                          height: "20px",
                          objectFit: "contain",
                          filter:
                            "brightness(0) saturate(100%) invert(40%) sepia(97%) saturate(2635%) hue-rotate(333deg) brightness(96%) contrast(96%)",
                        }}
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
                        alt="Details"
                        style={{
                          width: "15px",
                          height: "15px",
                          objectFit: "contain",
                        }}
                      />
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/localisation-shipment/${shipment.id}`)
                      }
                      className="rounded-full px-8 py-1.5 text-xs font-semibold text-[#7E52FF] bg-white border border-black hover:bg-[#f5f5f5]"
                    >
                      VIEW IN MAP
                    </button>
                  </div>
                  {mapStatus(shipment.status) === "active" ? (
                    <button className="bg-[#B8FF00] text-[#1a1a1a] font-bold rounded-full px-3 py-1.5 text-[10px]">
                      COMPLETE
                    </button>
                  ) : (
                    <button className="bg-[#7E52FF] text-white font-bold rounded-full px-3 py-1.5 text-[10px]">
                      REACTIVATE
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center hover:bg-[#f0f0f0] rounded-full transition-colors border border-[#e0e0e0] cursor-pointer"
          disabled={currentPage === 1}
        >
          <img
            src={ICONS.chevronLeft}
            alt="Previous"
            style={{ width: "10px", height: "10px", objectFit: "contain" }}
          />
        </button>
        {visiblePages.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="text-muted-foreground px-1"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 md:w-10 md:h-10 rounded-full font-semibold text-sm transition-colors ${page === currentPage ? "bg-[#7E52FF] text-white" : "bg-white text-foreground hover:bg-[#f0f0f0] border border-[#e0e0e0]"}`}
            >
              {page}
            </button>
          ),
        )}
        <button
          onClick={() =>
            currentPage < totalPages && setCurrentPage(currentPage + 1)
          }
          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center hover:bg-[#f0f0f0] rounded-full transition-colors border border-[#e0e0e0]"
          disabled={currentPage === totalPages}
        >
          <img
            src={ICONS.chevronRight}
            alt="Next"
            style={{ width: "10px", height: "10px", objectFit: "contain" }}
          />
        </button>
      </div>
    </div>
  );
}