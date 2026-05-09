"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api-client"
import { safeParse } from "@/lib/safe-json"
import { Header } from "./components/header"
import { RouteDetailsSection } from "./components/RouteDetailsSection"
import { ContactPhoneSection } from "./components/ContactPhoneSection"
import { TruckSelectionSection } from "./components/TruckSelectionSection"
import { NotesSection } from "./components/NotesSection"
import { SubmitButton } from "./components/SubmitButton"

const countries = [
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

export default function PostRoutePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isMobile, setIsMobile] = useState(false)

  const [originWilaya, setOriginWilaya] = useState("")
  const [destinationWilaya, setDestinationWilaya] = useState("")
  const [transitCities, setTransitCities] = useState("")
  const [tripType, setTripType] = useState<"aller" | "aller-retour">("aller")
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [capacity, setCapacity] = useState("")
  const [volume, setVolume] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(countries[0])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [trucks, setTrucks] = useState<any[]>([])
  const [selectedTruck, setSelectedTruck] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    fetchTrucks()
  }, [])

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start)
    setEndDate(end)
  }

  const handleAddTruck = async (newTruck: any) => {
    try {
      const token = localStorage.getItem("authToken")
      const formData = new FormData()

      formData.append("name", newTruck.name || "My Truck")
      formData.append("truck_type", newTruck.truck_type)
      formData.append("license_plate", newTruck.license_plate)
      formData.append("max_tonnage", String(newTruck.max_tonnage || 5))
      formData.append("max_volume", String(newTruck.max_volume || 50))

      if (newTruck.truck_pictures && newTruck.truck_pictures.length > 0) {
        newTruck.truck_pictures.forEach((file: File) => {
          formData.append("truck_pictures", file)
        })
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trucks`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })

      const responseText = await res.text()

      if (!res.ok) {
        const errorData = safeParse(responseText) || { message: responseText || `Failed to create truck: ${res.status}` }
        console.error("Truck creation error:", errorData)
        throw new Error(errorData.message || `Failed to create truck: ${res.status} ${res.statusText}`)
      }

      const createdTruck = safeParse(responseText) || { id: Date.now(), ...newTruck }

      const updatedTrucks = await fetchTrucks()

      const newIndex = updatedTrucks.findIndex(
        (t: any) => t.license_plate === newTruck.license_plate
      )
      if (newIndex !== -1) {
        setSelectedTruck(newIndex)
      }

      return createdTruck
    } catch (error: any) {
      console.error("Error creating truck:", error)
      setSubmitError(error.message || "Failed to create truck")
      throw error
    }
  }

  const fetchTrucks = async (): Promise<any[]> => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trucks/my-trucks`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (res.ok) {
        const responseText = await res.text()
        const data = safeParse(responseText) || {}
        const truckList = data.trucks || []
        setTrucks(truckList)
        return truckList
      }
      return []
    } catch (error) {
      console.error("Error fetching trucks:", error)
      return []
    }
  }

  const handleSubmit = async () => {

    const errors: Record<string, string> = {}
    if (!originWilaya) errors.origin = "Origin is required"
    if (!destinationWilaya) errors.destination = "Destination is required"
    if (!startDate) errors.departureStart = "Departure start date is required"
    if (tripType === "aller-retour" && !endDate) errors.departureEnd = "Return date is required"
    if (!capacity) errors.capacity = "Capacity is required"
    if (!volume) errors.volume = "Volume is required"
    if (!phoneNumber) errors.phone = "Phone number is required"
    if (selectedTruck === null && trucks.length > 0) errors.truck = "Please select a truck"

    setFormErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }

    setIsLoading(true)
    setSubmitError("")

    const selectedTruckData = selectedTruck !== null ? trucks[selectedTruck] : null

    const payload = {
      origin: originWilaya,
      destination: destinationWilaya,
      transit_cities: transitCities.split(",").map(c => c.trim()).filter(Boolean),
      start_date: startDate ? startDate.toISOString().slice(0, 10) : null,
      end_date: endDate ? endDate.toISOString().slice(0, 10) : null,
      max_weight: parseFloat(capacity),
      max_volume: parseFloat(volume),
      phonecountrycode: selectedCountry.code,
      contact_phone: phoneNumber,
      notes: notes || null,
      truck_type: selectedTruckData?.truck_type || null,
      assigned_truck_id: selectedTruckData?.id !== -1 ? selectedTruckData?.id : null,
      route_type: tripType === "aller" ? "ONE_WAY" : "ROUND_TRIP",
    }

    try {
      const res = await api.post('/routes', payload)

      const responseText = await res.text()
      const data = safeParse(responseText) || { message: responseText || 'Failed to publish route' }

      if (!res.ok) throw new Error(data.message || "Failed to publish route")

      router.push("/feed?tab=routes")
    } catch (err: any) {
      setSubmitError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const isAlgeria = selectedCountry.code === "+213"

  const t = {
    title: "Publish New Route",
    subtitle: "List your available truck capacity on the marketplace for Algerian shippers.",
    goBack: "Go Back",
    routeDetails: "Route Details",
    originCity: "Origin City",
    destinationCity: "Destination City",
    selectWilaya: "Select a wilaya",
    transitCities: "Transit Cities (Optional)",
    transitPlaceholder: "Select cities the route passes through",
    transitHint: "You can select multiple cities",
    selectTransitCity: "Select transit city",
    searchCity: "Search city...",
    tripType: "Trip Type",
    oneWay: "→ One Way",
    roundTrip: "⇄ Round Trip",
    departureDates: "Departure Date",
    departureDate: "Departure Date",
    returnDates: "Return Date",
    to: "to",
    cancel: "Cancel",
    setDate: "Set Date",
    truckTypeSelect: "Truck Type",
    truckTypeSelectHint: "What type of truck are you offering?",
    availableCapacity: "Available Capacity (Tons)",
    capacityHint: "Maximum weight you can carry",
    availableVolume: "Available Volume (m³)",
    volumeHint: "Maximum space available",
    contactPhone: "Contact Phone",
    contactPhoneDesc: "This number will be visible to transporters",
    algeriaOnly: "Only Algerian numbers are allowed for now",
    truckSelection: "Truck Selection",
    myTrucks: "My Trucks",
    addNew: "Add New Truck",
    truckType: "Truck Type",
    truckTypePlaceholder: "Select truck type",
    maxTonnage: "Max Tonnage",
    maxTonnageHint: "Maximum load capacity in tons",
    licensePlate: "License Plate",
    licensePlatePlaceholder: "e.g., 123 ABC 45",
    truckPictures: "Truck Pictures",
    dragDrop: "Drag & drop or click to upload",
    fileTypes: "Supported: JPG, PNG, PDF",
    browseFiles: "Browse files",
    saveTruck: "Save Truck",
    notes: "Additional Notes",
    optional: "(Optional)",
    notesPlaceholder: "Add any special instructions for the transporter...",
    publishRoute: "Publish Route",
    publishing: "Publishing...",
    publishNote: "By publishing, you agree to our",
    termsConditions: "Terms & Conditions",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    support: "Support",
    errors: {
      origin: "Please select an origin city.",
      destination: "Please select a destination city.",
      date: "Please select a departure date.",
      departureStart: "Please select a departure start date.",
      departureEnd: "Please select a departure end date.",
      departureOrder: "Departure start date must be before departure end date.",
      returnStart: "Please select a return start date.",
      returnEnd: "Please select a return end date.",
      returnOrder: "Return start date must be before return end date.",
      returnAfterDeparture: "Return start date must be after departure end date.",
      phone: "Please enter a phone number.",
      truck: "Please select or add a truck.",
      submitFailed: "Something went wrong. Please try again.",
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
      />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
          style={{ background: "none", border: "none" }}
        >
          ← {t.goBack}
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.title}</h1>

          {}
        <div className="space-y-6">
          {}
          <RouteDetailsSection
            t={t}
            lang="en"
            visible={true}
            isMobile={isMobile}
            originWilaya={originWilaya}
            destinationWilaya={destinationWilaya}
            transitCities={transitCities}
            tripType={tripType}
            startDate={startDate}
            endDate={endDate}
            capacity={capacity}
            volume={volume}
            formErrors={formErrors}
            onOriginChange={setOriginWilaya}
            onDestinationChange={setDestinationWilaya}
            onTransitChange={setTransitCities}
            onTripTypeChange={setTripType}
            onDateChange={handleDateChange}
            onCapacityChange={setCapacity}
            onVolumeChange={setVolume}
          />

          {}
          <ContactPhoneSection
            t={t}
            visible={true}
            countries={countries}
            selectedCountry={selectedCountry}
            phoneNumber={phoneNumber}
            formErrors={formErrors}
            onCountryChange={setSelectedCountry}
            onPhoneChange={setPhoneNumber}
          />

          {}
          <TruckSelectionSection
            t={t}
            visible={true}
            trucks={trucks}
            selectedTruck={selectedTruck}
            formErrors={formErrors}
            onSelectTruck={setSelectedTruck}
            onAddTruck={handleAddTruck}
          />

          {}
          <NotesSection
            t={t}
            visible={true}
            notes={notes}
            onChange={setNotes}
          />

          {}
          <div className="pt-4">
            {submitError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {submitError}
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold bg-[#B8FF00] text-black hover:bg-[#a3e600] transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Publishing..." : "Publish Route"}
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              By publishing, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
