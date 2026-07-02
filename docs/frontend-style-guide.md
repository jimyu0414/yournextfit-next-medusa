# Frontend Style Guide

This guide documents the preferred styling approach for the storefront in `apps/storefront`.

## Preferred Approach

For future storefront styling work, prefer SCSS Modules for component-specific styles.

Use `.module.scss` files for new or heavily edited storefront components. Keep styles close to the component they belong to, and use semantic class names that describe the role of the element rather than the visual implementation detail.

Good examples:

```text
hero
heroMedia
heroContent
navDropdown
productSpecs
```

## Tailwind Usage

Tailwind should stay installed and available for now, but avoid long Tailwind `className` strings for complex layouts.

Tailwind is still acceptable for:

- small one-off utility spacing
- quick prototypes
- tiny layout adjustments where a full SCSS module class would add noise

For reusable components or complex layouts, use SCSS Modules instead.

## Component Styling Rules

- Use `.module.scss` files for new or heavily edited storefront components.
- Use semantic SCSS module class names for reusable components.
- Keep responsive styles close to the component in the related `.module.scss` file.
- Migrate styles gradually when touching a component.
- Do not migrate the whole site at once.

## Global Styles

Use global styles only for true global concerns, such as:

- base typography
- CSS variables
- resets
- root-level page defaults

Do not put component-specific styles in `app/globals.scss`.

## Suggested File Pattern

```text
components/
  ProductCard.tsx
  ProductCard.module.scss

components/
  SiteHeader.tsx
  SiteHeader.module.scss

app/snowboards/
  page.tsx
  SnowboardsPage.module.scss
```
