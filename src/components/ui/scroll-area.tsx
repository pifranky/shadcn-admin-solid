import { splitProps, type ComponentProps } from 'solid-js'
import { cn } from '@/lib/utils'

/**
 * Lightweight scroll container. Radix ScrollArea has no Kobalte equivalent,
 * so we rely on native (thin, themed) scrollbars instead.
 */
function ScrollArea(
  props: ComponentProps<'div'> & {
    orientation?: 'vertical' | 'horizontal'
    type?: 'auto' | 'always' | 'scroll' | 'hover'
  }
) {
  const [local, others] = splitProps(props, [
    'class',
    'orientation',
    'type',
    'children',
  ])
  return (
    <div
      data-slot='scroll-area'
      class={cn(
        'relative',
        local.orientation === 'horizontal'
          ? 'overflow-x-auto overflow-y-hidden'
          : 'overflow-y-auto',
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  )
}

export { ScrollArea }
