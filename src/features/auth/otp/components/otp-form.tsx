import { createSignal, splitProps, type ComponentProps } from 'solid-js'
import { z } from 'zod'
import { useNavigate } from '@tanstack/solid-router'
import { createForm } from '@/lib/form'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'

const formSchema = z.object({
  otp: z
    .string()
    .min(6, 'Please enter the 6-digit code.')
    .max(6, 'Please enter the 6-digit code.'),
})

type OtpFormProps = ComponentProps<'form'>

export function OtpForm(props: OtpFormProps) {
  const [local, others] = splitProps(props, ['class'])
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = createSignal(false)

  const form = createForm({
    schema: formSchema,
    defaultValues: { otp: '' },
    onSubmit: (data) => {
      setIsLoading(true)
      showSubmittedData(data)

      setTimeout(() => {
        setIsLoading(false)
        navigate({ to: '/' })
      }, 1000)
    },
  })

  const otp = () => (form.values.otp as string) ?? ''

  return (
    <form
      onSubmit={form.handleSubmit}
      class={cn('grid gap-2', local.class)}
      {...others}
    >
      <FormField form={form} name='otp'>
        {(field) => (
          <FormItem>
            <FormLabel class='sr-only'>One-Time Password</FormLabel>
            <InputOTP
              id={field.id}
              maxLength={6}
              value={field.value()}
              onValueChange={field.setValue}
              containerClass='justify-between sm:[&>[data-slot="input-otp-group"]>div]:w-12'
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FormMessage />
          </FormItem>
        )}
      </FormField>
      <Button
        type='submit'
        class='mt-2'
        disabled={otp().length < 6 || isLoading()}
      >
        Verify
      </Button>
    </form>
  )
}
