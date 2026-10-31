import { splitProps, type ValidComponent } from 'solid-js'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import * as SeparatorPrimitive from '@kobalte/core/separator'
import { cn } from '@/lib/utils'

type SeparatorProps<T extends ValidComponent = 'hr'> =
  SeparatorPrimitive.SeparatorRootProps<T> & { class?: string | undefined }

function Separator<T extends ValidComponent = 'hr'>(
  props: PolymorphicProps<T, SeparatorProps<T>>
) {
  const [local, others] = splitProps(props as SeparatorProps, [
    'class',
    'orientation',
  ])
  return (
    <SeparatorPrimitive.Root
      data-slot='separator'
      orientation={local.orientation ?? 'horizontal'}
      class={cn(
        'shrink-0 border-none bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch',
        local.class
      )}
      {...others}
    />
  )
}

export { Separator }
