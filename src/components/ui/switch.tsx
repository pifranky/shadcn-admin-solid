import { splitProps, type ValidComponent } from 'solid-js'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import * as SwitchPrimitive from '@kobalte/core/switch'
import { cn } from '@/lib/utils'

type SwitchProps<T extends ValidComponent = 'div'> =
  SwitchPrimitive.SwitchRootProps<T> & {
    class?: string | undefined
    id?: string
    'aria-readonly'?: boolean
  }

function Switch<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, SwitchProps<T>>
) {
  const [local, others] = splitProps(props as SwitchProps, ['class', 'id'])
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      class={cn('inline-flex items-center', local.class)}
      {...others}
    >
      <SwitchPrimitive.Input id={local.id} class='peer' />
      <SwitchPrimitive.Control class='inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent bg-input shadow-xs transition-all outline-none peer-focus-visible:border-ring peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50 data-checked:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-50 dark:bg-input/80 dark:data-checked:bg-primary'>
        <SwitchPrimitive.Thumb class='pointer-events-none block size-4 translate-x-0 rounded-full bg-background ring-0 transition-transform data-checked:translate-x-[calc(100%-2px)] rtl:data-checked:-translate-x-[calc(100%-2px)] dark:bg-foreground dark:data-checked:bg-primary-foreground' />
      </SwitchPrimitive.Control>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
