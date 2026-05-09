import { useState } from "react"
import { WeightInput } from "./WeightInput"
import { TRUCK_TYPES } from "@/app/constants/truck-types"

type Props = {
  t: any
  visible: boolean
  trucks: any[]
  selectedTruck: number | null
  formErrors: Record<string, string>
  onSelectTruck: (i: number) => void
  onAddTruck: (truck: any) => void
}

export function TruckSelectionSection({
  t, visible, trucks, selectedTruck, formErrors, onSelectTruck, onAddTruck,
}: Props) {
  const [truckMode, setTruckMode] = useState<"myTrucks" | "addNew">("myTrucks")
  const [truckName, setTruckName] = useState("")
  const [truckType, setTruckType] = useState("")
  const [licensePlate, setLicensePlate] = useState("")
  const [maxTonnage, setMaxTonnage] = useState("5")
  const [maxVolume, setMaxVolume] = useState("50")
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])

  const handleAddPhotos = (files: File[]) => {
    setPhotoFiles(prev => [...prev, ...files])
    setPhotoPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))])
  }

  const handleRemovePhoto = (index: number) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index))
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSaveTruck = () => {
    if (!truckName || !truckType || !licensePlate) return
    const tonnageNum = Number(maxTonnage)
    const volumeNum = Number(maxVolume)
    if (tonnageNum <= 0 || volumeNum <= 0) return
    onAddTruck({
      id: -1,
      name: truckName,
      truck_type: truckType,
      license_plate: licensePlate,
      max_tonnage: tonnageNum,
      max_volume: volumeNum,
      truck_pictures: photoFiles
    })
    setTruckMode("myTrucks")
    setTruckName("")
    setTruckType("")
    setLicensePlate("")
    setMaxTonnage("5")
    setMaxVolume("50")
    setPhotoFiles([])
    setPhotoPreviews([])
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease 0.3s" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: "#B8FF00", color: "#111" }}>3</div>
        <h2 className="text-xl font-semibold text-gray-900">{t.truckSelection}</h2>
      </div>

      {}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {(["myTrucks", "addNew"] as const).map(mode => (
          <button key={mode} onClick={() => setTruckMode(mode)} style={{ padding: "8px 20px", borderRadius: "999px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 600, backgroundColor: truckMode === mode ? "#B8FF00" : "transparent", color: truckMode === mode ? "#111" : "#374151" }}>
            {mode === "myTrucks" ? t.myTrucks : t.addNew}
          </button>
        ))}
      </div>

      {truckMode === "myTrucks" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {trucks && trucks.length > 0 ? trucks.map((truck, i) => (
            <button key={i} onClick={() => onSelectTruck(i)} style={{ padding: "14px 16px", borderRadius: "12px", cursor: "pointer", textAlign: "left", border: selectedTruck === i ? "2px solid #B8FF00" : "2px solid #e5e7eb", backgroundColor: selectedTruck === i ? "#EDFFD0" : "white", display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: selectedTruck === i ? "#B8FF00" : "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={selectedTruck === i ? "/icons/truck.png" : "/icons/truck-gray.png"} alt="truck" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#111" }}>{truck.truck_type}</div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>{truck.license_plate} · {truck.max_tonnage} Tons</div>
              </div>
              {selectedTruck === i && (
                <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#B8FF00", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src="/icons/check green.png" alt="selected" style={{ width: "12px", height: "12px", objectFit: "contain" }} />
                </div>
              )}
            </button>
          )) : (
            <div className="text-center text-gray-500 py-8 col-span-2">No trucks found. Add a new truck.</div>
          )}
          {formErrors.truck && <p className="text-xs text-red-500 col-span-2">{formErrors.truck}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {}
            <div>
              <label htmlFor="truckName" className="block text-sm font-bold text-gray-900 mb-2">Truck Name</label>
              <input
                id="truckName"
                name="truckName"
                type="text"
                placeholder="e.g., Truck 01"
                value={truckName}
                onChange={e => setTruckName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none"
                style={{ backgroundColor: "#EDFFD0", border: "none" }}
                aria-label="Truck Name"
              />
            </div>

            {}
            <div>
              <label htmlFor="truckType" className="block text-sm font-bold text-gray-900 mb-2">{t.truckType}</label>
              <div style={{ position: "relative" }}>
                <select id="truckType" name="truckType" value={truckType} onChange={e => setTruckType(e.target.value)} style={{ width: "100%", padding: "12px 16px", backgroundColor: "#EDFFD0", borderRadius: "8px", border: "none", outline: "none", fontSize: "14px", color: truckType ? "#374151" : "#9ca3af", cursor: "pointer", appearance: "none" }}>
                  <option value="">{t.truckTypePlaceholder}</option>
                  {TRUCK_TYPES.map(truck => (
                    <option key={truck.value} value={truck.value}> ({truck.value}) {truck.labelEn}</option>
                  ))}
                </select>
                <img src="/icons/icon down green 1.png" alt="select" style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", objectFit: "contain", pointerEvents: "none" }} />
              </div>
            </div>

            <WeightInput label={t.maxTonnage} hint={t.maxTonnageHint} value={maxTonnage} onChange={setMaxTonnage} />

            <div>
              <label htmlFor="maxVolume" className="block text-sm font-bold text-gray-900 mb-2">Max Volume (m³)</label>
              <input
                id="maxVolume"
                name="maxVolume"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="e.g., 50"
                value={maxVolume}
                onChange={e => {
                  const val = e.target.value
                  if (val === "" || parseFloat(val) > 0) {
                    setMaxVolume(val)
                  }
                }}
                className="w-full px-4 py-3 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none"
                style={{ backgroundColor: "#EDFFD0", border: "none" }}
                aria-label="Maximum Volume in cubic meters"
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="licensePlate" className="block text-sm font-bold text-gray-900 mb-2">{t.licensePlate}</label>
              <input id="licensePlate" name="licensePlate" type="text" placeholder={t.licensePlatePlaceholder} value={licensePlate} onChange={e => setLicensePlate(e.target.value)} className="w-full px-4 py-3 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none" style={{ backgroundColor: "#EDFFD0", border: "none" }} aria-label="License Plate Number" />
            </div>
          </div>

          {}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">{t.truckPictures}</label>
            {photoPreviews.length === 0 ? (
              <label style={{ display: "block", cursor: "pointer" }}>
                <input type="file" accept="image/*,application/pdf" multiple style={{ display: "none" }} onChange={e => handleAddPhotos(Array.from(e.target.files || []))} />
                <div className="border-2 border-dashed rounded-xl p-8 text-center" style={{ borderColor: "#B8FF00" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#EDFFD0"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                  <div className="flex justify-center mb-3"><img src="/icons/upload green.png" alt="Upload" style={{ width: "40px", height: "40px", objectFit: "contain", opacity: 0.6 }} /></div>
                  <p className="text-gray-900 font-medium mb-1">{t.dragDrop}</p>
                  <p className="text-gray-400 text-sm mb-2">{t.fileTypes}</p>
                  <span style={{ color: "#B8FF00", fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}>{t.browseFiles}</span>
                </div>
              </label>
            ) : (
              <div>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                  <label style={{ width: "80px", height: "80px", borderRadius: "16px", border: "2px dashed #d4ffaa", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backgroundColor: "white" }}>
                    <input type="file" accept="image/*,application/pdf" multiple style={{ display: "none" }} onChange={e => handleAddPhotos(Array.from(e.target.files || []))} />
                    <span style={{ fontSize: "28px", color: "#d4ffaa", lineHeight: 1 }}>+</span>
                  </label>
                  {photoPreviews.map((src, i) => (
                    <div key={i} style={{ position: "relative", width: "80px", height: "80px", borderRadius: "16px", overflow: "visible" }}>
                      <img src={src} alt={`Upload ${i + 1}`} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "16px" }} />
                      <button onClick={() => handleRemovePhoto(i)} style={{ position: "absolute", top: "-8px", right: "-8px", width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#111", border: "2px solid white", color: "white", fontSize: "11px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>×</button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">{t.fileTypes}</p>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleSaveTruck} disabled={!truckName || !truckType || !licensePlate} style={{ padding: "10px 24px", borderRadius: "10px", border: "none", backgroundColor: truckName && truckType && licensePlate ? "#B8FF00" : "#e5e7eb", color: truckName && truckType && licensePlate ? "#111" : "#9ca3af", fontWeight: 700, fontSize: "14px", cursor: truckName && truckType && licensePlate ? "pointer" : "not-allowed" }}>{t.saveTruck}</button>
          </div>
        </div>
      )}
    </div>
  )
}