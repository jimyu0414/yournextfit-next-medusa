import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows"

type VariantInput = {
  title: string
  sku: string
  options: Record<string, string>
  usd: number
  aud: number
  stocked_quantity?: number
}

type ProductSeedInput = {
  title: string
  subtitle?: string
  description: string
  handle: string
  weight?: number
  categoryName: string
  collectionHandle?: string
  metadata: Record<string, unknown>
  options: { title: string; values: string[] }[]
  variants: VariantInput[]
}

type SeedRecord = Record<string, any>

const money = (amount: number, currency_code: "usd" | "aud") => ({
  amount,
  currency_code,
})

const variants = (items: VariantInput[]) =>
  items.map(({ usd, aud, stocked_quantity, ...item }) => ({
    ...item,
    manage_inventory: true,
    prices: [money(usd, "usd"), money(aud, "aud")],
    metadata: {
      seeded_stocked_quantity: stocked_quantity ?? 12,
    },
  }))

const combinationVariants = ({
  optionTitle,
  values,
  sizes,
  skuPrefix,
  usd,
  aud,
}: {
  optionTitle: "Graphic" | "Graphic/Color" | "Color"
  values: string[]
  sizes: string[]
  skuPrefix: string
  usd: number
  aud: number
}) =>
  values.flatMap((value) =>
    sizes.map((size) => ({
      title: `${value} / ${size}`,
      sku: `${skuPrefix}-${value
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .toUpperCase()}-${size.replace(/[^a-zA-Z0-9]+/g, "").toUpperCase()}`,
      options: {
        [optionTitle]: value,
        Size: size,
      },
      usd,
      aud,
    }))
  )

const snowboardCategory = "Snowboards"

