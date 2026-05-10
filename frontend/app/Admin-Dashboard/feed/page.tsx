"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/app/feed/components/header";
import {
  FilterBar,
  defaultFilters,
  FilterValues,
} from "@/app/feed/components/FilterBar";
import {
  RouteFilterBar,
  defaultRouteFilters,
  RouteFilterValues,
} from "@/app/feed/components/RouteFilterBar";
import { ShipmentCard } from "@/app/feed/components/ShipmentCard";
import { RouteCard } from "@/app/feed/components/RouteCard";
import { Pagination } from "@/app/feed/components/Pagination";
import { FeedToggle } from "@/app/feed/components/FeedToggle";
import FeedBottomNav from "./components/bottomnavfeed";

interface AdminFilterValues extends FilterValues {
  userSearch: string;
}

interface AdminRouteFilterValues extends RouteFilterValues {
  userSearch: string;
}

const translations = {
  en: {
    resultsFound: (n: number) => `${n} result${n !== 1 ? "s" : ""} found`,
    loading: "Loading...",
    error: "Error loading data",
    noResults: "No results found.",
    adminPanel: "Admin Feed Panel",
    allListings: "All Listings (Admin View)",
    searchByUser: "Search by user / company name",
  },
  fr: {
    resultsFound: (n: number) => `${n} résultat${n !== 1 ? "s" : ""} trouvé${n !== 1 ? "s" : ""}`,
    loading: "Chargement...",
    error: "Erreur de chargement",
    noResults: "Aucun résultat trouvé.",
    adminPanel: "Panneau Admin",
    allListings: "Toutes les annonces (Vue Admin)",
    searchByUser: "Rechercher par utilisateur / nom d'entreprise",
  },
};

const ITEMS_PER_PAGE = 10;

function extractWilayaName(wilayaStr: string): string {
  const parts = wilayaStr.split(" - ");
  return parts.length > 1 ? parts[1] : wilayaStr;
}

