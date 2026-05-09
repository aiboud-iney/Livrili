"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "./components/header";
import { ShipmentDetails } from "./components/shipment-details";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ShipmentData {
  id: number;
  title: string;
  origin: string;
  destination: string;
  from_pickup_date: string;
  to_pickup_date: string;
  weight: number;
  volume: number;
  phone_number: string;
  description: string;
  shipment_pictures: string[];
  shipment_photos?: string[];
  created_by: number;
  created_at: string;
  status: string;
  shipment_type: string;
  truck_type?: string | null;
}

export interface PosterData {
  id: number;
  business_name: string;
  email: string;
  phone_number: string;
}

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const shipmentId = params.id as string;

  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [poster, setPoster] = useState<PosterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shipmentId) return;

    const fetchShipmentData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const shipmentResponse = await fetch(
          `${API_BASE_URL}/shipments/${shipmentId}`,
        );

        if (!shipmentResponse.ok) {
          if (shipmentResponse.status === 404) {
            throw new Error("Shipment not found");
          }
          throw new Error("Failed to load shipment");
        }

        const shipmentData = await shipmentResponse.json();

        const shipmentInfo = shipmentData.shipment || shipmentData;
        setShipment(shipmentInfo);

        if (shipmentInfo.created_by) {
          setPoster({
            id: shipmentInfo.created_by,
            business_name: shipmentInfo.business_name || "Unknown",
            email: shipmentInfo.email || "",
            phone_number: shipmentInfo.user_phone || "",
          });
        }
      } catch (err: any) {
        console.error(" Error fetching shipment:", err);
        setError(err.message || "Failed to load shipment details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipmentData();
  }, [shipmentId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Loading shipment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error === "Shipment not found"
                ? "Shipment Not Found"
                : "Something Went Wrong"}
            </h2>
            <p className="text-gray-600 mb-6">
              {error ||
                "We couldn't load the shipment details. Please try again."}
            </p>
            <button
              onClick={() => router.push("/shipment-listing")}
              className="px-6 py-3 bg-[#7E52FF] text-white rounded-lg hover:bg-[#6D28D9] transition-colors cursor-pointer"
            >
              Back to Shipments
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />
      <div className="flex-1">
        <ShipmentDetails shipment={shipment} poster={poster} />
      </div>
      <footer className="bg-[#202020] py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p style={{ fontSize: "11px", color: "#9CA3AF" }}>
            © 2026 LIVRILI LOGISTICS SOLUTIONS. DZ
          </p>
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
              Privacy Policy
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
              Terms of Service
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
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
