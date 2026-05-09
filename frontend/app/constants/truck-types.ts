export const TRUCK_TYPES = [
  { value: "DRY_VAN", labelEn: "Dry Van", labelFr: "Fourgon fermé", color: "#6B7280", colorName: "gray" },
  { value: "REEFER", labelEn: "Reefer", labelFr: "Frigo - Réfrigéré", color: "#3B82F6", colorName: "blue" },
  { value: "FLATBED", labelEn: "Flatbed", labelFr: "Plateau", color: "#1a1a1a", colorName: "dark" },
  { value: "BOX_TRUCK", labelEn: "Box Truck", labelFr: "Camion caisse", color: "#22C55E", colorName: "green" },
  { value: "CONTAINER", labelEn: "Container", labelFr: "Porte-conteneur", color: "#F97316", colorName: "orange" },
  { value: "HOT_SHOT", labelEn: "Hot Shot", labelFr: "Hot Shot", color: "#DC2626", colorName: "red" },
  { value: "CONESTOGA", labelEn: "Conestoga", labelFr: "Conestoga", color: "#8B5CF6", colorName: "purple" },
  { value: "STEP_DECK", labelEn: "Step Deck", labelFr: "Step Deck", color: "#EC4899", colorName: "pink" },
  { value: "CARGO_VAN", labelEn: "Cargo Van", labelFr: "Fourgonnette", color: "#14B8A6", colorName: "teal" },
]

export const TRUCK_TYPE_COLORS: Record<string, { bg: string; text: string; border?: string }> = {
  DRY_VAN: { bg: "#F3F4F6", text: "#374151", border: "#D1D5DB" },
  REEFER: { bg: "#DBEAFE", text: "#1E40AF", border: "#3B82F6" },
  FLATBED: { bg: "#1a1a1a", text: "#ffffff" },
  BOX_TRUCK: { bg: "#DCFCE7", text: "#166534", border: "#22C55E" },
  CONTAINER: { bg: "#FFEDD5", text: "#9A3412", border: "#F97316" },
  HOT_SHOT: { bg: "#FEE2E2", text: "#991B1B", border: "#DC2626" },
  CONESTOGA: { bg: "#EDE9FE", text: "#5B21B6", border: "#8B5CF6" },
  STEP_DECK: { bg: "#FCE7F3", text: "#9D174D", border: "#EC4899" },
  CARGO_VAN: { bg: "#CCFBF1", text: "#0F766E", border: "#14B8A6" },
}

export const TRUCK_TYPE_CODE_MAP: Record<string, string> = {
  V: "DRY_VAN",
  R: "REEFER",
  F: "FLATBED",
  SB: "BOX_TRUCK",
  C: "CONTAINER",
  HS: "HOT_SHOT",
  N: "CONESTOGA",
  SD: "STEP_DECK",
  CV: "CARGO_VAN",
}

const humanize = (v: string) =>
  v.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

export const normalizeTruckType = (value: string): string => {
  if (!value) return value

  const mapped = TRUCK_TYPE_CODE_MAP[value.toUpperCase()]
  if (mapped) return mapped

  return value
}

const findTruckType = (value: string) => {
  if (!value) return undefined

  const normalized = normalizeTruckType(value)
  return TRUCK_TYPES.find((t) => t.value === normalized) ??
    TRUCK_TYPES.find((t) => t.value.toLowerCase() === normalized?.toLowerCase())
}

export const getTruckTypeLabelEn = (value: string): string =>
  findTruckType(value)?.labelEn ?? humanize(value ?? "")

export const getTruckTypeLabelFr = (value: string): string =>
  findTruckType(value)?.labelFr ?? humanize(value ?? "")

export const getTruckTypeLabel = (value: string, lang: string = "en"): string =>
  lang === "fr" ? getTruckTypeLabelFr(value) : getTruckTypeLabelEn(value)

export const getTruckTypeColor = (value: string): { bg: string; text: string; border?: string } => {
  if (!value) return { bg: "#F3F4F6", text: "#374151" }
  const normalized = normalizeTruckType(value)
  return TRUCK_TYPE_COLORS[normalized] ?? { bg: "#F3F4F6", text: "#374151" }
}

export const getTruckTypeOptions = (lang: string = "en") =>
  TRUCK_TYPES.map((t) => ({
    value: t.value,
    label: lang === "fr" ? t.labelFr : t.labelEn,
  }))