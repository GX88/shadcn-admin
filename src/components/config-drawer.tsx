import {
  createContext,
  type Dispatch,
  type SetStateAction,
  type SVGProps,
  use,
  useState,
} from 'react'
import { Root as Radio, Item } from '@radix-ui/react-radio-group'
import { CircleCheck, RotateCcw, Settings } from 'lucide-react'
import { IconDir } from '@/assets/custom/icon-dir'
import { IconLayoutCompact } from '@/assets/custom/icon-layout-compact'
import { IconLayoutDefault } from '@/assets/custom/icon-layout-default'
import { IconLayoutFull } from '@/assets/custom/icon-layout-full'
import { IconLayoutSlimSide } from '@/assets/custom/icon-layout-slim-side'
import { IconLayoutTop } from '@/assets/custom/icon-layout-top'
import { IconLayoutTopSide } from '@/assets/custom/icon-layout-top-side'
import { IconSidebarFloating } from '@/assets/custom/icon-sidebar-floating'
import { IconSidebarInset } from '@/assets/custom/icon-sidebar-inset'
import { IconSidebarSidebar } from '@/assets/custom/icon-sidebar-sidebar'
import { IconThemeDark } from '@/assets/custom/icon-theme-dark'
import { IconThemeLight } from '@/assets/custom/icon-theme-light'
import { IconThemeSystem } from '@/assets/custom/icon-theme-system'
import { cn } from '@/lib/utils'
import { useDirection } from '@/context/direction-provider'
import { type LayoutPreset, useLayout } from '@/context/layout-provider'
import { useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useSidebar } from './ui/sidebar'

type ConfigDrawerContextValue = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const ConfigDrawerContext = createContext<ConfigDrawerContextValue | null>(null)

export function ConfigDrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <ConfigDrawerContext value={{ open, setOpen }}>
      {children}
      <ConfigDrawerSheet open={open} onOpenChange={setOpen} />
    </ConfigDrawerContext>
  )
}

export function ConfigDrawer() {
  const drawer = use(ConfigDrawerContext)

  if (!drawer) {
    return <StandaloneConfigDrawer />
  }

  return <ConfigDrawerButton onClick={() => drawer.setOpen(true)} />
}

function StandaloneConfigDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <ConfigDrawerButton />
      </SheetTrigger>
      <ConfigDrawerContent />
    </Sheet>
  )
}

function ConfigDrawerButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button
      size='icon'
      variant='ghost'
      aria-label='Open theme settings'
      className='rounded-full'
      onClick={onClick}
    >
      <Settings aria-hidden='true' />
    </Button>
  )
}

function ConfigDrawerSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <ConfigDrawerContent />
    </Sheet>
  )
}

function ConfigDrawerContent() {
  const { setOpen } = useSidebar()
  const { resetDir } = useDirection()
  const { resetTheme } = useTheme()
  const { resetLayout } = useLayout()

  const handleReset = () => {
    setOpen(true)
    resetDir()
    resetTheme()
    resetLayout()
  }

  return (
    <SheetContent className='flex flex-col'>
      <SheetHeader className='pb-0 text-start'>
        <SheetTitle>Theme Settings</SheetTitle>
        <SheetDescription>
          Adjust the appearance and layout to suit your preferences.
        </SheetDescription>
      </SheetHeader>
      <div className='space-y-6 overflow-y-auto px-4'>
        <ThemeConfig />
        <SidebarConfig />
        <LayoutConfig />
        <DirConfig />
      </div>
      <SheetFooter className='gap-2'>
        <Button
          variant='destructive'
          onClick={handleReset}
          aria-label='Reset all settings to default values'
        >
          Reset
        </Button>
      </SheetFooter>
    </SheetContent>
  )
}

function SectionTitle({
  title,
  showReset = false,
  onReset,
  resetAriaLabel,
  className,
}: {
  title: string
  showReset?: boolean
  onReset?: () => void
  /** Shown on the small per-section reset (RotateCcw) for accessibility and tests. */
  resetAriaLabel?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground',
        className
      )}
    >
      {title}
      {showReset && onReset && (
        <Button
          type='button'
          size='icon'
          variant='secondary'
          className='size-4 rounded-full'
          onClick={onReset}
          aria-label={resetAriaLabel}
        >
          <RotateCcw className='size-3' />
        </Button>
      )}
    </div>
  )
}

function RadioGroupItem({
  item,
  isTheme = false,
}: {
  item: {
    value: string
    label: string
    icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement
  }
  isTheme?: boolean
}) {
  return (
    <Item
      value={item.value}
      className={cn('group outline-none', 'transition duration-200 ease-in')}
      aria-label={`Select ${item.label.toLowerCase()}`}
      aria-describedby={`${item.value}-description`}
    >
      <div
        className={cn(
          'relative rounded-[6px] ring-[1px] ring-border',
          'group-data-[state=checked]:shadow-2xl group-data-[state=checked]:ring-primary',
          'group-focus-visible:ring-2'
        )}
        role='img'
        aria-hidden='false'
        aria-label={`${item.label} option preview`}
      >
        <CircleCheck
          className={cn(
            'size-6 fill-primary stroke-white',
            'group-data-[state=unchecked]:hidden',
            'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2'
          )}
          aria-hidden='true'
        />
        <item.icon
          className={cn(
            !isTheme &&
              'fill-primary stroke-primary group-data-[state=unchecked]:fill-muted-foreground group-data-[state=unchecked]:stroke-muted-foreground'
          )}
          aria-hidden='true'
        />
      </div>
      <div
        className='mt-1 text-xs'
        id={`${item.value}-description`}
        aria-live='polite'
      >
        {item.label}
      </div>
    </Item>
  )
}

