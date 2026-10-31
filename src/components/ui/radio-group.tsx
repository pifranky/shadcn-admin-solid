import { splitProps, type JSX, type ValidComponent } from 'solid-js'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import * as RadioGroupPrimitive from '@kobalte/core/radio-group'
import { cn } from '@/lib/utils'

type RadioGroupProps<T extends ValidComponent = 'div'> =
  RadioGroupPrimitive.RadioGroupRootProps<T> & { class?: string | undefined }

function RadioGroup<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, RadioGroupProps<T>>
) {
  const [local, others] = splitProps(props as RadioGroupProps, ['class'])
  return (
    <RadioGroupPrimitive.Root
      data-slot='radio-group'
      class={cn('grid gap-3', local.class)}
      {...others}
    />
  )
}

type RadioGroupItemProps<T extends ValidComponent = 'div'> =
  RadioGroupPrimitive.RadioGroupItemProps<T> & {
    class?: string | undefined
    children?: JSX.Element
  }

/** A radio item with an optional label rendered next to the indicator. */
function RadioGroupItem<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, RadioGroupItemProps<T>>
) {
  const [local, others] = splitProps(props as RadioGroupItemProps, [
    'class',
    'children',
  ])
  return (
    <RadioGroupPrimitive.Item
      data-slot='radio-group-item'
      class={cn('flex items-center gap-3', local.class)}
      {...others}
    >
      <RadioGroupPrimitive.ItemInput class='peer' />
      <RadioGroupPrimitive.ItemControl class='relative flex aspect-square size-4 shrink-0 items-center justify-center rounded-full border border-input text-primary shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:border-ring peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-invalid:border-destructive dark:bg-input/30'>
        <RadioGroupPrimitive.ItemIndicator class='absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary' />
      </RadioGroupPrimitive.ItemControl>
      {local.children}
    </RadioGroupPrimitive.Item>
  )
}

const RadioGroupItemLabel = RadioGroupPrimitive.ItemLabel

export { RadioGroup, RadioGroupItem, RadioGroupItemLabel }
