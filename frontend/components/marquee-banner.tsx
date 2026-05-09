"use client"

import { useLang } from "@/contexts/LanguageContext"

const itemsByLang = {
  en: ["REDUCE COST", "DIRECT CONTACT", "NO MIDDLEMAN"],
  fr: ["RÉDUIRE LES COÛTS", "CONTACT DIRECT", "SANS INTERMÉDIAIRE"],
}

export function MarqueeBanner() {
  const { lang } = useLang()
  const items = Array(6).fill(itemsByLang[lang]).flat()

  return (
    <div className="bg-[#202020] py-4 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {items.map((item, index) => (
          <div key={index} className="flex items-center mx-8">
            <span className="text-[#ffffff] font-semibold text-xs tracking-wider">
              {item}
            </span>
            <span className="ml-8 text-[#BFFF00] text-2xl">•</span>
          </div>
        ))}
      </div>
    </div>
  )
}
