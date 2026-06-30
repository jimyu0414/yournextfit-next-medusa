import type { Metadata } from "next"
import { PageShell } from "@/components/PageShell"

export const metadata: Metadata = {
  title: "About Us | Ride Hard, Pay Less.",
}

const criteria = [
  {
    title: "Performance First",
    body: "Whether it’s an ultra-light core built to withstand explosive flatground tricks, or a wide, stiff board designed to hold an edge on bulletproof ice, we only recommend gear that actually elevates your ride based on real physics and materials.",
  },
  {
    title: "Zero Brand Premium",
    body: "By cutting out middleman markups and excessive marketing budgets, we ensure that every dollar you spend goes directly into premium paulownia wood, carbon fiber matrices, and high-speed sintered bases.",
  },
  {
    title: "Mountain-Ready Practicality",
    body: "Aesthetic matters, but functionality is king. Our curated snow apparel and accessories are built to turn heads, but more importantly, they are packed with high waterproof and breathability ratings to keep you bone-dry and warm.",
  },
]

export default function AboutPage() {
  return (
    <PageShell
      description="A rider-led store built around useful specs, honest value, and gear that helps you spend more time on the mountain."
      eyebrow="About Us"
      title="Ride Hard, Pay Less."
    >
      <article className="mx-auto max-w-4xl space-y-10 text-neutral-800">
        <section className="space-y-4 text-base leading-8">
          <h2 className="text-2xl font-semibold text-neutral-950">
            Built by a Rider with 10 Years on the Mountain.
          </h2>
          <p>Welcome to Your Next Fit.</p>
          <p>
            If you’ve ever stared at a $700 price tag on a brand-new snowboard
            or jacket and wondered if a simple logo is really worth that much—you
            are in the right place.
          </p>
          <p>
            I’m the founder of Your Next Fit. With over 10 years of snowboarding
            experience, the mountain has been my second home. Over the past
            decade, I’ve ridden almost every type of board out there—from
            ultra-flexy, buttery flatground boards and stiff, aggressive park
            decks, to high-speed freeride machines.
          </p>
        </section>

        <section className="space-y-4 text-base leading-8">
          <h2 className="text-2xl font-semibold text-neutral-950">
            My 10-Year Insight: It’s the Specs, Not the Logo
          </h2>
          <p>
            After a decade of heavy riding and testing, I’ve come to a
            definitive realization: what truly impacts your ride isn&apos;t the
            brand name stamped on the top sheet. It comes down to a precise
            science.
          </p>
          <p>
            The perfect ride depends on finding the right length, flex, width,
            and profile tailored specifically to your height and weight. Once the
            geometry is right, it’s all about the materials and fine-tuning of
            the core and edges.
          </p>
          <p>
            Unfortunately, mainstream international brands often slap massive
            price tags on basic gear. You could spend $500 on an imported
            &quot;entry-level&quot; board that still uses a slow, extruded base
            and weak core. I knew there had to be a better way for riders to get
            premium performance without emptying their bank accounts.
          </p>
        </section>

        <section className="space-y-4 text-base leading-8">
          <h2 className="text-2xl font-semibold text-neutral-950">
            Curating China’s Best Next-Gen Snowboard Brands
          </h2>
          <p>
            The domestic snowboarding scene has undergone a massive
            technological revolution. Factories that once manufactured for
            high-end global brands are now producing their own cutting-edge
            decks.
          </p>
          <p>
            But not all new brands are created equal. Leveraging my 10 years of
            experience, I’ve spent countless hours researching, testing, and
            filtering the market. I have handpicked only the best, most reliable
            next-gen brands—like Maibk, Cosone, and Cloud Suntt—that master the
            art of value-to-performance.
          </p>
          <p>
            Every single board on our digital shelves must pass my strict
            criteria:
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {criteria.map((item) => (
            <div
              className="rounded border border-black/10 bg-white p-5 shadow-sm"
              key={item.title}
            >
              <h3 className="text-lg font-semibold text-neutral-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-700">
                {item.body}
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-4 text-base leading-8">
          <h2 className="text-2xl font-semibold text-neutral-950">
            Strip Away the Hype. Join the Revolution.
          </h2>
          <p>
            Whether you are a day-one beginner learning to link your first
            turns, or an advanced rider searching for the ultimate deep-carving
            machine, Your Next Fit has your back. I’ve done the testing and
            filtered out the noise so you can shop with 100% confidence.
          </p>
          <p>
            Save your money on overpriced logos, buy more lift tickets, and
            spend more time on the mountain.
          </p>
          <p className="font-semibold text-neutral-950">
            — Yu Liu, Founder of Your Next Fit
          </p>
        </section>
      </article>
    </PageShell>
  )
}
