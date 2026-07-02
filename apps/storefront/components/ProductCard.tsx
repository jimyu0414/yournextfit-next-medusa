import Image from "next/image"
import Link from "next/link"
import {
  brandName,
  fromPrice,
  graphicValues,
  productSeries,
  sizeValues,
  StoreProduct,
} from "@/lib/catalog"
import styles from "./ProductCard.module.scss"

function DetailLine({ label, values }: { label: string; values: string[] }) {
  if (!values.length) {
    return null
  }

  return (
    <p className={styles.detailLine}>
      <span className={styles.detailLabel}>{label}:</span>{" "}
      {values.join(", ")}
    </p>
  )
}

export function ProductCard({ product }: { product: StoreProduct }) {
  const series = productSeries(product)
  const graphics = graphicValues(product)
  const sizes = sizeValues(product)

  return (
    <article className={styles.card}>
      <div className={styles.imageArea}>
        {product.thumbnail ? (
          <Image
            alt={product.title}
            className={styles.image}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            src={product.thumbnail}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            Image coming soon
          </div>
        )}
      </div>
      <div className={styles.body}>
        <div>
          <p className={styles.brand}>{brandName(product)}</p>
          <h2 className={styles.title}>{product.title}</h2>
          {series ? (
            <p className={styles.series}>Series: {series}</p>
          ) : null}
          <p className={styles.description}>
            {product.description}
          </p>
          <div className={styles.details}>
            <DetailLine label="Graphics/Colors" values={graphics} />
            <DetailLine label="Sizes" values={sizes} />
          </div>
        </div>
        <div className={styles.footer}>
          <p className={styles.price}>{fromPrice(product)}</p>
          <Link
            className={styles.detailsLink}
            href={`/products/${product.handle}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
