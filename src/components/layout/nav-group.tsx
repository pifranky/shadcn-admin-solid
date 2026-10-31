import { For, Show, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { Link, useLocation } from '@tanstack/solid-router'
import { ChevronRight } from 'lucide-solid'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  type NavCollapsible,
  type NavItem,
  type NavLink,
  type NavGroup as NavGroupProps,
} from './types'

export function NavGroup(props: NavGroupProps) {
  const { state, isMobile } = useSidebar()
  const location = useLocation()
  const href = () => location().href
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{props.title}</SidebarGroupLabel>
      <SidebarMenu>
        <For each={props.items}>
          {(item) => (
            <Show
              when={item.items}
              fallback={
                <SidebarMenuLink item={item as NavLink} href={href()} />
              }
            >
              <Show
                when={state() === 'collapsed' && !isMobile()}
                fallback={
                  <SidebarMenuCollapsible
                    item={item as NavCollapsible}
                    href={href()}
                  />
                }
              >
                <SidebarMenuCollapsedDropdown
                  item={item as NavCollapsible}
                  href={href()}
                />
              </Show>
            </Show>
          )}
        </For>
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavBadge(props: { children: JSX.Element }) {
  return <Badge class='rounded-full px-1 py-0 text-xs'>{props.children}</Badge>
}

function SidebarMenuLink(props: { item: NavLink; href: string }) {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        as={Link}
        to={props.item.url}
        onClick={() => setOpenMobile(false)}
        isActive={checkIsActive(props.href, props.item)}
        tooltip={props.item.title}
      >
        <Show when={props.item.icon}>
          <Dynamic component={props.item.icon} />
        </Show>
        <span>{props.item.title}</span>
        <Show when={props.item.badge}>
          <NavBadge>{props.item.badge}</NavBadge>
        </Show>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarMenuCollapsible(props: { item: NavCollapsible; href: string }) {
  const { setOpenMobile } = useSidebar()
  return (
    <Collapsible
      as={SidebarMenuItem}
      defaultOpen={checkIsActive(props.href, props.item, true)}
      class='group/collapsible'
    >
      <CollapsibleTrigger as={SidebarMenuButton} tooltip={props.item.title}>
        <Show when={props.item.icon}>
          <Dynamic component={props.item.icon} />
        </Show>
        <span>{props.item.title}</span>
        <Show when={props.item.badge}>
          <NavBadge>{props.item.badge}</NavBadge>
        </Show>
        <ChevronRight class='ms-auto transition-transform duration-200 group-data-expanded/collapsible:rotate-90 rtl:rotate-180 rtl:group-data-expanded/collapsible:rotate-90' />
      </CollapsibleTrigger>
      <CollapsibleContent class='CollapsibleContent'>
        <SidebarMenuSub>
          <For each={props.item.items}>
            {(subItem) => (
              <SidebarMenuSubItem>
                <SidebarMenuSubButton
                  as={Link}
                  to={subItem.url}
                  onClick={() => setOpenMobile(false)}
                  isActive={checkIsActive(props.href, subItem)}
                >
                  <Show when={subItem.icon}>
                    <Dynamic component={subItem.icon} />
                  </Show>
                  <span>{subItem.title}</span>
                  <Show when={subItem.badge}>
                    <NavBadge>{subItem.badge}</NavBadge>
                  </Show>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            )}
          </For>
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

function SidebarMenuCollapsedDropdown(props: {
  item: NavCollapsible
  href: string
}) {
  return (
    <SidebarMenuItem>
      <DropdownMenu placement='right-start'>
        <DropdownMenuTrigger
          as={SidebarMenuButton}
          tooltip={props.item.title}
          isActive={checkIsActive(props.href, props.item)}
        >
          <Show when={props.item.icon}>
            <Dynamic component={props.item.icon} />
          </Show>
          <span>{props.item.title}</span>
          <Show when={props.item.badge}>
            <NavBadge>{props.item.badge}</NavBadge>
          </Show>
          <ChevronRight class='ms-auto transition-transform duration-200 group-data-expanded/collapsible:rotate-90' />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            {props.item.title} {props.item.badge ? `(${props.item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <For each={props.item.items}>
            {(sub) => (
              <DropdownMenuItem
                as={Link}
                to={sub.url}
                class={checkIsActive(props.href, sub) ? 'bg-secondary' : ''}
              >
                <Show when={sub.icon}>
                  <Dynamic component={sub.icon} />
                </Show>
                <span class='max-w-52 text-wrap'>{sub.title}</span>
                <Show when={sub.badge}>
                  <span class='ms-auto text-xs'>{sub.badge}</span>
                </Show>
              </DropdownMenuItem>
            )}
          </For>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function checkIsActive(href: string, item: NavItem, mainNav = false) {
  return (
    href === item.url || // /endpint?search=param
    href.split('?')[0] === item.url || // endpoint
    !!item?.items?.filter((i) => i.url === href).length || // if child nav is active
    (mainNav &&
      href.split('/')[1] !== '' &&
      href.split('/')[1] === item?.url?.split('/')[1])
  )
}
