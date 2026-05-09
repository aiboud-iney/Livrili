export const PRODUCT_TYPES = [

  { value: "GC", labelEn: "General Cargo", labelFr: "Marchandises générales", color: "#6B7280", colorName: "gray" },
  { value: "PG", labelEn: "Palletized Goods", labelFr: "Marchandises palettisées", color: "#8B5CF6", colorName: "purple" },
  { value: "PK", labelEn: "Packaged Goods", labelFr: "Marchandises embalées", color: "#14B8A6", colorName: "teal" },
  { value: "LC", labelEn: "Loose Cargo", labelFr: "Vrac non conditionné", color: "#78716C", colorName: "tan" },

  { value: "RF", labelEn: "Refrigerated", labelFr: "Réfrigéré / Frais", color: "#3B82F6", colorName: "blue" },
  { value: "FZ", labelEn: "Frozen", labelFr: "Surgelé", color: "#06B6D4", colorName: "cyan" },
  { value: "DF", labelEn: "Dry Food", labelFr: "Alimentation sèche", color: "#22C55E", colorName: "green" },
  { value: "BV", labelEn: "Beverages", labelFr: "Boissons", color: "#F97316", colorName: "orange" },
  { value: "LS", labelEn: "Livestock", labelFr: "Bétail", color: "#84CC16", colorName: "lime" },

  { value: "RM", labelEn: "Raw Materials", labelFr: "Matières premières", color: "#57534E", colorName: "stone" },
  { value: "SM", labelEn: "Steel / Metal", labelFr: "Acier / Métal", color: "#4B5563", colorName: "gray-dark" },
  { value: "CH", labelEn: "Chemicals", labelFr: "Produits chimiques", color: "#EAB308", colorName: "yellow" },
  { value: "HZ", labelEn: "Hazardous Materials", labelFr: "Matières dangereuses", color: "#DC2626", colorName: "red" },
  { value: "CM", labelEn: "Construction Materials", labelFr: "Matériaux de construction", color: "#A16207", colorName: "amber" },
  { value: "ME", labelEn: "Machinery", labelFr: "Machines / Équipements", color: "#7C3AED", colorName: "violet" },

  { value: "OG", labelEn: "Oversize / Out of Gauge", labelFr: "Hors gabarit", color: "#EC4899", colorName: "pink" },
  { value: "HL", labelEn: "Heavy Lift", labelFr: "Charge lourde", color: "#DB2777", colorName: "pink-dark" },
  { value: "VA", labelEn: "Vehicles", labelFr: "Véhicules / Autos", color: "#0284C7", colorName: "sky" },
  { value: "FV", labelEn: "Fragile / High Value", labelFr: "Fragile / Haute valeur", color: "#F59E0B", colorName: "amber" },
  { value: "MP", labelEn: "Medical / Pharmaceutical", labelFr: "Médical / Pharmaceutique", color: "#10B981", colorName: "emerald" },
  { value: "EL", labelEn: "Electronics", labelFr: "Électronique", color: "#6366F1", colorName: "indigo" },

  { value: "DB", labelEn: "Dry Bulk", labelFr: "Vrac sec", color: "#78716C", colorName: "stone-light" },
  { value: "LB", labelEn: "Liquid Bulk", labelFr: "Vrac liquide", color: "#0D9488", colorName: "teal-dark" },
  { value: "AB", labelEn: "Agricultural Bulk", labelFr: "Vrac agricole", color: "#65A30D", colorName: "lime-dark" },
]

export const PRODUCT_TYPE_COLORS: Record<string, { bg: string; text: string; border?: string }> = {

  GC: { bg: "#F3F4F6", text: "#374151", border: "#D1D5DB" },
  PG: { bg: "#EDE9FE", text: "#5B21B6", border: "#8B5CF6" },
  PK: { bg: "#CCFBF1", text: "#0F766E", border: "#14B8A6" },
  LC: { bg: "#F5F5F4", text: "#44403C", border: "#78716C" },

  RF: { bg: "#DBEAFE", text: "#1E40AF", border: "#3B82F6" },
  FZ: { bg: "#CFFAFE", text: "#155E75", border: "#06B6D4" },
  DF: { bg: "#DCFCE7", text: "#166534", border: "#22C55E" },
  BV: { bg: "#FFEDD5", text: "#9A3412", border: "#F97316" },
  LS: { bg: "#ECFCCB", text: "#3F6212", border: "#84CC16" },

  RM: { bg: "#E7E5E4", text: "#292524", border: "#57534E" },
  SM: { bg: "#E5E7EB", text: "#1F2937", border: "#4B5563" },
  CH: { bg: "#FEF9C3", text: "#854D0E", border: "#EAB308" },
  HZ: { bg: "#FEE2E2", text: "#991B1B", border: "#DC2626" },
  CM: { bg: "#FEF3C7", text: "#92400E", border: "#D97706" },
  ME: { bg: "#F3E8FF", text: "#5B21B6", border: "#7C3AED" },

  OG: { bg: "#FCE7F3", text: "#9D174D", border: "#EC4899" },
  HL: { bg: "#FBCFE8", text: "#9D174D", border: "#DB2777" },
  VA: { bg: "#E0F2FE", text: "#075985", border: "#0284C7" },
  FV: { bg: "#FEF3C7", text: "#92400E", border: "#F59E0B" },
  MP: { bg: "#D1FAE5", text: "#065F46", border: "#10B981" },
  EL: { bg: "#E0E7FF", text: "#3730A3", border: "#6366F1" },

  DB: { bg: "#F5F5F4", text: "#44403C", border: "#78716C" },
  LB: { bg: "#99F6E4", text: "#115E59", border: "#0D9488" },
  AB: { bg: "#D9F99D", text: "#3F6212", border: "#65A30D" },
}

const humanize = (v: string) =>
  v.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

const findProductType = (value: string) =>
  PRODUCT_TYPES.find((t) => t.value === value) ??
  PRODUCT_TYPES.find((t) => t.value.toLowerCase() === value?.toLowerCase())

export const getProductTypeLabelEn = (value: string): string =>
  findProductType(value)?.labelEn ?? humanize(value ?? "")

export const getProductTypeLabelFr = (value: string): string =>
  findProductType(value)?.labelFr ?? humanize(value ?? "")

export const getProductTypeLabel = (value: string, lang: string = "en"): string =>
  lang === "fr" ? getProductTypeLabelFr(value) : getProductTypeLabelEn(value)

export const getProductTypeColor = (value: string): { bg: string; text: string; border?: string } =>
  PRODUCT_TYPE_COLORS[value] ?? { bg: "#F3F4F6", text: "#374151" }

export const getProductTypeOptions = (lang: string = "en") =>
  PRODUCT_TYPES.map((t) => ({
    value: t.value,
    label: lang === "fr" ? t.labelFr : t.labelEn,
  }))

export const REQUIRES_REFRIGERATED = ["RF", "FZ"]

export const requiresRefrigeratedTruck = (productType: string): boolean =>
  REQUIRES_REFRIGERATED.includes(productType)