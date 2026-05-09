"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import NotificationDropdown from "@/components/NotificationDropdown";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useLang } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/language-switcher";

import { LimitReachedModal } from "@/components/LimitReachedModal";

import { translations } from "./translations";
import { DEFAULT_COUNTRIES, toISODate } from "./types";
import type { PostShipmentPayload, Country } from "./types";

import { CargoDetailsSection } from "./components/CargoDetailsSection";
import { RouteScheduleSection } from "./components/RouteScheduleSection";
import { ContactPhoneSection } from "./components/ContactPhoneSection";
import { NotesSection } from "./components/NotesSection";
import { CargoPhotosSection } from "./components/CargoPhotosSection";
import { SubmitButton } from "./components/SubmitButton";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
  );
};

const getUserId = (): number | null => {
  if (typeof window === "undefined") return null;
  const userStr =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return user.id;
  } catch {
    return null;
  }
};

export default function PostShipmentPage() {
  const { lang } = useLang();
  const t = translations[lang];
  const router = useRouter();

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
  const [description, setDescription] = useState("");

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
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [showLimitModal, setShowLimitModal] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isAlgeria = selectedCountry.code === "+213";

  useEffect(() => {

    const token = getAuthToken();
    const userId = getUserId();

    if (!token || !userId) {
      router.push("/login");
      return;
    }

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
  }, [router]);

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

  const handlePublish = async () => {
    if (!validate()) return;

    const token = getAuthToken();
    const userId = getUserId();

    if (!token || !userId) {
      setSubmitError("Authentication required. Please login again.");
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setSubmitError("");
    setSuccessMessage("");

    try {

      const fullPhoneNumber = `${selectedCountry.code}${phoneNumber.trim()}`;

      const formData = new FormData();

      formData.append("title", shipmentTitle.trim());
      formData.append("origin", originWilaya);
      formData.append("destination", destinationWilaya);
      formData.append("from_pickup_date", toISODate(startDate!));
      if (endDate) {
        formData.append("to_pickup_date", toISODate(endDate));
      }
      formData.append("weight", weight);
      formData.append("volume", volume || "0");
      if (shipmentType) {
        formData.append("shipment_type", shipmentType);
      }
      formData.append("phone_number", fullPhoneNumber);
      if (truckType) {
        formData.append("truck_type", truckType);
      }

      if (description.trim()) {
        formData.append("description", description.trim());
      }

      photoFiles.forEach((file) => {
        formData.append("shipment_pictures", file);
      });



      const response = await fetch(`${API_BASE_URL}/shipments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && data.message === "FREE_LIMIT_REACHED") {
          setShowLimitModal(true);
          setIsLoading(false);
          return;
        }
        throw new Error(data.message || "Failed to create shipment");
      }



      const shipmentId = data.shipment?.id || data.id;

      setSuccessMessage("Shipment published successfully! Redirecting...");

      setTimeout(() => {
        router.push(`/shipment-listing/${shipmentId}`);
      }, 1500);
    } catch (error: any) {
      console.error(" Error creating shipment:", error);
      setSubmitError(error.message || t.errors.submitFailed);
    } finally {
      setIsLoading(false);
    }
  };

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
              </button>
              <NotificationDropdown show={showNotifications} lang={lang} />
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
              notes={description}
              onChange={setDescription}
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
          {successMessage && (
            <div
              style={{
                marginTop: "24px",
                padding: "16px",
                backgroundColor: "#d4edda",
                border: "1px solid #c3e6cb",
                borderRadius: "12px",
                color: "#155724",
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              {successMessage}
            </div>
          )}

          <SubmitButton
            t={t}
            visible={visible}
            isAlgeria={isAlgeria}
            isLoading={isLoading}
            submitError={submitError}
            onPublish={handlePublish}
          />
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

      {}
      {showLimitModal && (
        <LimitReachedModal
          isOpen={showLimitModal}
          onClose={() => setShowLimitModal(false)}
          lang={lang}
        />
      )}
    </div>
  );
}
