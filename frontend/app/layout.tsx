import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { LanguageProvider } from "@/contexts/LanguageContext"
import { AuthProviderWrapper } from "@/components/AuthProviderWrapper"
import { SetHtmlLang } from "@/components/set-html-lang"
import { GoogleProvider } from "@/components/google-oauth-provider"

export const metadata: Metadata = {
  title: 'Livrili - Connect Shipments & Trucks Intelligently',
  description: 'Eliminate empty return trips and optimize your logistics across Algeria with our direct freight marketplace. No middleman, no extra costs.',
  icons: {
    icon: '/icons/logo.png',
    apple: '/icons/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <GoogleProvider>
          <LanguageProvider>
            <AuthProviderWrapper>
              <SetHtmlLang />
              {children}
              <Analytics />
            </AuthProviderWrapper>
          </LanguageProvider>
        </GoogleProvider>
      </body>
    </html>
  )
}