export type EditTruckPayload = {
  truck_type: string;
  license_plate: string;
  max_tonnage: number;
  max_volume?: number;
};

export const TRUCK_TYPES = [
  "Flat Bed",
  "Box Truck",
  "Refrigerated",
  "Tanker",
  "Dump Truck",
  "Tractor Trailer",
  "Pickup Truck",
  "Van",
  "Other",
];

export function formatTonnage(tonnage: number): string {
  return `${tonnage} Tons`;
}

export function formatVolume(volume: number): string {
  return `${volume} m³`;
}
