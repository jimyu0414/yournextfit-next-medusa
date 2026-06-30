import type { Metadata } from "next"
import Link from "next/link"
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
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/snowboards", label: "Snowboards" },
    { href: "/clothing", label: "Clothing" },
    { href: "/accessories", label: "Accessories" },
    { href: "/about", label: "About Us" },
  ]

  return (
    <html lang="en">
      <body>
        <header className="border-b border-black/10 bg-white/75 backdrop-blur">
          <nav className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
            <Link
              className="text-lg font-semibold tracking-wide text-neutral-950"
              href="/"
            >
              Your Next Fit
            </Link>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-neutral-700">
              {navItems.map((item) => (
                <Link
                  className="transition hover:text-teal-800"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
