import { Link } from '@tanstack/solid-router'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-solid'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { SignOutDialog } from '@/components/sign-out-dialog'

type NavUserProps = {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function NavUser(props: NavUserProps) {
  const { isMobile } = useSidebar()
  const [open, setOpen] = useDialogState()

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu placement={isMobile() ? 'bottom-end' : 'right-end'}>
            <DropdownMenuTrigger
              as={SidebarMenuButton}
              size='lg'
              class='data-expanded:bg-sidebar-accent data-expanded:text-sidebar-accent-foreground'
            >
              <Avatar class='h-8 w-8 rounded-lg'>
                <AvatarImage src={props.user.avatar} alt={props.user.name} />
                <AvatarFallback class='rounded-lg'>SN</AvatarFallback>
              </Avatar>
              <div class='grid flex-1 text-start text-sm leading-tight'>
                <span class='truncate font-semibold'>{props.user.name}</span>
                <span class='truncate text-xs'>{props.user.email}</span>
              </div>
              <ChevronsUpDown class='ms-auto size-4' />
            </DropdownMenuTrigger>
            <DropdownMenuContent class='w-(--kb-popper-anchor-width) min-w-56 rounded-lg'>
              <DropdownMenuLabel class='p-0 font-normal'>
                <div class='flex items-center gap-2 px-1 py-1.5 text-start text-sm'>
                  <Avatar class='h-8 w-8 rounded-lg'>
                    <AvatarImage
                      src={props.user.avatar}
                      alt={props.user.name}
                    />
                    <AvatarFallback class='rounded-lg'>SN</AvatarFallback>
                  </Avatar>
                  <div class='grid flex-1 text-start text-sm leading-tight'>
                    <span class='truncate font-semibold'>
                      {props.user.name}
                    </span>
                    <span class='truncate text-xs'>{props.user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem as={Link} to='/settings/account'>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem as={Link} to='/settings'>
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem as={Link} to='/settings/notifications'>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant='destructive'
                onSelect={() => setOpen(true)}
              >
                <LogOut />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <SignOutDialog open={!!open()} onOpenChange={setOpen} />
    </>
  )
}
