import type { JSX } from 'solid-js'
import { Logo } from '@/assets/logo'

type AuthLayoutProps = {
  children: JSX.Element
}

export function AuthLayout(props: AuthLayoutProps) {
  return (
    <div class='container grid h-svh max-w-none items-center justify-center'>
      <div class='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:p-8'>
        <div class='mb-4 flex items-center justify-center'>
          <Logo class='me-2' />
          <h1 class='text-xl font-medium'>Shadcn Admin</h1>
        </div>
        {props.children}
      </div>
    </div>
  )
}
