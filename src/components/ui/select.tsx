import { splitProps, type JSX, type ValidComponent } from 'solid-js'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import * as SelectPrimitive from '@kobalte/core/select'
import { CheckIcon, ChevronDownIcon } from 'lucide-solid'
import { cn } from '@/lib/utils'

/**
 * Kobalte's Select is data-driven: pass `options`, `itemComponent`
 * and render the trigger/value/content. See `SelectDropdown` for a
 * ready-made `{ label, value }` helper.
 */
const Select = SelectPrimitive.Root
const SelectValue = SelectPrimitive.Value
const SelectHiddenSelect = SelectPrimitive.HiddenSelect

type SelectTriggerProps<T extends ValidComponent = 'button'> =
  SelectPrimitive.SelectTriggerProps<T> & {
    class?: string | undefined
    children?: JSX.Element
    size?: 'sm' | 'default'
  }

function SelectTrigger<T extends ValidComponent = 'button'>(
  props: PolymorphicProps<T, SelectTriggerProps<T>>
) {
  const [local, others] = splitProps(props as SelectTriggerProps, [
    'class',
    'children',
    'size',
  ])
  return (
    <SelectPrimitive.Trigger
      data-slot='select-trigger'
      data-size={local.size ?? 'default'}
      class={cn(
        "flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-invalid:border-destructive data-placeholder-shown:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        local.class
      )}
      {...others}
    >
      {local.children}
      <SelectPrimitive.Icon as={ChevronDownIcon} class='size-4 opacity-50' />
    </SelectPrimitive.Trigger>
  )
}

type SelectContentProps<T extends ValidComponent = 'div'> =
  SelectPrimitive.SelectContentProps<T> & { class?: string | undefined }

function SelectContent<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, SelectContentProps<T>>
) {
  const [local, others] = splitProps(props as SelectContentProps, ['class'])
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot='select-content'
        class={cn(
          'relative z-50 max-h-(--kb-popper-content-available-height) min-w-32 origin-(--kb-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:animate-in data-expanded:fade-in-0 data-expanded:zoom-in-95',
          local.class
        )}
        {...others}
      >
        <SelectPrimitive.Listbox class='w-full min-w-(--kb-popper-anchor-width) scroll-my-1 p-1 outline-none' />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

type SelectItemProps<T extends ValidComponent = 'li'> =
  SelectPrimitive.SelectItemProps<T> & {
    class?: string | undefined
    children?: JSX.Element
  }

function SelectItem<T extends ValidComponent = 'li'>(
  props: PolymorphicProps<T, SelectItemProps<T>>
) {
  const [local, others] = splitProps(props as SelectItemProps, [
    'class',
    'children',
  ])
  return (
    <SelectPrimitive.Item
      data-slot='select-item'
      class={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 ps-2 pe-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        local.class
      )}
      {...others}
    >
      <SelectPrimitive.ItemIndicator class='absolute inset-e-2 flex size-3.5 items-center justify-center'>
        <CheckIcon class='size-4' />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemLabel class='flex items-center gap-2'>
        {local.children}
      </SelectPrimitive.ItemLabel>
    </SelectPrimitive.Item>
  )
}

export {
  Select,
  SelectValue,
  SelectHiddenSelect,
  SelectTrigger,
  SelectContent,
  SelectItem,
}
