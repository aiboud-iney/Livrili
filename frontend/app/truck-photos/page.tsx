"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NotificationDropdown from "@/components/NotificationDropdown";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useLang } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/language-switcher";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const normalizeTruckPhotoUrl = (rawPath: string): string => {
  if (!rawPath) return "";

  if (/^https?:\/\//.test(rawPath)) return rawPath;

  const normalized = rawPath.replace(/\\/g, "/");

  const uploadsIndex = normalized.toLowerCase().lastIndexOf("/uploads/");
  if (uploadsIndex !== -1) {
    const uploadsPath = normalized.slice(uploadsIndex);
    return `${API_BASE_URL}${uploadsPath}`;
  }

  if (normalized.startsWith("uploads/")) {
    return `${API_BASE_URL}/${normalized}`;
  }

  if (normalized.startsWith("/uploads/")) {
    return `${API_BASE_URL}${normalized}`;
  }

  return normalized;
};

function TruckPhotosPageContent() {
  const { lang } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const truckId = searchParams.get("id");
  const action = searchParams.get("action");

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [visible, setVisible] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photosError, setPhotosError] = useState("");

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVisible(true);
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchTruckPhotos = async () => {
      if (!truckId) return;

      try {
        setPhotosLoading(true);
        setPhotosError("");

        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_BASE_URL}/trucks/${truckId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch truck photos (${response.status})`);
        }

        const data = await response.json();
        const pictures = Array.isArray(data?.truck?.truck_pictures)
          ? data.truck.truck_pictures
          : [];

        setPhotos(pictures.map((path: string) => normalizeTruckPhotoUrl(path)));
      } catch (error) {
        console.error("Failed to load truck photos:", error);
        setPhotos([]);
        setPhotosError(
          lang === "en"
            ? "Failed to load truck photos"
            : "Échec du chargement des photos du camion",
        );
      } finally {
        setPhotosLoading(false);
      }
    };

    fetchTruckPhotos();
  }, [truckId, lang]);

  const handleAddPhotos = (files: File[]) => {
    setNewPhotos((prev) => [...prev, ...files]);
    setPhotoPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const handleRemovePhoto = (index: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExisting = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
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

  const handleSave = async () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.back();
    }, 1000);
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
        <div className="max-w-4xl mx-auto">
          <button
            title="Go Back"
            className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: "none", border: "none" }}
            onClick={() => router.back()}
          >
            <img
              src="/icons/go back.png"
              alt="Go Back"
              style={{ width: "20px", height: "20px", objectFit: "contain" }}
            />
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {lang === "en" ? "Truck Photos" : "Photos du Camion"}
          </h1>
          <p className="text-gray-500 mb-8">
            {lang === "en"
              ? "View and manage photos for truck ID: "
              : "Afficher et gérer les photos pour le camion: "}{" "}
            {truckId}
          </p>

          {photosError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {photosError}
            </div>
          )}

          {}
          {!photosLoading && photos.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-[#e0e0e0] mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {lang === "en" ? "All Photos" : "Toutes les Photos"}
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "16px",
                }}
              >
                {photos.map((photo, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "relative",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <img
                      src={photo}
                      alt={`Photo ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      onClick={() => handleRemoveExisting(idx)}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "28px",
                        height: "28px",
                        cursor: "pointer",
                        fontSize: "16px",
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

          {photosLoading && (
            <div className="mb-6 rounded-lg border border-[#e0e0e0] bg-white p-6 text-sm text-gray-500">
              {lang === "en" ? "Loading photos..." : "Chargement des photos..."}
            </div>
          )}

          {}
          <div className="bg-white p-6 rounded-lg border border-[#e0e0e0]">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {lang === "en" ? "Add Photos" : "Ajouter des Photos"}
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
                {lang === "en"
                  ? "Drag and drop images here"
                  : "Glissez et déposez les images ici"}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginBottom: "12px",
                }}
              >
                PNG, JPG or PDF (Max. 5MB per file)
              </p>
              <p
                style={{ fontSize: "13px", color: "#7C3AED", fontWeight: 500 }}
              >
                {lang === "en"
                  ? "or browse files"
                  : "ou parcourir les fichiers"}
              </p>
              <input
                title="truck photos upload"
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*" />
            </div>
            {photoPreviews.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1a1a1a",
                    marginBottom: "12px",
                  }}
                >
                  {lang === "en" ? "New Photos" : "Nouvelles Photos"}
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(120px, 1fr))",
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
                          height: "120px",
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

          {}
          <div
            style={{
              marginTop: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {photoPreviews.length > 0 && (
              <button
                onClick={handleSave}
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
                {isLoading
                  ? lang === "en"
                    ? "Saving..."
                    : "Enregistrement..."
                  : lang === "en"
                    ? "Save Photos"
                    : "Enregistrer les Photos"}
              </button>
            )}
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
              {lang === "en" ? "Go Back" : "Retour"}
            </button>
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

export default function TruckPhotosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f5f5]" />}>
      <TruckPhotosPageContent />
    </Suspense>
  );
}
