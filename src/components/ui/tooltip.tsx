import { splitProps, type JSX, type ValidComponent } from 'solid-js'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import * as TooltipPrimitive from '@kobalte/core/tooltip'
import { cn } from '@/lib/utils'

const Tooltip = (props: TooltipPrimitive.TooltipRootProps) => (
  <TooltipPrimitive.Root openDelay={0} closeDelay={0} gutter={4} {...props} />
)
const TooltipTrigger = TooltipPrimitive.Trigger

type TooltipContentProps<T extends ValidComponent = 'div'> =
  TooltipPrimitive.TooltipContentProps<T> & {
    class?: string | undefined
    children?: JSX.Element
  }

function TooltipContent<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, TooltipContentProps<T>>
) {
  const [local, others] = splitProps(props as TooltipContentProps, [
    'class',
    'children',
  ])
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot='tooltip-content'
        class={cn(
          'z-50 w-fit origin-(--kb-tooltip-content-transform-origin) animate-in rounded-md bg-primary px-3 py-1.5 text-xs text-balance text-primary-foreground fade-in-0 zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          local.class
        )}
        {...others}
      >
        {local.children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent }
