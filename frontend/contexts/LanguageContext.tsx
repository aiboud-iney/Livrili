"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type Language = "en" | "fr"

type LanguageContextType = {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: "Home",
    settings: "Settings",
    dashboard: "Dashboard",
    profile: "Profile",
    postShipment: "Post a Shipment",
    publishRoute: "Post a Route",
    dashboardOverview: "Dashboard overview",
    activeShipments: "Active shipments",
    activeRoutes: "Active routes",
    myTrucksLabel: "My trucks",
    myShipments: "My shipments",
    myRoutes: "My routes",
    myTrucks: "My trucks",
    giveFeedback: "Give feedback",
    feedback: "Feedback",
    help: "Help",
    logout: "Logout",
    editProfile: "Edit Profile",
    reviews: "reviews",
  },
  fr: {
    home: "Accueil",
    settings: "Paramètres",
    dashboard: "Tableau de bord",
    profile: "Profil",
    postShipment: "Publier une expédition",
    publishRoute: "Publier un trajet",
    dashboardOverview: "Aperçu du tableau de bord",
    activeShipments: "Expéditions actives",
    activeRoutes: "Trajets actifs",
    myTrucksLabel: "Mes camions",
    myShipments: "Mes expéditions",
    myRoutes: "Mes trajets",
    myTrucks: "Mes camions",
    giveFeedback: "Donner un avis",
    feedback: "Retours",
    help: "Aide",
    logout: "Déconnexion",
    editProfile: "Modifier le Profil",
    reviews: "avis",
  },
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key: string) => key,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en")
  const setLang = (newLang: Language) => setLangState(newLang)
  const t = (key: string) => translations[lang]?.[key] ?? key

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)