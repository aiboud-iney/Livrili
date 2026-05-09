"use client";

import { Header } from "../components/header";
import { RouteDetails } from "../components/route-details";
import { useRouter } from "next/navigation";

export default function RouteListingPage({ params }: { params: { routeId: string } }) {
  const router = useRouter();
  const onPublish = () => {
  router.push("/post-route");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1">
        <RouteDetails routeId={params.routeId} />
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
