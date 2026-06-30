import { ErrorState, PageShell } from "@/components/PageShell"
import { ProductGrid } from "@/components/ProductGrid"
import { getCatalogProducts, productsByBrand } from "@/lib/catalog"

export const dynamic = "force-dynamic"

export default async function MaibkPage() {
  const { data: products, error } = await getCatalogProducts()
  const maibkProducts = productsByBrand(products, "maibk")

  return (
    <PageShell
      description="Trendy, beginner-friendly, softer-flex all-mountain and park boards."
      eyebrow="Maibk"
      title="Maibk Snowboards"
    >
      {error ? <ErrorState message={error} /> : null}
      <ProductGrid
        emptyMessage="Maibk products are not available yet. Run the backend seed and refresh."
        products={maibkProducts}
      />
    </PageShell>
  )
}
