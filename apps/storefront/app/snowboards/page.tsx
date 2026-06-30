import Link from "next/link"
import { PageShell } from "@/components/PageShell"
import { brandSummaries } from "@/lib/catalog"

export default function SnowboardsPage() {
  return (
    <PageShell
      description="Browse selected snowboard brands by ride style, flex, and value-to-performance focus."
      eyebrow="Snowboards"
      title="Snowboard Brands"
    >
      <section className="grid gap-4 md:grid-cols-3">
        {brandSummaries.map((brand) => (
          <Link
            className="flex min-h-64 flex-col justify-between rounded border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            href={brand.href}
            key={brand.slug}
          >
            <div>
              <h2 className="text-2xl font-semibold text-neutral-950">
                {brand.name}
              </h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-teal-800">
                {brand.positioning}
              </p>
              <p className="mt-4 text-sm leading-6 text-neutral-600">
                {brand.description}
              </p>
            </div>
            <span className="mt-6 text-sm font-semibold text-neutral-950">
              View brand page
            </span>
          </Link>
        ))}
      </section>
    </PageShell>
  )
}
