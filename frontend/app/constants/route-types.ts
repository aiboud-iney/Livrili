export const ROUTE_TYPES = [
  { value: "ONE_WAY", labelEn: "One Way", labelFr: "Aller simple" },
  { value: "ROUND_TRIP", labelEn: "Round Trip", labelFr: "Aller-retour" },
] as const;

export type RouteType = (typeof ROUTE_TYPES)[number]["value"];
