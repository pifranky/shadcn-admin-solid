import { createSignal, splitProps, type ComponentProps } from 'solid-js'
import { z } from 'zod'
import { Link, useNavigate } from '@tanstack/solid-router'
import { Loader2, LogIn } from 'lucide-solid'
import { toast } from 'solid-sonner'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { useAuthStore } from '@/stores/auth-store'
import { createForm } from '@/lib/form'
import { sleep, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email.' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password.')
    .min(7, 'Password must be at least 7 characters long.'),
})

type UserAuthFormProps = ComponentProps<'form'> & {
  redirectTo?: string
}

export function UserAuthForm(props: UserAuthFormProps) {
  const [local, others] = splitProps(props, ['class', 'redirectTo'])
  const [isLoading, setIsLoading] = createSignal(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = createForm({
    schema: formSchema,
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: (data) => {
      setIsLoading(true)

      toast.promise(sleep(2000), {
        loading: 'Signing in...',
        success: () => {
          setIsLoading(false)

          // Mock successful authentication with expiry computed at success time
          const mockUser = {
            accountNo: 'ACC001',
            email: data.email,
            role: ['user'],
            exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
          }

          // Set user and access token
          auth.setUser(mockUser)
          auth.setAccessToken('mock-access-token')

          // Redirect to the stored location or default to dashboard
          const targetPath = local.redirectTo || '/'
          navigate({ to: targetPath, replace: true })

          return `Welcome back, ${data.email}!`
        },
        error: 'Error',
      })
    },
  })

  return (
    <form
      onSubmit={form.handleSubmit}
      class={cn('grid gap-3', local.class)}
      novalidate
      {...others}
    >
      <FormField form={form} name='email'>
        {(field) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <Input placeholder='name@example.com' {...field.inputProps} />
            <FormMessage />
          </FormItem>
        )}
      </FormField>
      <FormField form={form} name='password'>
        {(field) => (
          <FormItem class='relative'>
            <FormLabel>Password</FormLabel>
            <PasswordInput placeholder='********' {...field.inputProps} />
            <FormMessage />
            <Link
              to='/forgot-password'
              class='absolute inset-e-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75'
            >
              Forgot password?
            </Link>
          </FormItem>
        )}
      </FormField>
      <Button type='submit' class='mt-2' disabled={isLoading()}>
        {isLoading() ? <Loader2 class='animate-spin' /> : <LogIn />}
        Sign in
      </Button>

      <div class='relative my-2'>
        <div class='absolute inset-0 flex items-center'>
          <span class='w-full border-t' />
        </div>
        <div class='relative flex justify-center text-xs uppercase'>
          <span class='bg-background px-2 text-muted-foreground'>
            Or continue with
          </span>
        </div>
      </div>

      <div class='grid grid-cols-2 gap-2'>
        <Button variant='outline' type='button' disabled={isLoading()}>
          <IconGithub class='h-4 w-4' /> GitHub
        </Button>
        <Button variant='outline' type='button' disabled={isLoading()}>
          <IconFacebook class='h-4 w-4' /> Facebook
        </Button>
      </div>
    </form>
  )
}
