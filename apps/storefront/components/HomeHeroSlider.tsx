"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { getEnabledHomeHeroSlides, HomeHeroSlide } from "@/lib/home-hero"

const autoplayDelayMs = 7000

function slideLinkProps(slide: HomeHeroSlide) {
  if (!slide.external) {
    return {}
  }

  return {
    target: "_blank",
    rel: "noopener noreferrer",
  }
}

export function HomeHeroSlider() {
  const slides = useMemo(() => getEnabledHomeHeroSlides(), [])
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const hasMultipleSlides = slides.length > 1
  const activeSlide = slides[activeIndex]

  useEffect(() => {
    if (!hasMultipleSlides || paused) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length)
    }, autoplayDelayMs)

    return () => window.clearInterval(timer)
  }, [hasMultipleSlides, paused, slides.length])

  if (!activeSlide) {
    return null
  }

  function showPreviousSlide() {
    setActiveIndex((index) => (index === 0 ? slides.length - 1 : index - 1))
  }

  function showNextSlide() {
    setActiveIndex((index) => (index + 1) % slides.length)
  }

  const SlideLink = activeSlide.external ? "a" : Link

  return (
    <section
      aria-label="Homepage featured promotions"
      className="w-full overflow-hidden bg-neutral-950"
      onFocus={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative">
        <SlideLink
          className="group relative block aspect-[4/5] w-full overflow-hidden bg-neutral-900 sm:aspect-[16/9] lg:aspect-[21/8]"
          href={activeSlide.href}
          {...slideLinkProps(activeSlide)}
        >
          <picture>
            <source media="(min-width: 640px)" srcSet={activeSlide.desktopImage} />
            <img
              alt={activeSlide.alt}
              className="h-full w-full object-cover"
              src={activeSlide.mobileImage}
            />
          </picture>

          {(activeSlide.eyebrow ||
            activeSlide.title ||
            activeSlide.subtitle ||
            activeSlide.ctaText) ? (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/72 via-black/34 to-transparent px-5 pb-7 pt-24 text-white sm:px-8 sm:pb-10 lg:px-10">
              <div className="mx-auto w-full max-w-7xl">
                {activeSlide.eyebrow ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/78">
                    {activeSlide.eyebrow}
                  </p>
                ) : null}
                {activeSlide.title ? (
                  <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">
                    {activeSlide.title}
                  </h1>
                ) : null}
                {activeSlide.subtitle ? (
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/82 sm:text-base">
                    {activeSlide.subtitle}
                  </p>
                ) : null}
                {activeSlide.ctaText ? (
                  <span className="mt-5 inline-flex rounded border border-white/80 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-white group-hover:text-neutral-950">
                    {activeSlide.ctaText}
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
        </SlideLink>

        {hasMultipleSlides ? (
          <>
            <button
              aria-label="Show previous hero slide"
              className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/28 text-xl text-white backdrop-blur transition hover:bg-black/44 focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:flex"
              onClick={showPreviousSlide}
              type="button"
            >
              ‹
            </button>
            <button
              aria-label="Show next hero slide"
              className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/28 text-xl text-white backdrop-blur transition hover:bg-black/44 focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:flex"
              onClick={showNextSlide}
              type="button"
            >
              ›
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((slide, index) => (
                <button
                  aria-label={`Show hero slide ${index + 1}`}
                  aria-current={index === activeIndex}
                  className={[
                    "h-2 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
                    index === activeIndex ? "w-7 bg-white" : "w-2 bg-white/55",
                  ].join(" ")}
                  key={slide.id}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}
