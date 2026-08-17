import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { CookieNotice } from "@/components/layout/CookieNotice"
import WhatsAppButton from "@/components/layout/WhatsAppButton"
import { ScrollProgress } from "@/components/ui/ScrollProgress"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "DonaCenter - Butiku Juaj Premium i Modës",
  description: "Zbuloni koleksionin më të ri të veshjeve moderne dhe elegante në DonaCenter. Cilësi e lartë, stil i përjetshëm. Transport në Kosovë, Shqipëri dhe Maqedoninë e Veriut.",
  keywords: "modë, veshje, premium, butik, kosovë, shqipëri, online shop, fashion, donacenter",
  openGraph: {
    title: "DonaCenter - Butiku Juaj Premium i Modës",
    description: "Zbuloni koleksionin më të ri të veshjeve moderne dhe elegante.",
    type: "website",
    locale: "sq_AL",
    siteName: "DonaCenter",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="sq"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white font-sans">
        <ScrollProgress />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <CookieNotice />
        <Analytics />
      </body>
    </html>
  )
}
