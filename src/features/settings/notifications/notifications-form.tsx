import { For } from 'solid-js'
import { z } from 'zod'
import { Link } from '@tanstack/solid-router'
import { createForm } from '@/lib/form'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemLabel,
} from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'

const notificationsFormSchema = z.object({
  type: z.enum(['all', 'mentions', 'none'], {
    error: (iss) =>
      iss.input === undefined
        ? 'Please select a notification type.'
        : undefined,
  }),
  mobile: z.boolean().default(false).optional(),
  communication_emails: z.boolean().default(false).optional(),
  social_emails: z.boolean().default(false).optional(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

// This can come from your database or API.
const defaultValues: Partial<NotificationsFormValues> = {
  communication_emails: false,
  marketing_emails: false,
  social_emails: true,
  security_emails: true,
}

const emailSwitches = [
  {
    name: 'communication_emails',
    label: 'Communication emails',
    desc: 'Receive emails about your account activity.',
  },
  {
    name: 'marketing_emails',
    label: 'Marketing emails',
    desc: 'Receive emails about new products, features, and more.',
  },
  {
    name: 'social_emails',
    label: 'Social emails',
    desc: 'Receive emails for friend requests, follows, and more.',
  },
  {
    name: 'security_emails',
    label: 'Security emails',
    desc: 'Receive emails about your account activity and security.',
    disabled: true,
  },
] as const

export function NotificationsForm() {
  const form = createForm({
    schema: notificationsFormSchema,
    defaultValues,
    onSubmit: (data) => showSubmittedData(data),
  })

  return (
    <form onSubmit={form.handleSubmit} class='space-y-8'>
      <FormField form={form} name='type'>
        {(field) => (
          <FormItem class='relative space-y-3'>
            <FormLabel>Notify me about...</FormLabel>
            <RadioGroup
              value={field.value()}
              onChange={field.setValue}
              validationState={field.error() ? 'invalid' : 'valid'}
              class='flex flex-col gap-2'
            >
              <RadioGroupItem value='all'>
                <RadioGroupItemLabel class='text-sm font-normal'>
                  All new messages
                </RadioGroupItemLabel>
              </RadioGroupItem>
              <RadioGroupItem value='mentions'>
                <RadioGroupItemLabel class='text-sm font-normal'>
                  Direct messages and mentions
                </RadioGroupItemLabel>
              </RadioGroupItem>
              <RadioGroupItem value='none'>
                <RadioGroupItemLabel class='text-sm font-normal'>
                  Nothing
                </RadioGroupItemLabel>
              </RadioGroupItem>
            </RadioGroup>
            <FormMessage />
          </FormItem>
        )}
      </FormField>
      <div class='relative'>
        <h3 class='mb-4 text-lg font-medium'>Email Notifications</h3>
        <div class='space-y-4'>
          <For each={emailSwitches}>
            {(item) => (
              <FormField form={form} name={item.name}>
                {(field) => (
                  <FormItem class='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div class='space-y-0.5'>
                      <FormLabel class='text-base'>{item.label}</FormLabel>
                      <FormDescription>{item.desc}</FormDescription>
                    </div>
                    <Switch
                      id={field.id}
                      checked={field.value()}
                      onChange={field.setValue}
                      disabled={'disabled' in item && item.disabled}
                      aria-readonly={'disabled' in item && item.disabled}
                    />
                  </FormItem>
                )}
              </FormField>
            )}
          </For>
        </div>
      </div>
      <FormField form={form} name='mobile'>
        {(field) => (
          <FormItem class='relative flex flex-row items-start gap-2'>
            <Checkbox
              id={field.id}
              checked={field.value()}
              onChange={field.setValue}
            />
            <div class='space-y-1 leading-none'>
              <FormLabel>
                Use different settings for my mobile devices
              </FormLabel>
              <FormDescription>
                You can manage your mobile notifications in the{' '}
                <Link
                  to='/settings'
                  class='underline decoration-dashed underline-offset-4 hover:decoration-solid'
                >
                  mobile settings
                </Link>{' '}
                page.
              </FormDescription>
            </div>
          </FormItem>
        )}
      </FormField>
      <Button type='submit'>Update notifications</Button>
    </form>
  )
}