export default function AdminFeedPage() {
  const { lang } = useLang();
  const { role, isAuthenticated } = useAuth();
  const t = translations[lang];
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAuthenticated && role?.toLowerCase() !== "admin") {
      router.push("/feed");
    }
  }, [isAuthenticated, role, router]);

  const activeTab: "shipments" | "routes" = searchParams.get("tab") === "routes" ? "routes" : "shipments";
  const [currentPage, setCurrentPage] = useState(1);
  const [shipmentFilters, setShipmentFilters] = useState<AdminFilterValues>({ ...defaultFilters, userSearch: "" });
  const [routeFilters, setRouteFilters] = useState<AdminRouteFilterValues>({ ...defaultRouteFilters, userSearch: "" });
  const [isMobile, setIsMobile] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const buildQueryParams = useCallback(() => {
    const urlParams = new URLSearchParams();

    if (activeTab === "shipments") {
      const sf = shipmentFilters;

      if (sf.userSearch && sf.userSearch.trim() !== "") {
        urlParams.set("userSearch", sf.userSearch.trim());
      }

      if (sf.origin && sf.origin.length > 0) {
        sf.origin.forEach((origin) => {
          urlParams.append("origin", extractWilayaName(origin));
        });
      }

      if (sf.destination && sf.destination.length > 0) {
        sf.destination.forEach((dest) => {
          urlParams.append("destination", extractWilayaName(dest));
        });
      }

      if (sf.startDate && sf.startDate !== "") {
  urlParams.set("start_date", sf.startDate);
 }
 if (sf.endDate && sf.endDate !== "") {
   urlParams.set("end_date", sf.endDate);
 }

      if (sf.weightMin !== undefined && sf.weightMin > 0) {
        urlParams.set("weightMin", String(sf.weightMin));
      }
      if (sf.weightMax !== undefined && sf.weightMax < 25) {
        urlParams.set("weightMax", String(sf.weightMax));
      }

      if (sf.volumeMin !== undefined && sf.volumeMin > 0) {
        urlParams.set("volumeMin", String(sf.volumeMin));
      }
      if (sf.volumeMax !== undefined && sf.volumeMax < 100) {
        urlParams.set("volumeMax", String(sf.volumeMax));
      }

      if (sf.sortBy) {
        urlParams.set("sortBy", sf.sortBy);
      }

      if (sf.shipmentTypes && sf.shipmentTypes.length > 0) {
        sf.shipmentTypes.forEach((type) => {
          urlParams.append("shipmentTypes", type);
        });
      }

      if (sf.truckTypes && sf.truckTypes.length > 0) {
        sf.truckTypes.forEach((type) => {
          urlParams.append("truckTypes", type);
        });
      }
    } else {
      const rf = routeFilters;

      if (rf.userSearch && rf.userSearch.trim() !== "") {
        urlParams.set("userSearch", rf.userSearch.trim());
      }

      if (rf.origin && rf.origin.length > 0) {
        rf.origin.forEach((origin) => {
          urlParams.append("origin", extractWilayaName(origin));
        });
      }

      if (rf.destination && rf.destination.length > 0) {
        rf.destination.forEach((dest) => {
          urlParams.append("destination", extractWilayaName(dest));
        });
      }

      if (rf.start_date && rf.start_date !== "") {
  urlParams.set("start_date", rf.start_date);
 }
 if (rf.end_date && rf.end_date !== "") {
   urlParams.set("end_date", rf.end_date);
 }

      if (rf.weightMin !== undefined && rf.weightMin > 0) {
        urlParams.set("weightMin", String(rf.weightMin));
      }
      if (rf.weightMax !== undefined && rf.weightMax < 25) {
        urlParams.set("weightMax", String(rf.weightMax));
      }

      if (rf.volumeMin !== undefined && rf.volumeMin > 0) {
        urlParams.set("volumeMin", String(rf.volumeMin));
      }
      if (rf.volumeMax !== undefined && rf.volumeMax < 100) {
        urlParams.set("volumeMax", String(rf.volumeMax));
      }

      if (rf.sortBy) {
        urlParams.set("sortBy", rf.sortBy);
      }

      if (rf.truckTypes && rf.truckTypes.length > 0) {
        rf.truckTypes.forEach((type) => {
          urlParams.append("truckTypes", type);
        });
      }

      if (rf.route_type) {
        const mappedType = rf.route_type === "aller" ? "ONE_WAY" : "ROUND_TRIP";
        urlParams.set("route_type", mappedType);
      }
    }

    urlParams.set("page", String(currentPage));
    urlParams.set("limit", String(ITEMS_PER_PAGE));
    return urlParams;
  }, [activeTab, shipmentFilters, routeFilters, currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const urlParams = buildQueryParams();
        const query = urlParams.toString();
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const endpoint = activeTab === "shipments" ? "/shipments" : "/routes";
        const url = `${baseUrl}${endpoint}?${query}`;
        const token = localStorage.getItem("authToken");
        const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        const fetchedItems = data.shipments || data.routes || [];
        setItems(fetchedItems);
        if (data.pagination) {
          setTotalPages(data.pagination.total_pages || 1);
          setTotalItems(data.pagination.total || 0);
        } else {
          setTotalPages(Math.ceil(fetchedItems.length / ITEMS_PER_PAGE) || 1);
          setTotalItems(fetchedItems.length);
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Unknown error");
        setItems([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, currentPage, shipmentFilters, routeFilters, buildQueryParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, shipmentFilters, routeFilters]);

  const handleTabChange = (tab: "shipments" | "routes") => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("tab", tab);
    router.replace(`/Admin-Dashboard/feed?${next.toString()}`);
  };

  const handleShipmentFilterChange = (key: keyof AdminFilterValues, value: any) => {
    setShipmentFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleRouteFilterChange = (key: keyof AdminRouteFilterValues, value: any) => {
    setRouteFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleShipmentFilterClear = () => setShipmentFilters({ ...defaultFilters, userSearch: "" });
  const handleRouteFilterClear = () => setRouteFilters({ ...defaultRouteFilters, userSearch: "" });

  const handleDeleteItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setTotalItems(prev => prev - 1);
  };

  const displayItems = items.map(item => {
    if (activeTab === "shipments" && item.from_pickup_date && item.to_pickup_date) {
      const from = item.from_pickup_date.slice(0, 10);
      const to = item.to_pickup_date.slice(0, 10);
      return { ...item, dateRange: from === to ? from : `${from} to ${to}` };
    }
    return item;
  });

  const UserSearchInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
      <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", pointerEvents: "none", zIndex: 1 }} viewBox="0 0 16 16" fill="none">
        <circle cx="7" cy="7" r="5" stroke="#6b7280" strokeWidth="1.5" />
        <path d="M11 11L15 15" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.searchByUser}
        style={{
          width: "100%", padding: "10px 14px 10px 38px", border: "1.5px solid #e2e8f0",
          borderRadius: "10px", fontSize: "14px", color: "#111827", backgroundColor: "#fff",
          outline: "none", transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#DC2626")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6]">
      <Header />
      <div className="flex-1">
        <main style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", padding: isMobile ? "24px 16px 112px" : "24px 24px 48px" }}>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <span style={{ display: "inline-block", backgroundColor: "#DC2626", color: "white", fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "999px", letterSpacing: "0.5px" }}>
              {t.adminPanel}
            </span>
            <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>{t.allListings}</p>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <UserSearchInput
              value={activeTab === "shipments" ? shipmentFilters.userSearch : routeFilters.userSearch}
              onChange={(val) => {
                if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
                searchTimerRef.current = setTimeout(() => {
                  activeTab === "shipments"
                    ? handleShipmentFilterChange("userSearch", val)
                    : handleRouteFilterChange("userSearch", val);
                }, 300);
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <FeedToggle active={activeTab} onChange={handleTabChange} />
          </div>

          <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "16px", marginBottom: "16px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
            {activeTab === "shipments" ? (
              <FilterBar filters={shipmentFilters} onChange={handleShipmentFilterChange} onClear={handleShipmentFilterClear} />
            ) : (
              <RouteFilterBar filters={routeFilters} onChange={handleRouteFilterChange} onClear={handleRouteFilterClear} />
            )}
          </div>

          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px", fontWeight: 500 }}>
            {loading ? t.loading : error ? t.error : t.resultsFound(totalItems)}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {loading ? (
              <div style={{ textAlign: "center", color: "#DC2626", padding: "40px" }}>{t.loading}</div>
            ) : error ? (
              <div style={{ textAlign: "center", color: "#ef4444", padding: "40px" }}>{t.error}: {error}</div>
            ) : displayItems.length === 0 ? (
              <div style={{ textAlign: "center", color: "#6b7280", padding: "40px" }}>{t.noResults}</div>
            ) : activeTab === "shipments" ? (
              displayItems.map(item => <ShipmentCard key={item.id} shipment={item} onDelete={handleDeleteItem} isAdminView={true} />)
            ) : (
              displayItems.map(item => <RouteCard key={item.id} route={item} onDelete={handleDeleteItem} isAdminView={true} />)
            )}
          </div>

          {totalPages > 1 && (
            <div style={{ marginTop: "32px" }}>
              <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
            </div>
          )}
        </main>
      </div>

      {}
      {isMobile && <FeedBottomNav />}
    </div>
  );
}