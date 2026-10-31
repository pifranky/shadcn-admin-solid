import {
  createSignal,
  onCleanup,
  onMount,
  splitProps,
  type ComponentProps,
} from 'solid-js'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

type HeaderProps = ComponentProps<'header'> & {
  fixed?: boolean
}

export function Header(props: HeaderProps) {
  const [local, others] = splitProps(props, ['class', 'fixed', 'children'])
  const [offset, setOffset] = createSignal(0)

  onMount(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true })

    // Clean up the event listener on unmount
    onCleanup(() => document.removeEventListener('scroll', onScroll))
  })

  return (
    <header
      class={cn(
        'z-50 h-16',
        local.fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
        offset() > 10 && local.fixed ? 'shadow' : 'shadow-none',
        local.class
      )}
      {...others}
    >
      <div
        class={cn(
          'relative flex h-full items-center gap-3 p-4 sm:gap-4',
          offset() > 10 &&
            local.fixed &&
            'after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg'
        )}
      >
        <SidebarTrigger variant='outline' class='max-md:scale-125' />
        <Separator orientation='vertical' class='h-6' />
        {local.children}
      </div>
    </header>
  )
}
