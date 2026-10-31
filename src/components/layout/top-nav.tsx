import { For, splitProps, type ComponentProps } from 'solid-js'
import { Link } from '@tanstack/solid-router'
import { Menu } from 'lucide-solid'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type TopNavProps = ComponentProps<'nav'> & {
  links: {
    title: string
    href: string
    isActive: boolean
    disabled?: boolean
  }[]
}

export function TopNav(props: TopNavProps) {
  const [local, others] = splitProps(props, ['class', 'links'])
  return (
    <>
      <DropdownMenu modal={false} placement='bottom-start'>
        <DropdownMenuTrigger
          as={Button}
          size='icon'
          variant='outline'
          class={cn('md:size-7 lg:hidden', local.class)}
        >
          <Menu />
          <span class='sr-only'>Toggle navigation menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <For each={local.links}>
            {(link) => (
              <DropdownMenuItem
                as={Link}
                to={link.href}
                class={!link.isActive ? 'text-muted-foreground' : ''}
                disabled={link.disabled}
              >
                {link.title}
              </DropdownMenuItem>
            )}
          </For>
        </DropdownMenuContent>
      </DropdownMenu>

      <nav
        class={cn(
          'hidden items-center space-x-4 lg:flex lg:space-x-4 xl:space-x-6',
          local.class
        )}
        {...others}
      >
        <For each={local.links}>
          {(link) => (
            <Link
              to={link.href}
              disabled={link.disabled}
              class={`text-sm font-medium transition-colors hover:text-primary ${link.isActive ? '' : 'text-muted-foreground'}`}
            >
              {link.title}
            </Link>
          )}
        </For>
      </nav>
    </>
  )
}
