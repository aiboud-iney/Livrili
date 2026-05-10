"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PricingSection } from "@/components/subscription"

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}
