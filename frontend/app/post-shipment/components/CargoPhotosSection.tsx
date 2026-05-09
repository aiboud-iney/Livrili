import type { Translations } from "../translations"

type Props = {
  t:             Translations
  visible:       boolean
  photoPreviews: string[]
  onAddPhotos:   (files: File[]) => void
  onRemovePhoto: (index: number) => void
}

export function CargoPhotosSection({ t, visible, photoPreviews, onAddPhotos, onRemovePhoto }: Props) {
  return (
    <div
      className="bg-white rounded-xl p-6 shadow-sm"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#7C3AED] rounded-full flex items-center justify-center text-white text-sm font-medium">5</div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t.cargoPhotos}{" "}
            <span className="text-gray-400 font-normal text-base">{t.optional}</span>
          </h2>
        </div>
      </div>

      {photoPreviews.length === 0 ? (
        <label style={{ display: "block", cursor: "pointer" }}>
          <input
            type="file"
            accept="image/*,application/pdf"
            multiple
            style={{ display: "none" }}
            onChange={e => onAddPhotos(Array.from(e.target.files || []))}
          />
          <div
            className="border-2 border-dashed border-[#7C3AED] rounded-xl p-8 text-center"
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#faf5ff")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
            style={{ transition: "background 0.2s" }}
          >
            <div className="flex justify-center mb-3">
              <img src="/icons/upload.png" alt="Upload" style={{ width: "40px", height: "40px", objectFit: "contain", opacity: 0.6 }} />
            </div>
            <p className="text-gray-900 font-medium mb-1">{t.dragDrop}</p>
            <p className="text-gray-400 text-sm mb-2">{t.fileTypes}</p>
            <span className="text-[#7C3AED] font-medium">{t.browseFiles}</span>
          </div>
        </label>
      ) : (
        <div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <label
              style={{ width: "80px", height: "80px", borderRadius: "16px", border: "2px dashed #d8b4fe", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backgroundColor: "white", transition: "border-color 0.2s", flexShrink: 0 }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#7C3AED")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#d8b4fe")}
            >
              <input
                type="file"
                accept="image/*,application/pdf"
                multiple
                style={{ display: "none" }}
                onChange={e => onAddPhotos(Array.from(e.target.files || []))}
              />
              <span style={{ fontSize: "28px", color: "#c4b5fd", lineHeight: 1 }}>+</span>
            </label>

            {photoPreviews.map((src, i) => (
              <div key={i} style={{ position: "relative", width: "80px", height: "80px", borderRadius: "16px", overflow: "visible", flexShrink: 0 }}>
                <img src={src} alt={`Upload ${i + 1}`} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "16px", display: "block" }} />
                <button
                  title="Remove"
                  onClick={() => onRemovePhoto(i)}
                  style={{ position: "absolute", top: "-8px", right: "-8px", width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#111", border: "2px solid white", color: "white", fontSize: "11px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "12px" }}>{t.fileTypes}</p>
        </div>
      )}
    </div>
  )
}