function ThemeConfig() {
  const { defaultTheme, theme, setTheme } = useTheme()
  return (
    <div>
      <SectionTitle
        title='Theme'
        showReset={theme !== defaultTheme}
        onReset={() => setTheme(defaultTheme)}
        resetAriaLabel='Reset theme preference to default'
      />
      <Radio
        value={theme}
        onValueChange={setTheme}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label='Select theme preference'
        aria-describedby='theme-description'
      >
        {[
          {
            value: 'system',
            label: 'System',
            icon: IconThemeSystem,
          },
          {
            value: 'light',
            label: 'Light',
            icon: IconThemeLight,
          },
          {
            value: 'dark',
            label: 'Dark',
            icon: IconThemeDark,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} isTheme />
        ))}
      </Radio>
      <div id='theme-description' className='sr-only'>
        Choose between system preference, light mode, or dark mode
      </div>
    </div>
  )
}

function SidebarConfig() {
  const { defaultVariant, variant, setVariant } = useLayout()
  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title='Sidebar'
        showReset={defaultVariant !== variant}
        onReset={() => setVariant(defaultVariant)}
        resetAriaLabel='Reset sidebar style to default'
      />
      <Radio
        value={variant}
        onValueChange={setVariant}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label='Select sidebar style'
        aria-describedby='sidebar-description'
      >
        {[
          {
            value: 'inset',
            label: 'Inset',
            icon: IconSidebarInset,
          },
          {
            value: 'floating',
            label: 'Floating',
            icon: IconSidebarFloating,
          },
          {
            value: 'sidebar',
            label: 'Sidebar',
            icon: IconSidebarSidebar,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id='sidebar-description' className='sr-only'>
        Choose between inset, floating, or standard sidebar layout
      </div>
    </div>
  )
}

function LayoutConfig() {
  const { setOpen } = useSidebar()
  const {
    defaultCollapsible,
    defaultLayoutPreset,
    layoutPreset,
    setCollapsible,
    setLayoutPreset,
  } = useLayout()

  const applyLayoutPreset = (preset: LayoutPreset) => {
    setLayoutPreset(preset)

    if (preset === 'compact' || preset === 'slim-side') {
      setOpen(false)
      setCollapsible('icon')
      return
    }

    if (preset === 'full') {
      setOpen(false)
      setCollapsible('offcanvas')
      return
    }

    setOpen(true)
    setCollapsible(defaultCollapsible)
  }

  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title='Layout'
        showReset={layoutPreset !== defaultLayoutPreset}
        onReset={() => applyLayoutPreset(defaultLayoutPreset)}
        resetAriaLabel='Reset layout preset to default'
      />
      <Radio
        value={layoutPreset}
        onValueChange={(v) => applyLayoutPreset(v as LayoutPreset)}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label='Select layout preset'
        aria-describedby='layout-description'
      >
        {[
          {
            value: 'default',
            label: 'Default',
            icon: IconLayoutDefault,
          },
          {
            value: 'compact',
            label: 'Compact',
            icon: IconLayoutCompact,
          },
          {
            value: 'full',
            label: 'Full layout',
            icon: IconLayoutFull,
          },
          {
            value: 'top-side',
            label: 'Top side',
            icon: IconLayoutTopSide,
          },
          {
            value: 'top',
            label: 'Top',
            icon: IconLayoutTop,
          },
          {
            value: 'slim-side',
            label: 'Slim side',
            icon: IconLayoutSlimSide,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id='layout-description' className='sr-only'>
        Choose between side, compact, full-width, top-side, top, or slim side layouts
      </div>
    </div>
  )
}

function DirConfig() {
  const { defaultDir, dir, setDir } = useDirection()
  return (
    <div>
      <SectionTitle
        title='Direction'
        showReset={defaultDir !== dir}
        onReset={() => setDir(defaultDir)}
        resetAriaLabel='Reset text direction to default'
      />
      <Radio
        value={dir}
        onValueChange={setDir}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label='Select site direction'
        aria-describedby='direction-description'
      >
        {[
          {
            value: 'ltr',
            label: 'Left to Right',
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir='ltr' {...props} />
            ),
          },
          {
            value: 'rtl',
            label: 'Right to Left',
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir='rtl' {...props} />
            ),
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id='direction-description' className='sr-only'>
        Choose between left-to-right or right-to-left site direction
      </div>
    </div>
  )
}