const catalogProducts: ProductSeedInput[] = [
  {
    title: "Cloud Suntt Regular Snowboard",
    subtitle: "Regular series with three graphics.",
    description:
      "Regular version with three board graphics/designs. Built for all-mountain carving progression with a balanced medium flex.",
    handle: "cloud-suntt-regular-snowboard",
    weight: 3000,
    categoryName: snowboardCategory,
    collectionHandle: "cloud-suntt",
    metadata: {
      catalog_phase: "phase-2a",
      brand: "Cloud Suntt",
      brand_slug: "cloud-suntt",
      series: "Regular",
      terrain: "All Mountain / Carving",
      flex: "Medium",
      level: "Intermediate",
      note: "Custom board graphics may be added later with an additional customization fee.",
    },
    options: [
      {
        title: "Graphic",
        values: ["Graphic 1", "Graphic 2", "Graphic 3"],
      },
      {
        title: "Size",
        values: ["146cm", "151cm", "154cm", "155cm", "160cm"],
      },
    ],
    variants: combinationVariants({
      optionTitle: "Graphic",
      values: ["Graphic 1", "Graphic 2", "Graphic 3"],
      sizes: ["146cm", "151cm", "154cm", "155cm", "160cm"],
      skuPrefix: "CS-REG",
      usd: 399,
      aud: 609,
    }),
  },
  {
    title: "Cloud Suntt SUN Wide Snowboard",
    subtitle: "Wide carving and all-mountain series.",
    description:
      "SUN Wide series with one graphic, a wider platform, and a confident carving-oriented ride.",
    handle: "cloud-suntt-sun-wide-snowboard",
    weight: 3200,
    categoryName: snowboardCategory,
    collectionHandle: "cloud-suntt",
    metadata: {
      catalog_phase: "phase-2a",
      brand: "Cloud Suntt",
      brand_slug: "cloud-suntt",
      series: "SUN Wide",
      terrain: "Carving / All Mountain",
      width: "Wide",
      level: "Intermediate / Advanced",
    },
    options: [
      {
        title: "Graphic",
        values: ["SUN Graphic"],
      },
      {
        title: "Size",
        values: ["151cm", "154cm", "158cm"],
      },
    ],
    variants: combinationVariants({
      optionTitle: "Graphic",
      values: ["SUN Graphic"],
      sizes: ["151cm", "154cm", "158cm"],
      skuPrefix: "CS-SUN-WIDE",
      usd: 449,
      aud: 689,
    }),
  },
  {
    title: "Cloud Suntt TT Carving Hammerhead Snowboard",
    subtitle: "Directional hammerhead carving board.",
    description:
      "TT directional carving hammerhead board for advanced riders who want strong edge hold and a focused carving shape.",
    handle: "cloud-suntt-tt-carving-hammerhead-snowboard",
    weight: 3300,
    categoryName: snowboardCategory,
    collectionHandle: "cloud-suntt",
    metadata: {
      catalog_phase: "phase-2a",
      brand: "Cloud Suntt",
      brand_slug: "cloud-suntt",
      series: "TT",
      terrain: "Directional Carving",
      shape: "Hammerhead",
      level: "Advanced",
    },
    options: [
      {
        title: "Graphic",
        values: ["TT Graphic"],
      },
      {
        title: "Size",
        values: ["160cm"],
      },
    ],
    variants: combinationVariants({
      optionTitle: "Graphic",
      values: ["TT Graphic"],
      sizes: ["160cm"],
      skuPrefix: "CS-TT",
      usd: 529,
      aud: 809,
    }),
  },
  // TODO: Add Cloud Suntt Pro Snowboard after confirmed graphics, sizes, pricing, and specs are provided.
  {
    title: "Maibk Sugar Snowboard",
    subtitle: "Soft-medium park and all-mountain board.",
    description:
      "Currently the main Maibk model, with trendy colorways and an approachable softer-flex ride for park and all-mountain progression.",
    handle: "maibk-sugar-snowboard",
    weight: 2850,
    categoryName: snowboardCategory,
    collectionHandle: "maibk",
    metadata: {
      catalog_phase: "phase-2a",
      brand: "Maibk",
      brand_slug: "maibk",
      series: "Sugar",
      terrain: "Park / All Mountain",
      flex: "Soft-Medium",
      level: "Beginner / Intermediate",
    },
    options: [
      {
        title: "Graphic/Color",
        values: ["Purple", "Pink", "Black"],
      },
      {
        title: "Size",
        values: ["135cm", "140cm", "146cm", "147cm", "150cm", "151cm"],
      },
    ],
    variants: combinationVariants({
      optionTitle: "Graphic/Color",
      values: ["Purple", "Pink", "Black"],
      sizes: ["135cm", "140cm", "146cm", "147cm", "150cm", "151cm"],
      skuPrefix: "MAIBK-SUGAR",
      usd: 319,
      aud: 489,
    }),
  },
  {
    title: "Cosone Duck Stance Carving Snowboard",
    subtitle: "Placeholder duck-stance carving model.",
    description:
      "A Cosone duck-stance carving snowboard placeholder. Exact graphics, colors, sizes, and detailed specs are coming soon.",
    handle: "cosone-duck-stance-carving-snowboard",
    weight: 3000,
    categoryName: snowboardCategory,
    collectionHandle: "cosone",
    metadata: {
      catalog_phase: "phase-2a",
      brand: "Cosone",
      brand_slug: "cosone",
      series: "Duck Stance Carving",
      terrain: "Carving",
      details_pending: true,
    },
    options: [
      {
        title: "Graphic/Color",
        values: ["TBD"],
      },
      {
        title: "Size",
        values: ["TBD"],
      },
    ],
    variants: [
      {
        title: "TBD / TBD",
        sku: "COSONE-DUCK-TBD",
        options: {
          "Graphic/Color": "TBD",
          Size: "TBD",
        },
        usd: 299,
        aud: 459,
        stocked_quantity: 0,
      },
    ],
  },
  {
    title: "Cosone Directional Carving Snowboard",
    subtitle: "Placeholder directional carving model.",
    description:
      "A Cosone directional carving snowboard placeholder. Exact graphics, colors, sizes, and detailed specs are coming soon.",
    handle: "cosone-directional-carving-snowboard",
    weight: 3100,
    categoryName: snowboardCategory,
    collectionHandle: "cosone",
    metadata: {
      catalog_phase: "phase-2a",
      brand: "Cosone",
      brand_slug: "cosone",
      series: "Directional Carving",
      terrain: "Directional Carving",
      details_pending: true,
    },
    options: [
      {
        title: "Graphic/Color",
        values: ["TBD"],
      },
      {
        title: "Size",
        values: ["TBD"],
      },
    ],
    variants: [
      {
        title: "TBD / TBD",
        sku: "COSONE-DIR-TBD",
        options: {
          "Graphic/Color": "TBD",
          Size: "TBD",
        },
        usd: 299,
        aud: 459,
        stocked_quantity: 0,
      },
    ],
  },
  {
    title: "Cosone Kids Snowboard",
    subtitle: "Placeholder kids progression model.",
    description:
      "A Cosone kids snowboard placeholder for young riders. Exact graphics, colors, sizes, and detailed specs are coming soon.",
    handle: "cosone-kids-snowboard",
    weight: 2200,
    categoryName: snowboardCategory,
    collectionHandle: "cosone",
    metadata: {
      catalog_phase: "phase-2a",
      brand: "Cosone",
      brand_slug: "cosone",
      series: "Kids",
      terrain: "Progression",
      details_pending: true,
    },
    options: [
      {
        title: "Graphic/Color",
        values: ["TBD"],
      },
      {
        title: "Size",
        values: ["TBD"],
      },
    ],
    variants: [
      {
        title: "TBD / TBD",
        sku: "COSONE-KIDS-TBD",
        options: {
          "Graphic/Color": "TBD",
          Size: "TBD",
        },
        usd: 219,
        aud: 339,
        stocked_quantity: 0,
      },
    ],
  },
  {
    title: "Cosone Powder Snowboard",
    subtitle: "Placeholder powder model.",
    description:
      "A Cosone powder snowboard placeholder for float-focused riding. Exact graphics, colors, sizes, and detailed specs are coming soon.",
    handle: "cosone-powder-snowboard",
    weight: 3100,
    categoryName: snowboardCategory,
    collectionHandle: "cosone",
    metadata: {
      catalog_phase: "phase-2a",
      brand: "Cosone",
      brand_slug: "cosone",
      series: "Powder",
      terrain: "Powder",
      details_pending: true,
    },
    options: [
      {
        title: "Graphic/Color",
        values: ["TBD"],
      },
      {
        title: "Size",
        values: ["TBD"],
      },
    ],
    variants: [
      {
        title: "TBD / TBD",
        sku: "COSONE-POWDER-TBD",
        options: {
          "Graphic/Color": "TBD",
          Size: "TBD",
        },
        usd: 299,
        aud: 459,
        stocked_quantity: 0,
      },
    ],
  },
  {
    title: "Storm Shell Jacket",
    subtitle: "Simple waterproof shell placeholder.",
    description:
      "A mountain-ready shell jacket placeholder for the clothing catalog.",
    handle: "storm-shell-jacket",
    weight: 900,
    categoryName: "Jackets",
    metadata: {
      catalog_phase: "phase-2a",
      product_group: "clothing",
      product_type: "Jackets",
      series: "Storm Shell",
    },
    options: [
      {
        title: "Color",
        values: ["Black"],
      },
      {
        title: "Size",
        values: ["S", "M", "L", "XL"],
      },
    ],
    variants: combinationVariants({
      optionTitle: "Color",
      values: ["Black"],
      sizes: ["S", "M", "L", "XL"],
      skuPrefix: "YNF-JACKET-STORM",
      usd: 189,
      aud: 289,
    }),
  },
  {
    title: "Snow Pants",
    subtitle: "Simple snowboard pants placeholder.",
    description:
      "Durable snow pants placeholder for the clothing catalog.",
    handle: "snow-pants",
    weight: 800,
    categoryName: "Pants",
    metadata: {
      catalog_phase: "phase-2a",
      product_group: "clothing",
      product_type: "Pants",
      series: "Snow Pants",
    },
    options: [
      {
        title: "Color",
        values: ["Black"],
      },
      {
        title: "Size",
        values: ["S", "M", "L", "XL"],
      },
    ],
    variants: combinationVariants({
      optionTitle: "Color",
      values: ["Black"],
      sizes: ["S", "M", "L", "XL"],
      skuPrefix: "YNF-PANTS-SNOW",
      usd: 149,
      aud: 229,
    }),
  },
  {
    title: "Jacket + Pant Set",
    subtitle: "Simple outerwear set placeholder.",
    description:
      "A practical jacket and pant set placeholder for riders building a full kit.",
    handle: "jacket-pant-set",
    weight: 1600,
    categoryName: "Jacket + Pant Sets",
    metadata: {
      catalog_phase: "phase-2a",
      product_group: "clothing",
      product_type: "Jacket + Pant Sets",
      series: "Outerwear Set",
    },
    options: [
      {
        title: "Color",
        values: ["Black"],
      },
      {
        title: "Size",
        values: ["S", "M", "L", "XL"],
      },
    ],
    variants: combinationVariants({
      optionTitle: "Color",
      values: ["Black"],
      sizes: ["S", "M", "L", "XL"],
      skuPrefix: "YNF-SET",
      usd: 299,
      aud: 459,
    }),
  },
  {
    title: "Waxing Iron Kit",
    subtitle: "Simple waxing tool kit.",
    description:
      "A local placeholder kit for maintaining snowboard bases at home.",
    handle: "waxing-iron-kit",
    weight: 1200,
    categoryName: "Waxing Tools",
    metadata: {
      catalog_phase: "phase-2a",
      product_group: "accessories",
      product_type: "Waxing Tools",
      series: "Waxing Iron Kit",
    },
    options: [{ title: "Style", values: ["Standard Kit"] }],
    variants: [
      {
        title: "Standard Kit",
        sku: "YNF-WAX-IRON-KIT",
        options: { Style: "Standard Kit" },
        usd: 69,
        aud: 105,
      },
    ],
  },
  {
    title: "All-Temperature Wax",
    subtitle: "Everyday snowboard wax.",
    description:
      "All-temperature snowboard wax placeholder for regular base care.",
    handle: "all-temperature-wax",
    weight: 200,
    categoryName: "Waxing Tools",
    metadata: {
      catalog_phase: "phase-2a",
      product_group: "accessories",
      product_type: "Waxing Tools",
      series: "All-Temperature Wax",
    },
    options: [{ title: "Style", values: ["120g Bar"] }],
    variants: [
      {
        title: "120g Bar",
        sku: "YNF-WAX-ALL-TEMP",
        options: { Style: "120g Bar" },
        usd: 18,
        aud: 28,
      },
    ],
  },
  {
    title: "Snowboard Stomp Pad",
    subtitle: "Simple traction pad.",
    description:
      "A clear stomp pad placeholder for one-foot skating and lift exits.",
    handle: "snowboard-stomp-pad",
    weight: 120,
    categoryName: "Stomp Pads",
    metadata: {
      catalog_phase: "phase-2a",
      product_group: "accessories",
      product_type: "Stomp Pads",
      series: "Stomp Pad",
    },
    options: [{ title: "Color", values: ["Clear"] }],
    variants: [
      {
        title: "Clear",
        sku: "YNF-STOMP-CLEAR",
        options: { Color: "Clear" },
        usd: 15,
        aud: 23,
      },
    ],
  },
  {
    title: "Edge Tuning Tool",
    subtitle: "Simple edge maintenance tool.",
    description:
      "A compact edge tuning tool placeholder for keeping carving boards sharp.",
    handle: "edge-tuning-tool",
    weight: 250,
    categoryName: "Waxing Tools",
    metadata: {
      catalog_phase: "phase-2a",
      product_group: "accessories",
      product_type: "Waxing Tools",
      series: "Edge Tuning Tool",
    },
    options: [{ title: "Style", values: ["Standard Tool"] }],
    variants: [
      {
        title: "Standard Tool",
        sku: "YNF-EDGE-TOOL",
        options: { Style: "Standard Tool" },
        usd: 29,
        aud: 45,
      },
    ],
  },
]

