import type { Collapsible, LayoutPreset } from './layout-provider'

export type SidebarLayoutMode = 'normal' | 'none' | 'rail'
export type ContentFrame = 'native' | 'inset-card' | 'full'
export type ContentScroll = 'document' | 'content'

export type LayoutPresetConfig = {
  topHeader: boolean
  headerBrand: boolean
  sidebarMode: SidebarLayoutMode
  sidebarBrand: boolean
  pageHeader: boolean
  contentFrame: ContentFrame
  contentScroll: ContentScroll
  sidebarState: {
    open?: boolean
    collapsible?: Collapsible
  }
}

const DEFAULT_COLLAPSIBLE: Collapsible = 'icon'

const layoutPresetConfigs: Record<LayoutPreset, LayoutPresetConfig> = {
  default: {
    topHeader: false,
    headerBrand: false,
    sidebarMode: 'normal',
    sidebarBrand: true,
    pageHeader: true,
    contentFrame: 'native',
    contentScroll: 'document',
    sidebarState: {
      open: true,
      collapsible: DEFAULT_COLLAPSIBLE,
    },
  },
  compact: {
    topHeader: false,
    headerBrand: false,
    sidebarMode: 'normal',
    sidebarBrand: true,
    pageHeader: true,
    contentFrame: 'native',
    contentScroll: 'document',
    sidebarState: {
      open: false,
      collapsible: 'icon',
    },
  },
  full: {
    topHeader: false,
    headerBrand: false,
    sidebarMode: 'normal',
    sidebarBrand: true,
    pageHeader: true,
    contentFrame: 'native',
    contentScroll: 'document',
    sidebarState: {
      open: false,
      collapsible: 'offcanvas',
    },
  },
  'top-side': {
    topHeader: true,
    headerBrand: true,
    sidebarMode: 'normal',
    sidebarBrand: false,
    pageHeader: false,
    contentFrame: 'inset-card',
    contentScroll: 'content',
    sidebarState: {
      open: true,
      collapsible: DEFAULT_COLLAPSIBLE,
    },
  },
  top: {
    topHeader: true,
    headerBrand: true,
    sidebarMode: 'none',
    sidebarBrand: false,
    pageHeader: false,
    contentFrame: 'full',
    contentScroll: 'content',
    sidebarState: {
      open: true,
      collapsible: DEFAULT_COLLAPSIBLE,
    },
  },
  'slim-side': {
    topHeader: true,
    headerBrand: true,
    sidebarMode: 'rail',
    sidebarBrand: false,
    pageHeader: false,
    contentFrame: 'inset-card',
    contentScroll: 'content',
    sidebarState: {
      open: false,
      collapsible: 'icon',
    },
  },
}

export function getLayoutPresetConfig(layoutPreset: LayoutPreset) {
  return layoutPresetConfigs[layoutPreset]
}