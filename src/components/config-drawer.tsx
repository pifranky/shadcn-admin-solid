import { For, Show, type Component, type ComponentProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import * as RadioGroupPrimitive from '@kobalte/core/radio-group'
import { CircleCheck, RotateCcw, Settings } from 'lucide-solid'
import { IconDir } from '@/assets/custom/icon-dir'
import { IconLayoutCompact } from '@/assets/custom/icon-layout-compact'
import { IconLayoutDefault } from '@/assets/custom/icon-layout-default'
import { IconLayoutFull } from '@/assets/custom/icon-layout-full'
import { IconSidebarFloating } from '@/assets/custom/icon-sidebar-floating'
import { IconSidebarInset } from '@/assets/custom/icon-sidebar-inset'
import { IconSidebarSidebar } from '@/assets/custom/icon-sidebar-sidebar'
import { IconThemeDark } from '@/assets/custom/icon-theme-dark'
import { IconThemeLight } from '@/assets/custom/icon-theme-light'
import { IconThemeSystem } from '@/assets/custom/icon-theme-system'
import { cn } from '@/lib/utils'
import { type Direction, useDirection } from '@/context/direction-provider'
import { type Collapsible, useLayout } from '@/context/layout-provider'
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

type RadioOption = {
  value: string
  label: string
  icon: Component<ComponentProps<'svg'>>
}

export function ConfigDrawer() {
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
    <Sheet>
      <SheetTrigger
        as={Button}
        size='icon'
        variant='ghost'
        aria-label='Open theme settings'
        class='rounded-full'
      >
        <Settings aria-hidden='true' />
      </SheetTrigger>
      <SheetContent class='flex flex-col'>
        <SheetHeader class='pb-0 text-start'>
          <SheetTitle>Theme Settings</SheetTitle>
          <SheetDescription>
            Adjust the appearance and layout to suit your preferences.
          </SheetDescription>
        </SheetHeader>
        <div class='space-y-6 overflow-y-auto px-4'>
          <ThemeConfig />
          <SidebarConfig />
          <LayoutConfig />
          <DirConfig />
        </div>
        <SheetFooter class='gap-2'>
          <Button
            variant='destructive'
            onClick={handleReset}
            aria-label='Reset all settings to default values'
          >
            Reset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function SectionTitle(props: {
  title: string
  showReset?: boolean
  onReset?: () => void
  /** Shown on the small per-section reset (RotateCcw) for accessibility and tests. */
  resetAriaLabel?: string
  class?: string
}) {
  return (
    <div
      class={cn(
        'mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground',
        props.class
      )}
    >
      {props.title}
      <Show when={props.showReset && props.onReset}>
        <Button
          type='button'
          size='icon'
          variant='secondary'
          class='size-4 rounded-full'
          onClick={() => props.onReset?.()}
          aria-label={props.resetAriaLabel}
        >
          <RotateCcw class='size-3' />
        </Button>
      </Show>
    </div>
  )
}

function RadioGroupItem(props: { item: RadioOption; isTheme?: boolean }) {
  return (
    <RadioGroupPrimitive.Item
      as='label'
      value={props.item.value}
      class={cn(
        'group cursor-pointer outline-none',
        'transition duration-200 ease-in'
      )}
      aria-label={`Select ${props.item.label.toLowerCase()}`}
      aria-describedby={`${props.item.value}-description`}
    >
      <RadioGroupPrimitive.ItemInput class='peer' />
      <RadioGroupPrimitive.ItemControl
        class={cn(
          'relative rounded-[6px] ring-[1px] ring-border',
          'data-checked:shadow-2xl data-checked:ring-primary',
          'peer-focus-visible:ring-2'
        )}
        role='img'
        aria-hidden='false'
        aria-label={`${props.item.label} option preview`}
      >
        <CircleCheck
          class={cn(
            'size-6 fill-primary stroke-white',
            'hidden group-data-checked:block',
            'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2'
          )}
          aria-hidden='true'
        />
        <Dynamic
          component={props.item.icon}
          class={cn(
            !props.isTheme &&
              'fill-muted-foreground stroke-muted-foreground group-data-checked:fill-primary group-data-checked:stroke-primary'
          )}
          aria-hidden='true'
        />
      </RadioGroupPrimitive.ItemControl>
      <div
        class='mt-1 text-xs'
        id={`${props.item.value}-description`}
        aria-live='polite'
      >
        {props.item.label}
      </div>
    </RadioGroupPrimitive.Item>
  )
}

function OptionsRadio(props: {
  value: string
  onChange: (value: string) => void
  items: RadioOption[]
  isTheme?: boolean
  'aria-label': string
  'aria-describedby': string
}) {
  return (
    <RadioGroupPrimitive.Root
      value={props.value}
      onChange={props.onChange}
      class='grid w-full max-w-md grid-cols-3 gap-4'
      aria-label={props['aria-label']}
      aria-describedby={props['aria-describedby']}
    >
      <For each={props.items}>
        {(item) => <RadioGroupItem item={item} isTheme={props.isTheme} />}
      </For>
    </RadioGroupPrimitive.Root>
  )
}

function ThemeConfig() {
  const { defaultTheme, theme, setTheme } = useTheme()
  return (
    <div>
      <SectionTitle
        title='Theme'
        showReset={theme() !== defaultTheme}
        onReset={() => setTheme(defaultTheme)}
        resetAriaLabel='Reset theme preference to default'
      />
      <OptionsRadio
        value={theme()}
        onChange={(v) => setTheme(v as typeof defaultTheme)}
        aria-label='Select theme preference'
        aria-describedby='theme-description'
        isTheme
        items={[
          { value: 'system', label: 'System', icon: IconThemeSystem },
          { value: 'light', label: 'Light', icon: IconThemeLight },
          { value: 'dark', label: 'Dark', icon: IconThemeDark },
        ]}
      />
      <div id='theme-description' class='sr-only'>
        Choose between system preference, light mode, or dark mode
      </div>
    </div>
  )
}

function SidebarConfig() {
  const { defaultVariant, variant, setVariant } = useLayout()
  return (
    <div class='max-md:hidden'>
      <SectionTitle
        title='Sidebar'
        showReset={defaultVariant !== variant()}
        onReset={() => setVariant(defaultVariant)}
        resetAriaLabel='Reset sidebar style to default'
      />
      <OptionsRadio
        value={variant()}
        onChange={(v) => setVariant(v as typeof defaultVariant)}
        aria-label='Select sidebar style'
        aria-describedby='sidebar-description'
        items={[
          { value: 'inset', label: 'Inset', icon: IconSidebarInset },
          { value: 'floating', label: 'Floating', icon: IconSidebarFloating },
          { value: 'sidebar', label: 'Sidebar', icon: IconSidebarSidebar },
        ]}
      />
      <div id='sidebar-description' class='sr-only'>
        Choose between inset, floating, or standard sidebar layout
      </div>
    </div>
  )
}

function LayoutConfig() {
  const { open, setOpen } = useSidebar()
  const { defaultCollapsible, collapsible, setCollapsible } = useLayout()

  const radioState = () => (open() ? 'default' : collapsible())

  return (
    <div class='max-md:hidden'>
      <SectionTitle
        title='Layout'
        showReset={radioState() !== 'default'}
        onReset={() => {
          setOpen(true)
          setCollapsible(defaultCollapsible)
        }}
        resetAriaLabel='Reset layout options to default'
      />
      <OptionsRadio
        value={radioState()}
        onChange={(v) => {
          if (v === 'default') {
            setOpen(true)
            return
          }
          setOpen(false)
          setCollapsible(v as Collapsible)
        }}
        aria-label='Select layout style'
        aria-describedby='layout-description'
        items={[
          { value: 'default', label: 'Default', icon: IconLayoutDefault },
          { value: 'icon', label: 'Compact', icon: IconLayoutCompact },
          { value: 'offcanvas', label: 'Full layout', icon: IconLayoutFull },
        ]}
      />
      <div id='layout-description' class='sr-only'>
        Choose between default expanded, compact icon-only, or full layout mode
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
        showReset={defaultDir !== dir()}
        onReset={() => setDir(defaultDir)}
        resetAriaLabel='Reset text direction to default'
      />
      <OptionsRadio
        value={dir()}
        onChange={(v) => setDir(v as Direction)}
        aria-label='Select site direction'
        aria-describedby='direction-description'
        items={[
          {
            value: 'ltr',
            label: 'Left to Right',
            icon: (props) => <IconDir dir='ltr' {...props} />,
          },
          {
            value: 'rtl',
            label: 'Right to Left',
            icon: (props) => <IconDir dir='rtl' {...props} />,
          },
        ]}
      />
      <div id='direction-description' class='sr-only'>
        Choose between left-to-right or right-to-left site direction
      </div>
    </div>
  )
}
