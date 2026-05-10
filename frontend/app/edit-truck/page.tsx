"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NotificationDropdown from "@/components/NotificationDropdown";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useLang } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/language-switcher";
import { TRUCK_TYPES } from "@/app/constants/truck-types";

import { translations } from "./translations";
import type { EditTruckPayload } from "./types";

function EditTruckPageContent() {
  const { lang } = useLang();
  const t = translations[lang ?? "en"];
  const router = useRouter();
  const searchParams = useSearchParams();
  const truckId = searchParams.get("id");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const [truckType, setTruckType] = useState("Flat Bed");
  const [licensePlate, setLicensePlate] = useState("");
  const [maxTonnage, setMaxTonnage] = useState("20");
  const [maxVolume, setMaxVolume] = useState("50");

  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTruck, setIsLoadingTruck] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [notificationCount, setNotificationCount] = useState(0);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVisible(true);
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

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
    async function fetchTruckData() {
      if (!truckId) {
        setLoadError("Truck ID not found");
        setIsLoadingTruck(false);
        return;
      }

      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${apiUrl}/trucks/${truckId}`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to load truck (${res.status})`);
        }

        const data = await res.json();
        const truck = data?.truck ?? data ?? {};

        setTruckType(String(truck.truck_type ?? "Flat Bed"));
        setLicensePlate(String(truck.license_plate ?? ""));
        setMaxTonnage(
          truck.max_tonnage != null ? String(truck.max_tonnage) : "20",
        );
        setMaxVolume(truck.max_volume != null ? String(truck.max_volume) : "");

        setIsLoadingTruck(false);
      } catch (error) {
        setLoadError("Error loading truck. Please try again.");
        setIsLoadingTruck(false);
      }
    }

    fetchTruckData();
  }, [truckId, apiUrl]);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    handleAddPhotos(files as File[]);
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!truckType) errors.truckType = t.errors.truckType;
    if (!licensePlate.trim()) errors.licensePlate = t.errors.licensePlate;
    if (!maxTonnage) errors.maxTonnage = t.errors.maxTonnage;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    setIsLoading(true);
    setSubmitError("");

    try {
      const token = localStorage.getItem("authToken");

      const payload: EditTruckPayload = {
        truck_type: truckType,
        license_plate: licensePlate.trim(),
        max_tonnage: Number(maxTonnage),
        max_volume: maxVolume ? Number(maxVolume) : undefined,
      };

      const res = await fetch(`${apiUrl}/trucks/${truckId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        if (photoFiles.length > 0) {
          const photoFormData = new FormData();
          photoFiles.forEach((file) => photoFormData.append("truck_pictures", file));
          await fetch(`${apiUrl}/trucks/${truckId}/photos`, {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: photoFormData,
          });
        }
        router.push("/Dashboard");
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

  if (isLoadingTruck) {
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
              {lang === "en" ? "Loading truck..." : "Chargement du camion..."}
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
              onClick={() => router.push("/Dashboard")}
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
            {}
            <div
              className="bg-white p-6 rounded-lg border border-[#e0e0e0]"
              style={{
                opacity: visible ? 1 : 0,
                transition: "opacity 0.5s ease 0.2s",
              }}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {t.truckDetails}
              </h2>

              <div className="space-y-4">
                {}
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1a1a1a",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    {t.truckType}
                  </label>
                  <select
                    value={truckType}
                    onChange={(e) => {
                      setTruckType(e.target.value);
                      setFormErrors((p) => ({ ...p, truckType: "" }));
                    }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: formErrors.truckType
                        ? "1px solid #ef4444"
                        : "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">{t.truckTypePlaceholder || "Select a truck type"}</option>
                    {TRUCK_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {lang === "fr" ? type.labelFr : type.labelEn}
                      </option>
                    ))}
                  </select>
                  {formErrors.truckType && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {formErrors.truckType}
                    </p>
                  )}
                </div>

                {}
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1a1a1a",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    {t.licensePlate}
                  </label>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => {
                      setLicensePlate(e.target.value);
                      setFormErrors((p) => ({ ...p, licensePlate: "" }));
                    }}
                    placeholder={t.licensePlateHint}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: formErrors.licensePlate
                        ? "1px solid #ef4444"
                        : "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                    }}
                  />
                  {formErrors.licensePlate && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {formErrors.licensePlate}
                    </p>
                  )}
                </div>

                {}
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1a1a1a",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    {t.maxTonnage}
                  </label>
                  <input
                    type="number"
                    value={maxTonnage}
                    onChange={(e) => {
                      setMaxTonnage(e.target.value);
                      setFormErrors((p) => ({ ...p, maxTonnage: "" }));
                    }}
                    placeholder={t.maxTonnageHint}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: formErrors.maxTonnage
                        ? "1px solid #ef4444"
                        : "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                    }}
                  />
                  {formErrors.maxTonnage && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {formErrors.maxTonnage}
                    </p>
                  )}
                </div>

                {}
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1a1a1a",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    {t.maxVolume}
                  </label>
                  <input
                    type="number"
                    value={maxVolume}
                    onChange={(e) => setMaxVolume(e.target.value)}
                    placeholder={t.maxVolumeHint}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>
            </div>

            {}
            <div
              className="bg-white p-6 rounded-lg border border-[#e0e0e0]"
              style={{
                opacity: visible ? 1 : 0,
                transition: "opacity 0.5s ease 0.3s",
              }}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {t.truckPhotos}
              </h2>

              {}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed #d1d5db",
                  borderRadius: "8px",
                  padding: "32px 24px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "#fafafa",
                  transition: "all 0.3s ease",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#1a1a1a",
                    marginBottom: "8px",
                  }}
                >
                  {t.dragDrop}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "12px",
                  }}
                >
                  {t.fileTypes}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#7C3AED",
                    fontWeight: 500,
                  }}
                >
                  {t.browseFiles}
                </p>
                <input
                  title="truck photos upload"
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*" />
              </div>
              {photoPreviews.length > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(100px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {photoPreviews.map((preview, idx) => (
                      <div key={idx} style={{ position: "relative" }}>
                        <img
                          src={preview}
                          alt={`Preview ${idx}`}
                          style={{
                            width: "100%",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        <button
                          onClick={() => handleRemovePhoto(idx)}
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            backgroundColor: "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
                  backgroundColor: "#7C3AED",
                  color: "white",
                  cursor: !isLoading ? "pointer" : "not-allowed",
                  fontSize: "14px",
                  fontWeight: 600,
                  opacity: !isLoading ? 1 : 0.6,
                  transition: "all 0.3s ease",
                  width: "100%",
                }}
              >
                {isLoading ? t.updating : t.updateTruck}
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
              {t.updateNote}{" "}
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

export default function EditTruckPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f5f5]" />}>
      <EditTruckPageContent />
    </Suspense>
  );
}
