import type { JSX } from 'solid-js'
import { Separator } from '@/components/ui/separator'

type ContentSectionProps = {
  title: string
  desc: string
  children: JSX.Element
}

export function ContentSection(props: ContentSectionProps) {
  return (
    <div class='flex flex-1 flex-col'>
      <div class='flex-none'>
        <h3 class='text-lg font-medium'>{props.title}</h3>
        <p class='text-sm text-muted-foreground'>{props.desc}</p>
      </div>
      <Separator class='my-4 flex-none' />
      <div class='faded-bottom h-full w-full overflow-y-auto scroll-smooth pe-4 pb-12'>
        <div class='-mx-1 px-1.5 lg:max-w-xl'>{props.children}</div>
      </div>
    </div>
  )
}
