import { Link } from '@tanstack/solid-router'
import { Menu, X } from 'lucide-solid'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function AppTitle() {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          as='div'
          size='lg'
          class='gap-0 py-0 hover:bg-transparent active:bg-transparent'
        >
          <Link
            to='/'
            onClick={() => setOpenMobile(false)}
            class='grid flex-1 text-start text-sm leading-tight'
          >
            <span class='truncate font-bold'>Shadcn-Admin</span>
            <span class='truncate text-xs'>Vite + SolidJS</span>
          </Link>
          <ToggleSidebar />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function ToggleSidebar(props: { class?: string }) {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      data-sidebar='trigger'
      data-slot='sidebar-trigger'
      variant='ghost'
      size='icon'
      class={cn('aspect-square size-8 max-md:scale-125', props.class)}
      onClick={toggleSidebar}
    >
      <X class='md:hidden' />
      <Menu class='max-md:hidden' />
      <span class='sr-only'>Toggle Sidebar</span>
    </Button>
  )
}
