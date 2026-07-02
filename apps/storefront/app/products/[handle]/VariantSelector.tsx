"use client"

import { useMemo, useState } from "react"
import { StoreOption, StoreVariant, variantPrice } from "@/lib/catalog"
import styles from "./VariantSelector.module.scss"

export type VariantSelection = Record<string, string>

function variantOptionMap(variant: StoreVariant) {
  const map = new Map<string, string>()

  variant.options?.forEach((option) => {
    if (option.option?.title && option.value) {
      map.set(option.option.title, option.value)
    }
  })

  return map
}

export function getInitialVariantSelection(
  options: StoreOption[],
  variants: StoreVariant[]
) {
  const selection: VariantSelection = {}
  const firstVariantOptions = variants[0] ? variantOptionMap(variants[0]) : null

  options.forEach((option) => {
    if (!option.title) {
      return
    }

    const firstVariantValue = firstVariantOptions?.get(option.title)
    const firstOptionValue = option.values?.find((value) => value.value)?.value
    const initialValue = firstVariantValue || firstOptionValue

    if (initialValue) {
      selection[option.title] = initialValue
    }
  })

  return selection
}

export function VariantSelector({
  onSelectionChange,
  options,
  selection: controlledSelection,
  variants,
}: {
  onSelectionChange?: (selection: VariantSelection) => void
  options: StoreOption[]
  selection?: VariantSelection
  variants: StoreVariant[]
}) {
  const initialSelection = useMemo(
    () => getInitialVariantSelection(options, variants),
    [options, variants]
  )
  const [internalSelection, setInternalSelection] = useState(initialSelection)
  const selection = controlledSelection || internalSelection

  function updateSelection(nextSelection: VariantSelection) {
    if (!controlledSelection) {
      setInternalSelection(nextSelection)
    }

    onSelectionChange?.(nextSelection)
  }

  const selectedVariant = variants.find((variant) => {
    const optionMap = variantOptionMap(variant)

    return Object.entries(selection).every(
      ([title, value]) => optionMap.get(title) === value
    )
  })

  function isValueAvailable(title: string, value: string) {
    if (!variants.length) {
      return true
    }

    return variants.some((variant) => {
      const optionMap = variantOptionMap(variant)

      return Object.entries(selection).every(([selectedTitle, selectedValue]) => {
        const expectedValue = selectedTitle === title ? value : selectedValue
        return optionMap.get(selectedTitle) === expectedValue
      })
    })
  }

  if (!options.length) {
    return (
      <div className={styles.selectedPanel}>
        <p className={styles.selectedText}>
          No selectable options are configured for this product yet.
        </p>
      </div>
    )
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
          <div className={styles.optionGroup} key={title}>
            <p className={styles.optionLabel}>{title}</p>
            <div className={styles.optionValues}>
              {values.map((value) => {
                const selected = selection[title] === value
                const available = isValueAvailable(title, value)
                const isGraphicOption = /graphic|color/i.test(title)

                return (
                  <button
                    aria-pressed={selected}
                    className={[
                      styles.optionButton,
                      isGraphicOption ? styles.graphicOptionButton : "",
                      selected ? styles.optionButtonSelected : "",
                      available ? "" : styles.optionButtonUnavailable,
                    ].join(" ")}
                    disabled={!available}
                    key={value}
                    onClick={() =>
                      updateSelection({
                        ...selection,
                        [title]: value,
                      })
                    }
                    type="button"
                  >
                    {value}
                    {!available ? (
                      <span className={styles.unavailableLabel}>
                        Unavailable
                      </span>
                    ) : null}
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
              Selected variant{" "}
              <span className={styles.selectedVariantTitle}>
                {selectedVariant.title}
              </span>
            </p>
            <p className={styles.selectedPrice}>
              {variantPrice(selectedVariant) || "Price coming soon"}
            </p>
            <p className={styles.availableMessage}>
              Available for this configuration
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
