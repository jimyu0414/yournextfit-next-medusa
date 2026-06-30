import Link from "next/link"
import { ReactNode } from "react"

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
      <header className="border-b border-black/10 pb-8">
        {eyebrow ? (
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-4xl text-4xl font-semibold text-neutral-950 sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </main>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <section className="rounded border border-amber-300 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950">
      {message}
    </section>
  )
}

export function SectionHeader({
  title,
  description,
  href,
}: {
  title: string
  description?: string
  href?: string
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-950">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
            {description}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link
          className="text-sm font-semibold text-teal-800 underline-offset-4 hover:underline"
          href={href}
        >
          View all
        </Link>
      ) : null}
    </div>
  )
}
