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
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <div className="space-y-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded border border-black/10 bg-neutral-200">
            {product.thumbnail ? (
              <Image
                alt={product.title}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                src={product.thumbnail}
              />
            ) : (
              <div className="flex h-full items-center justify-center px-5 text-center text-sm font-medium text-neutral-500">
                Image coming soon
              </div>
            )}
          </div>

          <div className="rounded border border-black/10 bg-white p-5">
            <h2 className="text-xl font-semibold text-neutral-950">
              Product Details
            </h2>
            <p className="mt-3 text-base leading-7 text-neutral-700">
              {product.description}
            </p>
            {metadataEntries.length ? (
              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                {metadataEntries.map(([label, value]) => (
                  <div
                    className="rounded border border-black/10 bg-neutral-50 px-4 py-3"
                    key={label}
                  >
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-neutral-900">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>

        <aside className="h-fit rounded border border-black/10 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">
            {brand}
          </p>
          {series ? (
            <p className="mt-2 text-sm font-medium text-neutral-700">
              Series: {series}
            </p>
          ) : null}
          <p className="mt-4 text-2xl font-semibold text-neutral-950">
            {fromPrice(product)}
          </p>

          {graphics.length ? (
            <p className="mt-4 text-sm leading-6 text-neutral-600">
              <span className="font-medium text-neutral-900">
                Graphics/Colors:
              </span>{" "}
              {graphics.join(", ")}
            </p>
          ) : null}
          {sizes.length ? (
            <p className="mt-1 text-sm leading-6 text-neutral-600">
              <span className="font-medium text-neutral-900">Sizes:</span>{" "}
              {sizes.join(", ")}
            </p>
          ) : null}

          <div className="mt-6">
            <VariantSelector
              options={product.options || []}
              variants={product.variants || []}
            />
          </div>
        </aside>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-950">
          Available Variants
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {product.variants?.map((variant) => (
            <div
              className="rounded border border-black/10 bg-white p-4"
              key={variant.id || variant.sku || variant.title}
            >
              <p className="font-medium text-neutral-950">{variant.title}</p>
              {variant.sku ? (
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-neutral-500">
                  {variant.sku}
                </p>
              ) : null}
              <p className="mt-3 text-sm font-semibold text-neutral-900">
                {variantPrice(variant) || "Price coming soon"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
