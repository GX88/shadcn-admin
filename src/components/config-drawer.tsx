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
import { getLayoutPresetConfig } from '@/context/layout-config'
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
import { useTranslation } from 'react-i18next'
import { locales } from '@/i18n/types'

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
  const { t } = useTranslation()

  const handleReset = () => {
    setOpen(true)
    resetDir()
    resetTheme()
    resetLayout()
  }

  return (
    <SheetContent className='flex flex-col'>
      <SheetHeader className='pb-0 text-start'>
        <SheetTitle>{t('config.themeSettings')}</SheetTitle>
        <SheetDescription>
          {t('config.adjustAppearance') || 'Adjust the appearance and layout to suit your preferences.'}
        </SheetDescription>
      </SheetHeader>
      <div className='min-h-0 flex-1 space-y-6 overflow-y-auto px-4'>
        <ThemeConfig />
        <SidebarConfig />
        <LayoutConfig />
        <DirConfig />
        <LanguageConfig />
      </div>
      <SheetFooter className='gap-2'>
        <Button
          variant='destructive'
          onClick={handleReset}
          aria-label='Reset all settings to default values'
        >
          {t('config.reset')}
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
  const { t } = useTranslation()
  return (
    <div>
      <SectionTitle
        title={t('config.theme')}
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
            label: t('config.system'),
            icon: IconThemeSystem,
          },
          {
            value: 'light',
            label: t('config.light'),
            icon: IconThemeLight,
          },
          {
            value: 'dark',
            label: t('config.dark'),
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
  const { t } = useTranslation()
  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title={t('config.sidebar')}
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
            label: t('config.inset'),
            icon: IconSidebarInset,
          },
          {
            value: 'floating',
            label: t('config.floating'),
            icon: IconSidebarFloating,
          },
          {
            value: 'sidebar',
            label: t('config.sidebar'),
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
    defaultLayoutPreset,
    layoutPreset,
    setCollapsible,
    setLayoutPreset,
  } = useLayout()
  const { t } = useTranslation()

  const applyLayoutPreset = (preset: LayoutPreset) => {
    const layoutConfig = getLayoutPresetConfig(preset)

    setLayoutPreset(preset)
    setOpen(layoutConfig.sidebarState.open ?? true)
    setCollapsible(layoutConfig.sidebarState.collapsible ?? 'icon')
  }

  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title={t('config.layout')}
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
            label: t('config.default'),
            icon: IconLayoutDefault,
          },
          {
            value: 'compact',
            label: t('config.compact'),
            icon: IconLayoutCompact,
          },
          {
            value: 'full',
            label: t('config.full'),
            icon: IconLayoutFull,
          },
          {
            value: 'top-side',
            label: t('config.topSide'),
            icon: IconLayoutTopSide,
          },
          {
            value: 'top',
            label: t('config.top'),
            icon: IconLayoutTop,
          },
          {
            value: 'slim-side',
            label: t('config.slimSide'),
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
  const { t } = useTranslation()
  return (
    <div>
      <SectionTitle
        title={t('config.direction')}
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
            label: t('config.ltr'),
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir='ltr' {...props} />
            ),
          },
          {
            value: 'rtl',
            label: t('config.rtl'),
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

function LanguageIcon({ lang }: { lang: string }) {
  return (
    <div className='flex items-center justify-center text-2xl'>
      {lang === 'en' && '🇺🇸'}
      {lang === 'zh' && '🇨🇳'}
      {lang === 'ar' && '🇸🇦'}
    </div>
  )
}

function LanguageConfig() {
  const { t, i18n } = useTranslation()

  return (
    <div>
      <SectionTitle title={t('config.language')} showReset={false} />
      <Radio
        value={i18n.language}
        onValueChange={(lang) => i18n.changeLanguage(lang)}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label='Select language'
      >
        {locales.map((item) => (
          <RadioGroupItem
            key={item.code}
            item={{
              value: item.code,
              label: item.name,
              icon: () => <LanguageIcon lang={item.code} />,
            }}
          />
        ))}
      </Radio>
    </div>
  )
}
