"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const snowboardLinks = [
  { href: "/snowboards", label: "All Snowboards" },
  { href: "/snowboards/cloud-suntt", label: "Cloud Suntt" },
  { href: "/snowboards/maibk", label: "Maibk" },
  { href: "/snowboards/cosone", label: "Cosone" },
]

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/clothing", label: "Clothing" },
  { href: "/accessories", label: "Accessories" },
  { href: "/about", label: "About Us" },
]

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function navLinkClass(active: boolean) {
  return [
    "rounded px-2 py-2 transition hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2",
    active ? "text-neutral-950" : "text-neutral-700",
  ].join(" ")
}

export function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  const snowboardsActive = isActive(pathname, "/snowboards")

  return (
    <header className="border-b border-black/10 bg-white/80 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10"
      >
        <div className="flex min-h-16 items-center justify-between gap-4">
          <Link
            className="rounded text-lg font-semibold tracking-wide text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
            href="/"
            onClick={closeMenu}
          >
            Your Next Fit
          </Link>

          <div className="hidden items-center gap-4 text-sm font-medium lg:flex">
            <Link className={navLinkClass(isActive(pathname, "/"))} href="/">
              Home
            </Link>

            <div className="group relative">
              <Link
                aria-haspopup="true"
                className={navLinkClass(snowboardsActive)}
                href="/snowboards"
              >
                Snowboards
              </Link>
              <div className="invisible absolute left-0 top-full z-30 mt-3 w-56 rounded border border-black/10 bg-white p-2 text-sm opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {snowboardLinks.map((item) => (
                  <Link
                    className="block rounded px-3 py-2 text-neutral-700 transition hover:bg-teal-50 hover:text-teal-900 focus:outline-none focus-visible:bg-teal-50 focus-visible:text-teal-900"
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {mainLinks.slice(1).map((item) => (
              <Link
                className={navLinkClass(isActive(pathname, item.href))}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded border border-black/10 bg-white text-neutral-950 shadow-sm transition hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span className="sr-only">
              {menuOpen ? "Close navigation menu" : "Open navigation menu"}
            </span>
            <span aria-hidden="true" className="flex flex-col gap-1.5">
              <span
                className={[
                  "block h-0.5 w-5 bg-neutral-950 transition",
                  menuOpen ? "translate-y-2 rotate-45" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "block h-0.5 w-5 bg-neutral-950 transition",
                  menuOpen ? "opacity-0" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "block h-0.5 w-5 bg-neutral-950 transition",
                  menuOpen ? "-translate-y-2 -rotate-45" : "",
                ].join(" ")}
              />
            </span>
          </button>
        </div>

        <div
          className={[
            "overflow-hidden border-t border-black/10 text-sm font-medium lg:hidden",
            menuOpen ? "block" : "hidden",
          ].join(" ")}
          id="mobile-navigation"
        >
          <div className="grid gap-1 py-4">
            <Link
              className="rounded px-3 py-3 text-neutral-800 transition hover:bg-teal-50 hover:text-teal-900 focus:outline-none focus-visible:bg-teal-50 focus-visible:text-teal-900"
              href="/"
              onClick={closeMenu}
            >
              Home
            </Link>

            <div className="rounded border border-black/10 bg-white/70 p-2">
              <p className="px-2 py-2 text-xs font-semibold uppercase text-neutral-500">
                Snowboards
              </p>
              <div className="grid gap-1">
                {snowboardLinks.map((item) => (
                  <Link
                    className="rounded px-3 py-3 text-neutral-800 transition hover:bg-teal-50 hover:text-teal-900 focus:outline-none focus-visible:bg-teal-50 focus-visible:text-teal-900"
                    href={item.href}
                    key={item.href}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {mainLinks.slice(1).map((item) => (
              <Link
                className="rounded px-3 py-3 text-neutral-800 transition hover:bg-teal-50 hover:text-teal-900 focus:outline-none focus-visible:bg-teal-50 focus-visible:text-teal-900"
                href={item.href}
                key={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
