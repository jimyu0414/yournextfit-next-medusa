export type ProductImageMap = Record<string, Record<string, string>>

export const productGraphicImages: ProductImageMap = {
  "cloud-suntt-regular-snowboard": {
    "graphic 1": "/products/cloud-suntt/regular/graphic-1.png",
    "graphic 2": "/products/cloud-suntt/regular/graphic-2.png",
    "graphic 3": "/products/cloud-suntt/regular/graphic-3.png",
  },
}

function normalizeOptionValue(value?: string | null) {
  return value?.trim().toLowerCase() || ""
}

export function getProductGraphicImage(
  handle?: string | null,
  graphicOrColor?: string | null
) {
  if (!handle || !graphicOrColor) {
    return ""
  }

  return (
    productGraphicImages[handle]?.[normalizeOptionValue(graphicOrColor)] || ""
  )
}
