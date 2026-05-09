"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NotificationDropdown from "@/components/NotificationDropdown";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useLang } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/language-switcher";

import { translations } from "./translations";
import {
  DEFAULT_COUNTRIES,
  DEFAULT_TRUCKS,
  toISODate,
  fromISODate,
} from "./types";
import type { PublishRoutePayload, Country, Truck } from "./types";

import { RouteDetailsSection } from "../post-route/components/RouteDetailsSection";
import { ContactPhoneSection } from "../post-route/components/ContactPhoneSection";
import { TruckSelectionSection } from "../post-route/components/TruckSelectionSection";
import { NotesSection } from "../post-route/components/NotesSection";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function EditRoutePageContent() {
  const { lang } = useLang();
  const t = translations[lang ?? "en"];
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeId = searchParams.get("id");

  const [capacity, setCapacity] = useState("5");
  const [volume, setVolume] = useState("5");
  const [originWilaya, setOriginWilaya] = useState("");
  const [destinationWilaya, setDestinationWilaya] = useState("");
  const [transitCities, setTransitCities] = useState("");
  const [tripType, setTripType] = useState<"aller" | "aller-retour">("aller");
  const [outboundStartDate, setOutboundStartDate] = useState<Date | null>(null);
  const [outboundEndDate, setOutboundEndDate] = useState<Date | null>(null);
  const [returnStartDate, setReturnStartDate] = useState<Date | null>(null);
  const [returnEndDate, setReturnEndDate] = useState<Date | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [truckTypeCode, setTruckTypeCode] = useState("");

  const [trucks, setTrucks] = useState<Truck[]>(DEFAULT_TRUCKS);
  const [selectedTruck, setSelectedTruck] = useState<number | null>(0);

  const [countries, setCountries] = useState<Country[]>(DEFAULT_COUNTRIES);
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    DEFAULT_COUNTRIES[0],
  );

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoadingRoute, setIsLoadingRoute] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [routeAssignedTruckId, setRouteAssignedTruckId] = useState<
    number | null
  >(null);
  const [notificationCount, setNotificationCount] = useState(0);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isAlgeria = selectedCountry.code === "+213";

  useEffect(() => {
    setVisible(true);
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    fetch("https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2")
      .then((res) => res.json())
      .then((data: any[]) => {
        const updated = DEFAULT_COUNTRIES.map((c) => {
          const found = data.find((d) => d.cca2 === c.iso);
          return {
            ...c,
            flagUrl: found?.flags?.png || found?.flags?.svg || "",
          };
        });
        setCountries(updated);
        setSelectedCountry(updated[0]);
      })
      .catch(() => {});

    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    async function fetchRouteData() {
      if (!routeId) {
        setLoadError("Route ID not found");
        setIsLoadingRoute(false);
        return;
      }

      try {
        setIsLoadingRoute(true);
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${apiUrl}/routes/${routeId}`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load route (${response.status})`);
        }

        const route = await response.json();

        setOriginWilaya(String(route?.origin ?? ""));
        setDestinationWilaya(String(route?.destination ?? ""));
        setTransitCities(
          Array.isArray(route?.transit_cities)
            ? route.transit_cities.join(", ")
            : "",
        );
        setCapacity(route?.max_weight != null ? String(route.max_weight) : "5");
        setVolume(route?.max_volume != null ? String(route.max_volume) : "");
        setPhoneNumber(String(route?.contact_phone ?? ""));
        setNotes(String(route?.notes ?? ""));

        const outboundStart =
          fromISODate(String(route?.start_date ?? "").slice(0, 10)) ||
          fromISODate(String(route?.departure_date ?? "").slice(0, 10));
        const outboundEnd =
          fromISODate(String(route?.end_date ?? "").slice(0, 10)) || outboundStart;
        setOutboundStartDate(outboundStart);
        setOutboundEndDate(outboundEnd);

        const inferredTripType: "aller" | "aller-retour" =
          route?.route_type === "ROUND_TRIP"
            ? "aller-retour"
            : "aller";
        setTripType(inferredTripType);

        const returnStart =
          fromISODate(String(route?.end_date ?? "").slice(0, 10));
        const returnEnd = returnStart;
        setReturnStartDate(returnStart);
        setReturnEndDate(returnEnd);

        if (route?.phonecountrycode) {
          const country = DEFAULT_COUNTRIES.find(
            (c) => c.code === route.phonecountrycode,
          );
          if (country) setSelectedCountry(country);
        }

        if (route?.assigned_truck_id != null) {
          setRouteAssignedTruckId(Number(route.assigned_truck_id));
        }

        if (route?.truck_type != null) {
          setTruckTypeCode(String(route.truck_type));
        }

        setIsLoadingRoute(false);
      } catch (err) {
        console.error("Error fetching route:", err);
        setLoadError(t.errors.fetchFailed);
        setIsLoadingRoute(false);
      }
    }

    fetchRouteData();
  }, [routeId]);

  useEffect(() => {
    async function fetchTrucks() {
      try {
        const res = await fetch(`${apiUrl}/trucks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch trucks");
        const data: { trucks: Truck[] } = await res.json();
        setTrucks(data.trucks);
        if (data.trucks.length > 0 && routeAssignedTruckId === null) {
          setSelectedTruck(0);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchTrucks();
  }, [routeAssignedTruckId]);

  useEffect(() => {
    if (routeAssignedTruckId === null || trucks.length === 0) return;
    const assignedIndex = trucks.findIndex(
      (truck) => Number(truck.id) === routeAssignedTruckId,
    );
    if (assignedIndex >= 0) {
      setSelectedTruck(assignedIndex);
    }
  }, [routeAssignedTruckId, trucks]);

  const handleAddTruck = (truck: Truck) => {
    const formData = new FormData();

    if (truck.truck_pictures) {
      truck.truck_pictures.forEach((file) =>
        formData.append("truck_pictures", file),
      );
    }

    formData.append("truck_type", truck.truck_type);
    formData.append("license_plate", truck.license_plate);
    formData.append("max_tonnage", truck.max_tonnage.toString());

    fetch(`${apiUrl}/trucks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {

        setTrucks((prev) => [...prev, data.truck]);
        setSelectedTruck(trucks.length);
      })
      .catch((err) => console.error("Error:", err));
  };

    const validate = (): boolean => {
      const errors: Record<string, string> = {};
      if (!originWilaya) errors.origin = t.errors.origin;
      if (!destinationWilaya) errors.destination = t.errors.destination;
      if (!outboundStartDate) errors.departureStart = t.errors.departureStart;
      if (!outboundEndDate) errors.departureEnd = t.errors.departureEnd;
      if (outboundStartDate && outboundEndDate && outboundStartDate > outboundEndDate) {
        errors.departureEnd = t.errors.departureOrder;
      }
      if (tripType === "aller-retour") {
        if (!returnStartDate) errors.returnStart = t.errors.returnStart;
        if (!returnEndDate) errors.returnEnd = t.errors.returnEnd;
        if (returnStartDate && returnEndDate && returnStartDate > returnEndDate) {
          errors.returnEnd = t.errors.returnOrder;
        }
        if (outboundEndDate && returnStartDate && returnStartDate <= outboundEndDate) {
          errors.returnAfterDeparture = t.errors.returnAfterDeparture;
        }
      }
      if (!truckTypeCode) errors.truckType = "Please select a truck type.";
      if (!phoneNumber) errors.phone = t.errors.phone;
      if (selectedTruck === null) errors.truck = t.errors.truck;
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

  const handleUpdate = async () => {
    if (!validate() || !routeId) return;
    setIsLoading(true);
    setSubmitError("");

      const payload: PublishRoutePayload = {
        origin: originWilaya,
        destination: destinationWilaya,
        transit_cities: transitCities
          ? transitCities
              .split(",")
              .map((city) => city.trim())
              .filter(Boolean)
          : undefined,
        route_type: tripType === "aller-retour" ? "ROUND_TRIP" : "ONE_WAY",
        departure_date: toISODate(outboundStartDate!),
        start_date: toISODate(outboundStartDate!),
        end_date: toISODate(outboundEndDate!),
        return_start_date:
          tripType === "aller-retour" && returnStartDate
            ? toISODate(returnStartDate)
            : undefined,
        return_end_date:
          tripType === "aller-retour" && returnEndDate
            ? toISODate(returnEndDate)
            : undefined,
        max_weight: Number(capacity),
        max_volume: volume ? Number(volume) : undefined,
        phonecountrycode: selectedCountry.code,
        contact_phone: phoneNumber.trim(),
      truck_type: truckTypeCode || trucks[selectedTruck!].truck_type || "not specified",
      notes: notes.trim() || undefined,
      assigned_truck_id: trucks[selectedTruck!].id,
    };

    try {
      const response = await fetch(`${apiUrl}/routes/${routeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard");
      } else {
        setSubmitError(data.message || t.errors.submitFailed);
      }
    } catch (err) {
      setSubmitError(t.errors.submitFailed);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingRoute) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              title="Go to home"
              onClick={() => router.push("/")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: 0,
              }}
            >
              <div className="w-9 h-9 bg-[#7C3AED] rounded-lg flex items-center justify-center">
                <img
                  src="/icons/logo.png"
                  alt="Livrili"
                  style={{
                    width: "20px",
                    height: "20px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <span className="text-xl font-semibold text-black">Livrili</span>
            </button>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED] mx-auto mb-4"></div>
            <p className="text-gray-600">
              {lang === "en"
                ? "Loading route..."
                : "Chargement de l'itinéraire..."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              title="Go to home"
              onClick={() => router.push("/")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: 0,
              }}
            >
              <div className="w-9 h-9 bg-[#7C3AED] rounded-lg flex items-center justify-center">
                <img
                  src="/icons/logo.png"
                  alt="Livrili"
                  style={{
                    width: "20px",
                    height: "20px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <span className="text-xl font-semibold text-black">Livrili</span>
            </button>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-red-500 mb-4">{loadError}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg"
            >
              {lang === "en"
                ? "Back to Dashboard"
                : "Retour au Tableau de Bord"}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f5f5f5] flex flex-col"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            title="Go to home"
            onClick={() => router.push("/")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: 0,
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#7C3AED" }}
            >
              <img
                src="/icons/logo.png"
                alt="Livrili"
                style={{ width: "20px", height: "20px", objectFit: "contain" }}
              />
            </div>
            <span className="text-xl font-semibold text-black">Livrili</span>
          </button>

          <div className="flex items-center gap-3">
            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                title="Notifications"
                onClick={() => {
                  setShowNotifications((p) => !p);
                  setShowProfile(false);
                }}
                style={{
                  position: "relative",
                  padding: "8px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "50%",
                }}
              >
                <img
                  src="/icons/bell.png"
                  alt="Notifications"
                  style={{
                    width: "20px",
                    height: "20px",
                    objectFit: "contain",
                  }}
                />
                {notificationCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#EF4444",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "700",
                    border: "2px solid white"
                  }}>
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </span>
                )}
              </button>
              <NotificationDropdown show={showNotifications} lang={lang} notificationCount={notificationCount} />
            </div>
            <div ref={profileRef} style={{ position: "relative" }}>
              <button
                title="Profile"
                onClick={() => {
                  setShowProfile((p) => !p);
                  setShowNotifications(false);
                }}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  backgroundColor: "#F5A962",
                  border: "none",
                  cursor: "pointer",
                }}
              />
              <ProfileDropdown show={showProfile} />
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {}
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <button
            title="Go Back"
            className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: "none", border: "none" }}
            onClick={() => router.back()}
          >
            <img
              src="/icons/go back.png"
              alt="Back"
              style={{ width: "20px", height: "20px", objectFit: "contain" }}
            />
            <span
              style={{ fontSize: "13px", fontWeight: 700, color: "#94A3B8" }}
            >
              {t.goBack}
            </span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-500 mb-8">{t.subtitle}</p>

          <div className="space-y-6">
            <RouteDetailsSection
              t={t}
              lang={lang}
              visible={visible}
              isMobile={isMobile}
              originWilaya={originWilaya}
              destinationWilaya={destinationWilaya}
              transitCities={transitCities}
              tripType={tripType}
              startDate={outboundStartDate}
              endDate={outboundEndDate}
              capacity={capacity}
              volume={volume}
              formErrors={formErrors}
              onOriginChange={(v) => {
                setOriginWilaya(v);
                setFormErrors((p) => ({ ...p, origin: "" }));
              }}
              onDestinationChange={(v) => {
                setDestinationWilaya(v);
                setFormErrors((p) => ({ ...p, destination: "" }));
              }}
              onTransitChange={setTransitCities}
              onTripTypeChange={(v) => {
                setTripType(v);
                if (v === "aller") {
                  setReturnStartDate(null);
                  setReturnEndDate(null);
                  setFormErrors((p) => ({
                    ...p,
                    returnStart: "",
                    returnEnd: "",
                    returnAfterDeparture: "",
                  }));
                }
              }}
              onDateChange={(s, e) => {
                setOutboundStartDate(s);
                setOutboundEndDate(e);
                setFormErrors((p) => ({ ...p, departureStart: "", departureEnd: "" }));
              }}
              onCapacityChange={setCapacity}
              onVolumeChange={setVolume}
            />

            <ContactPhoneSection
              t={t}
              visible={visible}
              countries={countries}
              selectedCountry={selectedCountry}
              phoneNumber={phoneNumber}
              formErrors={formErrors}
              onCountryChange={setSelectedCountry}
              onPhoneChange={(v) => {
                setPhoneNumber(v);
                setFormErrors((p) => ({ ...p, phone: "" }));
              }}
            />

            <TruckSelectionSection
              t={t}
              visible={visible}
              trucks={trucks}
              selectedTruck={selectedTruck}
              formErrors={formErrors}
              onSelectTruck={(i) => {
                setSelectedTruck(i);
                setFormErrors((p) => ({ ...p, truck: "" }));
              }}
              onAddTruck={handleAddTruck}
            />

            <NotesSection
              t={t}
              visible={visible}
              notes={notes}
              onChange={setNotes}
            />
          </div>

          {}
          <div style={{ marginTop: "32px" }}>
            {submitError && (
              <div
                style={{
                  padding: "12px 16px",
                  marginBottom: "16px",
                  backgroundColor: "#FEE2E2",
                  color: "#DC2626",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {submitError}
              </div>
            )}

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                style={{
                  padding: "14px 24px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: isAlgeria ? "#B8FF00" : "#d1d5db",
                  color: "#1a1a1a",
                  cursor: isAlgeria && !isLoading ? "pointer" : "not-allowed",
                  fontSize: "14px",
                  fontWeight: 600,
                  opacity: isAlgeria && !isLoading ? 1 : 0.6,
                  transition: "all 0.3s ease",
                  width: "100%",
                }}
              >
                {isLoading ? t.updating : t.updateRoute}
              </button>
              <button
                onClick={() => router.back()}
                disabled={isLoading}
                style={{
                  padding: "14px 24px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "white",
                  color: "#1a1a1a",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  opacity: isLoading ? 0.6 : 1,
                  transition: "all 0.3s ease",
                  width: "100%",
                }}
              >
                Cancel
              </button>
            </div>

            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginTop: "16px",
                textAlign: "center",
              }}
            >
              {t.publishNote}{" "}
              <a
                href="/terms"
                style={{ color: "#B8FF00", textDecoration: "none" }}
              >
                {t.termsConditions}
              </a>
            </p>
          </div>
        </div>
      </main>

      {}
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
              {t.privacyPolicy}
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
              {t.termsOfService}
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
    </div>
  );
}

export default function EditRoutePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f5f5]" />}>
      <EditRoutePageContent />
    </Suspense>
  );
}
