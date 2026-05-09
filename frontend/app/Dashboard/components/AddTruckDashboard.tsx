"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { TRUCK_TYPES } from "@/app/constants/truck-types"

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface AddTruckDashboardProps {
  onTruckAdded?: () => void;
}

export default function AddTruckDashboard({ onTruckAdded }: AddTruckDashboardProps) {
  const router = useRouter()

  const [truckType, setTruckType] = useState("")
  const [licensePlate, setLicensePlate] = useState("")
  const [maxTonnage, setMaxTonnage] = useState("")
  const [maxVolume, setMaxVolume] = useState("")

  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddPhotos = (files: File[]) => {
    setPhotoFiles((prev) => [...prev, ...files])
    setPhotoPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))])
  }

  const handleRemovePhoto = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index))
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files)
    handleAddPhotos(files as File[])
  }

  const validate = (): boolean => {
    const errors: Record<string, string> = {}
    if (!truckType.trim()) errors.truckType = "Truck type is required"
    if (!licensePlate.trim()) errors.licensePlate = "License plate is required"
    if (!maxTonnage || Number(maxTonnage) <= 0) errors.maxTonnage = "Valid max tonnage is required"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setIsLoading(true)
    setSubmitError("")

    const formData = new FormData()
    formData.append("name", "My Truck")
    formData.append("truck_type", truckType.trim())
    formData.append("license_plate", licensePlate.trim())
    formData.append("max_tonnage", maxTonnage || "5")
    formData.append("max_volume", maxVolume || "50")
    photoFiles.forEach((file) => {
      formData.append("truck_pictures", file)
    })

    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch(`${apiUrl}/trucks`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })

      if (res.ok) {

        setTruckType("")
        setLicensePlate("")
        setMaxTonnage("")
        setMaxVolume("")
        setPhotoFiles([])
        setPhotoPreviews([])
        setFormErrors({})
        setSubmitError("")

        if (onTruckAdded) {
          onTruckAdded()
        }
        window.dispatchEvent(new Event("trucks-refreshed"))
      } else {
        const errorData = await res.json().catch(() => ({}))
        setSubmitError(
          errorData.message || "Failed to add truck. Please try again."
        )
      }
    } catch (error) {
      setSubmitError("Failed to add truck. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold bg-[#B8FF00] text-gray-900">
          +
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Add New Truck</h2>
      </div>

      <div className="space-y-4">
        {}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Truck Type
          </label>
          <select
            value={truckType}
            onChange={(e) => setTruckType(e.target.value)}
            className={`w-full px-4 py-3 rounded-full focus:outline-none transition ${
              formErrors.truckType
                ? "border-2 border-red-500 bg-white"
                : "bg-[#EDFFD0]"
            }`}
          >
            <option value="">Select truck type</option>
            {TRUCK_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.labelEn}
              </option>
            ))}
          </select>
          {formErrors.truckType && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.truckType}
            </p>
          )}
        </div>

        {}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            License Plate
          </label>
          <input
            type="text"
            placeholder="Enter license plate"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            className={`w-full px-4 py-3 rounded-full focus:outline-none transition ${
              formErrors.licensePlate
                ? "border-2 border-red-500 bg-white"
                : "bg-[#EDFFD0]"
            }`}
          />
          {formErrors.licensePlate && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.licensePlate}
            </p>
          )}
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Max Tonnage (tons)
            </label>
            <input
              type="number"
              placeholder="20"
              value={maxTonnage}
              onChange={(e) => setMaxTonnage(e.target.value)}
              className={`w-full px-4 py-3 rounded-full focus:outline-none transition ${
                formErrors.maxTonnage
                  ? "border-2 border-red-500 bg-white"
                  : "bg-[#EDFFD0]"
              }`}
            />
            {formErrors.maxTonnage && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.maxTonnage}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Max Volume (m³)
            </label>
            <input
              type="number"
              placeholder="50"
              value={maxVolume}
              onChange={(e) => setMaxVolume(e.target.value)}
              className="w-full px-4 py-3 rounded-full focus:outline-none transition bg-[#EDFFD0]"
            />
          </div>
        </div>

        {}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Truck Photos (Optional)
          </label>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#B8FF00] rounded-lg p-6 text-center cursor-pointer hover:bg-[#f0ffd0] transition"
          >
            <svg
              className="w-8 h-8 mx-auto mb-2 text-[#B8FF00]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p className="text-gray-900 font-medium text-sm">Drag & drop photos</p>
            <p className="text-gray-500 text-xs">PNG, JPG up to 10MB</p>
            <p className="text-[#B8FF00] text-sm font-medium mt-1">Browse files</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg"
              onChange={(e) => handleAddPhotos(Array.from(e.target.files || []))}
              className="hidden"
            />
          </div>

          {}
          {photoPreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {photoPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{submitError}</p>
          </div>
        )}

        {}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-[#B8FF00] text-gray-900 py-3 rounded-full font-bold hover:bg-[#a8ee00] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Adding Truck..." : "Add Truck"}
        </button>
      </div>
    </div>
  )
}
