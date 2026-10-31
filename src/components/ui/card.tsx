import { splitProps, type ComponentProps } from 'solid-js'
import { cn } from '@/lib/utils'

function make(slot: string, base: string, tag: 'div' = 'div') {
  return (props: ComponentProps<typeof tag>) => {
    const [local, others] = splitProps(props, ['class'])
    return <div data-slot={slot} class={cn(base, local.class)} {...others} />
  }
}

const Card = make(
  'card',
  'flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm'
)
const CardHeader = make(
  'card-header',
  '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6'
)
const CardTitle = make('card-title', 'leading-none font-semibold')
const CardDescription = make(
  'card-description',
  'text-sm text-muted-foreground'
)
const CardAction = make(
  'card-action',
  'col-start-2 row-span-2 row-start-1 self-start justify-self-end'
)
const CardContent = make('card-content', 'px-6')
const CardFooter = make(
  'card-footer',
  'flex items-center px-6 [.border-t]:pt-6'
)

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
