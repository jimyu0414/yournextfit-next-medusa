import type { Metadata } from "next"
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
      <body>{children}</body>
    </html>
  )
}
