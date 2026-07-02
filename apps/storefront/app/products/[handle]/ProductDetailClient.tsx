"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import {
  brandSummaries,
  brandName,
  fromPrice,
  graphicValues,
  metadataText,
  productSeries,
  sizeValues,
  StoreProduct,
  variantPrice,
} from "@/lib/catalog"
import { getProductGraphicImage } from "@/lib/product-images"
import styles from "./ProductPage.module.scss"
import {
  getInitialVariantSelection,
  VariantSelection,
  VariantSelector,
} from "./VariantSelector"

function selectedGraphicValue(selection: VariantSelection) {
  const graphicEntry = Object.entries(selection).find(([title]) =>
    /graphic|color/i.test(title)
  )

  return graphicEntry?.[1] || ""
}

export function ProductDetailClient({ product }: { product: StoreProduct }) {
  const brand = brandName(product)
  const brandSlug = metadataText(product, "brand_slug")
  const brandSummary = brandSummaries.find((item) => item.slug === brandSlug)
  const series = productSeries(product)
  const graphics = graphicValues(product)
  const sizes = sizeValues(product)
  const hasVariants = Boolean(product.variants?.length)
  const isSnowboard =
    metadataText(product, "product_group") === "snowboards" ||
    product.categories?.some((category) => category.name === "Snowboards")
  const [selection, setSelection] = useState(() =>
    getInitialVariantSelection(product.options || [], product.variants || [])
  )
  const [failedImage, setFailedImage] = useState("")
  const activeGraphic = selectedGraphicValue(selection)
  const mappedGraphicImage = getProductGraphicImage(
    product.handle,
    activeGraphic
  )
  const mediaImage = mappedGraphicImage || product.thumbnail || ""
  const shouldShowMediaImage = Boolean(mediaImage && failedImage !== mediaImage)
  const imageAlt = activeGraphic
    ? `${product.title} - ${activeGraphic}`
    : product.title
  const specs = useMemo(
    () =>
      [
        ["Brand", brand],
        ["Series / Model", series],
        ["Terrain", metadataText(product, "terrain")],
        ["Flex", metadataText(product, "flex")],
        ["Level", metadataText(product, "level")],
        ["Width", metadataText(product, "width")],
        ["Shape", metadataText(product, "shape")],
        ["Model", metadataText(product, "model")],
        ["Gender", metadataText(product, "gender")],
        ["Graphics / Colors", graphics.join(", ")],
        ["Sizes", sizes.join(", ")],
      ].filter((entry) => entry[1]),
    [brand, graphics, product, series, sizes]
  )

  return (
    <main className={styles.productDetail}>
      <section className={styles.layout}>
        <div className={styles.mediaPanel}>
          <div className={styles.mediaFrame}>
            {shouldShowMediaImage ? (
              <Image
                alt={imageAlt}
                className={styles.image}
                fill
                onError={() => setFailedImage(mediaImage)}
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                src={mediaImage}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                {brandSummary?.logoSrc ? (
                  <Image
                    alt={brandSummary.logoAlt}
                    className={styles.brandLogo}
                    height={160}
                    src={brandSummary.logoSrc}
                    width={320}
                  />
                ) : (
                  <p className={styles.placeholderBrand}>{brand}</p>
                )}
                <p className={styles.placeholderLabel}>
                  Product images coming soon
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className={styles.productInfo}>
          <div className={styles.meta}>
            <p className={styles.brand}>{brand}</p>
            {series ? (
              <p className={styles.series}>Series: {series}</p>
            ) : null}
          </div>

          <h1 className={styles.title}>{product.title}</h1>

          {product.description ? (
            <p className={styles.shortDescription}>{product.description}</p>
          ) : null}

          <p className={styles.price}>{fromPrice(product)}</p>
          <p
            className={
              hasVariants ? styles.availableStatus : styles.pendingStatus
            }
          >
            {hasVariants
              ? "Available configurations ready to review"
              : "Configuration details coming soon"}
          </p>

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
              onSelectionChange={setSelection}
              options={product.options || []}
              selection={selection}
              variants={product.variants || []}
            />
          </div>

          <div className={styles.ctaPanel}>
            <button className={styles.comingSoonButton} disabled type="button">
              Add to cart coming soon
            </button>
            <p className={styles.ctaNote}>
              Checkout and payment will be added in a later phase.
            </p>
          </div>
        </aside>
      </section>

      {specs.length ? (
        <section className={styles.specs}>
          <div>
            <p className={styles.sectionEyebrow}>Specs</p>
            <h2 className={styles.sectionTitle}>
              {isSnowboard ? "Snowboard Details" : "Product Specs"}
            </h2>
          </div>
          <dl className={styles.specsGrid}>
            {specs.map(([label, value]) => (
              <div className={styles.specItem} key={label}>
                <dt className={styles.specLabel}>{label}</dt>
                <dd className={styles.specValue}>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

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
    </main>
  )
}
