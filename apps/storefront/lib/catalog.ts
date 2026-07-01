import { backendUrl, publishableKey, storeHeaders } from "@/lib/medusa"

export type StoreOptionValue = {
  id?: string
  value?: string | null
}

export type StoreOption = {
  id?: string
  title?: string | null
  values?: StoreOptionValue[]
}

export type StoreVariantOption = {
  id?: string
  value?: string | null
  option?: {
    id?: string
    title?: string | null
  } | null
}

export type StoreVariant = {
  id?: string
  title?: string | null
  sku?: string | null
  options?: StoreVariantOption[]
  calculated_price?: {
    calculated_amount?: number | null
    currency_code?: string | null
  } | null
  prices?: { amount?: number | null; currency_code?: string | null }[]
}

export type StoreProduct = {
  id: string
  title: string
  handle?: string | null
  subtitle?: string | null
  description?: string | null
  thumbnail?: string | null
  metadata?: Record<string, unknown> | null
  categories?: { name?: string | null }[]
  collection?: { title?: string | null; handle?: string | null } | null
  options?: StoreOption[]
  variants?: StoreVariant[]
}

export type StoreRegion = {
  id: string
  name: string
}

export type CatalogResult<T> = {
  data: T
  error: string
}

export const brandSummaries = [
  {
    name: "Cloud Suntt",
    slug: "cloud-suntt",
    href: "/snowboards/cloud-suntt",
    logoSrc: "/brands/cloud-suntt-logo.png",
    logoAlt: "Cloud Suntt logo",
    positioning:
      "Performance-focused carving, wide boards, and advanced freeride progression.",
    description:
      "A focused range for riders who care about edge hold, shape, width, and carving confidence.",
  },
  {
    name: "Maibk",
    slug: "maibk",
    href: "/snowboards/maibk",
    logoSrc: "/brands/maibk-logo.png",
    logoAlt: "Maibk logo",
    positioning:
      "Trendy, beginner-friendly, softer-flex all-mountain and park boards.",
    description:
      "Approachable park and all-mountain boards with playful flex and clean colorways.",
  },
  {
    name: "Cosone",
    slug: "cosone",
    href: "/snowboards/cosone",
    logoSrc: "/brands/cosone-logo.png",
    logoAlt: "Cosone logo",
    positioning:
      "Affordable value route with carving and progression-focused models.",
    description:
      "Value-driven snowboard models for riders exploring carving, powder, and progression shapes.",
  },
]

const productFields = [
  "id",
  "title",
  "subtitle",
  "handle",
  "description",
  "thumbnail",
  "metadata",
  "categories.name",
  "collection.title",
  "collection.handle",
  "options.title",
  "options.values.value",
  "variants.id",
  "variants.title",
  "variants.sku",
  "variants.options.value",
  "variants.options.option.title",
  "variants.calculated_price",
  "variants.prices.*",
].join(",")

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${backendUrl}${path}`, {
    headers: storeHeaders,
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function getRegion(): Promise<StoreRegion> {
  const response = await fetchJson<{ regions?: StoreRegion[] }>(
    "/store/regions"
  )
  const region = response.regions?.[0]

  if (!region) {
    throw new Error("No Medusa region found. Run the backend seed first.")
  }

  return region
}

export async function getCatalogProducts(): Promise<
  CatalogResult<StoreProduct[]>
> {
  if (!publishableKey) {
    return {
      data: [],
      error:
        "Missing NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY. Run the backend seed and copy the printed publishable key into apps/storefront/.env.local.",
    }
  }

  try {
    const region = await getRegion()
    const params = new URLSearchParams({
      limit: "100",
      region_id: region.id,
      fields: productFields,
    })
    const response = await fetchJson<{ products?: StoreProduct[] }>(
      `/store/products?${params.toString()}`
    )
    const products = response.products || []

    return {
      data: products.filter(
        (product) => product.metadata?.catalog_phase === "phase-2a"
      ),
      error: "",
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"

    return {
      data: [],
      error: `Could not fetch products from ${backendUrl}: ${message}`,
    }
  }
}

export async function getProductByHandle(
  handle: string
): Promise<CatalogResult<StoreProduct | null>> {
  const products = await getCatalogProducts()

  if (products.error) {
    return {
      data: null,
      error: products.error,
    }
  }

  return {
    data: products.data.find((product) => product.handle === handle) || null,
    error: "",
  }
}

export function productsByBrand(products: StoreProduct[], brandSlug: string) {
  return products.filter((product) => product.metadata?.brand_slug === brandSlug)
}

export function productsByGroup(products: StoreProduct[], group: string) {
  return products.filter((product) => product.metadata?.product_group === group)
}

export function productsByCategory(products: StoreProduct[], category: string) {
  return products.filter((product) =>
    product.categories?.some((item) => item.name === category)
  )
}

export function metadataText(product: StoreProduct, key: string) {
  const value = product.metadata?.[key]

  return typeof value === "string" ? value : ""
}

export function brandName(product: StoreProduct) {
  return metadataText(product, "brand") || product.collection?.title || "Your Next Fit"
}

export function productSeries(product: StoreProduct) {
  return metadataText(product, "series")
}

function optionValuesFromOptions(product: StoreProduct, matcher: RegExp) {
  const option = product.options?.find((item) =>
    matcher.test(item.title || "")
  )

  return (
    option?.values
      ?.map((value) => value.value)
      .filter((value): value is string => Boolean(value)) || []
  )
}

function optionValuesFromVariants(product: StoreProduct, matcher: RegExp) {
  const values = new Set<string>()

  product.variants?.forEach((variant) => {
    variant.options?.forEach((option) => {
      if (matcher.test(option.option?.title || "") && option.value) {
        values.add(option.value)
      }
    })
  })

  return Array.from(values)
}

export function optionValues(product: StoreProduct, matcher: RegExp) {
  return Array.from(
    new Set([
      ...optionValuesFromOptions(product, matcher),
      ...optionValuesFromVariants(product, matcher),
    ])
  )
}

export function graphicValues(product: StoreProduct) {
  return optionValues(product, /graphic|color/i)
}

export function sizeValues(product: StoreProduct) {
  return optionValues(product, /^size$/i)
}

export function formatPrice(amount?: number | null, currencyCode?: string | null) {
  if (amount == null || !currencyCode) {
    return ""
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount)
}

export function variantPrice(variant?: StoreVariant) {
  const calculated = variant?.calculated_price
  if (calculated?.calculated_amount != null && calculated.currency_code) {
    return formatPrice(calculated.calculated_amount, calculated.currency_code)
  }

  const price = variant?.prices?.[0]
  return formatPrice(price?.amount, price?.currency_code)
}

export function fromPrice(product: StoreProduct) {
  const prices =
    product.variants
      ?.map((variant) => {
        const calculated = variant.calculated_price
        const price = variant.prices?.[0]
        return {
          amount: calculated?.calculated_amount ?? price?.amount,
          currency: calculated?.currency_code ?? price?.currency_code,
        }
      })
      .filter((price) => price.amount != null && price.currency) || []

  if (!prices.length) {
    return "Price coming soon"
  }

  const currency = prices[0].currency
  const min = Math.min(...prices.map((price) => Number(price.amount)))

  return `From ${formatPrice(min, currency)}`
}
