import Link from "next/link"
import { HomeHeroSlider } from "@/components/HomeHeroSlider"
import { ProductGrid } from "@/components/ProductGrid"
import { ErrorState, PageShell, SectionHeader } from "@/components/PageShell"
import {
  brandSummaries,
  getCatalogProducts,
  productsByBrand,
  productsByGroup,
} from "@/lib/catalog"

export const dynamic = "force-dynamic"

export default async function Home() {
  const { data: products, error } = await getCatalogProducts()
  const featuredSnowboards = brandSummaries.flatMap((brand) =>
    productsByBrand(products, brand.slug).slice(0, brand.slug === "cosone" ? 1 : 2)
  )
  const clothing = productsByGroup(products, "clothing").slice(0, 3)
  const accessories = productsByGroup(products, "accessories").slice(0, 4)

  return (
    <>
      <HomeHeroSlider />
      <PageShell
        description="Selected snowboard brands, practical apparel, and mountain accessories curated around specs, value, and ride feel."
        eyebrow="Snowboard and mountain gear"
        title="Your Next Fit"
      >
        {error ? <ErrorState message={error} /> : null}

        <section className="grid gap-4 md:grid-cols-3">
          {brandSummaries.map((brand) => (
            <Link
              className="rounded border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              href={brand.href}
              key={brand.slug}
            >
              <h2 className="text-xl font-semibold text-neutral-950">
                {brand.name}
              </h2>
              <p className="mt-2 text-sm font-medium text-teal-800">
                {brand.positioning}
              </p>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {brand.description}
              </p>
            </Link>
          ))}
        </section>

        <section className="space-y-5">
          <SectionHeader
            description="One product per snowboard model, with graphics/colors and sizes represented as options and variants."
            href="/snowboards"
            title="Featured Snowboards"
          />
          <ProductGrid
            emptyMessage="No Phase 2A snowboard products found. Run the backend seed and refresh."
            products={featuredSnowboards}
          />
        </section>

        <section className="space-y-5">
          <SectionHeader href="/clothing" title="Clothing" />
          <ProductGrid
            emptyMessage="Clothing placeholder products are not seeded yet."
            products={clothing}
          />
        </section>

        <section className="space-y-5">
          <SectionHeader href="/accessories" title="Accessories" />
          <ProductGrid
            emptyMessage="Accessory placeholder products are not seeded yet."
            products={accessories}
          />
        </section>
      </PageShell>
    </>
  )
}
