"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "./components/header";
import { FeedToggle } from "./components/FeedToggle";
import {
  FilterBar,
  defaultFilters,
  FilterValues,
} from "./components/FilterBar";
import {
  RouteFilterBar,
  defaultRouteFilters,
  RouteFilterValues,
} from "./components/RouteFilterBar";
import { ShipmentCard } from "./components/ShipmentCard";
import { RouteCard } from "./components/RouteCard";
import { Pagination } from "./components/Pagination";
import { useLang } from "@/contexts/LanguageContext";
import FeedBottomNav from "./components/bottomnavfeed";

const translations = {
  en: {
    resultsFound: (n: number) => `${n} result${n !== 1 ? "s" : ""} found`,
    copyright: "© 2026 LIVRILI LOGISTICS SOLUTIONS. DZ",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    support: "Support",
    loading: "Loading...",
    error: "Error loading data",
    noResults: "No results found.",
  },
  fr: {
    resultsFound: (n: number) =>
      `${n} résultat${n !== 1 ? "s" : ""} trouvé${n !== 1 ? "s" : ""}`,
    copyright: "© 2026 LIVRILI SOLUTIONS LOGISTIQUES. DZ",
    privacy: "Confidentialité",
    terms: "Conditions",
    support: "Support",
    loading: "Chargement...",
    error: "Erreur de chargement",
    noResults: "Aucun résultat trouvé.",
  },
};

const ITEMS_PER_PAGE = 10;

function extractWilayaName(wilayaStr: string): string {
  const parts = wilayaStr.split(" - ");
  return parts.length > 1 ? parts[1] : wilayaStr;
}

export default function FeedPage() {
  const { lang } = useLang();
  const t = translations[lang];
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab: "shipments" | "routes" =
    searchParams.get("tab") === "routes" ? "routes" : "shipments";
  const [currentPage, setCurrentPage] = useState(1);
  const [shipmentFilters, setShipmentFilters] =
    useState<FilterValues>(defaultFilters);
  const [routeFilters, setRouteFilters] =
    useState<RouteFilterValues>(defaultRouteFilters);
  const [isMobile, setIsMobile] = useState(false);

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
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

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
    router.replace(`/feed?${next.toString()}`);
  };

  const handleShipmentFilterChange = (key: keyof FilterValues, value: any) => {
    setShipmentFilters((prev: FilterValues) => ({ ...prev, [key]: value }));
  };

  const handleRouteFilterChange = (
    key: keyof RouteFilterValues,
    value: any,
  ) => {
    setRouteFilters((prev: RouteFilterValues) => ({ ...prev, [key]: value }));
  };

  const handleShipmentFilterClear = () => {
    setShipmentFilters(defaultFilters);
  };

  const handleRouteFilterClear = () => {
    setRouteFilters(defaultRouteFilters);
  };

  const handleDeleteItem = (id: number) => {
    setItems((prev) => prev.filter((item: any) => item.id !== id));
    setTotalItems(prev => prev - 1);
  };

  const displayItems = items.map((item) => {
    if (activeTab === "shipments" && item.from_pickup_date && item.to_pickup_date) {
      const from = item.from_pickup_date.slice(0, 10);
      const to = item.to_pickup_date.slice(0, 10);
      const dateRange = from === to ? from : `${from} to ${to}`;
      return { ...item, dateRange };
    }
    return item;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6]">
      <Header />

      <div className="flex-1">
        <main
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            padding: isMobile ? "24px 16px 112px" : "24px 24px 48px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <FeedToggle active={activeTab} onChange={handleTabChange} />
          </div>

          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "14px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            }}
          >
            {activeTab === "shipments" ? (
              <FilterBar
                filters={shipmentFilters}
                onChange={handleShipmentFilterChange}
                onClear={handleShipmentFilterClear}
              />
            ) : (
              <RouteFilterBar
                filters={routeFilters}
                onChange={handleRouteFilterChange}
                onClear={handleRouteFilterClear}
              />
            )}
          </div>

          <p
            style={{
              fontSize: "13px",
              color: "#6b7280",
              marginBottom: "12px",
              fontWeight: 500,
            }}
          >
            {loading
              ? t.loading
              : error
                ? t.error
                : t.resultsFound(totalItems)}
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {loading ? (
              <div style={{ textAlign: "center", color: "#7C3AED", padding: "40px" }}>
                {t.loading}
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", color: "#ef4444", padding: "40px" }}>
                {t.error}: {error}
              </div>
            ) : displayItems.length === 0 ? (
              <div style={{ textAlign: "center", color: "#6b7280", padding: "40px" }}>
                {t.noResults}
              </div>
            ) : activeTab === "shipments" ? (
              displayItems.map((item) => (
                <ShipmentCard
                  key={item.id}
                  shipment={item}
                  onDelete={handleDeleteItem}
                  isAdminView={false}
                />
              ))
            ) : (
              displayItems.map((item) => (
                <RouteCard
                  key={item.id}
                  route={item}
                  onDelete={handleDeleteItem}
                  isAdminView={false}
                />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div style={{ marginTop: "32px" }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={setCurrentPage}
              />
            </div>
          )}
        </main>
      </div>

      <footer
        style={{
          display: isMobile ? "none" : "block",
          backgroundColor: "#202020",
          padding: "16px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <p style={{ fontSize: "11px", color: "#9CA3AF" }}>{t.copyright}</p>
          <div className="flex items-center gap-6">
            <a
              href="/privacy-policy"
              style={{
                fontSize: "11px",
                color: "#9CA3AF",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
            >
              {t.privacy}
            </a>
            <a
              href="/terms"
              style={{
                fontSize: "11px",
                color: "#9CA3AF",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
            >
              {t.terms}
            </a>
            <a
              href="/support"
              style={{
                fontSize: "11px",
                color: "#9CA3AF",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
            >
              {t.support}
            </a>
          </div>
        </div>
      </footer>

      <div style={{ display: isMobile ? "block" : "none" }}>
        <FeedBottomNav />
      </div>
    </div>
  );
}