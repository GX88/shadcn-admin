import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
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
  const [open, setOpen] = useState(() => getCookie('sidebar_state') !== 'false')
  const isSlimSide = layoutPreset === 'slim-side'

  return (
    <SidebarProvider
      defaultOpen={open}
      open={isSlimSide ? false : open}
      onOpenChange={setOpen}
    >
      {children}
    </SidebarProvider>
  )
}

function AuthenticatedLayoutShell({ children }: { children: React.ReactNode }) {
  const { layoutPreset } = useLayout()
  const hasGlobalHeader =
    layoutPreset === 'top-side' ||
    layoutPreset === 'top' ||
    layoutPreset === 'slim-side'
  const hasSidebar = layoutPreset !== 'top'
  const compactSidebar = layoutPreset === 'slim-side'

  return (
    <>
      <SkipToMain />
      {hasGlobalHeader && (
        <Header
          global
          fixed
          showBrand
          showSidebarTrigger={hasSidebar}
        >
          <HeaderActions />
        </Header>
      )}
      <div className={cn('flex min-h-svh w-full', hasGlobalHeader && 'min-h-0 flex-1')}>
        {hasSidebar && (
          <AppSidebar
            hideHeader={hasGlobalHeader}
            compact={compactSidebar}
            className={cn(
              hasGlobalHeader &&
                'top-12 h-[calc(100svh-3rem)] group-data-[collapsible=offcanvas]:-inset-s-[calc(var(--sidebar-width))]'
            )}
          />
        )}
        <SidebarInset
          className={cn(
            // Set content container, so we can use container queries
            '@container/content',

            // If layout is fixed, set the height
            // to 100svh to prevent overflow
            'has-data-[layout=fixed]:h-svh',

            // If layout is fixed and sidebar is inset,
            // set the height to 100svh - spacing (total margins) to prevent overflow
            !hasGlobalHeader &&
              'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]',
            hasGlobalHeader &&
              'min-h-[calc(100svh-3rem)] pt-12 md:!m-0 md:!rounded-none md:!shadow-none',
            layoutPreset === 'top' && 'w-full'
          )}
        >
          {children}
        </SidebarInset>
      </div>
    </>
  )
}
