import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { getLayoutPresetConfig } from '@/context/layout-config'
import { LayoutProvider, useLayout } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { ConfigDrawerProvider } from '@/components/config-drawer'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { HeaderActions } from '@/components/layout/header-actions'
import { SkipToMain } from '@/components/skip-to-main'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <SearchProvider>
      <LayoutProvider>
        <AuthenticatedSidebarProvider>
          <ConfigDrawerProvider>
            <AuthenticatedLayoutShell>
              {children ?? <Outlet />}
            </AuthenticatedLayoutShell>
          </ConfigDrawerProvider>
        </AuthenticatedSidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}

function AuthenticatedSidebarProvider({ children }: { children: React.ReactNode }) {
  const { layoutPreset } = useLayout()
  const layoutConfig = getLayoutPresetConfig(layoutPreset)
  const savedOpen = getCookie('sidebar_state')
  const defaultOpen =
    savedOpen === undefined
      ? (layoutConfig.sidebarState.open ?? true)
      : savedOpen !== 'false'
  const [open, setOpen] = useState(defaultOpen)
  const isRail = layoutConfig.sidebarMode === 'rail'

  return (
    <SidebarProvider open={isRail ? false : open} onOpenChange={setOpen}>
      {children}
    </SidebarProvider>
  )
}

function AuthenticatedLayoutShell({ children }: { children: React.ReactNode }) {
  const { layoutPreset } = useLayout()
  const layoutConfig = getLayoutPresetConfig(layoutPreset)
  const hasSidebar = layoutConfig.sidebarMode !== 'none'
  const isFrameBounded = layoutConfig.contentScroll === 'content'

  return (
    <>
      <SkipToMain />
      <div
        className={cn(
          'flex w-full [--layout-header-height:3rem]',
          isFrameBounded ? 'h-svh flex-col overflow-hidden' : 'min-h-svh'
        )}
      >
        {layoutConfig.topHeader && (
          <Header
            global
            showBrand={layoutConfig.headerBrand}
            showSidebarTrigger={hasSidebar}
          >
            <HeaderActions />
          </Header>
        )}
        <div
          className={cn(
            'flex w-full',
            isFrameBounded ? 'min-h-0 flex-1' : 'min-h-svh'
          )}
        >
          {hasSidebar && (
            <AppSidebar
              showBrand={layoutConfig.sidebarBrand}
              mode={layoutConfig.sidebarMode}
              className={cn(
                layoutConfig.topHeader &&
                  'top-(--layout-header-height) h-[calc(100svh-var(--layout-header-height))] group-data-[collapsible=offcanvas]:-inset-s-[calc(var(--sidebar-width))]'
              )}
            />
          )}
          <SidebarInset
            className={cn(
              '@container/content',
              isFrameBounded
                ? 'min-h-0 overflow-y-auto'
                : 'has-data-[layout=fixed]:h-svh',
              !isFrameBounded &&
                'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]',
              layoutConfig.contentFrame === 'inset-card' &&
                'm-2 rounded-xl shadow-sm md:!m-2 md:!rounded-xl md:!shadow-sm',
              layoutConfig.contentFrame === 'full' && 'w-full'
            )}
          >
            {children}
          </SidebarInset>
        </div>
      </div>
    </>
  )
}
