import WeightInput from "./WeightInput"
import { SHIPMENT_TYPES } from "@/app/constants/shipment-types"
import { TRUCK_TYPES } from "@/app/constants/truck-types"
import type { Translations } from "../translations"

type Props = {
  t:                Translations
  lang:             string
  visible:          boolean
  shipmentTitle:    string
  weight:           string
  volume:           string
  shipmentType:     string
  truckType:        string
  formErrors:       Record<string, string>
  onTitleChange:    (v: string) => void
  onWeightChange:   (v: string) => void
  onVolumeChange:   (v: string) => void
  onShipmentTypeChange: (v: string) => void
  onTruckTypeChange: (v: string) => void
}

export function CargoDetailsSection({
  t, lang, visible,
  shipmentTitle, weight, volume, shipmentType, truckType, formErrors,
  onTitleChange, onWeightChange, onVolumeChange, onShipmentTypeChange, onTruckTypeChange,
}: Props) {
  return (
    <div
      className="bg-white rounded-xl p-6 shadow-sm"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-7 h-7 bg-[#7C3AED] rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
        <h2 className="text-xl font-semibold text-gray-900">{t.cargoDetails}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">{t.shipmentTitle}</label>
          <input
            type="text"
            title={t.shipmentTitle}
            placeholder={t.shipmentTitlePlaceholder}
            value={shipmentTitle}
            onChange={e => onTitleChange(e.target.value)}
            className="w-full px-4 py-3 bg-[#F3EAFF] rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            style={{ border: formErrors.shipmentTitle ? "1.5px solid #fca5a5" : "none" }}
          />
          {formErrors.shipmentTitle && (
            <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>{formErrors.shipmentTitle}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 items-start">
          <WeightInput label={t.totalWeight} hint={t.totalWeightHint} value={weight} onChange={onWeightChange} />
          <WeightInput label={t.volume}      hint={t.volumeHint}      value={volume} onChange={onVolumeChange} />
        </div>

        {}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">{t.shipmentType}</label>
          <div style={{ position: "relative" }}>
            <select
              title={t.shipmentType}
              value={shipmentType}
              onChange={e => onShipmentTypeChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg focus:outline-none appearance-none cursor-pointer ${shipmentType ? "text-gray-700" : "text-gray-400"}`}
              style={{ backgroundColor: "#F3EAFF", paddingRight: "40px", border: formErrors.shipmentType ? "1.5px solid #fca5a5" : "none", outline: "none" }}
            >
              <option value="">Select shipment type</option>
              {SHIPMENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  ({type.value}) {lang === "fr" ? type.labelFr : type.labelEn}
                </option>
              ))}
            </select>
            <img src="/icons/icon down green 1.png" alt="select" style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", objectFit: "contain", pointerEvents: "none" }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{t.shipmentTypeHint}</p>
          {formErrors.shipmentType && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>{formErrors.shipmentType}</p>}
        </div>

        {}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">{t.truckType}</label>
          <div style={{ position: "relative" }}>
            <select
              title={t.truckType}
              value={truckType}
              onChange={e => onTruckTypeChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg focus:outline-none appearance-none cursor-pointer ${truckType ? "text-gray-700" : "text-gray-400"}`}
              style={{ backgroundColor: "#F3EAFF", paddingRight: "40px", border: formErrors.truckType ? "1.5px solid #fca5a5" : "none", outline: "none" }}
            >
              <option value="">Select truck type</option>
              {TRUCK_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  ({type.value}) {lang === "fr" ? type.labelFr : type.labelEn}
                </option>
              ))}
            </select>
            <img src="/icons/icon down green 1.png" alt="select" style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", objectFit: "contain", pointerEvents: "none" }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{t.truckTypeHint}</p>
          {formErrors.truckType && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>{formErrors.truckType}</p>}
        </div>
      </div>
    </div>
  )
}
