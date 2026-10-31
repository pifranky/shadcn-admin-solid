import { createSignal, splitProps, type ComponentProps } from 'solid-js'
import { z } from 'zod'
import { useNavigate } from '@tanstack/solid-router'
import { ArrowRight, Loader2 } from 'lucide-solid'
import { toast } from 'solid-sonner'
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

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email.' : undefined),
  }),
})

export function ForgotPasswordForm(props: ComponentProps<'form'>) {
  const [local, others] = splitProps(props, ['class'])
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = createSignal(false)

  const form = createForm({
    schema: formSchema,
    defaultValues: { email: '' },
    onSubmit: (data) => {
      setIsLoading(true)
      toast.promise(sleep(2000), {
        loading: 'Sending email...',
        success: () => {
          setIsLoading(false)
          form.reset()
          navigate({ to: '/otp' })
          return `Email sent to ${data.email}`
        },
        error: 'Error',
      })
    },
  })

  return (
    <form
      onSubmit={form.handleSubmit}
      class={cn('grid gap-2', local.class)}
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
      <Button type='submit' class='mt-2' disabled={isLoading()}>
        Continue
        {isLoading() ? <Loader2 class='animate-spin' /> : <ArrowRight />}
      </Button>
    </form>
  )
}
