import { ErrorState, PageShell } from "@/components/PageShell"
import { ProductGrid } from "@/components/ProductGrid"
import { getCatalogProducts, productsByBrand } from "@/lib/catalog"

export const dynamic = "force-dynamic"

export default async function CosonePage() {
  const { data: products, error } = await getCatalogProducts()
  const cosoneProducts = productsByBrand(products, "cosone")

  return (
    <PageShell
      description="Affordable value route with carving and progression-focused models. Exact graphics and sizes are still being confirmed for this placeholder range."
      eyebrow="Cosone"
      title="Cosone Snowboards"
    >
      {error ? <ErrorState message={error} /> : null}
      <ProductGrid
        emptyMessage="Cosone placeholder products are not available yet. Run the backend seed and refresh."
        products={cosoneProducts}
      />
    </PageShell>
  )
}
