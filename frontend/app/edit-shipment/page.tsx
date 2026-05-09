"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NotificationDropdown from "@/components/NotificationDropdown";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useLang } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/language-switcher";

import { translations } from "./translations";
import { DEFAULT_COUNTRIES, toISODate, fromISODate } from "./types";
import type { EditShipmentPayload, Country } from "./types";

import { CargoDetailsSection } from "@/app/post-shipment/components/CargoDetailsSection";
import { RouteScheduleSection } from "@/app/post-shipment/components/RouteScheduleSection";
import { ContactPhoneSection } from "@/app/post-shipment/components/ContactPhoneSection";
import { NotesSection } from "@/app/post-shipment/components/NotesSection";
import { CargoPhotosSection } from "@/app/post-shipment/components/CargoPhotosSection";
import { SubmitButton } from "@/app/post-shipment/components/SubmitButton";

function EditShipmentPageContent() {
  const { lang } = useLang();
  const t = translations[lang];
  const router = useRouter();
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get("id");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const [shipmentTitle, setShipmentTitle] = useState("");
  const [weight, setWeight] = useState("5");
  const [volume, setVolume] = useState("5");
  const [shipmentType, setShipmentType] = useState("");
  const [truckType, setTruckType] = useState("");
  const [originWilaya, setOriginWilaya] = useState("");
  const [destinationWilaya, setDestinationWilaya] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const [countries, setCountries] = useState<Country[]>(DEFAULT_COUNTRIES);
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    DEFAULT_COUNTRIES[0],
  );

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingShipment, setIsLoadingShipment] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
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
    async function fetchShipmentData() {
      if (!shipmentId) {
        setLoadError("Shipment ID not found");
        setIsLoadingShipment(false);
        return;
      }

      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${apiUrl}/shipments/${shipmentId}`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to load shipment (${res.status})`);
        }

        const data = await res.json();
        const shipment = data?.shipment ?? data ?? {};

        const rawPhone = String(shipment.phone_number ?? "").trim();
        const matchingCountry =
          countries
            .slice()
            .sort((a, b) => b.code.length - a.code.length)
            .find((country) => rawPhone.startsWith(country.code)) ?? null;

        if (shipment.title) setShipmentTitle(String(shipment.title));
        if (shipment.weight != null) setWeight(String(shipment.weight));
        if (shipment.volume != null) setVolume(String(shipment.volume));
        if (shipment.origin) setOriginWilaya(String(shipment.origin));
        if (shipment.destination)
          setDestinationWilaya(String(shipment.destination));
        if (matchingCountry) {
          setSelectedCountry(matchingCountry);
          setPhoneNumber(
            rawPhone.replace(matchingCountry.code, "") || rawPhone,
          );
        } else if (rawPhone) {
          setPhoneNumber(rawPhone);
        }
        if (shipment.description) setNotes(String(shipment.description));
        if (shipment.shipment_type) setShipmentType(String(shipment.shipment_type));
        if (shipment.truck_type) setTruckType(String(shipment.truck_type));
        if (shipment.from_pickup_date) {
          setStartDate(
            fromISODate(String(shipment.from_pickup_date).slice(0, 10)),
          );
        }
        if (shipment.to_pickup_date) {
          setEndDate(fromISODate(String(shipment.to_pickup_date).slice(0, 10)));
        }

        setIsLoadingShipment(false);
      } catch (error) {
        setLoadError("Error loading shipment. Please try again.");
        setIsLoadingShipment(false);
      }
    }

    fetchShipmentData();
  }, [shipmentId, countries, apiUrl]);

  const handleAddPhotos = (files: File[]) => {
    setPhotoFiles((prev) => [...prev, ...files]);
    setPhotoPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!shipmentTitle.trim()) errors.shipmentTitle = t.errors.shipmentTitle;
    if (!originWilaya) errors.origin = t.errors.origin;
    if (!destinationWilaya) errors.destination = t.errors.destination;
    if (!startDate) errors.date = t.errors.date;
    if (!shipmentType) errors.shipmentType = "Please select a shipment type.";
    if (!phoneNumber.trim()) errors.phone = t.errors.phone;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    setIsLoading(true);
    setSubmitError("");

    const payload: EditShipmentPayload = {
      title: shipmentTitle.trim(),
      origin: originWilaya,
      destination: destinationWilaya,
      from_pickup_date: toISODate(startDate!),
      to_pickup_date: endDate ? toISODate(endDate) : undefined,
      weight: weight,
      volume: volume || "0",
      phone_number: `${selectedCountry.code}${phoneNumber.trim()}`,
      description: notes.trim() || undefined,
      shipment_type: shipmentType || undefined,
    };

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${apiUrl}/shipments/${shipmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setSubmitError(data.message || t.errors.submitFailed);
      }
    } catch (error) {
      setSubmitError(t.errors.submitFailed);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingShipment) {
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
                ? "Loading shipment..."
                : "Chargement de l'expédition..."}
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
            <div className="w-9 h-9 bg-[#7C3AED] rounded-lg flex items-center justify-center">
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
            <CargoDetailsSection
              t={t}
              lang={lang}
              visible={visible}
              shipmentTitle={shipmentTitle}
              weight={weight}
              volume={volume}
              shipmentType={shipmentType}
              truckType={truckType}
              formErrors={formErrors}
              onTitleChange={(v) => {
                setShipmentTitle(v);
                setFormErrors((p) => ({ ...p, shipmentTitle: "" }));
              }}
              onWeightChange={setWeight}
              onVolumeChange={setVolume}
              onShipmentTypeChange={(v) => {
                setShipmentType(v);
                setFormErrors((p) => ({ ...p, shipmentType: "" }));
              }}
              onTruckTypeChange={(v) => {
                setTruckType(v);
                setFormErrors((p) => ({ ...p, truckType: "" }));
              }}
            />

            <RouteScheduleSection
              t={t}
              lang={lang}
              visible={visible}
              isMobile={isMobile}
              originWilaya={originWilaya}
              destinationWilaya={destinationWilaya}
              startDate={startDate}
              endDate={endDate}
              formErrors={formErrors}
              onOriginChange={(v) => {
                setOriginWilaya(v);
                setFormErrors((p) => ({ ...p, origin: "" }));
              }}
              onDestinationChange={(v) => {
                setDestinationWilaya(v);
                setFormErrors((p) => ({ ...p, destination: "" }));
              }}
              onDateChange={(s, e) => {
                setStartDate(s);
                setEndDate(e);
              }}
              onClearDateError={() =>
                setFormErrors((p) => ({ ...p, date: "" }))
              }
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

            <NotesSection
              t={t}
              visible={visible}
              notes={notes}
              onChange={setNotes}
            />

            <CargoPhotosSection
              t={t}
              visible={visible}
              photoPreviews={photoPreviews}
              onAddPhotos={handleAddPhotos}
              onRemovePhoto={handleRemovePhoto}
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
                  backgroundColor: isAlgeria ? "#7C3AED" : "#d1d5db",
                  color: "white",
                  cursor: isAlgeria && !isLoading ? "pointer" : "not-allowed",
                  fontSize: "14px",
                  fontWeight: 600,
                  opacity: isAlgeria && !isLoading ? 1 : 0.6,
                  transition: "all 0.3s ease",
                  width: "100%",
                }}
              >
                {isLoading ? t.publishing : t.publishShipment}
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
                {lang === "en" ? "Cancel" : "Annuler"}
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
                style={{ color: "#7C3AED", textDecoration: "none" }}
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

export default function EditShipmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f5f5]" />}>
      <EditShipmentPageContent />
    </Suspense>
  );
}
