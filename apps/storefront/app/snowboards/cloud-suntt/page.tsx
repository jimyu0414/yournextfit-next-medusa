import { ErrorState, PageShell } from "@/components/PageShell"
import { ProductGrid } from "@/components/ProductGrid"
import { getCatalogProducts, productsByBrand } from "@/lib/catalog"

export const dynamic = "force-dynamic"

export default async function CloudSunttPage() {
  const { data: products, error } = await getCatalogProducts()
  const cloudSunttProducts = productsByBrand(products, "cloud-suntt")

  return (
    <PageShell
      description="Performance-focused carving, wide boards, and advanced freeride progression."
      eyebrow="Cloud Suntt"
      title="Cloud Suntt Snowboards"
    >
      {error ? <ErrorState message={error} /> : null}
      <ProductGrid
        emptyMessage="Cloud Suntt products are not available yet. Run the backend seed and refresh."
        products={cloudSunttProducts}
      />
    </PageShell>
  )
}
