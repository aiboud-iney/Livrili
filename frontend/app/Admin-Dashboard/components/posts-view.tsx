"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ManagementType = "all" | "shipments" | "routes";

interface ShipmentData {
  id: string;
  origin: string;
  destination: string;
  created_at: string;
  weight: number;
  volume: number;
  status: string;
  type: "shipment";
  company?: string;
  user_email?: string;
}

interface RouteData {
  id: string;
  origin: string;
  destination: string;
  created_at: string;
  max_weight: number;
  max_volume: number;
  departure_date: string;
  status: string;
  type: "route";
  company?: string;
  user_email?: string;
}

type PostData = ShipmentData | RouteData;

export default function PostsView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ManagementType>("all");
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token =
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");

        const [shipmentsResponse, routesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/shipments`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }),
          fetch(`${API_BASE_URL}/routes?page=1&limit=1000`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }),
        ]);

        if (!shipmentsResponse.ok) {
          throw new Error(`Failed to fetch shipments (${shipmentsResponse.status})`);
        }
        if (!routesResponse.ok) {
          throw new Error(`Failed to fetch routes (${routesResponse.status})`);
        }

        const shipmentsData = await shipmentsResponse.json();
        const routesData = await routesResponse.json();

        const shipmentsWithType: ShipmentData[] = (shipmentsData.shipments || shipmentsData || []).map(
          (s: any) => ({ ...s, type: "shipment" })
        );
        const routesWithType: RouteData[] = (routesData.routes || routesData || []).map(
          (r: any) => ({ ...r, type: "route" })
        );

        setShipments(shipmentsWithType);
        setRoutes(routesWithType);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setError(err.message || "Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const getItemType = (id: string): "shipment" | "route" | null => {
    const shipment = shipments.find((s) => s.id === id);
    if (shipment) return "shipment";
    const route = routes.find((r) => r.id === id);
    if (route) return "route";
    return null;
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    const itemType = getItemType(deleteId);
    if (!itemType) {
      toast.error("Item not found");
      setDeleteId(null);
      return;
    }

    try {
      setIsDeleting(true);
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      const deleteUrl = itemType === "shipment"
        ? `${API_BASE_URL}/shipments/${deleteId}`
        : `${API_BASE_URL}/routes/${deleteId}`;

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${itemType} (${response.status})`);
      }

      if (itemType === "shipment") {
        setShipments((prev) =>
          prev.filter((shipment) => shipment.id !== deleteId),
        );
      } else {
        setRoutes((prev) => prev.filter((route) => route.id !== deleteId));
      }

      toast.success(`${itemType === "shipment" ? "Shipment" : "Route"} deleted successfully`);
      setDeleteId(null);
    } catch (err: any) {
      console.error(`Error deleting:`, err);
      toast.error(`Failed to delete: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-8 pt-7">
        <h1 className="text-[32px] font-black text-gray-900 tracking-tight mb-8">
          Management
        </h1>
        <div className="text-center py-12 text-gray-500">
          <p className="text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 pt-7">
      <h1 className="text-[32px] font-black text-gray-900 tracking-tight mb-8">
        Management
      </h1>

      {}
      <div
        style={{
          display: "inline-flex",
          backgroundColor: "#ffffff",
          borderRadius: "999px",
          padding: "4px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          marginBottom: "24px",
        }}
      >
        {(["all", "shipments", "routes"] as ManagementType[]).map((type) => {
          const isActive = activeTab === type;
          const getActiveColor = () => {
            if (type === "all") return "#374151";
            if (type === "routes") return "#84cc16";
            return "#7C3AED";
          };
          const getActiveShadow = () => {
            if (type === "all") return "rgba(55,65,81,0.3)";
            if (type === "routes") return "rgba(132,204,22,0.3)";
            return "rgba(124,58,237,0.3)";
          };
          const getActiveText = () => {
            if (type === "routes") return "#111";
            return "#ffffff";
          };
          const activeColor = getActiveColor();
          const activeShadow = getActiveShadow();
          const activeText = getActiveText();

          const displayLabel = type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1);
          return (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              style={{
                padding: "8px 28px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 700,
                transition: "all 0.2s ease",
                backgroundColor: isActive ? activeColor : "transparent",
                color: isActive ? activeText : "#6b7280",
                boxShadow: isActive ? `0 2px 8px ${activeShadow}` : "none",
              }}
            >
              {displayLabel}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {}
      {activeTab === "all" && (
        <div className="flex flex-col gap-3">
          {[...shipments, ...routes]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((post) =>
              post.type === "shipment" ? (
                <ShipmentCard
                  key={post.id}
                  shipment={post}
                  onDelete={handleDeleteClick}
                />
              ) : (
                <RouteCard
                  key={post.id}
                  route={post}
                  onDelete={handleDeleteClick}
                />
              )
            )}

          {shipments.length === 0 && routes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">No posts found.</p>
            </div>
          )}
        </div>
      )}

      {}
      {activeTab === "shipments" && (
        <div className="flex flex-col gap-3">
          {shipments
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((shipment) => (
              <ShipmentCard
                key={shipment.id}
                shipment={shipment}
                onDelete={handleDeleteClick}
              />
            ))}

          {shipments.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">No shipments found.</p>
            </div>
          )}
        </div>
      )}

      {}
      {activeTab === "routes" && (
        <div className="flex flex-col gap-3">
          {routes
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                onDelete={handleDeleteClick}
              />
            ))}

          {routes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">No routes found.</p>
            </div>
          )}
        </div>
      )}

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {activeTab}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {activeTab.slice(0, -1)}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ShipmentCard({
  shipment,
  onDelete,
}: {
  shipment: ShipmentData;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.15)";
        e.currentTarget.style.borderColor = "#7C3AED";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#e5e7eb";
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#111",
            marginBottom: "8px",
          }}
        >
          {shipment.origin} → {shipment.destination}
        </div>
        <div
          style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}
        >
          Weight: {shipment.weight}kg | Volume: {shipment.volume}m³
        </div>
        <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
          Status: {shipment.status}
        </div>
        <div style={{ fontSize: "11px", color: "#9ca3af" }}>
          By: {shipment.company || shipment.user_email || "Unknown"}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginLeft: "16px",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => router.push(`/shipment-listing/${shipment.id}`)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#7C3AED",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#6d28d9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#7C3AED";
          }}
        >
          More Details
        </button>
        <button
          onClick={() => onDelete(shipment.id)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            border: "none",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#fecaca";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#fee2e2";
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function RouteCard({
  route,
  onDelete,
}: {
  route: RouteData;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(184,255,0,0.15)";
        e.currentTarget.style.borderColor = "#B8FF00";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#e5e7eb";
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#111",
            marginBottom: "8px",
          }}
        >
          {route.origin} → {route.destination}
        </div>
        <div
          style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}
        >
          Max Weight: {route.max_weight}kg | Max Volume: {route.max_volume}m³
        </div>
        <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
          Departure: {new Date(route.departure_date).toLocaleDateString()} |
          Status: {route.status}
        </div>
        <div style={{ fontSize: "11px", color: "#9ca3af" }}>
          By: {route.company || route.user_email || "Unknown"}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginLeft: "16px",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => router.push(`/route-listing/${route.id}`)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#B8FF00",
            color: "#111",
            border: "none",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#a3e600";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#B8FF00";
          }}
        >
          More Details
        </button>
        <button
          onClick={() => onDelete(route.id)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            border: "none",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#fecaca";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#fee2e2";
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}