"use client"

import { useMemo, useState } from "react"
import { StoreOption, StoreVariant, variantPrice } from "@/lib/catalog"
import styles from "./VariantSelector.module.scss"

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
    <div className={styles.selector}>
      {options.map((option) => {
        const title = option.title || "Option"
        const values =
          option.values
            ?.map((value) => value.value)
            .filter((value): value is string => Boolean(value)) || []

        return (
          <div key={title}>
            <p className={styles.optionLabel}>{title}</p>
            <div className={styles.optionValues}>
              {values.map((value) => {
                const selected = selection[title] === value
                const available = isValueAvailable(title, value)

                return (
                  <button
                    className={[
                      styles.optionButton,
                      selected ? styles.optionButtonSelected : "",
                      available ? "" : styles.optionButtonUnavailable,
                    ].join(" ")}
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

      <div className={styles.selectedPanel}>
        {selectedVariant ? (
          <div className={styles.selectedContent}>
            <p className={styles.selectedText}>
              Selected variant:{" "}
              <span className={styles.selectedVariantTitle}>
                {selectedVariant.title}
              </span>
            </p>
            <p className={styles.selectedPrice}>
              {variantPrice(selectedVariant) || "Price coming soon"}
            </p>
          </div>
        ) : (
          <p className={styles.unavailableMessage}>
            That combination is not currently available. Choose another graphic,
            color, or size.
          </p>
        )}
      </div>
    </div>
  )
}
