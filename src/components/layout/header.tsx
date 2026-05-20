import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { getLayoutPresetConfig } from '@/context/layout-config'
import { useLayout } from '@/context/layout-provider'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { appBrand } from './brand'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  global?: boolean
  showBrand?: boolean
  showSidebarTrigger?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Header({
  className,
  fixed,
  global = false,
  showBrand = false,
  showSidebarTrigger = true,
  children,
  ...props
}: HeaderProps) {
  const [offset, setOffset] = useState(0)
  const { layoutPreset } = useLayout()
  const layoutConfig = getLayoutPresetConfig(layoutPreset)
  const Logo = appBrand.logo

  useEffect(() => {
    if (!fixed || global) {
      return
    }

    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    document.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => document.removeEventListener('scroll', onScroll)
  }, [fixed, global])

  if (!global && !layoutConfig.pageHeader) {
    return null
  }

  return (
    <header
      className={cn(
        global ? 'relative z-50 h-12 shrink-0 bg-sidebar' : 'z-50 h-16',
        !global && fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
        offset > 10 && fixed
          ? global
            ? 'border-b border-border/70'
            : 'shadow'
          : global
            ? 'border-b border-transparent'
            : 'shadow-none',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'relative flex h-full items-center gap-3',
          global ? 'px-4' : 'p-4 sm:gap-4',
          !global &&
            offset > 10 &&
            fixed &&
            'after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg'
        )}
      >
        {showSidebarTrigger && (
          <SidebarTrigger
            variant={global ? 'ghost' : 'outline'}
            className={cn(global ? 'size-7 shrink-0' : 'max-md:scale-125')}
          />
        )}
        {!global && showSidebarTrigger && (
          <Separator orientation='vertical' className='h-6' />
        )}
        {showBrand && (
          <Link
            to='/'
            className='flex shrink-0 items-center gap-2 rounded-md px-1.5 py-1 text-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          >
            <span className='flex size-5 items-center justify-center rounded-md bg-primary text-primary-foreground'>
              <Logo className='size-3' />
            </span>
            <span className='text-sm font-semibold'>{appBrand.name}</span>
          </Link>
        )}
        {children}
      </div>
    </header>
  )
}
