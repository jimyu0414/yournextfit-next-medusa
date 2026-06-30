import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
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

const imageUrl =
  "https://images.unsplash.com/photo-1518608774889-b04d2abe7702?auto=format&fit=crop&w=1200&q=80"

type VariantInput = {
  title: string
  sku: string
  options: Record<string, string>
  usd: number
  aud: number
}

const money = (amount: number, currency_code: "usd" | "aud") => ({
  amount,
  currency_code,
})

const variants = (items: VariantInput[]) =>
  items.map(({ usd, aud, ...item }) => ({
    ...item,
    prices: [money(usd, "usd"), money(aud, "aud")],
  }))

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

  logger.info("Seeding Yournextfit local store data...")

  const {
    result: [salesChannel],
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

  const {
    result: [publishableApiKey],
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

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [salesChannel.id],
    },
  })

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

  const countries = ["us", "au"]

  const {
    result: [region],
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

  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  })

  const {
    result: [stockLocation],
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

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  })

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
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

  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfileResult[0]

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

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [salesChannel.id],
    },
  })

  const { result: categories } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        "Snowboards",
        "Boots",
        "Bindings",
        "Outerwear",
        "Accessories",
        "Badminton",
      ].map((name) => ({
        name,
        is_active: true,
      })),
    },
  })

  const categoryId = (name: string) =>
    categories.find((category) => category.name === name)!.id

  const { result: productOptions } = await createProductOptionsWorkflow(
    container
  ).run({
    input: {
      product_options: [
        {
          title: "Length",
          values: ["150 cm", "154 cm", "158 cm", "162 cm"],
        },
        {
          title: "Size",
          values: ["S", "M", "L", "XL", "8", "9", "10", "11"],
        },
        {
          title: "Color",
          values: ["Black", "White", "Slate", "Pine", "Storm Blue"],
        },
        {
          title: "Flex",
          values: ["Soft", "Medium", "Stiff"],
        },
        {
          title: "Terrain",
          values: ["Powder", "All-Mountain", "Park"],
        },
        {
          title: "Gender",
          values: ["Unisex", "Women", "Men"],
        },
      ],
    },
  })

  const option = (title: string) => ({
    id: productOptions.find((item) => item.title === title)!.id,
  })

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Yournextfit Powder Twin Snowboard",
          subtitle: "Directional twin for soft landings and deep days.",
          description:
            "A buoyant powder board with a stable twin feel, medium flex, and a wide nose for playful storm days.",
          handle: "yournextfit-powder-twin-snowboard",
          weight: 3200,
          status: ProductStatus.PUBLISHED,
          category_ids: [categoryId("Snowboards")],
          shipping_profile_id: shippingProfile.id,
          images: [{ url: imageUrl }],
          options: [option("Length"), option("Flex"), option("Terrain")],
          variants: variants([
            {
              title: "154 cm / Medium / Powder",
              sku: "YNF-SB-POW-154",
              options: {
                Length: "154 cm",
                Flex: "Medium",
                Terrain: "Powder",
              },
              usd: 549,
              aud: 839,
            },
            {
              title: "158 cm / Medium / Powder",
              sku: "YNF-SB-POW-158",
              options: {
                Length: "158 cm",
                Flex: "Medium",
                Terrain: "Powder",
              },
              usd: 549,
              aud: 839,
            },
          ]),
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Yournextfit All-Mountain Carbon Snowboard",
          subtitle: "Lightweight response for carving, trees, and chop.",
          description:
            "A stiff carbon-reinforced board built for fast edge changes and confident all-mountain riding.",
          handle: "yournextfit-all-mountain-carbon-snowboard",
          weight: 3000,
          status: ProductStatus.PUBLISHED,
          category_ids: [categoryId("Snowboards")],
          shipping_profile_id: shippingProfile.id,
          images: [{ url: imageUrl }],
          options: [option("Length"), option("Flex"), option("Terrain")],
          variants: variants([
            {
              title: "158 cm / Stiff / All-Mountain",
              sku: "YNF-SB-CAR-158",
              options: {
                Length: "158 cm",
                Flex: "Stiff",
                Terrain: "All-Mountain",
              },
              usd: 629,
              aud: 969,
            },
            {
              title: "162 cm / Stiff / All-Mountain",
              sku: "YNF-SB-CAR-162",
              options: {
                Length: "162 cm",
                Flex: "Stiff",
                Terrain: "All-Mountain",
              },
              usd: 629,
              aud: 969,
            },
          ]),
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Yournextfit Park Flex Snowboard",
          subtitle: "Soft flex for rails, side hits, and spring laps.",
          description:
            "A forgiving park board with a soft twin profile for freestyle progression and easy presses.",
          handle: "yournextfit-park-flex-snowboard",
          weight: 2900,
          status: ProductStatus.PUBLISHED,
          category_ids: [categoryId("Snowboards")],
          shipping_profile_id: shippingProfile.id,
          images: [{ url: imageUrl }],
          options: [option("Length"), option("Flex"), option("Terrain")],
          variants: variants([
            {
              title: "150 cm / Soft / Park",
              sku: "YNF-SB-PARK-150",
              options: {
                Length: "150 cm",
                Flex: "Soft",
                Terrain: "Park",
              },
              usd: 429,
              aud: 659,
            },
            {
              title: "154 cm / Soft / Park",
              sku: "YNF-SB-PARK-154",
              options: {
                Length: "154 cm",
                Flex: "Soft",
                Terrain: "Park",
              },
              usd: 429,
              aud: 659,
            },
          ]),
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Alpine Fit Snowboard Boots",
          subtitle: "Supportive boots for cold resort days.",
          description:
            "Warm medium-flex boots with a supportive liner and easy all-day fit.",
          handle: "alpine-fit-snowboard-boots",
          weight: 1800,
          status: ProductStatus.PUBLISHED,
          category_ids: [categoryId("Boots")],
          shipping_profile_id: shippingProfile.id,
          images: [{ url: imageUrl }],
          options: [option("Size"), option("Gender"), option("Color")],
          variants: variants([
            {
              title: "9 / Unisex / Black",
              sku: "YNF-BT-AF-9-BLK",
              options: {
                Size: "9",
                Gender: "Unisex",
                Color: "Black",
              },
              usd: 249,
              aud: 379,
            },
            {
              title: "10 / Unisex / Black",
              sku: "YNF-BT-AF-10-BLK",
              options: {
                Size: "10",
                Gender: "Unisex",
                Color: "Black",
              },
              usd: 249,
              aud: 379,
            },
          ]),
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Carbon Response Bindings",
          subtitle: "Fast edge response with a damp ride.",
          description:
            "Lightweight bindings with a responsive highback and simple tool-free adjustments.",
          handle: "carbon-response-bindings",
          weight: 1200,
          status: ProductStatus.PUBLISHED,
          category_ids: [categoryId("Bindings")],
          shipping_profile_id: shippingProfile.id,
          images: [{ url: imageUrl }],
          options: [option("Size"), option("Color"), option("Flex")],
          variants: variants([
            {
              title: "M / Black / Stiff",
              sku: "YNF-BD-CR-M-BLK",
              options: {
                Size: "M",
                Color: "Black",
                Flex: "Stiff",
              },
              usd: 279,
              aud: 429,
            },
            {
              title: "L / Black / Stiff",
              sku: "YNF-BD-CR-L-BLK",
              options: {
                Size: "L",
                Color: "Black",
                Flex: "Stiff",
              },
              usd: 279,
              aud: 429,
            },
          ]),
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Storm Shell Jacket",
          subtitle: "Waterproof shell for mountain weather.",
          description:
            "A lightweight waterproof shell with helmet-compatible hood and clean freeride styling.",
          handle: "storm-shell-jacket",
          weight: 900,
          status: ProductStatus.PUBLISHED,
          category_ids: [categoryId("Outerwear")],
          shipping_profile_id: shippingProfile.id,
          images: [{ url: imageUrl }],
          options: [option("Size"), option("Gender"), option("Color")],
          variants: variants([
            {
              title: "M / Men / Storm Blue",
              sku: "YNF-OW-SS-M-BLU",
              options: {
                Size: "M",
                Gender: "Men",
                Color: "Storm Blue",
              },
              usd: 319,
              aud: 489,
            },
            {
              title: "L / Men / Storm Blue",
              sku: "YNF-OW-SS-L-BLU",
              options: {
                Size: "L",
                Gender: "Men",
                Color: "Storm Blue",
              },
              usd: 319,
              aud: 489,
            },
          ]),
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Performance Badminton Racket",
          subtitle: "Fast frame for weekly court sessions.",
          description:
            "A balanced graphite racket for quick doubles exchanges and controlled singles play.",
          handle: "performance-badminton-racket",
          weight: 110,
          status: ProductStatus.PUBLISHED,
          category_ids: [categoryId("Badminton")],
          shipping_profile_id: shippingProfile.id,
          images: [{ url: imageUrl }],
          options: [option("Color"), option("Flex")],
          variants: variants([
            {
              title: "White / Medium",
              sku: "YNF-BM-PR-WHT-MED",
              options: {
                Color: "White",
                Flex: "Medium",
              },
              usd: 119,
              aud: 179,
            },
            {
              title: "Pine / Medium",
              sku: "YNF-BM-PR-PIN-MED",
              options: {
                Color: "Pine",
                Flex: "Medium",
              },
              usd: 119,
              aud: 179,
            },
          ]),
          sales_channels: [{ id: salesChannel.id }],
        },
      ],
    },
  })

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems.map((item) => ({
        location_id: stockLocation.id,
        stocked_quantity: 25,
        inventory_item_id: item.id,
      })),
    },
  })

  logger.info("Seed completed.")
  logger.info(`Publishable API key: ${publishableApiKey.token}`)
}
