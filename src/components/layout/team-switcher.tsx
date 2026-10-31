import { createSignal, For } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { ChevronsUpDown, Plus } from 'lucide-solid'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import type { SidebarData } from './types'

type TeamSwitcherProps = {
  teams: SidebarData['teams']
}

export function TeamSwitcher(props: TeamSwitcherProps) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = createSignal(props.teams[0])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu placement={isMobile() ? 'bottom-start' : 'right-start'}>
          <DropdownMenuTrigger
            as={SidebarMenuButton}
            size='lg'
            class='data-expanded:bg-sidebar-accent data-expanded:text-sidebar-accent-foreground'
          >
            <div class='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
              <Dynamic component={activeTeam().logo} class='size-4' />
            </div>
            <div class='grid flex-1 text-start text-sm leading-tight'>
              <span class='truncate font-semibold'>{activeTeam().name}</span>
              <span class='truncate text-xs'>{activeTeam().plan}</span>
            </div>
            <ChevronsUpDown class='ms-auto' />
          </DropdownMenuTrigger>
          <DropdownMenuContent class='w-(--kb-popper-anchor-width) min-w-56 rounded-lg'>
            <DropdownMenuLabel class='text-xs text-muted-foreground'>
              Teams
            </DropdownMenuLabel>
            <For each={props.teams}>
              {(team, index) => (
                <DropdownMenuItem
                  onSelect={() => setActiveTeam(team)}
                  class='gap-2 p-2'
                >
                  <div class='flex size-6 items-center justify-center rounded-sm border'>
                    <Dynamic component={team.logo} class='size-4 shrink-0' />
                  </div>
                  {team.name}
                  <DropdownMenuShortcut>⌘{index() + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
            </For>
            <DropdownMenuSeparator />
            <DropdownMenuItem class='gap-2 p-2'>
              <div class='flex size-6 items-center justify-center rounded-md border bg-background'>
                <Plus class='size-4' />
              </div>
              <div class='font-medium text-muted-foreground'>Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
