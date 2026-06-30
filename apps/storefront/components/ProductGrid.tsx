import { ProductCard } from "@/components/ProductCard"
import { StoreProduct } from "@/lib/catalog"

export function ProductGrid({
  emptyMessage,
  products,
}: {
  emptyMessage: string
  products: StoreProduct[]
}) {
  if (!products.length) {
    return (
      <section className="rounded border border-black/10 bg-white/75 px-5 py-8 text-center text-neutral-700">
        {emptyMessage}
      </section>
    )
  }

  return (
    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  )
}
