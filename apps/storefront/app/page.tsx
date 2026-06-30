import Image from "next/image"
import { backendUrl, publishableKey, storeHeaders } from "@/lib/medusa"

export const dynamic = "force-dynamic"

type StoreProduct = {
  id: string
  title: string
  thumbnail?: string | null
  categories?: { name?: string | null }[]
  collection?: { title?: string | null } | null
  variants?: {
    calculated_price?: {
      calculated_amount?: number | null
      currency_code?: string | null
    } | null
    prices?: { amount?: number | null; currency_code?: string | null }[]
  }[]
}

type StoreRegion = {
  id: string
  name: string
}

function formatPrice(product: StoreProduct) {
  const calculated = product.variants?.[0]?.calculated_price
  if (calculated?.calculated_amount != null && calculated.currency_code) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: calculated.currency_code.toUpperCase(),
    }).format(calculated.calculated_amount)
  }

  const price = product.variants?.[0]?.prices?.[0]
  if (price?.amount != null && price.currency_code) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currency_code.toUpperCase(),
    }).format(price.amount)
  }

  return "Price coming soon"
}

function productGroup(product: StoreProduct) {
  return (
    product.categories?.[0]?.name ||
    product.collection?.title ||
    "Yournextfit gear"
  )
}

async function getProducts() {
  if (!publishableKey) {
    return {
      products: [] as StoreProduct[],
      error:
        "Missing NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY. Run the backend seed and copy the printed publishable key into apps/storefront/.env.local.",
    }
  }

  try {
    const regionsResponse = await fetch(`${backendUrl}/store/regions`, {
      headers: storeHeaders,
      cache: "no-store",
    })

    if (!regionsResponse.ok) {
      throw new Error(`Regions request failed with ${regionsResponse.status}`)
    }

    const regionsData = (await regionsResponse.json()) as {
      regions?: StoreRegion[]
    }
    const region = regionsData.regions?.[0]

    if (!region) {
      throw new Error("No Medusa region found. Run the backend seed first.")
    }

    const productParams = new URLSearchParams({
      limit: "24",
      region_id: region.id,
      fields:
        "id,title,thumbnail,categories.name,collection.title,variants.calculated_price,variants.prices.*",
    })
    const productsResponse = await fetch(
      `${backendUrl}/store/products?${productParams.toString()}`,
      {
        headers: storeHeaders,
        cache: "no-store",
      }
    )

    if (!productsResponse.ok) {
      throw new Error(`Products request failed with ${productsResponse.status}`)
    }

    const response = (await productsResponse.json()) as {
      products?: StoreProduct[]
    }

    return {
      products: (response.products || []) as StoreProduct[],
      error: "",
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"

    return {
      products: [] as StoreProduct[],
      error: `Could not fetch products from ${backendUrl}: ${message}`,
    }
  }
}

export default async function Home() {
  const { products, error } = await getProducts()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-5 py-8 sm:px-8 lg:px-10">
      <header className="flex flex-col gap-6 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
            Snowboard and court gear
          </p>
          <h1 className="text-4xl font-semibold text-neutral-950 sm:text-5xl">
            Yournextfit
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-700">
            A simple Phase 1 storefront backed by Medusa, stocked with local
            snowboard, outerwear, accessory, and badminton sample products.
          </p>
        </div>
        <div className="rounded border border-black/10 bg-white/70 px-4 py-3 text-sm text-neutral-700 shadow-sm">
          Backend: <span className="font-medium">{backendUrl}</span>
        </div>
      </header>

      {error ? (
        <section className="rounded border border-amber-300 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950">
          {error}
        </section>
      ) : null}

      {!error && products.length === 0 ? (
        <section className="rounded border border-black/10 bg-white/75 px-5 py-8 text-center text-neutral-700">
          No products found yet. Run migrations, seed the backend, and refresh
          this page.
        </section>
      ) : null}

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <article
            className="overflow-hidden rounded border border-black/10 bg-white shadow-sm"
            key={product.id}
          >
            <div className="relative aspect-[4/3] bg-neutral-200">
              {product.thumbnail ? (
                <Image
                  alt={product.title}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  src={product.thumbnail}
                />
              ) : (
                <div className="flex h-full items-center justify-center px-4 text-center text-sm text-neutral-500">
                  Image coming soon
                </div>
              )}
            </div>
            <div className="flex min-h-44 flex-col justify-between gap-5 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-800">
                  {productGroup(product)}
                </p>
                <h2 className="mt-2 text-lg font-semibold leading-snug text-neutral-950">
                  {product.title}
                </h2>
              </div>
              <p className="text-base font-semibold text-neutral-900">
                {formatPrice(product)}
              </p>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
