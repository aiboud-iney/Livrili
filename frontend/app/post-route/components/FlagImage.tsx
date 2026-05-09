import type { Country } from "../types"

export function FlagImage({ country }: { country: Country }) {
  if (country.flagUrl) {
    return (
      <img
        src={country.flagUrl}
        alt={country.name}
        style={{ width: "24px", height: "16px", objectFit: "cover", borderRadius: "2px", flexShrink: 0 }}
      />
    )
  }
  return (
    <div style={{ width: "24px", height: "16px", borderRadius: "2px", backgroundColor: "#B8FF00", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: "7px", fontWeight: 700, color: "#111" }}>{country.iso}</span>
    </div>
  )
}
