export type Truck = { id: number; truck_type: string; license_plate: string; max_tonnage: number, truck_pictures?: File[] }

export type PublishRoutePayload = {
  origin:      string
  destination: string
  transit_cities?:    string[]
  route_type:         "ONE_WAY" | "ROUND_TRIP"
  trip_type?:         "aller" | "aller-retour"
  departure_date:     string
  start_date?:        string
  end_date?:          string
  return_start_date?: string
  return_end_date?:   string
  max_weight:      number
  max_volume?:         number
  phonecountrycode:  string
  contact_phone:       string
  truck_type:             string
  notes?:            string
  assigned_truck_id?: number
}

export type Country = { code: string; name: string; iso: string; flagUrl: string }

import { WILAYAS } from "../constants/wilayas";

export const ALGERIAN_WILAYAS = WILAYAS;

export const DEFAULT_COUNTRIES: Country[] = [
  { code: "+213", name: "Algeria",        iso: "DZ", flagUrl: "" },
  { code: "+1",   name: "United States",  iso: "US", flagUrl: "" },
  { code: "+44",  name: "United Kingdom", iso: "GB", flagUrl: "" },
  { code: "+33",  name: "France",         iso: "FR", flagUrl: "" },
  { code: "+49",  name: "Germany",        iso: "DE", flagUrl: "" },
  { code: "+34",  name: "Spain",          iso: "ES", flagUrl: "" },
  { code: "+39",  name: "Italy",          iso: "IT", flagUrl: "" },
  { code: "+212", name: "Morocco",        iso: "MA", flagUrl: "" },
  { code: "+216", name: "Tunisia",        iso: "TN", flagUrl: "" },
  { code: "+20",  name: "Egypt",          iso: "EG", flagUrl: "" },
  { code: "+966", name: "Saudi Arabia",   iso: "SA", flagUrl: "" },
  { code: "+971", name: "UAE",            iso: "AE", flagUrl: "" },
  { code: "+90",  name: "Turkey",         iso: "TR", flagUrl: "" },
  { code: "+86",  name: "China",          iso: "CN", flagUrl: "" },
  { code: "+91",  name: "India",          iso: "IN", flagUrl: "" },
]

export const MONTHS    = ["January","February","March","April","May","June","July","August","September","October","November","December"]
export const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
export const DAYS      = ["Mo","Tu","We","Th","Fr","Sa","Su"]
export const DAYS_FR   = ["Lu","Ma","Me","Je","Ve","Sa","Di"]

export const DEFAULT_TRUCKS: Truck[] = [
  { id: -3, truck_type: "Renault Kerax", license_plate: "ABC-123-DZ", max_tonnage: 24 },
  { id: -2, truck_type: "Volvo FH16",    license_plate: "XYZ-789-DZ", max_tonnage: 40 },
]

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export function formatDate(d: Date | null) {
  if (!d || isNaN(d.getTime())) return "__/__/____"
  return `${String(d.getDate()).padStart(2, "0")} / ${String(d.getMonth() + 1).padStart(2, "0")} / ${d.getFullYear()}`
}

export function toISODate(d: Date) {
  if (isNaN(d.getTime())) return ""
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function fromISODate(isoString: string): Date | null {
  if (!isoString) return null
  try {
    const parts = isoString.split("-")
    if (parts.length !== 3) return null
    const [year, month, day] = parts.map(Number)
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null
    const date = new Date(year, month - 1, day)
    if (isNaN(date.getTime())) return null
    return date
  } catch {
    return null
  }
}
