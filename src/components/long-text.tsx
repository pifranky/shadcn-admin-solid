import { createSignal, onMount, Show, type JSX } from 'solid-js'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type LongTextProps = {
  children: JSX.Element
  class?: string
  contentClass?: string
}

export function LongText(props: LongTextProps) {
  let ref: HTMLDivElement | undefined
  const [isOverflown, setIsOverflown] = createSignal(false)

  onMount(() => {
    if (checkOverflow(ref)) setIsOverflown(true)
  })

  return (
    <Show
      when={isOverflown()}
      fallback={
        <div ref={ref} class={cn('truncate', props.class)}>
          {props.children}
        </div>
      }
    >
      <div class='hidden sm:block'>
        <Tooltip>
          <TooltipTrigger as='div' class={cn('truncate', props.class)}>
            {props.children}
          </TooltipTrigger>
          <TooltipContent>
            <p class={props.contentClass}>{props.children}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div class='sm:hidden'>
        <Popover>
          <PopoverTrigger as='div' class={cn('truncate', props.class)}>
            {props.children}
          </PopoverTrigger>
          <PopoverContent class={cn('w-fit', props.contentClass)}>
            <p>{props.children}</p>
          </PopoverContent>
        </Popover>
      </div>
    </Show>
  )
}

const checkOverflow = (textContainer: HTMLDivElement | undefined) => {
  if (textContainer) {
    return (
      textContainer.offsetHeight < textContainer.scrollHeight ||
      textContainer.offsetWidth < textContainer.scrollWidth
    )
  }
  return false
}
