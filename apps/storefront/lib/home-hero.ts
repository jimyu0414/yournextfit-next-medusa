export type HomeHeroSlide = {
  id: string
  desktopImage: string
  mobileImage: string
  alt: string
  href: string
  external?: boolean
  enabled: boolean
  sortOrder?: number
  eyebrow?: string
  title?: string
  subtitle?: string
  ctaText?: string
}

// Hero slides are config-driven for now. Later this can be moved to Medusa Admin or a CMS.
export const homeHeroSlides: HomeHeroSlide[] = [
  {
    id: "cloud-suntt-carving",
    desktopImage: "/home-hero/cloud-suntt-desktop.png",
    mobileImage: "/home-hero/cloud-suntt-mobile.png",
    alt: "Cloud Suntt snowboard collection hero banner",
    href: "/snowboards/cloud-suntt",
    enabled: true,
    sortOrder: 10,
    eyebrow: "Cloud Suntt",
    title: "Carving-focused boards for your next line",
    subtitle:
      "Explore selected Cloud Suntt snowboard models built around edge hold, shape, and progression.",
    ctaText: "Shop Cloud Suntt",
  },
  {
    id: "maibk-sugar",
    desktopImage: "/home-hero/maibk-desktop.png",
    mobileImage: "/home-hero/maibk-mobile.png",
    alt: "Maibk Sugar snowboard collection hero banner",
    href: "/snowboards/maibk",
    enabled: true,
    sortOrder: 20,
    eyebrow: "Maibk",
    title: "Soft-flex boards with playful style",
    subtitle:
      "Discover Maibk Sugar boards for beginner-friendly park and all-mountain progression.",
    ctaText: "Shop Maibk",
  },
  {
    id: "cosone-blaze",
    desktopImage: "/home-hero/cosone-desktop.png",
    mobileImage: "/home-hero/cosone-mobile.png",
    alt: "Cosone Blaze snowboard collection hero banner",
    href: "/snowboards/cosone",
    enabled: true,
    sortOrder: 30,
    eyebrow: "Cosone",
    title: "Aggressive all-mountain performance",
    subtitle:
      "Experience the power and precision of the Cosone Blaze snowboard in any condition.",
    ctaText: "Shop Cosone",
  },
]

export function getEnabledHomeHeroSlides() {
  return homeHeroSlides
    .filter((slide) => slide.enabled)
    .sort((first, second) => {
      const firstOrder = first.sortOrder ?? Number.MAX_SAFE_INTEGER
      const secondOrder = second.sortOrder ?? Number.MAX_SAFE_INTEGER

      return firstOrder - secondOrder
    })
}
