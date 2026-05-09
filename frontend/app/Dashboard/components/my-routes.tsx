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
  transit_cities?: string[];
  departure_date: string;
  end_date?: string;
  availability_date?: string;
  truck_type_code: string;
  truck_type?: string;
  trip_type: "aller-retour" | "aller-simple";
  max_weight: number;
  max_volume: number;
  company?: string;
  status: string;
  created_at: string;
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

export default function MyRoutes() {
  const { t, lang } = useLang();
  const [statusFilter, setStatusFilter] = useState<RouteStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingRouteId, setUpdatingRouteId] = useState<string | null>(null);
  const router = useRouter();
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
      const routesArray = Array.isArray(data)
        ? data
        : (data?.routes ?? data?.data?.routes ?? data?.items);
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
    return String(route.max_weight ?? "N/A");
  };

  const getRouteVolume = (route: Route): string => {
    return String(route.max_volume ?? "N/A");
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

      if (!res.ok) {
        throw new Error(`Failed to update route status (${res.status})`);
      }

      setRoutes(prev =>
        prev.map(route =>
          route.id === routeId ? { ...route, status: "completed" } : route
        )
      );
      alert("Route marked as completed successfully!");
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

      if (!res.ok) {
        throw new Error(`Failed to reactivate route (${res.status})`);
      }

      setRoutes(prev =>
        prev.map(route =>
          route.id === routeId ? { ...route, status: "active" } : route
        )
      );
      alert("Route reactivated successfully!");
    } catch (err) {
      console.error("Failed to reactivate route:", err);
      setError("Failed to reactivate route");
    } finally {
      setUpdatingRouteId(null);
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    if (!window.confirm("Delete this route? This action cannot be undone.")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/routes/${routeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to delete route (${res.status})`);
      }

      setRoutes((prev) => prev.filter((route) => route.id !== routeId));
      alert("Route deleted successfully!");
    } catch (err) {
      console.error("Failed to delete route:", err);
      setError("Failed to delete route");
    }
  };

  const filteredRoutes =
    statusFilter === "all"
      ? routes
      : routes.filter((r) => mapStatus(r.status) === statusFilter);

  const totalPages = Math.ceil(filteredRoutes.length / 3);
  const displayedRoutes = filteredRoutes.slice(
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
        <h1 className="text-3xl font-bold text-foreground">My Routes</h1>
      </div>

      {}
      <div className="flex gap-2 mb-8">
        {["all", "active", "completed"].map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setStatusFilter(filter as RouteStatus);
              setCurrentPage(1);
            }}
            className={`px-5 py-2 rounded-full cursor-pointer font-medium capitalize text-sm transition-colors ${
              statusFilter === filter
                ? filter === "all"
                  ? "bg-[#1a1a1a] text-white"
                  : filter === "active"
                    ? "bg-[#B8FF00] text-[#1a1a1a]"
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

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E52FF] mb-2"></div>
            <p className="text-[#666]">Loading routes...</p>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
          <button onClick={fetchRoutes} className="ml-3 text-red-700 underline">Retry</button>
        </div>
      )}

      {!isLoading && filteredRoutes.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-[#666] text-lg">
            {statusFilter === "all" ? "No routes found" : `No ${statusFilter} routes found`}
          </p>
        </div>
      )}

      {!isLoading && displayedRoutes.length > 0 && (
        <>
          <div className="space-y-4 mb-8">
            {displayedRoutes.map((route) => (
              <div
                key={route.id}
                className={`border-2 rounded-2xl p-8 bg-white transition-shadow hover:shadow-lg ${
                  mapStatus(route.status) === "active"
                    ? "border-[#B8FF00]"
                    : "border-[#e0e0e0] opacity-75"
                }`}
              >
                {}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        mapStatus(route.status) === "active"
                          ? "bg-[#B8FF00] text-[#1a1a1a]"
                          : "bg-[#f0f0f0] text-[#666]"
                      }`}
                    >
                      {mapStatus(route.status) === "active" ? "ACTIVE" : "COMPLETED"}
                    </span>
                    {route.company && (
                      <div className="flex items-center gap-2">
                        <img src={ICONS.user} alt="Company" className="w-3 h-3 opacity-60" />
                        <span className="text-xs text-[#666] font-medium">
                          {route.company}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-[#1a1a1a] font-medium">
                    Posted: {formatDate(route.created_at)}
                  </span>
                </div>

                {}
                <div className="mb-6">
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#B8FF00]"></div>
                      <span className="font-bold text-[#1a1a1a] text-base">
                        {route.origin}
                      </span>
                    </div>

                    {route.transit_cities && route.transit_cities.length > 0 && (
                      <>
                        <span className="text-gray-400">→</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-xs text-gray-500">via</span>
                          {route.transit_cities.map((city, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                            >
                              {city}
                            </span>
                          ))}
                        </div>
                      </>
                    )}

                    <span className="text-gray-400">→</span>

                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#7E52FF]"></div>
                      <span className="font-bold text-[#1a1a1a] text-base">
                        {route.destination}
                      </span>
                    </div>
                  </div>
                </div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <img src={ICONS.calendar} alt="Date Range" className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Availability Date</p>
                      <p className="text-sm font-semibold text-[#1a1a1a]">
                        {formatDate(route.departure_date)} - {formatDate(route.end_date || route.departure_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img src={ICONS.trucks} alt="Truck" className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Truck Type</p>
                      {route.truck_type_code || route.truck_type ? (
                        <span
                          style={{
                            display: "inline-block",
                            backgroundColor: getTruckTypeColor(route.truck_type_code || route.truck_type || "").bg,
                            color: getTruckTypeColor(route.truck_type_code || route.truck_type || "").text,
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: "6px",
                            border: `1px solid ${getTruckTypeColor(route.truck_type_code || route.truck_type || "").border || "transparent"}`,
                          }}
                        >
                          {getTruckTypeLabel(route.truck_type_code || route.truck_type || "", lang)}
                        </span>
                      ) : (
                        <p className="text-sm font-semibold text-[#9ca3af]">—</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12H22" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M15 5L22 12L15 19" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Trip Type</p>
                      <span
                        style={{
                          display: "inline-block",
                          backgroundColor: route.trip_type === "aller-retour" ? "#fef3c7" : "#e0f2fe",
                          color: route.trip_type === "aller-retour" ? "#92400e" : "#0369a1",
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "6px",
                          border: `1px solid ${route.trip_type === "aller-retour" ? "#fcd34d" : "#7dd3fc"}`,
                        }}
                      >
                        {route.trip_type === "aller-retour" ? "⇄ Round Trip" : "→ One Way"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img src={ICONS.weight} alt="Weight" className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Tonnage</p>
                      <p className="text-sm font-semibold text-[#1a1a1a]">
                        {getRouteWeight(route)} tons
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img src={ICONS.volume} alt="Volume" className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-500">Volume</p>
                      <p className="text-sm font-semibold text-[#1a1a1a]">
                        {getRouteVolume(route)} m³
                      </p>
                    </div>
                  </div>
                </div>

                {}
                <div className="flex items-center justify-between pt-4 border-t border-[#e0e0e0]">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => router.push(`/edit-route?id=${route.id}`)}
                      className="flex items-center gap-2 text-[#666] hover:text-[#1a1a1a] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <img src={ICONS.edit} alt="Edit" className="w-5 h-5" />
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteRoute(route.id)}
                      className="flex items-center gap-2 text-red-500 hover:text-red-600 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <img src={ICONS.delete} alt="Delete" className="w-5 h-5" />
                      DELETE
                    </button>
                    <button
                      onClick={() => router.push(`/route-listing/${route.id}`)}
                      className="flex items-center gap-2 text-[#666] hover:text-[#1a1a1a] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <img src={ICONS.externalLink} alt="View" className="w-5 h-5" />
                      VIEW DETAILS
                    </button>
                  </div>

                  {mapStatus(route.status) === "active" ? (
                    <button
                      onClick={() => handleMarkAsCompleted(route.id)}
                      disabled={updatingRouteId === route.id}
                      className={`bg-[#B8FF00] hover:bg-[#a8ee00] text-[#1a1a1a] font-bold rounded-full px-6 py-2 text-xs transition-colors cursor-pointer ${
                        updatingRouteId === route.id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {updatingRouteId === route.id ? "Processing..." : "MARK AS COMPLETED"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReactivate(route.id)}
                      disabled={updatingRouteId === route.id}
                      className={`bg-[#7E52FF] hover:bg-[#6d41ff] text-white font-bold rounded-full px-6 py-2 text-xs transition-colors cursor-pointer ${
                        updatingRouteId === route.id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {updatingRouteId === route.id ? "Processing..." : "REACTIVATE"}
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
                className="w-10 h-10 flex items-center justify-center hover:bg-[#f0f0f0] rounded-full transition-colors border border-[#e0e0e0] cursor-pointer"
                disabled={currentPage === 1}
              >
                <img src={ICONS.chevronLeft} alt="Previous" className="w-2.5 h-2.5" />
              </button>

              {visiblePages.map((page, index) =>
                page === "ellipsis" ? (
                  <span key={`ellipsis-${index}`} className="px-1 text-muted-foreground">...</span>
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
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-[#f0f0f0] rounded-full transition-colors border border-[#e0e0e0] cursor-pointer"
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