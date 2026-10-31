import type { Component, ComponentProps } from 'solid-js'

type Icon = Component<ComponentProps<'svg'>>

type User = {
  name: string
  email: string
  avatar: string
}

type Team = {
  name: string
  logo: Icon
  plan: string
}

type BaseNavItem = {
  title: string
  badge?: string
  icon?: Icon
}

type NavLink = BaseNavItem & {
  url: string
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string })[]
  url?: never
}

type NavItem = NavCollapsible | NavLink

type NavGroup = {
  title: string
  items: NavItem[]
}

type SidebarData = {
  user: User
  teams: Team[]
  navGroups: NavGroup[]
}

export type { Icon, SidebarData, NavGroup, NavItem, NavCollapsible, NavLink }
