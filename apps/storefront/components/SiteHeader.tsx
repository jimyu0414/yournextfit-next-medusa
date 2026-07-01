"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import styles from "./SiteHeader.module.scss"

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
  return [styles.navLink, active ? styles.navLinkActive : ""].join(" ")
}

export function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  const snowboardsActive = isActive(pathname, "/snowboards")

  return (
    <header className={styles.header}>
      <nav aria-label="Main navigation" className={styles.nav}>
        <div className={styles.bar}>
          <Link
            className={styles.brand}
            href="/"
            onClick={closeMenu}
          >
            Your Next Fit
          </Link>

          <div className={styles.desktopNav}>
            <Link className={navLinkClass(isActive(pathname, "/"))} href="/">
              Home
            </Link>

            <div className={styles.dropdownWrap}>
              <Link
                aria-haspopup="true"
                className={navLinkClass(snowboardsActive)}
                href="/snowboards"
              >
                Snowboards
              </Link>
              <div className={styles.dropdown}>
                {snowboardLinks.map((item) => (
                  <Link
                    className={styles.dropdownLink}
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
            className={styles.menuButton}
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span className={styles.screenReaderOnly}>
              {menuOpen ? "Close navigation menu" : "Open navigation menu"}
            </span>
            <span aria-hidden="true" className={styles.hamburger}>
              <span
                className={[
                  styles.hamburgerLine,
                  menuOpen ? styles.hamburgerLineTopOpen : "",
                ].join(" ")}
              />
              <span
                className={[
                  styles.hamburgerLine,
                  menuOpen ? styles.hamburgerLineMiddleOpen : "",
                ].join(" ")}
              />
              <span
                className={[
                  styles.hamburgerLine,
                  menuOpen ? styles.hamburgerLineBottomOpen : "",
                ].join(" ")}
              />
            </span>
          </button>
        </div>

        <div
          className={[
            styles.mobileNav,
            menuOpen ? styles.mobileNavOpen : "",
          ].join(" ")}
          id="mobile-navigation"
        >
          <div className={styles.mobileNavInner}>
            <Link
              className={styles.mobileLink}
              href="/"
              onClick={closeMenu}
            >
              Home
            </Link>

            <div className={styles.mobileGroup}>
              <p className={styles.mobileGroupTitle}>Snowboards</p>
              <div className={styles.mobileGroupLinks}>
                {snowboardLinks.map((item) => (
                  <Link
                    className={styles.mobileLink}
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
                className={styles.mobileLink}
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
