import Image from "next/image"
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
            className="flex min-h-[24rem] flex-col justify-between overflow-hidden rounded border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
            href={brand.href}
            key={brand.slug}
          >
            <div className="border-b border-black/10 bg-gradient-to-br from-neutral-50 to-teal-50/60 p-5">
              <div className="flex h-24 items-center justify-center rounded bg-white p-5">
                <div className="relative h-full w-full">
                  <Image
                    alt={brand.logoAlt}
                    className="object-contain"
                    fill
                    sizes="(min-width: 768px) 30vw, 80vw"
                    src={brand.logoSrc}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-800">
                  Selected brand
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-neutral-950">
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
                Find out more
              </span>
            </div>
          </Link>
        ))}
      </section>
    </PageShell>
  )
}
