"use client"

import { useEffect } from "react"
import { useLang } from "@/contexts/LanguageContext"

export function SetHtmlLang() {
  const { lang } = useLang()
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "fr" ? "fr" : "en"
    }
  }, [lang])
  return null
}
