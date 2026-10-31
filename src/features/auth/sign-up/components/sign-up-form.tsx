import { createSignal, splitProps, type ComponentProps } from 'solid-js'
import { z } from 'zod'
import { Loader2, UserPlus } from 'lucide-solid'
import { toast } from 'solid-sonner'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
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

const formSchema = z
  .object({
    email: z.email({
      error: (iss) =>
        iss.input === '' ? 'Please enter your email.' : undefined,
    }),
    password: z
      .string()
      .min(1, 'Please enter your password.')
      .min(7, 'Password must be at least 7 characters long.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export function SignUpForm(props: ComponentProps<'form'>) {
  const [local, others] = splitProps(props, ['class'])
  const [isLoading, setIsLoading] = createSignal(false)

  const form = createForm({
    schema: formSchema,
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: (data) => {
      setIsLoading(true)

      toast.promise(sleep(2000), {
        loading: 'Creating account...',
        success: () => {
          setIsLoading(false)
          return `Account created for ${data.email}.`
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
          <FormItem>
            <FormLabel>Password</FormLabel>
            <PasswordInput placeholder='********' {...field.inputProps} />
            <FormMessage />
          </FormItem>
        )}
      </FormField>
      <FormField form={form} name='confirmPassword'>
        {(field) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <PasswordInput placeholder='********' {...field.inputProps} />
            <FormMessage />
          </FormItem>
        )}
      </FormField>
      <Button type='submit' class='mt-2' disabled={isLoading()}>
        {isLoading() ? <Loader2 class='animate-spin' /> : <UserPlus />}
        Create Account
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
        <Button
          variant='outline'
          class='w-full'
          type='button'
          disabled={isLoading()}
        >
          <IconGithub class='h-4 w-4' /> GitHub
        </Button>
        <Button
          variant='outline'
          class='w-full'
          type='button'
          disabled={isLoading()}
        >
          <IconFacebook class='h-4 w-4' /> Facebook
        </Button>
      </div>
    </form>
  )
}
