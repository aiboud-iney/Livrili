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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 6H23V12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  trendingDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M23 18L13.5 8.5L8.5 13.5L1 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 18H23V12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  orders: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 4H20V20H4V4Z" stroke="#7E52FF" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8 7H16" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 12H16" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 17H13" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M17 21V19C17 16.8 15.2 15 13 15H5C2.8 15 1 16.8 1 19V21" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="9" cy="7" r="4" stroke="#7E52FF" strokeWidth="1.5"/>
      <path d="M23 21V19C22.9 17 21.5 15.4 19.5 15" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 3.5C18 3.7 19.5 5.2 19.5 7.2C19.5 9.2 18 10.7 16 10.9" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  arrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  shipmentIcon: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 4H20V20H4V4Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8 7H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 17H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  routeIcon: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="5" r="2" stroke="#1a1a1a" strokeWidth="1.5"/>
      <circle cx="19" cy="19" r="2" stroke="#1a1a1a" strokeWidth="1.5"/>
      <path d="M5 7L5 17C5 18.1046 5.89543 19 7 19H19" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  truckIcon: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="14" height="10" rx="1.5" stroke="white" strokeWidth="1.5"/>
      <path d="M16 8.5L19 8.5L21 12V16H16V8.5Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="6" cy="17" r="2" stroke="white" strokeWidth="1.5"/>
      <circle cx="18" cy="17" r="2" stroke="white" strokeWidth="1.5"/>
    </svg>
  ),
  activityShipmentIcon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 4H20V20H4V4Z" stroke="#7E52FF" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8 7H16" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 12H16" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  activityRouteIcon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="5" r="2" stroke="#7E52FF" strokeWidth="1.5"/>
      <circle cx="19" cy="19" r="2" stroke="#7E52FF" strokeWidth="1.5"/>
      <path d="M5 7L5 17C5 18.1046 5.89543 19 7 19H19" stroke="#7E52FF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

