import { notFound } from "next/navigation"
import { ErrorState, PageShell } from "@/components/PageShell"
import { getProductByHandle } from "@/lib/catalog"
import { ProductDetailClient } from "./ProductDetailClient"

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

  return <ProductDetailClient product={product} />
}
