import {
  createContext,
  createMemo,
  createSignal,
  Match,
  mergeProps,
  onCleanup,
  onMount,
  Show,
  splitProps,
  Switch,
  useContext,
  type Accessor,
  type ComponentProps,
  type JSX,
  type ValidComponent,
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { cva, type VariantProps } from 'class-variance-authority'
import { PanelLeftIcon } from 'lucide-solid'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_MOBILE = '18rem'
const SIDEBAR_WIDTH_ICON = '3rem'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

type SidebarContextProps = {
  state: Accessor<'expanded' | 'collapsed'>
  open: Accessor<boolean>
  setOpen: (open: boolean) => void
  openMobile: Accessor<boolean>
  setOpenMobile: (open: boolean) => void
  isMobile: Accessor<boolean>
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextProps>()

function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }
  return context
}

function SidebarProvider(
  props: ComponentProps<'div'> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
) {
  const [local, others] = splitProps(props, [
    'defaultOpen',
    'open',
    'onOpenChange',
    'class',
    'style',
    'children',
  ])
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = createSignal(false)

  // This is the internal state of the sidebar.
  // We use open and onOpenChange for control from outside the component.
  const [_open, _setOpen] = createSignal(local.defaultOpen ?? true)
  const open = () => local.open ?? _open()
  const setOpen = (value: boolean) => {
    if (local.onOpenChange) {
      local.onOpenChange(value)
    } else {
      _setOpen(value)
    }
    // This sets the cookie to keep the sidebar state.
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }

  // Helper to toggle the sidebar.
  const toggleSidebar = () =>
    isMobile() ? setOpenMobile(!openMobile()) : setOpen(!open())

  // Adds a keyboard shortcut to toggle the sidebar.
  onMount(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    onCleanup(() => window.removeEventListener('keydown', handleKeyDown))
  })

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = createMemo(() => (open() ? 'expanded' : 'collapsed'))

  return (
    <SidebarContext.Provider
      value={{
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }}
    >
      <div
        data-slot='sidebar-wrapper'
        style={{
          '--sidebar-width': SIDEBAR_WIDTH,
          '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
          ...(typeof local.style === 'object' ? local.style : {}),
        }}
        class={cn(
          'group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar',
          local.class
        )}
        {...others}
      >
        {local.children}
      </div>
    </SidebarContext.Provider>
  )
}

function Sidebar(
  props: ComponentProps<'div'> & {
    side?: 'left' | 'right'
    variant?: 'sidebar' | 'floating' | 'inset'
    collapsible?: 'offcanvas' | 'icon' | 'none'
  }
) {
  const merged = mergeProps(
    { side: 'left', variant: 'sidebar', collapsible: 'offcanvas' } as const,
    props
  )
  const [local, others] = splitProps(merged, [
    'side',
    'variant',
    'collapsible',
    'class',
    'children',
  ])
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  return (
    <Switch>
      <Match when={local.collapsible === 'none'}>
        <div
          data-slot='sidebar'
          class={cn(
            'flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground',
            local.class
          )}
          {...others}
        >
          {local.children}
        </div>
      </Match>
      <Match when={isMobile()}>
        <Sheet open={openMobile()} onOpenChange={setOpenMobile}>
          <SheetContent
            data-sidebar='sidebar'
            data-slot='sidebar'
            data-mobile='true'
            class='w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden'
            style={{ '--sidebar-width': SIDEBAR_WIDTH_MOBILE }}
            side={local.side}
          >
            <SheetHeader class='sr-only'>
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Displays the mobile sidebar.</SheetDescription>
            </SheetHeader>
            <div class='flex h-full w-full flex-col'>{local.children}</div>
          </SheetContent>
        </Sheet>
      </Match>
      <Match when={true}>
        <div
          class='group peer hidden text-sidebar-foreground md:block'
          data-state={state()}
          data-collapsible={state() === 'collapsed' ? local.collapsible : ''}
          data-variant={local.variant}
          data-side={local.side}
          data-slot='sidebar'
        >
          {/* This is what handles the sidebar gap on desktop */}
          <div
            data-slot='sidebar-gap'
            class={cn(
              'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
              'group-data-[collapsible=offcanvas]:w-0',
              'group-data-[side=right]:rotate-180',
              local.variant === 'floating' || local.variant === 'inset'
                ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
                : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)'
            )}
          />
          <div
            data-slot='sidebar-container'
            class={cn(
              'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[inset-inline,width] duration-200 ease-linear md:flex',
              local.side === 'left'
                ? 'inset-s-0 group-data-[collapsible=offcanvas]:-inset-s-[calc(var(--sidebar-width))]'
                : 'inset-e-0 group-data-[collapsible=offcanvas]:-inset-e-[calc(var(--sidebar-width))]',
              // Adjust the padding for floating and inset variants.
              local.variant === 'floating' || local.variant === 'inset'
                ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
                : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-e group-data-[side=right]:border-s',
              local.class
            )}
            {...others}
          >
            <div
              data-sidebar='sidebar'
              data-slot='sidebar-inner'
              class='flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm'
            >
              {local.children}
            </div>
          </div>
        </div>
      </Match>
    </Switch>
  )
}

