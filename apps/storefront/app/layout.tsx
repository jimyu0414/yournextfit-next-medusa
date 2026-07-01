import type { Metadata } from "next"
import { SiteHeader } from "@/components/SiteHeader"
import "./globals.css"

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
      </body>
    </html>
  )
}
