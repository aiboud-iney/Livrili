"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";

const ICONS = {
  shipments: "/icons/shipments overview.png",
  routes: "/icons/route overview.png",
  trucks: "/icons/truck overview.png",
};

const AnalyticsIcons = {
  trendingUp: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 6H23V12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  arrowRight: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chartBar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M4 20H20" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 16L6 10" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 16L12 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18 16L18 8" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  shipmentIcon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 4H20V20H4V4Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8 7H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 17H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  routeIcon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="5" r="2" stroke="#1a1a1a" strokeWidth="1.5"/>
      <circle cx="19" cy="19" r="2" stroke="#1a1a1a" strokeWidth="1.5"/>
      <path d="M5 7L5 17C5 18.1046 5.89543 19 7 19H19" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  truckIcon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="14" height="10" rx="1.5" stroke="white" strokeWidth="1.5"/>
      <path d="M16 8.5L19 8.5L21 12V16H16V8.5Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="6" cy="17" r="2" stroke="white" strokeWidth="1.5"/>
      <circle cx="18" cy="17" r="2" stroke="white" strokeWidth="1.5"/>
    </svg>
  ),
};

export default function DashboardOverviewMobile() {
  const { t } = useLang();
  const router = useRouter();
  const [shipmentCount, setShipmentCount] = useState(82);
  const [routeCount, setRouteCount] = useState(114);
  const [truckCount, setTruckCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [shipmentsCountResult, routesCountResult, trucksCountResult] =
          await Promise.allSettled([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipments/count`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/routes/count`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/trucks/count`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }),
          ]);

        if (shipmentsCountResult.status === "fulfilled") {
          const response = shipmentsCountResult.value;
          if (response.ok) {
            const data = await response.json();
            const count = Number(data?.total ?? 82);
            setShipmentCount(Number.isFinite(count) ? count : 82);
          } else {
            setShipmentCount(82);
          }
        } else {
          setShipmentCount(82);
        }

        if (routesCountResult.status === "fulfilled") {
          const response = routesCountResult.value;
          if (response.ok) {
            const data = await response.json();
            const count = Number(data?.total ?? 114);
            setRouteCount(Number.isFinite(count) ? count : 114);
          } else {
            setRouteCount(114);
          }
        } else {
          setRouteCount(114);
        }

        if (trucksCountResult.status === "fulfilled") {
          const response = trucksCountResult.value;
          if (response.ok) {
            const data = await response.json();
            const count = Number(data?.total ?? 0);
            setTruckCount(Number.isFinite(count) ? count : 0);
          } else {
            setTruckCount(0);
            setError("Failed to load trucks count");
          }
        } else {
          setTruckCount(0);
          setError("Failed to load trucks count");
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setShipmentCount(82);
        setRouteCount(114);
        setTruckCount(0);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const stats = [
    {
      labelKey: "activeShipments",
      value: String(shipmentCount).padStart(2, "0"),
      iconKey: "shipments" as const,
      wide: true,
      onClick: () => router.push('/dashboard?page=shipments'),
    },
    {
      labelKey: "activeRoutes",
      value: String(routeCount).padStart(2, "0"),
      iconKey: "routes" as const,
      wide: false,
      onClick: () => router.push('/dashboard?page=routes'),
    },
    {
      labelKey: "myTrucksLabel",
      value: String(truckCount).padStart(2, "0"),
      iconKey: "trucks" as const,
      wide: false,
      onClick: () => router.push('/dashboard?page=trucks'),
    },
  ];

  const weeklyData = [42, 58, 45, 67, 63, 78, 82];
  const maxValue = Math.max(...weeklyData);

  return (
    <div className="p-4">
      {}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-xs mt-0.5">Logistics overview</p>
      </div>

      {}
      <div className="flex flex-col gap-3 mb-6">
        <div
          className="rounded-xl p-4 flex flex-col justify-between cursor-pointer active:scale-98 transition-all"
          style={{ backgroundColor: "#B8FF00" }}
          onClick={stats[0].onClick}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-gray-700 uppercase">
              {t(stats[0].labelKey)}
            </span>
            <div className="flex items-center gap-1">
              <AnalyticsIcons.trendingUp />
              <span className="text-green-700 text-[10px] font-semibold">+12%</span>
            </div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className="font-bold text-gray-900 text-4xl">
              {isLoading ? "--" : stats[0].value}
            </span>
            <img
              src={ICONS[stats[0].iconKey]}
              alt={t(stats[0].labelKey)}
              className="w-8 h-8 opacity-40"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.slice(1).map((stat) => (
            <div
              key={stat.labelKey}
              className="rounded-xl p-3 flex flex-col justify-between cursor-pointer active:scale-98 transition-all"
              style={{ backgroundColor: "#B8FF00" }}
              onClick={stat.onClick}
            >
              <span className="text-[9px] font-bold tracking-wider text-gray-700 uppercase leading-tight">
                {t(stat.labelKey)}
              </span>
              <div className="flex items-end justify-between mt-2">
                <span className="font-bold text-gray-900 text-3xl">
                  {isLoading ? "--" : stat.value}
                </span>
                <img
                  src={ICONS[stat.iconKey]}
                  alt={t(stat.labelKey)}
                  className="w-7 h-7 opacity-40"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
          <p className="text-lg font-bold text-gray-900">94%</p>
          <p className="text-[9px] text-gray-500">Completion Rate</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
          <p className="text-lg font-bold text-gray-900">2.4k</p>
          <p className="text-[9px] text-gray-500">Total KM</p>
        </div>
      </div>

      {}
      <div className="bg-white rounded-xl p-4 border border-gray-100 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <AnalyticsIcons.chartBar />
            <h3 className="font-semibold text-sm text-gray-900">Weekly Activity</h3>
          </div>
          <button className="text-[#7E52FF] text-[10px] font-medium flex items-center gap-0.5">
            Details
            <AnalyticsIcons.arrowRight />
          </button>
        </div>
        <div className="h-24 flex items-end gap-1">
          {weeklyData.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-[#7E52FF] rounded-t transition-all"
                style={{ height: `${(value / maxValue) * 60}px` }}
              />
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="flex gap-3">
        <button
          onClick={() => router.push('/post-shipment')}
          className="flex-1 bg-[#7E52FF] text-white rounded-xl p-3 text-center active:scale-98 transition-all cursor-pointer"
        >
          <div className="flex justify-center mb-0.5">
            <AnalyticsIcons.shipmentIcon />
          </div>
          <p className="text-[10px] font-semibold mt-1">Post Shipment</p>
        </button>
        <button
          onClick={() => router.push('/post-route')}
          className="flex-1 bg-[#B8FF00] text-gray-900 rounded-xl p-3 text-center active:scale-98 transition-all cursor-pointer"
        >
          <div className="flex justify-center mb-0.5">
            <AnalyticsIcons.routeIcon />
          </div>
          <p className="text-[10px] font-semibold mt-1">Post Route</p>
        </button>
        <button
          onClick={() => router.push('/add-truck')}
          className="flex-1 bg-gray-800 text-white rounded-xl p-3 text-center active:scale-98 transition-all cursor-pointer"
        >
          <div className="flex justify-center mb-0.5">
            <AnalyticsIcons.truckIcon />
          </div>
          <p className="text-[10px] font-semibold mt-1">Add Truck</p>
        </button>
      </div>

      {}
      {error && (
        <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
          {error}
          <button onClick={() => window.location.reload()} className="ml-2 underline">
            Retry
          </button>
        </div>
      )}
    </div>
  );
}