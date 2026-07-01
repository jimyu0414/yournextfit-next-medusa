import type { Metadata } from "next"
import { SiteFooter } from "@/components/SiteFooter"
import { SiteHeader } from "@/components/SiteHeader"
import "./globals.scss"

export const metadata: Metadata = {
  title: "Yournextfit",
  description: "Independent snowboard and sports ecommerce storefront.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
