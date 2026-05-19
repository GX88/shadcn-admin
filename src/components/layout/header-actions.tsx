import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export function HeaderActions() {
  return (
    <div className='ms-auto flex items-center gap-2'>
      <Search className='hidden md:flex' />
      <ThemeSwitch />
      <ConfigDrawer />
      <ProfileDropdown />
    </div>
  )
}