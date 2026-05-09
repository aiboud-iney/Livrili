"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PricingSection } from "@/components/subscription"
import { PlanSelectionModal } from "@/components/subscription/PlanSelectionModal"

export default function SubscriptionPage() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {

    const timer = setTimeout(() => {
      setShowModal(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <PricingSection />
      </main>
      <Footer />

      {}
      <PlanSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}