function SidebarTrigger(
  props: ComponentProps<'button'> & {
    variant?: 'ghost' | 'outline'
  }
) {
  const [local, others] = splitProps(props, ['class', 'onClick', 'variant'])
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      data-sidebar='trigger'
      data-slot='sidebar-trigger'
      variant={local.variant ?? 'ghost'}
      size='icon'
      class={cn('size-7', local.class)}
      onClick={(event: MouseEvent & { currentTarget: HTMLButtonElement }) => {
        if (typeof local.onClick === 'function')
          (local.onClick as (e: MouseEvent) => void)(event)
        toggleSidebar()
      }}
      {...others}
    >
      <PanelLeftIcon />
      <span class='sr-only'>Toggle Sidebar</span>
    </Button>
  )
}

function SidebarRail(props: ComponentProps<'button'>) {
  const [local, others] = splitProps(props, ['class'])
  const { toggleSidebar } = useSidebar()
  return (
    <button
      data-sidebar='rail'
      data-slot='sidebar-rail'
      aria-label='Toggle Sidebar'
      tabIndex={-1}
      onClick={toggleSidebar}
      title='Toggle Sidebar'
      class={cn(
        'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-inset-e-4 group-data-[side=right]:inset-s-0 after:absolute after:inset-y-0 after:inset-s-1/2 after:w-0.5 hover:after:bg-sidebar-border sm:flex',
        'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:start-full hover:group-data-[collapsible=offcanvas]:bg-sidebar',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-inset-e-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-inset-s-2',
        // RTL support
        'rtl:translate-x-1/2',
        'rtl:in-data-[side=left]:cursor-e-resize rtl:in-data-[side=right]:cursor-w-resize',
        'rtl:[[data-side=left][data-state=collapsed]_&]:cursor-w-resize rtl:[[data-side=right][data-state=collapsed]_&]:cursor-e-resize',
        local.class
      )}
      {...others}
    />
  )
}

function SidebarInset(props: ComponentProps<'div'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <div
      data-slot='sidebar-inset'
      class={cn(
        'relative flex w-full flex-1 flex-col bg-background',
        'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-2',
        local.class
      )}
      {...others}
    />
  )
}

function SidebarInput(props: ComponentProps<typeof Input>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <Input
      data-slot='sidebar-input'
      data-sidebar='input'
      class={cn('h-8 w-full bg-background shadow-none', local.class)}
      {...others}
    />
  )
}

function simpleDiv(slot: string, base: string) {
  return (props: ComponentProps<'div'>) => {
    const [local, others] = splitProps(props, ['class'])
    return (
      <div
        data-slot={`sidebar-${slot}`}
        data-sidebar={slot}
        class={cn(base, local.class)}
        {...others}
      />
    )
  }
}

const SidebarHeader = simpleDiv('header', 'flex flex-col gap-2 p-2')
const SidebarFooter = simpleDiv('footer', 'flex flex-col gap-2 p-2')
const SidebarContent = simpleDiv(
  'content',
  'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden'
)
const SidebarGroup = simpleDiv(
  'group',
  'relative flex w-full min-w-0 flex-col p-2'
)
const SidebarGroupContent = simpleDiv('group-content', 'w-full text-sm')
const SidebarGroupLabel = simpleDiv(
  'group-label',
  'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0'
)

function SidebarSeparator(props: ComponentProps<typeof Separator>) {
  const [local, others] = splitProps(props as { class?: string }, ['class'])
  return (
    <Separator
      data-slot='sidebar-separator'
      data-sidebar='separator'
      class={cn('mx-2 w-auto bg-sidebar-border', local.class)}
      {...others}
    />
  )
}

function SidebarGroupAction(props: ComponentProps<'button'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <button
      data-slot='sidebar-group-action'
      data-sidebar='group-action'
      class={cn(
        'absolute inset-e-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 md:after:hidden',
        'group-data-[collapsible=icon]:hidden',
        local.class
      )}
      {...others}
    />
  )
}

function SidebarMenu(props: ComponentProps<'ul'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <ul
      data-slot='sidebar-menu'
      data-sidebar='menu'
      class={cn('flex w-full min-w-0 flex-col gap-1', local.class)}
      {...others}
    />
  )
}

function SidebarMenuItem(props: ComponentProps<'li'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <li
      data-slot='sidebar-menu-item'
      data-sidebar='menu-item'
      class={cn('group/menu-item relative', local.class)}
      {...others}
    />
  )
}

