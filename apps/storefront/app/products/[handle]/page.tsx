import Image from "next/image"
import { notFound } from "next/navigation"
import { ErrorState, PageShell } from "@/components/PageShell"
import {
  brandName,
  fromPrice,
  getProductByHandle,
  graphicValues,
  metadataText,
  productSeries,
  sizeValues,
  variantPrice,
} from "@/lib/catalog"
import styles from "./ProductPage.module.scss"
import { VariantSelector } from "./VariantSelector"

export const dynamic = "force-dynamic"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const { data: product, error } = await getProductByHandle(handle)

  if (error) {
    return (
      <PageShell eyebrow="Product" title="Product">
        <ErrorState message={error} />
      </PageShell>
    )
  }

  if (!product) {
    notFound()
  }

  const brand = brandName(product)
  const series = productSeries(product)
  const graphics = graphicValues(product)
  const sizes = sizeValues(product)
  const metadataEntries = [
    ["Terrain", metadataText(product, "terrain")],
    ["Flex", metadataText(product, "flex")],
    ["Level", metadataText(product, "level")],
    ["Width", metadataText(product, "width")],
    ["Shape", metadataText(product, "shape")],
  ].filter((entry) => entry[1])

  return (
    <PageShell eyebrow={brand} title={product.title}>
      <section className={styles.layout}>
        <div className={styles.mainColumn}>
          <div className={styles.imageArea}>
            {product.thumbnail ? (
              <Image
                alt={product.title}
                className={styles.image}
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                src={product.thumbnail}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                Image coming soon
              </div>
            )}
          </div>

          <div className={styles.detailsPanel}>
            <h2 className={styles.sectionTitle}>Product Details</h2>
            <p className={styles.description}>
              {product.description}
            </p>
            {metadataEntries.length ? (
              <dl className={styles.metadataGrid}>
                {metadataEntries.map(([label, value]) => (
                  <div
                    className={styles.metadataItem}
                    key={label}
                  >
                    <dt className={styles.metadataLabel}>{label}</dt>
                    <dd className={styles.metadataValue}>{value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>

        <aside className={styles.purchasePanel}>
          <p className={styles.brand}>{brand}</p>
          {series ? (
            <p className={styles.series}>Series: {series}</p>
          ) : null}
          <p className={styles.price}>{fromPrice(product)}</p>

          {graphics.length ? (
            <p className={styles.optionSummary}>
              <span className={styles.optionSummaryLabel}>
                Graphics/Colors:
              </span>{" "}
              {graphics.join(", ")}
            </p>
          ) : null}
          {sizes.length ? (
            <p className={styles.optionSummary}>
              <span className={styles.optionSummaryLabel}>Sizes:</span>{" "}
              {sizes.join(", ")}
            </p>
          ) : null}

          <div className={styles.selectorWrap}>
            <VariantSelector
              options={product.options || []}
              variants={product.variants || []}
            />
          </div>
        </aside>
      </section>

      <section className={styles.variantsSection}>
        <h2 className={styles.variantsTitle}>Available Variants</h2>
        <div className={styles.variantGrid}>
          {product.variants?.map((variant) => (
            <div
              className={styles.variantCard}
              key={variant.id || variant.sku || variant.title}
            >
              <p className={styles.variantTitle}>{variant.title}</p>
              {variant.sku ? (
                <p className={styles.variantSku}>{variant.sku}</p>
              ) : null}
              <p className={styles.variantPrice}>
                {variantPrice(variant) || "Price coming soon"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