const brandCollections = [
  {
    title: "Cloud Suntt",
    handle: "cloud-suntt",
    metadata: {
      brand_slug: "cloud-suntt",
    },
  },
  {
    title: "Maibk",
    handle: "maibk",
    metadata: {
      brand_slug: "maibk",
    },
  },
  {
    title: "Cosone",
    handle: "cosone",
    metadata: {
      brand_slug: "cosone",
    },
  },
]

const categoryTree = [
  {
    name: "Snowboards",
    children: [],
  },
  {
    name: "Clothing",
    children: ["Jackets", "Pants", "Jacket + Pant Sets"],
  },
  {
    name: "Accessories",
    children: [
      "Waxing Tools",
      "Stomp Pads",
      "Goggles",
      "Helmets",
      "Protection",
    ],
  },
]

async function queryAll(
  query: any,
  entity: string,
  fields: string[]
): Promise<SeedRecord[]> {
  const { data } = await query.graph({
    entity,
    fields,
  })

  return data || []
}

async function ensureCategories(
  container: MedusaContainer,
  query: any
) {
  let categories = await queryAll(query, "product_category", [
    "id",
    "name",
    "handle",
    "parent_category_id",
  ])

  const byName = () =>
    new Map<string, any>(categories.map((category) => [category.name, category]))

  const missingParents = categoryTree
    .filter((category) => !byName().has(category.name))
    .map((category) => ({
      name: category.name,
      handle: category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      is_active: true,
    }))

  if (missingParents.length) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingParents,
      },
    })
    categories = await queryAll(query, "product_category", [
      "id",
      "name",
      "handle",
      "parent_category_id",
    ])
  }

  const categoryMap = byName()
  const missingChildren = categoryTree.flatMap((parent) => {
    const parentCategory = categoryMap.get(parent.name)

    return parent.children
      .filter((child) => !categoryMap.has(child))
      .map((child) => ({
        name: child,
        handle: child.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        is_active: true,
        parent_category_id: parentCategory?.id,
      }))
  })

  if (missingChildren.length) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingChildren,
      },
    })
    categories = await queryAll(query, "product_category", [
      "id",
      "name",
      "handle",
      "parent_category_id",
    ])
  }

  return new Map<string, string>(
    categories.map((category) => [category.name, category.id])
  )
}

