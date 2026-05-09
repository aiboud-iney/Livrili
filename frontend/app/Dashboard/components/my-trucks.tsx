"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { getVisiblePages } from "./pagination-utils";
import { getTruckTypeLabel, getTruckTypeColor } from "@/app/constants/truck-types";
import AddTruckDashboard from "./AddTruckDashboard";

interface Truck {
  id: string;
  truck_type: string;
  license_plate: string;
  max_tonnage: number;
  max_volume: number;
  truck_pictures?: string[];
  created_at: string;
  status?: string;
  year?: number;
  brand?: string;
  model?: string;
}

const ICONS = {
  plus: "/icons/add truck.png",
  edit: "/icons/edit dashboard.png",
  delete: "/icons/delete dashboard.png",
  externalLink: "/icons/view all photos.png",
  photo: "/icons/add photos.png",
  chevronLeft: "/icons/go left dashboard.png",
  chevronRight: "/icons/go right dashboard.png",
  calendar: "/icons/route dashboard calendar.png",
  weight: "/icons/route dashboard weight.png",
  volume: "/icons/route dashboard volume.png",
  license: "/icons/license-plate.png",
};

const normalizeTruckPhotoUrl = (rawPath: string): string => {
  if (!rawPath) return "";
  if (/^https?:\/\//.test(rawPath)) return rawPath;

  const normalized = rawPath.replace(/\\/g, "/");
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  const uploadsIndex = normalized.toLowerCase().lastIndexOf("/uploads/");

  if (uploadsIndex !== -1) {
    return `${apiBase}${normalized.slice(uploadsIndex)}`;
  }

  if (normalized.startsWith("uploads/")) return `${apiBase}/${normalized}`;
  if (normalized.startsWith("/uploads/")) return `${apiBase}${normalized}`;

  return normalized;
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

export default function MyTrucks() {
  const { t, lang } = useLang();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddTruckForm, setShowAddTruckForm] = useState(false);

  const fetchTrucks = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trucks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch trucks (${res.status})`);
      }

      const data = await res.json();
      const trucksArray = Array.isArray(data)
        ? data
        : (data?.trucks ?? data?.data?.trucks ?? data?.items);
      setTrucks(Array.isArray(trucksArray) ? trucksArray : []);
    } catch (err) {
      console.error("Failed to fetch trucks:", err);
      setError("Failed to load trucks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchTrucks();
    };
    window.addEventListener("trucks-refreshed", handleRefresh);
    return () => window.removeEventListener("trucks-refreshed", handleRefresh);
  }, []);

  const totalPages = Math.ceil(trucks.length / 6);
  const displayedTrucks = trucks.slice((currentPage - 1) * 6, currentPage * 6);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDeleteTruck = async (truckId: string) => {
    if (!window.confirm("Delete this truck?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trucks/${truckId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to delete truck (${res.status})`);
      }

      setTrucks((prev) => prev.filter((truck) => truck.id !== truckId));
    } catch (err) {
      console.error("Failed to delete truck:", err);
      setError("Failed to delete truck");
    }
  };

  return (
    <div className="p-10 md:p-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Trucks</h1>
        <button
          onClick={() => setShowAddTruckForm(!showAddTruckForm)}
          className="bg-[#B8FF00] hover:bg-[#a8ee00] text-[#1a1a1a] font-semibold rounded-full px-5 py-2 transition-colors flex items-center gap-2 text-sm cursor-pointer"
        >
          <img
            src={ICONS.plus}
            alt="Add"
            style={{ width: "15px", height: "15px", objectFit: "contain" }}
          />
          {showAddTruckForm ? "Cancel" : "Add Truck"}
        </button>
      </div>

      {}
      {showAddTruckForm && (
        <div className="mb-8">
          <AddTruckDashboard
            onTruckAdded={() => {
              setShowAddTruckForm(false)
              fetchTrucks()
            }}
          />
        </div>
      )}

      {}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E52FF] mb-2"></div>
            <p className="text-[#666]">Loading trucks...</p>
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
      {!isLoading && displayedTrucks.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-[#666] text-lg">No trucks found</p>
          <button
            onClick={() => setShowAddTruckForm(true)}
            className="mt-4 bg-[#7E52FF] text-white font-semibold rounded-full px-6 py-2 text-sm transition-colors hover:bg-[#6d41ff] cursor-pointer"
          >
            Add Your First Truck
          </button>
        </div>
      )}

      {}
      {!isLoading && displayedTrucks.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {displayedTrucks.map((truck) => (
              <div
                key={truck.id}
                className="border-2 border-[#e0e0e0] rounded-2xl p-6 bg-white hover:shadow-lg transition-shadow"
              >
                {}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {}
                    {truck.truck_type ? (
                      <span
                        style={{
                          display: "inline-block",
                          backgroundColor: getTruckTypeColor(truck.truck_type).bg,
                          color: getTruckTypeColor(truck.truck_type).text,
                          fontSize: "13px",
                          fontWeight: 700,
                          padding: "4px 12px",
                          borderRadius: "8px",
                          border: `1px solid ${getTruckTypeColor(truck.truck_type).border || "transparent"}`,
                          marginBottom: "8px",
                        }}
                      >
                        {getTruckTypeLabel(truck.truck_type, lang)}
                      </span>
                    ) : (
                      <span className="text-lg font-bold text-[#1a1a1a]">
                        {truck.truck_type || "Unknown Truck"}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#666] font-medium">
                    Added: {formatDate(truck.created_at)}
                  </span>
                </div>

                {}
                <div className="flex gap-5 mb-4">
                  {}
                  <div className="w-[140px] h-[100px] bg-[#f5f5f5] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-dashed border-[#d0d0d0]">
                    {truck.truck_pictures && truck.truck_pictures.length > 0 ? (
                      <img
                        src={normalizeTruckPhotoUrl(truck.truck_pictures[0])}
                        alt={truck.truck_type}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-[#999] text-xs">
                        <p>No photo</p>
                        <p>available</p>
                      </div>
                    )}
                  </div>

                  {}
                  <div className="flex-1">
                    {}
                    <div className="flex items-center gap-2 mb-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="6" width="18" height="12" rx="2" stroke="#7E52FF" strokeWidth="1.5"/>
                        <path d="M8 12H16" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
                        <circle cx="12" cy="12" r="1.5" fill="#7E52FF"/>
                      </svg>
                      <span className="inline-block bg-[#7E52FF] text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {truck.license_plate}
                      </span>
                    </div>

                    {}
                    <div className="grid grid-cols-2 gap-3">
                      {}
                      <div className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L20 7V12L12 17L4 12V7L12 2Z" stroke="#7E52FF" strokeWidth="1.5" strokeLinejoin="round"/>
                          <path d="M4 12L12 17L20 12" stroke="#7E52FF" strokeWidth="1.5" strokeLinejoin="round"/>
                          <path d="M12 22V17" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <div>
                          <p className="text-[10px] text-[#999] font-semibold tracking-wide">Max Tonnage</p>
                          <p className="text-sm font-bold text-[#1a1a1a]">
                            {truck.max_tonnage} tons
                          </p>
                        </div>
                      </div>

                      {}
                      <div className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 8L12 3L21 8L12 13L3 8Z" stroke="#7E52FF" strokeWidth="1.5" strokeLinejoin="round"/>
                          <path d="M3 13L12 18L21 13" stroke="#7E52FF" strokeWidth="1.5" strokeLinejoin="round"/>
                          <path d="M3 18L12 23L21 18" stroke="#7E52FF" strokeWidth="1.5" strokeLinejoin="round"/>
                        </svg>
                        <div>
                          <p className="text-[10px] text-[#999] font-semibold tracking-wide">Max Volume</p>
                          <p className="text-sm font-bold text-[#1a1a1a]">
                            {truck.max_volume} m³
                          </p>
                        </div>
                      </div>
                    </div>

                    {}
                    {(truck.year || truck.brand || truck.model) && (
                      <div className="mt-3 pt-2 border-t border-[#f0f0f0]">
                        <div className="flex items-center gap-3 text-xs text-[#666]">
                          {truck.year && <span>{truck.year}</span>}
                          {truck.brand && <span>{truck.brand}</span>}
                          {truck.model && <span>{truck.model}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {}
                <div className="flex items-center justify-between pt-4 border-t border-[#e0e0e0]">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => router.push(`/edit-truck?id=${truck.id}`)}
                      className="flex items-center gap-1.5 text-[#666] hover:text-foreground text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <img
                        src={ICONS.edit}
                        alt="Edit"
                        style={{
                          width: "15px",
                          height: "15px",
                          objectFit: "contain",
                        }}
                      />
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteTruck(truck.id)}
                      className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-xs font-semibold transition-colors cursor-pointer"
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
                  </div>
                  {truck.truck_pictures && truck.truck_pictures.length > 0 ? (
                    <button
                      onClick={() =>
                        router.push(`/truck-photos?id=${truck.id}&action=view`)
                      }
                      className="text-[#7E52FF] hover:text-[#6d41ff] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      View All Photos ({truck.truck_pictures.length})
                      <img
                        src={ICONS.externalLink}
                        alt="View"
                        style={{
                          width: "10px",
                          height: "10px",
                          objectFit: "contain",
                        }}
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        router.push(`/truck-photos?id=${truck.id}&action=add`)
                      }
                      className="text-[#7E52FF] hover:text-[#6d41ff] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      Add Photo
                      <img
                        src={ICONS.photo}
                        alt="Photo"
                        style={{
                          width: "15px",
                          height: "15px",
                          objectFit: "contain",
                        }}
                      />
                    </button>
                  )}
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
                className="w-10 h-10 flex items-center justify-center hover:bg-[#f0f0f0] rounded-full transition-colors border border-[#e0e0e0]"
                disabled={currentPage === 1}
              >
                <img
                  src={ICONS.chevronLeft}
                  alt="Previous"
                  style={{
                    width: "10px",
                    height: "10px",
                    objectFit: "contain",
                  }}
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
                    className={`w-10 h-10 rounded-full font-semibold text-sm transition-colors ${
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
                className="w-10 h-10 flex items-center justify-center hover:bg-[#f0f0f0] rounded-full transition-colors border border-[#e0e0e0]"
                disabled={currentPage === totalPages}
              >
                <img
                  src={ICONS.chevronRight}
                  alt="Next"
                  style={{
                    width: "10px",
                    height: "10px",
                    objectFit: "contain",
                  }}
                />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}