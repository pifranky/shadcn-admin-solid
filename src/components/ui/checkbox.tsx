import { Match, Switch, splitProps, type ValidComponent } from 'solid-js'
import * as CheckboxPrimitive from '@kobalte/core/checkbox'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import { CheckIcon, MinusIcon } from 'lucide-solid'
import { cn } from '@/lib/utils'

type CheckboxProps<T extends ValidComponent = 'div'> =
  CheckboxPrimitive.CheckboxRootProps<T> & {
    class?: string | undefined
    id?: string
    'aria-label'?: string
  }

function Checkbox<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, CheckboxProps<T>>
) {
  const [local, others] = splitProps(props as CheckboxProps, [
    'class',
    'id',
    'aria-label',
  ])
  return (
    <CheckboxPrimitive.Root
      data-slot='checkbox'
      class={cn('group/checkbox items-top flex', local.class)}
      {...others}
    >
      <CheckboxPrimitive.Input
        id={local.id}
        aria-label={local['aria-label']}
        class='peer'
      />
      <CheckboxPrimitive.Control class='peer flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input shadow-xs transition-shadow outline-none peer-focus-visible:border-ring peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-disabled:cursor-not-allowed data-disabled:opacity-50 data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground data-invalid:border-destructive dark:bg-input/30 dark:data-checked:bg-primary'>
        <CheckboxPrimitive.Indicator class='flex items-center justify-center text-current transition-none'>
          <Switch>
            <Match when={!others.indeterminate}>
              <CheckIcon class='size-3.5' />
            </Match>
            <Match when={others.indeterminate}>
              <MinusIcon class='size-3.5' />
            </Match>
          </Switch>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Control>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