const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pe-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-expanded:hover:bg-sidebar-accent data-expanded:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type SidebarMenuButtonProps = {
  as?: ValidComponent
  isActive?: boolean
  tooltip?: string
  class?: string
  children?: JSX.Element
  [key: string]: any
} & VariantProps<typeof sidebarMenuButtonVariants>

/**
 * Polymorphic menu button. Use `as={Link}` instead of Radix's `asChild`.
 * It can also be passed as `as` to Kobalte triggers.
 */
function SidebarMenuButton(props: SidebarMenuButtonProps) {
  const [local, others] = splitProps(props, [
    'as',
    'isActive',
    'variant',
    'size',
    'tooltip',
    'class',
  ])
  const { isMobile, state } = useSidebar()

  const button = (extra: Record<string, unknown> = {}) => (
    <Dynamic
      component={local.as ?? 'button'}
      data-slot='sidebar-menu-button'
      data-sidebar='menu-button'
      data-size={local.size ?? 'default'}
      data-active={local.isActive ?? false}
      class={cn(
        sidebarMenuButtonVariants({ variant: local.variant, size: local.size }),
        local.class
      )}
      {...others}
      {...extra}
    />
  )

  return (
    <Show when={local.tooltip} fallback={button()}>
      <Tooltip placement='right'>
        <TooltipTrigger as={(p: Record<string, unknown>) => button(p)} />
        <Show when={state() === 'collapsed' && !isMobile()}>
          <TooltipContent>{local.tooltip}</TooltipContent>
        </Show>
      </Tooltip>
    </Show>
  )
}

function SidebarMenuAction(
  props: ComponentProps<'button'> & { showOnHover?: boolean }
) {
  const [local, others] = splitProps(props, ['class', 'showOnHover'])
  return (
    <button
      data-slot='sidebar-menu-action'
      data-sidebar='menu-action'
      class={cn(
        'absolute inset-e-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 md:after:hidden',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        local.showOnHover &&
          'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground data-expanded:opacity-100 md:opacity-0',
        local.class
      )}
      {...others}
    />
  )
}

function SidebarMenuBadge(props: ComponentProps<'div'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <div
      data-slot='sidebar-menu-badge'
      data-sidebar='menu-badge'
      class={cn(
        'pointer-events-none absolute inset-e-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none',
        'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        local.class
      )}
      {...others}
    />
  )
}

function SidebarMenuSkeleton(
  props: ComponentProps<'div'> & { showIcon?: boolean }
) {
  const [local, others] = splitProps(props, ['class', 'showIcon'])
  // Random width between 50 to 90%.
  const width = `${Math.floor(Math.random() * 40) + 50}%`
  return (
    <div
      data-slot='sidebar-menu-skeleton'
      data-sidebar='menu-skeleton'
      class={cn('flex h-8 items-center gap-2 rounded-md px-2', local.class)}
      {...others}
    >
      <Show when={local.showIcon}>
        <Skeleton class='size-4 rounded-md' data-sidebar='menu-skeleton-icon' />
      </Show>
      <Skeleton
        class='h-4 max-w-(--skeleton-width) flex-1'
        data-sidebar='menu-skeleton-text'
        style={{ '--skeleton-width': width }}
      />
    </div>
  )
}

function SidebarMenuSub(props: ComponentProps<'ul'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <ul
      data-slot='sidebar-menu-sub'
      data-sidebar='menu-sub'
      class={cn(
        'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-s border-sidebar-border px-2.5 py-0.5',
        'group-data-[collapsible=icon]:hidden',
        local.class
      )}
      {...others}
    />
  )
}

function SidebarMenuSubItem(props: ComponentProps<'li'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <li
      data-slot='sidebar-menu-sub-item'
      data-sidebar='menu-sub-item'
      class={cn('group/menu-sub-item relative', local.class)}
      {...others}
    />
  )
}

function SidebarMenuSubButton(props: {
  as?: ValidComponent
  size?: 'sm' | 'md'
  isActive?: boolean
  class?: string
  children?: JSX.Element
  [key: string]: any
}) {
  const [local, others] = splitProps(props, ['as', 'size', 'isActive', 'class'])
  const size = () => local.size ?? 'md'
  return (
    <Dynamic
      component={local.as ?? 'a'}
      data-slot='sidebar-menu-sub-button'
      data-sidebar='menu-sub-button'
      data-size={size()}
      data-active={local.isActive ?? false}
      class={cn(
        'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-inherit',
        'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
        size() === 'sm' && 'text-xs',
        size() === 'md' && 'text-sm',
        'group-data-[collapsible=icon]:hidden',
        local.class
      )}
      {...others}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
