"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { getVisiblePages } from "./pagination-utils";
import { getTruckTypeLabel, getTruckTypeColor } from "@/app/constants/truck-types";

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
};

const normalizeTruckPhotoUrl = (rawPath: string): string => {
  if (!rawPath) return "";
  if (/^https?:\/\//.test(rawPath)) return rawPath;
  const normalized = rawPath.replace(/\\/g, "/");
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  const uploadsIndex = normalized.toLowerCase().lastIndexOf("/uploads/");
  if (uploadsIndex !== -1) return `${apiBase}${normalized.slice(uploadsIndex)}`;
  if (normalized.startsWith("uploads/")) return `${apiBase}/${normalized}`;
  if (normalized.startsWith("/uploads/")) return `${apiBase}${normalized}`;
  return normalized;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
};

export default function MyTrucksMobile() {
  const { t, lang } = useLang();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTrucks = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trucks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch trucks (${res.status})`);
      const data = await res.json();
      const trucksArray = Array.isArray(data) ? data : (data?.trucks ?? data?.data?.trucks ?? data?.items);
      setTrucks(Array.isArray(trucksArray) ? trucksArray : []);
    } catch (err) {
      console.error("Failed to fetch trucks:", err);
      setError("Failed to load trucks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchTrucks(); }, []);

  const handleDeleteTruck = async (truckId: string) => {
    if (!window.confirm("Delete this truck?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trucks/${truckId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      if (!res.ok) {
        if (res.status === 409) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Truck is assigned to an active route and cannot be deleted");
        }
        throw new Error(`Failed to delete truck (${res.status})`);
      }
      setTrucks((prev) => prev.filter((truck) => truck.id !== truckId));
    } catch (err) {
      console.error("Failed to delete truck:", err);
      setError("Failed to delete truck");
    }
  };

  const totalPages = Math.ceil(trucks.length / 6);
  const displayedTrucks = trucks.slice((currentPage - 1) * 6, currentPage * 6);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-foreground">My Trucks</h1>
        <button
          onClick={() => router.push("/add-truck")}
          className="bg-[#B8FF00] hover:bg-[#a8ee00] text-[#1a1a1a] font-semibold rounded-full px-4 py-1.5 transition-colors flex items-center gap-1.5 text-sm cursor-pointer"
        >
          <img src={ICONS.plus} alt="Add" style={{ width: "14px", height: "14px", objectFit: "contain" }} />
          Add Truck
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E52FF] mb-2"></div>
            <p className="text-[#666] text-sm">Loading trucks...</p>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
          <button onClick={fetchTrucks} className="ml-3 text-red-700 underline cursor-pointer">Retry</button>
        </div>
      )}

      {!isLoading && displayedTrucks.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-[#666] text-base">No trucks found</p>
          <button
            onClick={() => router.push("/add-truck")}
            className="mt-4 bg-[#7E52FF] text-white font-semibold rounded-full px-6 py-2 text-sm transition-colors hover:bg-[#6d41ff] cursor-pointer"
          >
            Add Your First Truck
          </button>
        </div>
      )}

      {!isLoading && displayedTrucks.length > 0 && (
        <>
          <div className="space-y-3 mb-6">
            {displayedTrucks.map((truck) => (
              <div key={truck.id} className="border-2 border-[#e0e0e0] rounded-2xl p-4 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    {truck.truck_type ? (
                      <span style={{
                        display: "inline-block",
                        backgroundColor: getTruckTypeColor(truck.truck_type).bg,
                        color: getTruckTypeColor(truck.truck_type).text,
                        fontSize: "11px", fontWeight: 700, padding: "3px 10px",
                        borderRadius: "6px",
                        border: `1px solid ${getTruckTypeColor(truck.truck_type).border || "transparent"}`,
                        marginBottom: "6px",
                      }}>
                        {getTruckTypeLabel(truck.truck_type, lang)}
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-[#1a1a1a]">Unknown Truck</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => router.push(`/edit-truck?id=${truck.id}`)}
                      className="p-1.5 hover:bg-[#f0f0f0] rounded-lg transition-colors cursor-pointer"
                    >
                      <img src={ICONS.edit} alt="Edit" style={{ width: "16px", height: "16px", objectFit: "contain" }} />
                    </button>
                    <button
                      onClick={() => handleDeleteTruck(truck.id)}
                      className="p-1.5 hover:bg-[#fef2f2] rounded-lg transition-colors cursor-pointer"
                    >
                      <img src={ICONS.delete} alt="Delete" style={{ width: "18px", height: "18px", objectFit: "contain", filter: "brightness(0) saturate(100%) invert(40%) sepia(97%) saturate(2635%) hue-rotate(333deg) brightness(96%) contrast(96%)" }} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-[#7E52FF] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">{truck.license_plate}</span>
                  <span className="text-[10px] text-[#999]">{formatDate(truck.created_at)}</span>
                </div>

                <div className="flex items-start gap-3 mb-2">
                  <div className="w-[80px] h-[60px] bg-[#f5f5f5] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-dashed border-[#d0d0d0]">
                    {truck.truck_pictures && truck.truck_pictures.length > 0 ? (
                      <img src={normalizeTruckPhotoUrl(truck.truck_pictures[0])} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#999] text-[10px]">No photo</span>
                    )}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-1.5">
                    <div>
                      <p className="text-[9px] text-[#999] font-semibold">Max Tonnage</p>
                      <p className="text-xs font-bold text-[#1a1a1a]">{truck.max_tonnage}t</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-[#999] font-semibold">Max Volume</p>
                      <p className="text-xs font-bold text-[#1a1a1a]">{truck.max_volume}m³</p>
                    </div>
                  </div>
                </div>

                {(truck.year || truck.brand || truck.model) && (
                  <div className="flex items-center gap-2 text-[11px] text-[#666] pt-2 border-t border-[#f0f0f0]">
                    {truck.year && <span>{truck.year}</span>}
                    {truck.brand && <span>{truck.brand}</span>}
                    {truck.model && <span>{truck.model}</span>}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[#f0f0f0] mt-2">
                  {truck.truck_pictures && truck.truck_pictures.length > 0 ? (
                    <button onClick={() => router.push(`/truck-photos?id=${truck.id}&action=view`)}
                      className="text-[#7E52FF] text-[10px] font-semibold cursor-pointer">
                      Photos ({truck.truck_pictures.length})
                    </button>
                  ) : (
                    <button onClick={() => router.push(`/truck-photos?id=${truck.id}&action=add`)}
                      className="text-[#7E52FF] text-[10px] font-semibold cursor-pointer">
                      Add Photo
                    </button>
                  )}
                  <button onClick={() => router.push(`/edit-truck?id=${truck.id}`)}
                    className="text-[#7E52FF] text-[10px] font-semibold cursor-pointer">
                    Details →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e0e0e0] cursor-pointer"
                disabled={currentPage === 1}>
                <img src={ICONS.chevronLeft} alt="Prev" className="w-2.5 h-2.5" />
              </button>
              {visiblePages.map((page, index) =>
                page === "ellipsis" ? (
                  <span key={`e-${index}`} className="px-1 text-xs">...</span>
                ) : (
                  <button key={page} onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      page === currentPage ? "bg-[#7E52FF] text-white" : "bg-white text-foreground border border-[#e0e0e0]"
                    }`}>{page}</button>
                ),
              )}
              <button onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e0e0e0] cursor-pointer"
                disabled={currentPage === totalPages}>
                <img src={ICONS.chevronRight} alt="Next" className="w-2.5 h-2.5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
