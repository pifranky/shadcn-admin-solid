import { For, splitProps, type ComponentProps, type JSX } from 'solid-js'
import { Link, useLocation, useNavigate } from '@tanstack/solid-router'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SelectDropdown } from '@/components/select-dropdown'

type SidebarNavProps = ComponentProps<'nav'> & {
  items: {
    href: string
    title: string
    icon: () => JSX.Element
  }[]
}

export function SidebarNav(props: SidebarNavProps) {
  const [local, others] = splitProps(props, ['class', 'items'])
  const location = useLocation()
  const pathname = () => location().pathname
  const navigate = useNavigate()

  return (
    <>
      <div class='p-1 md:hidden'>
        <SelectDropdown
          value={pathname() ?? '/settings'}
          onValueChange={(href) => navigate({ to: href })}
          placeholder='Theme'
          class='h-12 w-full sm:w-48'
          items={local.items.map((item) => ({
            value: item.href,
            label: item.title,
            icon: <span class='me-2 scale-125'>{item.icon()}</span>,
          }))}
        />
      </div>

      <ScrollArea
        orientation='horizontal'
        type='always'
        class='hidden w-full min-w-40 bg-background px-1 py-2 md:block'
      >
        <nav
          class={cn(
            'flex space-x-2 py-1 lg:flex-col lg:space-y-1 lg:space-x-0',
            local.class
          )}
          {...others}
        >
          <For each={local.items}>
            {(item) => (
              <Link
                to={item.href}
                class={cn(
                  buttonVariants({ variant: 'ghost' }),
                  pathname() === item.href
                    ? 'bg-muted hover:bg-accent'
                    : 'hover:bg-accent hover:underline',
                  'justify-start'
                )}
              >
                <span class='me-2'>{item.icon()}</span>
                {item.title}
              </Link>
            )}
          </For>
        </nav>
      </ScrollArea>
    </>
  )
}
