import Link from "next/link"
import styles from "./SiteFooter.module.scss"

const footerLinks = [
  { href: "/snowboards", label: "Snowboards" },
  { href: "/clothing", label: "Clothing" },
  { href: "/accessories", label: "Accessories" },
  { href: "/about", label: "About Us" },
]

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <p className={styles.brand}>Your Next Fit</p>
          <p className={styles.text}>
            Selected snowboard gear focused on practical specs, value, and
            mountain-ready performance.
          </p>
        </div>

        <nav aria-label="Footer navigation" className={styles.links}>
          {footerLinks.map((item) => (
            <Link className={styles.link} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
