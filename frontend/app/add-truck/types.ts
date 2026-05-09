export type AddTruckPayload = {
  truck_type: string
  license_plate: string
  max_tonnage: number
  max_volume?: number
  truck_pictures?: File[]
}

export type Truck = {
  id: number
  truck_type: string
  license_plate: string
  max_tonnage: number
  max_volume?: number
  truck_pictures?: string[]
}

export const toISODate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
