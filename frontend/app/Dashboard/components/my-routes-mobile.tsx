"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { getVisiblePages } from "./pagination-utils";
import { getTruckTypeLabel, getTruckTypeColor } from "@/app/constants/truck-types";

type RouteStatus = "all" | "active" | "completed";

interface Route {
  id: string;
  origin: string;
  destination: string;
  departure_date?: string;
  end_date?: string;
  return_start_date?: string;
  return_end_date?: string;
  start_date?: string;
  truck_type: string;
  max_weight?: string | number;
  max_volume?: string | number;
  capacity_tonnage?: number;
  capacity_volume?: number;
  status: string;
  created_at: string;
  trip_type?: "aller" | "aller-retour" | null;
}

const ICONS = {
  calendar: "/icons/route dashboard calendar.png",
  trucks: "/icons/route dashboard truck.png",
  weight: "/icons/route dashboard weight.png",
  volume: "/icons/route dashboard volume.png",
  edit: "/icons/edit dashboard.png",
  delete: "/icons/delete dashboard.png",
  externalLink: "/icons/details dashboard.png",
  chevronLeft: "/icons/go left dashboard.png",
  chevronRight: "/icons/go right dashboard.png",
};

export default function MyRoutesMobile() {
  const { t, lang } = useLang();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<RouteStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingRouteId, setUpdatingRouteId] = useState<string | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/routes/my-routes?page=1&limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch routes (${res.status})`);
      }

      const data = await res.json();
      const routesArray = Array.isArray(data) ? data : (data?.routes ?? data?.data?.routes ?? data?.items);
      setRoutes(Array.isArray(routesArray) ? routesArray : []);
    } catch (err) {
      console.error("Failed to fetch routes:", err);
      setError("Failed to load routes");
    } finally {
      setIsLoading(false);
    }
  };

  const mapStatus = (status: string): "active" | "completed" => {
    return status === "completed" ? "completed" : "active";
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

  const getRouteWeight = (route: Route): string => {
    return String(route.max_weight ?? route.capacity_tonnage ?? "N/A");
  };

  const getRouteVolume = (route: Route): string => {
    return String(route.max_volume ?? route.capacity_volume ?? "N/A");
  };

  const handleMarkAsCompleted = async (routeId: string) => {
    if (!window.confirm("Mark this route as completed?")) return;

    try {
      setUpdatingRouteId(routeId);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/routes/${routeId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ status: "completed" }),
        }
      );

      if (!res.ok) throw new Error(`Failed to update route (${res.status})`);

      setRoutes(prev => prev.map(route => route.id === routeId ? { ...route, status: "completed" } : route));
      alert("Route marked as completed!");
    } catch (err) {
      console.error("Failed to update route:", err);
      setError("Failed to update route status");
    } finally {
      setUpdatingRouteId(null);
    }
  };

  const handleReactivate = async (routeId: string) => {
    if (!window.confirm("Reactivate this route?")) return;

    try {
      setUpdatingRouteId(routeId);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/routes/${routeId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ status: "open" }),
        }
      );

      if (!res.ok) throw new Error(`Failed to reactivate (${res.status})`);

      setRoutes(prev => prev.map(route => route.id === routeId ? { ...route, status: "open" } : route));
      alert("Route reactivated!");
    } catch (err) {
      console.error("Failed to reactivate:", err);
      setError("Failed to reactivate route");
    } finally {
      setUpdatingRouteId(null);
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    if (!window.confirm("Delete this route? This cannot be undone.")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/routes/${routeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      if (!res.ok) throw new Error(`Failed to delete (${res.status})`);

      setRoutes(prev => prev.filter(route => route.id !== routeId));
      alert("Route deleted!");
    } catch (err) {
      console.error("Failed to delete:", err);
      setError("Failed to delete route");
    }
  };

  const filteredRoutes = statusFilter === "all"
    ? routes
    : routes.filter(route => mapStatus(route.status) === statusFilter);

  const totalPages = Math.ceil(filteredRoutes.length / 3);
  const displayedRoutes = filteredRoutes.slice((currentPage - 1) * 3, currentPage * 3);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-foreground">My Routes</h1>
      </div>

      {}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {["all", "active", "completed"].map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setStatusFilter(filter as RouteStatus);
              setCurrentPage(1);
            }}
            className={`px-4 py-1.5 rounded-full font-medium capitalize text-sm transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === filter
                ? filter === "all"
                  ? "bg-[#1a1a1a] text-white"
                  : filter === "active"
                    ? "bg-[#B8FF00] text-[#1a1a1a]"
                    : "bg-[#f0f0f0] text-[#666] font-bold"
                : "bg-white text-[#1a1a1a] border border-[#e0e0e0]"
            }`}
          >
            {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E52FF] mb-2"></div>
            <p className="text-[#666] text-sm">Loading routes...</p>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
          <button onClick={fetchRoutes} className="ml-3 text-red-700 underline">Retry</button>
        </div>
      )}

      {!isLoading && displayedRoutes.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-[#666] text-base">
            {statusFilter === "all" ? "No routes found" : `No ${statusFilter} routes`}
          </p>
        </div>
      )}

      {!isLoading && displayedRoutes.length > 0 && (
        <>
          <div className="space-y-3 mb-6">
            {displayedRoutes.map((route) => (
              <div
                key={route.id}
                className={`border-2 rounded-2xl bg-white p-4 transition-all ${
                  mapStatus(route.status) === "active" ? "border-[#B8FF00]" : "border-[#e0e0e0] opacity-75"
                }`}
              >
                {}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      mapStatus(route.status) === "active"
                        ? "bg-[#B8FF00] text-[#1a1a1a]"
                        : "bg-[#f0f0f0] text-[#666]"
                    }`}
                  >
                    {mapStatus(route.status) === "active" ? "ACTIVE" : "COMPLETED"}
                  </span>
                  <span className="text-xs text-[#666]">{formatDate(route.created_at)}</span>
                </div>

                {}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{route.origin}</span>
                    <span className="font-bold text-sm">{route.destination}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#7E52FF]" />
                    <div className="flex-1 h-0.5 bg-gray-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#7E52FF]" />
                  </div>
                </div>

                {}
                <div className="flex items-center gap-2 mb-2">
                  <img src={ICONS.calendar} alt="Date" className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold text-[#1a1a1a]">
                    {formatDate(route.start_date || route.departure_date || "")} - {formatDate(route.end_date || route.departure_date || "")}
                  </span>
                </div>

                {}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: route.trip_type === "aller-retour" ? "#fef3c7" : "#e0f2fe",
                      color: route.trip_type === "aller-retour" ? "#92400e" : "#0369a1",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {route.trip_type === "aller-retour" ? "Round Trip" : "One Way"}
                  </span>
                  {route.truck_type && (
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: getTruckTypeColor(route.truck_type).bg,
                        color: getTruckTypeColor(route.truck_type).text,
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: "4px",
                        border: `1px solid ${getTruckTypeColor(route.truck_type).border || "transparent"}`,
                      }}
                    >
                      {getTruckTypeLabel(route.truck_type, lang)}
                    </span>
                  )}
                </div>

                {}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5">
                    <img src={ICONS.weight} alt="Weight" className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">{getRouteWeight(route)} tons</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <img src={ICONS.volume} alt="Volume" className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">{getRouteVolume(route)} m³</span>
                  </div>
                </div>

                {}
                <div className="flex items-center justify-between pt-3 border-t border-[#e0e0e0]">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => router.push(`/edit-route?id=${route.id}`)}
                      className="flex items-center gap-1.5 text-[#666] text-xs font-semibold"
                    >
                      <img src={ICONS.edit} alt="Edit" className="w-4 h-4" />
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteRoute(route.id)}
                      className="flex items-center gap-1.5 text-red-500 text-xs font-semibold"
                    >
                      <img src={ICONS.delete} alt="Delete" className="w-4 h-4" />
                      DEL
                    </button>
                  </div>
                  {mapStatus(route.status) === "active" ? (
                    <button
                      onClick={() => handleMarkAsCompleted(route.id)}
                      disabled={updatingRouteId === route.id}
                      className={`bg-[#B8FF00] text-[#1a1a1a] font-bold rounded-full px-3 py-1.5 text-[10px] transition-all cursor-pointer ${
                        updatingRouteId === route.id ? "opacity-50" : ""
                      }`}
                    >
                      {updatingRouteId === route.id ? "..." : "COMPLETE"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReactivate(route.id)}
                      disabled={updatingRouteId === route.id}
                      className={`bg-[#7E52FF] text-white font-bold rounded-full px-3 py-1.5 text-[10px] transition-all cursor-pointer ${
                        updatingRouteId === route.id ? "opacity-50" : ""
                      }`}
                    >
                      {updatingRouteId === route.id ? "..." : "REACTIVATE"}
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
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e0e0e0] cursor-pointer"
                disabled={currentPage === 1}
              >
                <img src={ICONS.chevronLeft} alt="Prev" className="w-2.5 h-2.5" />
              </button>
              {visiblePages.map((page, idx) =>
                page === "ellipsis" ? (
                  <span key={idx} className="px-1 text-xs">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-xs font-semibold cursor-pointer ${
                      page === currentPage ? "bg-[#7E52FF] text-white" : "border border-[#e0e0e0]"
                    }`}
                  >
                    {page}
                  </button>
                )
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
        </>
      )}
    </div>
  );
}