import type { JSX } from 'solid-js'
import type { PopoverRootProps } from '@kobalte/core/popover'
import { CircleQuestionMark } from 'lucide-solid'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type LearnMoreProps = PopoverRootProps & {
  children?: JSX.Element
  contentClass?: string
  triggerClass?: string
}

export function LearnMore(props: LearnMoreProps) {
  return (
    <Popover placement='top-start' {...props}>
      <PopoverTrigger
        as={Button}
        variant='outline'
        size='icon'
        class={cn('size-5 rounded-full', props.triggerClass)}
      >
        <span class='sr-only'>Learn more</span>
        <CircleQuestionMark class='size-4 [&>circle]:hidden' />
      </PopoverTrigger>
      <PopoverContent
        class={cn('text-sm text-muted-foreground', props.contentClass)}
      >
        {props.children}
      </PopoverContent>
    </Popover>
  )
}
