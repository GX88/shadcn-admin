import { Link } from '@tanstack/react-router'
import type { SidebarLayoutMode } from '@/context/layout-config'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { appBrand } from './brand'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'

type AppSidebarProps = {
  showBrand?: boolean
  mode?: SidebarLayoutMode
  className?: string
}

export function AppSidebar({
  showBrand = true,
  mode = 'normal',
  className,
}: AppSidebarProps) {
  const { collapsible, variant } = useLayout()
  const isRail = mode === 'rail'

  return (
    <Sidebar
      collapsible={isRail ? 'icon' : collapsible}
      variant={isRail ? 'sidebar' : variant}
      className={className}
    >
      {showBrand && (
        <SidebarHeader>
          <SidebarBrand />
        </SidebarHeader>
      )}
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function SidebarBrand() {
  const { setOpenMobile } = useSidebar()
  const Logo = appBrand.logo

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size='lg' asChild tooltip={appBrand.name}>
          <Link to='/' onClick={() => setOpenMobile(false)}>
            <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
              <Logo className='size-4' />
            </div>
            <div className='grid flex-1 text-start text-sm leading-tight'>
              <span className='truncate font-semibold'>{appBrand.name}</span>
              <span className='truncate text-xs'>{appBrand.description}</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}