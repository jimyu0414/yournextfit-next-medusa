import { ErrorState, PageShell, SectionHeader } from "@/components/PageShell"
import { ProductGrid } from "@/components/ProductGrid"
import {
  getCatalogProducts,
  productsByCategory,
  productsByGroup,
} from "@/lib/catalog"

export const dynamic = "force-dynamic"

const accessorySections = [
  "Waxing Tools",
  "Stomp Pads",
  "Goggles",
  "Helmets",
  "Protection",
]

export default async function AccessoriesPage() {
  const { data: products, error } = await getCatalogProducts()
  const accessories = productsByGroup(products, "accessories")

  return (
    <PageShell
      description="Simple maintenance and mountain accessory placeholders, grouped by category."
      eyebrow="Accessories"
      title="Snowboard Accessories"
    >
      {error ? <ErrorState message={error} /> : null}

      <div className="space-y-10">
        {accessorySections.map((section) => (
          <section className="space-y-5" key={section}>
            <SectionHeader title={section} />
            <ProductGrid
              emptyMessage={`${section} products are coming soon.`}
              products={productsByCategory(accessories, section)}
            />
          </section>
        ))}
      </div>
    </PageShell>
  )
}
