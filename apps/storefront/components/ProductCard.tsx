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

function DetailLine({ label, values }: { label: string; values: string[] }) {
  if (!values.length) {
    return null
  }

  return (
    <p className="text-sm leading-6 text-neutral-600">
      <span className="font-medium text-neutral-800">{label}:</span>{" "}
      {values.join(", ")}
    </p>
  )
}

export function ProductCard({ product }: { product: StoreProduct }) {
  const series = productSeries(product)
  const graphics = graphicValues(product)
  const sizes = sizeValues(product)

  return (
    <article className="overflow-hidden rounded border border-black/10 bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-neutral-200">
        {product.thumbnail ? (
          <Image
            alt={product.title}
            className="object-cover"
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            src={product.thumbnail}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-5 text-center text-sm font-medium text-neutral-500">
            Image coming soon
          </div>
        )}
      </div>
      <div className="flex min-h-72 flex-col justify-between gap-5 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-800">
            {brandName(product)}
          </p>
          <h2 className="mt-2 text-lg font-semibold leading-snug text-neutral-950">
            {product.title}
          </h2>
          {series ? (
            <p className="mt-1 text-sm font-medium text-neutral-700">
              Series: {series}
            </p>
          ) : null}
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">
            {product.description}
          </p>
          <div className="mt-4 space-y-1">
            <DetailLine label="Graphics/Colors" values={graphics} />
            <DetailLine label="Sizes" values={sizes} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-base font-semibold text-neutral-900">
            {fromPrice(product)}
          </p>
          <Link
            className="rounded border border-neutral-950 px-3 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
            href={`/products/${product.handle}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
