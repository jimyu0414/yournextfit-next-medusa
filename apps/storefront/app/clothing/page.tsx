import { ErrorState, PageShell, SectionHeader } from "@/components/PageShell"
import { ProductGrid } from "@/components/ProductGrid"
import {
  getCatalogProducts,
  productsByCategory,
  productsByGroup,
} from "@/lib/catalog"

export const dynamic = "force-dynamic"

const clothingSections = ["Jackets", "Pants", "Jacket + Pant Sets"]

export default async function ClothingPage() {
  const { data: products, error } = await getCatalogProducts()
  const clothing = productsByGroup(products, "clothing")

  return (
    <PageShell
      description="Simple placeholder clothing catalog for jackets, pants, and full outerwear sets."
      eyebrow="Clothing"
      title="Snow Clothing"
    >
      {error ? <ErrorState message={error} /> : null}

      <div className="space-y-10">
        {clothingSections.map((section) => (
          <section className="space-y-5" key={section}>
            <SectionHeader title={section} />
            <ProductGrid
              emptyMessage={`${section} products are coming soon.`}
              products={productsByCategory(clothing, section)}
            />
          </section>
        ))}
      </div>
    </PageShell>
  )
}
