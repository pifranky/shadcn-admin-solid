import {
  splitProps,
  type ComponentProps,
  type JSX,
  type ValidComponent,
} from 'solid-js'
import * as DropdownMenuPrimitive from '@kobalte/core/dropdown-menu'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-solid'
import { cn } from '@/lib/utils'

/**
 * Kobalte positions menus via `placement` / `gutter` on the root
 * (Radix used `side` / `align` / `sideOffset` on the content).
 */
const DropdownMenu = (props: DropdownMenuPrimitive.DropdownMenuRootProps) => (
  <DropdownMenuPrimitive.Root gutter={4} {...props} />
)
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

type DropdownMenuContentProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitive.DropdownMenuContentProps<T> & {
    class?: string | undefined
    children?: JSX.Element
  }

function DropdownMenuContent<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuContentProps<T>>
) {
  const [local, others] = splitProps(props as DropdownMenuContentProps, [
    'class',
  ])
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot='dropdown-menu-content'
        class={cn(
          'z-50 max-h-(--kb-popper-content-available-height) min-w-32 origin-(--kb-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:animate-in data-expanded:fade-in-0 data-expanded:zoom-in-95',
          local.class
        )}
        {...others}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

const itemClass =
  "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:ps-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!"

type DropdownMenuItemProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitive.DropdownMenuItemProps<T> & {
    class?: string | undefined
    inset?: boolean
    variant?: 'default' | 'destructive'
  }

function DropdownMenuItem<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuItemProps<T>>
) {
  const [local, others] = splitProps(props as DropdownMenuItemProps, [
    'class',
    'inset',
    'variant',
  ])
  return (
    <DropdownMenuPrimitive.Item
      data-slot='dropdown-menu-item'
      data-inset={local.inset ? '' : undefined}
      data-variant={local.variant ?? 'default'}
      class={cn(itemClass, local.class)}
      {...others}
    />
  )
}

type DropdownMenuCheckboxItemProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitive.DropdownMenuCheckboxItemProps<T> & {
    class?: string | undefined
    children?: JSX.Element
  }

function DropdownMenuCheckboxItem<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuCheckboxItemProps<T>>
) {
  const [local, others] = splitProps(props as DropdownMenuCheckboxItemProps, [
    'class',
    'children',
  ])
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot='dropdown-menu-checkbox-item'
      class={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 ps-8 pe-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        local.class
      )}
      {...others}
    >
      <span class='pointer-events-none absolute inset-s-2 flex size-3.5 items-center justify-center'>
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon class='size-4' />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {local.children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

type DropdownMenuRadioItemProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitive.DropdownMenuRadioItemProps<T> & {
    class?: string | undefined
    children?: JSX.Element
  }

function DropdownMenuRadioItem<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuRadioItemProps<T>>
) {
  const [local, others] = splitProps(props as DropdownMenuRadioItemProps, [
    'class',
    'children',
  ])
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot='dropdown-menu-radio-item'
      class={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 ps-8 pe-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        local.class
      )}
      {...others}
    >
      <span class='pointer-events-none absolute inset-s-2 flex size-3.5 items-center justify-center'>
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon class='size-2 fill-current' />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {local.children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

type DropdownMenuLabelProps<T extends ValidComponent = 'span'> =
  DropdownMenuPrimitive.DropdownMenuGroupLabelProps<T> & {
    class?: string | undefined
    inset?: boolean
  }

/** A plain label (Kobalte's GroupLabel must live inside a Group). */
function DropdownMenuLabel(props: ComponentProps<'div'> & { inset?: boolean }) {
  const [local, others] = splitProps(props, ['class', 'inset'])
  return (
    <div
      data-slot='dropdown-menu-label'
      data-inset={local.inset ? '' : undefined}
      class={cn('px-2 py-1.5 text-sm font-medium data-inset:ps-8', local.class)}
      {...others}
    />
  )
}

function DropdownMenuGroupLabel<T extends ValidComponent = 'span'>(
  props: PolymorphicProps<T, DropdownMenuLabelProps<T>>
) {
  const [local, others] = splitProps(props as DropdownMenuLabelProps, [
    'class',
    'inset',
  ])
  return (
    <DropdownMenuPrimitive.GroupLabel
      data-slot='dropdown-menu-label'
      class={cn(
        'block px-2 py-1.5 text-sm font-medium',
        local.inset && 'ps-8',
        local.class
      )}
      {...others}
    />
  )
}

type DropdownMenuSeparatorProps<T extends ValidComponent = 'hr'> =
  DropdownMenuPrimitive.DropdownMenuSeparatorProps<T> & {
    class?: string | undefined
  }

function DropdownMenuSeparator<T extends ValidComponent = 'hr'>(
  props: PolymorphicProps<T, DropdownMenuSeparatorProps<T>>
) {
  const [local, others] = splitProps(props as DropdownMenuSeparatorProps, [
    'class',
  ])
  return (
    <DropdownMenuPrimitive.Separator
      data-slot='dropdown-menu-separator'
      class={cn('-mx-1 my-1 h-px border-none bg-border', local.class)}
      {...others}
    />
  )
}

function DropdownMenuShortcut(props: ComponentProps<'span'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <span
      data-slot='dropdown-menu-shortcut'
      class={cn(
        'ms-auto text-xs tracking-widest text-muted-foreground',
        local.class
      )}
      {...others}
    />
  )
}

type DropdownMenuSubTriggerProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitive.DropdownMenuSubTriggerProps<T> & {
    class?: string | undefined
    children?: JSX.Element
    inset?: boolean
  }

function DropdownMenuSubTrigger<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuSubTriggerProps<T>>
) {
  const [local, others] = splitProps(props as DropdownMenuSubTriggerProps, [
    'class',
    'children',
    'inset',
  ])
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot='dropdown-menu-sub-trigger'
      class={cn(
        'flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-expanded:bg-accent data-expanded:text-accent-foreground data-highlighted:bg-accent [&_svg]:size-4 [&_svg:not([class*="text-"])]:text-muted-foreground',
        local.inset && 'ps-8',
        local.class
      )}
      {...others}
    >
      {local.children}
      <ChevronRightIcon class='ms-auto size-4 rtl:rotate-180' />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

type DropdownMenuSubContentProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitive.DropdownMenuSubContentProps<T> & {
    class?: string | undefined
  }

function DropdownMenuSubContent<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuSubContentProps<T>>
) {
  const [local, others] = splitProps(props as DropdownMenuSubContentProps, [
    'class',
  ])
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        data-slot='dropdown-menu-sub-content'
        class={cn(
          'z-50 min-w-32 origin-(--kb-menu-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg outline-none data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:animate-in data-expanded:fade-in-0 data-expanded:zoom-in-95',
          local.class
        )}
        {...others}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
