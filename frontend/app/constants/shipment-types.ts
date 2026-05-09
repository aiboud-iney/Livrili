export interface ShipmentType {
  value: string;
  labelEn: string;
  labelFr: string;
  category: string;
  color: {
    bg: string;
    text: string;
    border: string;
  };
}

export const SHIPMENT_TYPES: ShipmentType[] = [

  { value: 'GENERAL_CARGO', labelEn: 'General Cargo', labelFr: 'Cargaison Générale', category: 'General',
    color: { bg: '#F3E8FF', text: '#6B21A8', border: '#D8B4FE' } },
  { value: 'PALLETIZED', labelEn: 'Palletized', labelFr: 'Palettisé', category: 'General',
    color: { bg: '#F3E8FF', text: '#6B21A8', border: '#D8B4FE' } },
  { value: 'PACKAGED', labelEn: 'Packaged', labelFr: 'Emballé', category: 'General',
    color: { bg: '#F3E8FF', text: '#6B21A8', border: '#D8B4FE' } },
  { value: 'LOOSE_CARGO', labelEn: 'Loose Cargo', labelFr: 'Cargaison Vrac', category: 'General',
    color: { bg: '#F3E8FF', text: '#6B21A8', border: '#D8B4FE' } },

  { value: 'REFRIGERATED', labelEn: 'Refrigerated', labelFr: 'Réfrigéré', category: 'Food & Perishables',
    color: { bg: '#DCFCE7', text: '#166534', border: '#86EFAC' } },
  { value: 'FROZEN', labelEn: 'Frozen', labelFr: 'Congelé', category: 'Food & Perishables',
    color: { bg: '#DCFCE7', text: '#166534', border: '#86EFAC' } },
  { value: 'DRY_FOOD', labelEn: 'Dry Food', labelFr: 'Aliments Secs', category: 'Food & Perishables',
    color: { bg: '#DCFCE7', text: '#166534', border: '#86EFAC' } },
  { value: 'BEVERAGES', labelEn: 'Beverages', labelFr: 'Boissons', category: 'Food & Perishables',
    color: { bg: '#DCFCE7', text: '#166534', border: '#86EFAC' } },
  { value: 'LIVESTOCK', labelEn: 'Livestock', labelFr: 'Bétail', category: 'Food & Perishables',
    color: { bg: '#DCFCE7', text: '#166534', border: '#86EFAC' } },

  { value: 'RAW_MATERIALS', labelEn: 'Raw Materials', labelFr: 'Matières Premières', category: 'Industrial',
    color: { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74' } },
  { value: 'STEEL_METAL', labelEn: 'Steel & Metal', labelFr: 'Acier & Métal', category: 'Industrial',
    color: { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74' } },
  { value: 'CHEMICALS', labelEn: 'Chemicals', labelFr: 'Produits Chimiques', category: 'Industrial',
    color: { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74' } },
  { value: 'HAZARDOUS', labelEn: 'Hazardous', labelFr: 'Dangereux', category: 'Industrial',
    color: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' } },
  { value: 'CONSTRUCTION', labelEn: 'Construction', labelFr: 'Construction', category: 'Industrial',
    color: { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74' } },
  { value: 'MACHINERY', labelEn: 'Machinery', labelFr: 'Machinerie', category: 'Industrial',
    color: { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74' } },

  { value: 'OVERSIZE', labelEn: 'Oversize', labelFr: 'Hors Dimensions', category: 'Special',
    color: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' } },
  { value: 'HEAVY_LIFT', labelEn: 'Heavy Lift', labelFr: 'Levage Lourd', category: 'Special',
    color: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' } },
  { value: 'VEHICLES', labelEn: 'Vehicles', labelFr: 'Véhicules', category: 'Special',
    color: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' } },
  { value: 'FRAGILE', labelEn: 'Fragile', labelFr: 'Fragile', category: 'Special',
    color: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' } },
  { value: 'MEDICAL', labelEn: 'Medical', labelFr: 'Médical', category: 'Special',
    color: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' } },
  { value: 'ELECTRONICS', labelEn: 'Electronics', labelFr: 'Électronique', category: 'Special',
    color: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' } },

  { value: 'DRY_BULK', labelEn: 'Dry Bulk', labelFr: 'Vrac Sec', category: 'Bulk',
    color: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' } },
  { value: 'LIQUID_BULK', labelEn: 'Liquid Bulk', labelFr: 'Vrac Liquide', category: 'Bulk',
    color: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' } },
  { value: 'AGRICULTURAL_BULK', labelEn: 'Agricultural Bulk', labelFr: 'Vrac Agricole', category: 'Bulk',
    color: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' } },
];

export function getShipmentType(value: string): ShipmentType | undefined {
  return SHIPMENT_TYPES.find(t => t.value === value);
}

export function getShipmentTypeLabel(value: string, lang: 'en' | 'fr' = 'en'): string {
  const type = getShipmentType(value);
  if (!type) return '—';
  return lang === 'en' ? type.labelEn : type.labelFr;
}

export function getShipmentTypeColor(value: string): { bg: string; text: string; border: string } {
  const type = getShipmentType(value);
  if (!type) return { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' };
  return type.color;
}

export function normalizeShipmentType(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.toUpperCase().trim();
  const validTypes = SHIPMENT_TYPES.map(t => t.value);
  return validTypes.includes(normalized) ? normalized : null;
}