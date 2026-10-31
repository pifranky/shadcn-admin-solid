import type { Component } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { createFileRoute } from '@tanstack/solid-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ForbiddenError } from '@/features/errors/forbidden'
import { GeneralError } from '@/features/errors/general-error'
import { MaintenanceError } from '@/features/errors/maintenance-error'
import { NotFoundError } from '@/features/errors/not-found-error'
import { UnauthorisedError } from '@/features/errors/unauthorized-error'

export const Route = createFileRoute('/_authenticated/errors/$error')({
  component: RouteComponent,
})

const errorMap: Record<string, Component> = {
  unauthorized: UnauthorisedError,
  forbidden: ForbiddenError,
  'not-found': NotFoundError,
  'internal-server-error': GeneralError,
  'maintenance-error': MaintenanceError,
}

function RouteComponent() {
  const params = Route.useParams()

  return (
    <>
      <Header fixed class='border-b'>
        <Search class='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <div class='flex-1 [&>div]:h-full'>
        <Dynamic component={errorMap[params().error] || NotFoundError} />
      </div>
    </>
  )
}