async function ensureCollections(
  container: MedusaContainer,
  query: any
) {
  let collections = await queryAll(query, "product_collection", [
    "id",
    "title",
    "handle",
  ])

  const missing = brandCollections.filter(
    (collection) =>
      !collections.some((item) => item.handle === collection.handle)
  )

  if (missing.length) {
    await createCollectionsWorkflow(container).run({
      input: {
        collections: missing,
      },
    })
    collections = await queryAll(query, "product_collection", [
      "id",
      "title",
      "handle",
    ])
  }

  return new Map<string, string>(
    collections.map((collection) => [collection.handle, collection.id])
  )
}

export default async function seed({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  )

  logger.info("Seeding Yournextfit Phase 2A catalog data...")

  const existingSalesChannels = await queryAll(query, "sales_channel", [
    "id",
    "name",
  ])
  let salesChannel = existingSalesChannels.find(
    (channel) => channel.name === "Yournextfit Online Store"
  )

  if (!salesChannel) {
    const {
      result: [createdSalesChannel],
    } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [
          {
            name: "Yournextfit Online Store",
            description: "Default local sales channel for the storefront.",
          },
        ],
      },
    })
    salesChannel = createdSalesChannel
  }

  const existingApiKeys = await queryAll(query, "api_key", [
    "id",
    "title",
    "token",
    "type",
  ])
  let publishableApiKey = existingApiKeys.find(
    (key) =>
      key.title === "Yournextfit Storefront Publishable Key" &&
      key.type === "publishable"
  )

  if (!publishableApiKey) {
    const {
      result: [createdPublishableApiKey],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Yournextfit Storefront Publishable Key",
            type: "publishable",
            created_by: "seed",
          },
        ],
      },
    })
    publishableApiKey = createdPublishableApiKey
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [salesChannel.id],
    },
  })

  const existingStores = await queryAll(query, "store", ["id", "name"])
  if (!existingStores.some((store) => store.name === "Yournextfit")) {
    await createStoresWorkflow(container).run({
      input: {
        stores: [
          {
            name: "Yournextfit",
            supported_currencies: [
              {
                currency_code: "usd",
                is_default: true,
              },
              {
                currency_code: "aud",
                is_default: false,
              },
            ],
            default_sales_channel_id: salesChannel.id,
          },
        ],
      },
    })
  }

  const countries = ["us", "au"]
  const existingRegions = await queryAll(query, "region", [
    "id",
    "name",
    "currency_code",
  ])
  let region = existingRegions.find((item) => item.name === "United States")

  if (!region) {
    const {
      result: [createdRegion],
    } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "United States",
            currency_code: "usd",
            countries,
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    })
    region = createdRegion
  }

  const existingTaxRegions = await queryAll(query, "tax_region", [
    "id",
    "country_code",
  ])
  const existingTaxCountries = new Set(
    existingTaxRegions.map((item) => item.country_code)
  )
  const missingTaxRegions = countries.filter(
    (countryCode) => !existingTaxCountries.has(countryCode)
  )

  if (missingTaxRegions.length) {
    await createTaxRegionsWorkflow(container).run({
      input: missingTaxRegions.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    })
  }

  const existingStockLocations = await queryAll(query, "stock_location", [
    "id",
    "name",
  ])
  let stockLocation = existingStockLocations.find(
    (location) => location.name === "Yournextfit Local Warehouse"
  )

  if (!stockLocation) {
    const {
      result: [createdStockLocation],
    } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Yournextfit Local Warehouse",
            address: {
              address_1: "Local development warehouse",
              city: "Denver",
              country_code: "US",
            },
          },
        ],
      },
    })
    stockLocation = createdStockLocation

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    })
  }

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [salesChannel.id],
    },
  })

  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfileResult[0]

  const existingShippingOptions = await queryAll(query, "shipping_option", [
    "id",
    "name",
  ])

  if (
    !existingShippingOptions.some((option) => option.name === "Standard Ground")
  ) {
    const fulfillmentSet =
      await fulfillmentModuleService.createFulfillmentSets({
        name: "Yournextfit Warehouse Shipping",
        type: "shipping",
        service_zones: [
          {
            name: "US and Australia",
            geo_zones: countries.map((country_code) => ({
              country_code,
              type: "country" as const,
            })),
          },
        ],
      })

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSet.id,
      },
    })

    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Ground",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Local development flat-rate shipping.",
            code: "standard",
          },
          prices: [
            money(12, "usd"),
            money(18, "aud"),
            {
              region_id: region.id,
              amount: 12,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
      ],
    })
  }

  const categories = await ensureCategories(container, query)
  const collections = await ensureCollections(container, query)
  const existingProducts = await queryAll(query, "product", ["id", "handle"])
  const existingHandles = new Set(
    existingProducts.map((product) => product.handle)
  )

  const productsToCreate = catalogProducts
    .filter((product) => !existingHandles.has(product.handle))
    .map((product) => ({
      title: product.title,
      subtitle: product.subtitle,
      description: product.description,
      handle: product.handle,
      weight: product.weight ?? 500,
      status: ProductStatus.PUBLISHED,
      category_ids: [categories.get(product.categoryName)!],
      collection_id: product.collectionHandle
        ? collections.get(product.collectionHandle)
        : undefined,
      shipping_profile_id: shippingProfile.id,
      metadata: product.metadata,
      options: product.options,
      variants: variants(product.variants),
      sales_channels: [{ id: salesChannel.id }],
    }))

  if (productsToCreate.length) {
    logger.info(`Creating ${productsToCreate.length} Phase 2A products...`)
    await createProductsWorkflow(container).run({
      input: {
        products: productsToCreate,
      },
    })
  } else {
    logger.info("Phase 2A products already exist; skipping product creation.")
  }

  const inventoryItems = await queryAll(query, "inventory_item", ["id"])
  const existingInventoryLevels = await queryAll(query, "inventory_level", [
    "id",
    "inventory_item_id",
    "location_id",
  ])
  const levelKeys = new Set(
    existingInventoryLevels.map(
      (level) => `${level.inventory_item_id}:${level.location_id}`
    )
  )
  const inventoryLevels = inventoryItems
    .filter((item) => !levelKeys.has(`${item.id}:${stockLocation.id}`))
    .map((item) => ({
      location_id: stockLocation.id,
      stocked_quantity: 12,
      inventory_item_id: item.id,
    }))

  if (inventoryLevels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: inventoryLevels,
      },
    })
  }

  logger.info("Phase 2A seed completed.")
  logger.info(`Publishable API key: ${publishableApiKey.token}`)
}
