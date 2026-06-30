"use client"

import { useMemo, useState } from "react"
import { StoreOption, StoreVariant, variantPrice } from "@/lib/catalog"

function variantOptionMap(variant: StoreVariant) {
  const map = new Map<string, string>()

  variant.options?.forEach((option) => {
    if (option.option?.title && option.value) {
      map.set(option.option.title, option.value)
    }
  })

  return map
}

export function VariantSelector({
  options,
  variants,
}: {
  options: StoreOption[]
  variants: StoreVariant[]
}) {
  const initialSelection = useMemo(() => {
    const selection: Record<string, string> = {}

    options.forEach((option) => {
      const firstValue = option.values?.find((value) => value.value)?.value
      if (option.title && firstValue) {
        selection[option.title] = firstValue
      }
    })

    return selection
  }, [options])
  const [selection, setSelection] = useState(initialSelection)

  const selectedVariant = variants.find((variant) => {
    const optionMap = variantOptionMap(variant)

    return Object.entries(selection).every(
      ([title, value]) => optionMap.get(title) === value
    )
  })

  function isValueAvailable(title: string, value: string) {
    return variants.some((variant) => {
      const optionMap = variantOptionMap(variant)

      return Object.entries(selection).every(([selectedTitle, selectedValue]) => {
        const expectedValue = selectedTitle === title ? value : selectedValue
        return optionMap.get(selectedTitle) === expectedValue
      })
    })
  }

  return (
    <div className="space-y-5">
      {options.map((option) => {
        const title = option.title || "Option"
        const values =
          option.values
            ?.map((value) => value.value)
            .filter((value): value is string => Boolean(value)) || []

        return (
          <div key={title}>
            <p className="mb-2 text-sm font-semibold text-neutral-900">
              {title}
            </p>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const selected = selection[title] === value
                const available = isValueAvailable(title, value)

                return (
                  <button
                    className={`rounded border px-3 py-2 text-sm font-medium transition ${
                      selected
                        ? "border-neutral-950 bg-neutral-950 text-white"
                        : "border-black/15 bg-white text-neutral-800 hover:border-neutral-500"
                    } ${available ? "" : "opacity-40"}`}
                    key={value}
                    onClick={() =>
                      setSelection((current) => ({
                        ...current,
                        [title]: value,
                      }))
                    }
                    type="button"
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="rounded border border-black/10 bg-white p-4">
        {selectedVariant ? (
          <div className="space-y-2">
            <p className="text-sm text-neutral-600">
              Selected variant:{" "}
              <span className="font-medium text-neutral-950">
                {selectedVariant.title}
              </span>
            </p>
            <p className="text-lg font-semibold text-neutral-950">
              {variantPrice(selectedVariant) || "Price coming soon"}
            </p>
          </div>
        ) : (
          <p className="text-sm leading-6 text-amber-900">
            That combination is not currently available. Choose another graphic,
            color, or size.
          </p>
        )}
      </div>
    </div>
  )
}
