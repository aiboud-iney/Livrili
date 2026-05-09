import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { MarqueeBanner } from "@/components/marquee-banner"
import { HiddenCosts } from "@/components/hidden-costs"
import { HowItWorks } from "@/components/how-it-works"
import { BenefitsBanner } from "@/components/benefits-banner"
import { TrustSection } from "@/components/trust-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <MarqueeBanner />
        <HiddenCosts />
        <HowItWorks />
        <BenefitsBanner />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
