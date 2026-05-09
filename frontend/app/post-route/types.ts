export interface Country {
  code: string
  iso: string
  name: string
  flagUrl: string
}

export const countries: Country[] = [
  { code: "+213", iso: "DZ", name: "Algeria", flagUrl: "https://flagcdn.com/dz.svg" },
  { code: "+33", iso: "FR", name: "France", flagUrl: "https://flagcdn.com/fr.svg" },
  { code: "+1", iso: "US", name: "United States", flagUrl: "https://flagcdn.com/us.svg" },
  { code: "+44", iso: "GB", name: "United Kingdom", flagUrl: "https://flagcdn.com/gb.svg" },
  { code: "+49", iso: "DE", name: "Germany", flagUrl: "https://flagcdn.com/de.svg" },
  { code: "+34", iso: "ES", name: "Spain", flagUrl: "https://flagcdn.com/es.svg" },
  { code: "+39", iso: "IT", name: "Italy", flagUrl: "https://flagcdn.com/it.svg" },
  { code: "+971", iso: "AE", name: "UAE", flagUrl: "https://flagcdn.com/ae.svg" },
  { code: "+966", iso: "SA", name: "Saudi Arabia", flagUrl: "https://flagcdn.com/sa.svg" },
  { code: "+20", iso: "EG", name: "Egypt", flagUrl: "https://flagcdn.com/eg.svg" },
  { code: "+212", iso: "MA", name: "Morocco", flagUrl: "https://flagcdn.com/ma.svg" },
  { code: "+216", iso: "TN", name: "Tunisia", flagUrl: "https://flagcdn.com/tn.svg" },
]

import { WILAYAS } from "../constants/wilayas";

export const ALGERIAN_WILAYAS = WILAYAS;

export const formatDate = (date: Date | null): string => {
  if (!date) return "__/__/____"
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day} / ${month} / ${year}`
}

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate()
}

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay()
}

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
export const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"]
export const DAYS = ["M", "T", "W", "T", "F", "S", "S"]
export const DAYS_FR = ["L", "M", "M", "J", "V", "S", "D"]