export default function DashboardOverview() {
  const { t } = useLang();
  const router = useRouter();
  const [shipmentCount, setShipmentCount] = useState(82);
  const [routeCount, setRouteCount] = useState(114);
  const [truckCount, setTruckCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

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
      trend: "+12%",
      trendUp: true,
      onClick: () => router.push('/dashboard?page=shipments'),
    },
    {
      labelKey: "activeRoutes",
      value: String(routeCount).padStart(2, "0"),
      iconKey: "routes" as const,
      trend: "+8%",
      trendUp: true,
      onClick: () => router.push('/dashboard?page=routes'),
    },
    {
      labelKey: "myTrucksLabel",
      value: String(truckCount).padStart(2, "0"),
      iconKey: "trucks" as const,
      trend: truckCount > 0 ? "+2" : "0",
      trendUp: truckCount > 0,
      onClick: () => router.push('/dashboard?page=trucks'),
    },
  ];

  const weeklyData = [42, 58, 45, 67, 63, 78, 82];
  const monthlyData = [245, 312, 298, 356, 389, 412];
  const yearlyData = [1245, 1567, 1892, 2123];

  const chartData = selectedPeriod === 'week' ? weeklyData : selectedPeriod === 'month' ? monthlyData : yearlyData;
  const maxValue = Math.max(...chartData);
  const chartLabels = selectedPeriod === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
                      selectedPeriod === 'month' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'] :
                      ['Q1', 'Q2', 'Q3', 'Q4'];

  const recentActivities = [
    { id: 1, type: 'shipment', title: 'Electronics shipment', status: 'completed', time: '2 hours ago' },
    { id: 2, type: 'route', title: 'Algiers to Oran', status: 'active', time: '5 hours ago' },
    { id: 3, type: 'shipment', title: 'Construction materials', status: 'in_transit', time: '1 day ago' },
    { id: 4, type: 'route', title: 'Constantine to Annaba', status: 'completed', time: '2 days ago' },
  ];

  const getActivityIcon = (type: string) => {
    if (type === 'shipment') return <AnalyticsIcons.activityShipmentIcon />;
    return <AnalyticsIcons.activityRouteIcon />;
  };

  return (
    <div className="p-6 md:p-8">
      {}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your logistics activity</p>
      </div>

      {}
      <div className="flex gap-2 mb-6">
        {(['week', 'month', 'year'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-1.5 rounded-lg font-medium text-sm transition-all cursor-pointer ${
              selectedPeriod === period
                ? 'bg-[#7E52FF] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.labelKey}
            className="rounded-xl p-5 flex flex-col justify-between cursor-pointer transition-all hover:shadow-md active:scale-98"
            style={{ backgroundColor: "#B8FF00" }}
            onClick={stat.onClick}
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold tracking-wider text-gray-700 uppercase">
                {t(stat.labelKey)}
              </span>
              <div className="flex items-center gap-1">
                {stat.trendUp ? <AnalyticsIcons.trendingUp /> : <AnalyticsIcons.trendingDown />}
                <span className={`text-xs font-semibold ${stat.trendUp ? 'text-green-700' : 'text-red-600'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
            <div className="flex items-end justify-between mt-3">
              <span className="font-bold text-gray-900 text-5xl leading-none">
                {isLoading ? "--" : stat.value}
              </span>
              <img
                src={ICONS[stat.iconKey]}
                alt={t(stat.labelKey)}
                className="w-9 h-9 opacity-40"
              />
            </div>
          </div>
        ))}
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-gray-900">Activity Overview</h3>
              <p className="text-xs text-gray-500 mt-0.5">Shipments and routes over time</p>
            </div>
            <button className="text-[#7E52FF] text-xs font-medium hover:underline flex items-center gap-1">
              Details
              <AnalyticsIcons.arrowRight />
            </button>
          </div>

          {}
          <div className="h-56 flex items-end gap-2">
            {chartData.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-[#7E52FF] rounded-t transition-all duration-300 hover:bg-[#6D28D9] cursor-pointer"
                  style={{ height: `${(value / maxValue) * 160}px` }}
                />
                <span className="text-[10px] text-gray-500">{chartLabels[index]}</span>
              </div>
            ))}
          </div>

          {}
          <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
            {chartData.map((value, index) => (
              <div key={index} className="text-center flex-1">
                <span className="text-[10px] font-medium text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-[#7E52FF] text-xs font-medium hover:underline">
              View all
            </button>
          </div>

          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                      activity.status === 'active' ? 'bg-[#B8FF00] text-gray-800' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {activity.status}
                    </span>
                    <span className="text-[10px] text-gray-400">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-lg font-bold text-gray-900">94%</p>
                <p className="text-[10px] text-gray-500">Completion Rate</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center flex-1">
                <p className="text-lg font-bold text-gray-900">2.4k</p>
                <p className="text-[10px] text-gray-500">Total KM Driven</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <button
          onClick={() => router.push('/post-shipment')}
          className="bg-[#7E52FF] text-white rounded-xl p-4 text-left hover:bg-[#6D28D9] transition-all cursor-pointer group"
        >
          <div className="mb-1">
            <AnalyticsIcons.shipmentIcon />
          </div>
          <h4 className="font-semibold text-sm mt-1">Post a Shipment</h4>
          <p className="text-purple-200 text-xs mt-0.5">Create new shipment listing</p>
        </button>

        <button
          onClick={() => router.push('/post-route')}
          className="bg-[#B8FF00] text-gray-900 rounded-xl p-4 text-left hover:bg-[#a8ee00] transition-all cursor-pointer"
        >
          <div className="mb-1">
            <AnalyticsIcons.routeIcon />
          </div>
          <h4 className="font-semibold text-sm mt-1">Post a Route</h4>
          <p className="text-gray-600 text-xs mt-0.5">Share available capacity</p>
        </button>

        <button
          onClick={() => router.push('/add-truck')}
          className="bg-gray-800 text-white rounded-xl p-4 text-left hover:bg-gray-900 transition-all cursor-pointer"
        >
          <div className="mb-1">
            <AnalyticsIcons.truckIcon />
          </div>
          <h4 className="font-semibold text-sm mt-1">Add a Truck</h4>
          <p className="text-gray-400 text-xs mt-0.5">Register your vehicle</p>
        </button>
      </div>

      {}
      {error && (
        <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
          <button onClick={() => window.location.reload()} className="ml-3 text-red-700 underline">
            Retry
          </button>
        </div>
      )}
    </div>
  );
}