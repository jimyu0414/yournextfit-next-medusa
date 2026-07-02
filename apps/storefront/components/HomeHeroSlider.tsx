"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { getEnabledHomeHeroSlides, HomeHeroSlide } from "@/lib/home-hero"
import styles from "./HomeHeroSlider.module.scss"

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
      className={styles.slider}
      onFocus={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.viewport}>
        <SlideLink
          className={styles.slide}
          href={activeSlide.href}
          {...slideLinkProps(activeSlide)}
        >
          <picture>
            <source media="(min-width: 640px)" srcSet={activeSlide.desktopImage} />
            <img
              alt={activeSlide.alt}
              className={styles.image}
              src={activeSlide.mobileImage}
            />
          </picture>

          {(activeSlide.eyebrow ||
            activeSlide.title ||
            activeSlide.subtitle ||
            activeSlide.ctaText) ? (
            <div className={styles.overlay}>
              <div className={styles.content}>
                {activeSlide.eyebrow ? (
                  <p className={styles.eyebrow}>{activeSlide.eyebrow}</p>
                ) : null}
                {activeSlide.title ? (
                  <h1 className={styles.title}>{activeSlide.title}</h1>
                ) : null}
                {activeSlide.subtitle ? (
                  <p className={styles.subtitle}>{activeSlide.subtitle}</p>
                ) : null}
                {activeSlide.ctaText ? (
                  <span className={styles.cta}>{activeSlide.ctaText}</span>
                ) : null}
              </div>
            </div>
          ) : null}
        </SlideLink>

        {hasMultipleSlides ? (
          <div className={styles.controls}>
            <button
              aria-label="Show previous hero slide"
              className={[styles.control, styles.previousControl].join(" ")}
              onClick={showPreviousSlide}
              type="button"
            >
              ‹
            </button>
            <button
              aria-label="Show next hero slide"
              className={[styles.control, styles.nextControl].join(" ")}
              onClick={showNextSlide}
              type="button"
            >
              ›
            </button>
            <div className={styles.dots}>
              {slides.map((slide, index) => (
                <button
                  aria-label={`Show hero slide ${index + 1}`}
                  aria-current={index === activeIndex}
                  className={[
                    styles.dot,
                    index === activeIndex ? styles.dotActive : "",
                  ].join(" ")}
                  key={slide.id}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
