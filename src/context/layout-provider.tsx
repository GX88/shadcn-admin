import { createContext, use, useState } from 'react'
import { getCookie, setCookie } from '@/lib/cookies'

export type Collapsible = 'offcanvas' | 'icon' | 'none'
export type LayoutPreset =
  | 'default'
  | 'compact'
  | 'full'
  | 'top-side'
  | 'top'
  | 'slim-side'
type Variant = 'inset' | 'sidebar' | 'floating'

// Cookie constants following the pattern from sidebar.tsx
const LAYOUT_COLLAPSIBLE_COOKIE_NAME = 'layout_collapsible'
const LAYOUT_PRESET_COOKIE_NAME = 'layout_preset'
const LAYOUT_VARIANT_COOKIE_NAME = 'layout_variant'
const LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Default values
const DEFAULT_VARIANT = 'inset'
const DEFAULT_COLLAPSIBLE = 'icon'
const DEFAULT_LAYOUT_PRESET = 'default'

const collapsibleValues: Collapsible[] = ['offcanvas', 'icon', 'none']
const layoutPresetValues: LayoutPreset[] = [
  'default',
  'compact',
  'full',
  'top-side',
  'top',
  'slim-side',
]
const variantValues: Variant[] = ['inset', 'sidebar', 'floating']

const isCollapsible = (value: string | undefined): value is Collapsible =>
  !!value && collapsibleValues.includes(value as Collapsible)

const isLayoutPreset = (value: string | undefined): value is LayoutPreset =>
  !!value && layoutPresetValues.includes(value as LayoutPreset)

const isVariant = (value: string | undefined): value is Variant =>
  !!value && variantValues.includes(value as Variant)

type LayoutContextType = {
  resetLayout: () => void

  defaultCollapsible: Collapsible
  collapsible: Collapsible
  setCollapsible: (collapsible: Collapsible) => void

  defaultLayoutPreset: LayoutPreset
  layoutPreset: LayoutPreset
  setLayoutPreset: (layoutPreset: LayoutPreset) => void

  defaultVariant: Variant
  variant: Variant
  setVariant: (variant: Variant) => void
}

const LayoutContext = createContext<LayoutContextType | null>(null)

type LayoutProviderProps = {
  children: React.ReactNode
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [collapsible, _setCollapsible] = useState<Collapsible>(() => {
    const saved = getCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME)
    return isCollapsible(saved) ? saved : DEFAULT_COLLAPSIBLE
  })

  const [layoutPreset, _setLayoutPreset] = useState<LayoutPreset>(() => {
    const saved = getCookie(LAYOUT_PRESET_COOKIE_NAME)
    return isLayoutPreset(saved) ? saved : DEFAULT_LAYOUT_PRESET
  })

  const [variant, _setVariant] = useState<Variant>(() => {
    const saved = getCookie(LAYOUT_VARIANT_COOKIE_NAME)
    return isVariant(saved) ? saved : DEFAULT_VARIANT
  })

  const setCollapsible = (newCollapsible: Collapsible) => {
    _setCollapsible(newCollapsible)
    setCookie(
      LAYOUT_COLLAPSIBLE_COOKIE_NAME,
      newCollapsible,
      LAYOUT_COOKIE_MAX_AGE
    )
  }

  const setLayoutPreset = (newLayoutPreset: LayoutPreset) => {
    _setLayoutPreset(newLayoutPreset)
    setCookie(
      LAYOUT_PRESET_COOKIE_NAME,
      newLayoutPreset,
      LAYOUT_COOKIE_MAX_AGE
    )
  }

  const setVariant = (newVariant: Variant) => {
    _setVariant(newVariant)
    setCookie(LAYOUT_VARIANT_COOKIE_NAME, newVariant, LAYOUT_COOKIE_MAX_AGE)
  }

  const resetLayout = () => {
    setCollapsible(DEFAULT_COLLAPSIBLE)
    setLayoutPreset(DEFAULT_LAYOUT_PRESET)
    setVariant(DEFAULT_VARIANT)
  }

  const contextValue: LayoutContextType = {
    resetLayout,
    defaultCollapsible: DEFAULT_COLLAPSIBLE,
    collapsible,
    setCollapsible,
    defaultLayoutPreset: DEFAULT_LAYOUT_PRESET,
    layoutPreset,
    setLayoutPreset,
    defaultVariant: DEFAULT_VARIANT,
    variant,
    setVariant,
  }

  return <LayoutContext value={contextValue}>{children}</LayoutContext>
}

// Define the hook for the provider
// eslint-disable-next-line react-refresh/only-export-components
export function useLayout() {
  const context = use(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}
