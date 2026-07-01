import Image from "next/image"
import Link from "next/link"
import { PageShell } from "@/components/PageShell"
import { brandSummaries } from "@/lib/catalog"
import styles from "./SnowboardsPage.module.scss"

export default function SnowboardsPage() {
  return (
    <PageShell
      description="Browse selected snowboard brands by ride style, flex, and value-to-performance focus."
      eyebrow="Snowboards"
      title="Snowboard Brands"
    >
      <section className={styles.brandGrid}>
        {brandSummaries.map((brand) => (
          <Link
            className={styles.brandCard}
            href={brand.href}
            key={brand.slug}
          >
            <div className={styles.logoArea}>
              <div className={styles.logoFrame}>
                <div className={styles.logoImageWrap}>
                  <Image
                    alt={brand.logoAlt}
                    className={styles.logoImage}
                    fill
                    sizes="(min-width: 768px) 30vw, 80vw"
                    src={brand.logoSrc}
                  />
                </div>
              </div>
            </div>
            <div className={styles.cardBody}>
              <div>
                <p className={styles.eyebrow}>Selected brand</p>
                <h2 className={styles.title}>{brand.name}</h2>
                <p className={styles.positioning}>{brand.positioning}</p>
                <p className={styles.description}>{brand.description}</p>
              </div>
              <span className={styles.cardLinkText}>Find out more</span>
            </div>
          </Link>
        ))}
      </section>
    </PageShell>
  )
}
