import { useEffect, useState } from 'react'
import { Command } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLayout } from '@/context/layout-provider'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

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

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true })

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  if (!global && layoutPreset !== 'default' && layoutPreset !== 'compact' && layoutPreset !== 'full') {
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
          <div className='flex shrink-0 items-center gap-2'>
            <span className='flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground'>
              <Command className='size-2.5' />
            </span>
            <span className='text-sm font-semibold text-foreground'>Shadcn Admin</span>
          </div>
        )}
        {children}
      </div>
    </header>
  )
}
