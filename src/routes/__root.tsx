import { Show } from 'solid-js'
import { type QueryClient } from '@tanstack/solid-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/solid-router'
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => {
    return (
      <>
        <NavigationProgress />
        <Outlet />
        <Toaster duration={5000} />
        <Show when={import.meta.env.MODE === 'development'}>
          <TanStackRouterDevtools position='bottom-right' />
        </Show>
      </>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
