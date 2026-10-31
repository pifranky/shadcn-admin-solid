import { For } from 'solid-js'
import { z } from 'zod'
import { Link } from '@tanstack/solid-router'
import { createForm } from '@/lib/form'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'

const profileFormSchema = z.object({
  username: z
    .string('Please enter your username.')
    .min(2, 'Username must be at least 2 characters.')
    .max(30, 'Username must not be longer than 30 characters.'),
  email: z.email({
    error: (iss) =>
      iss.input === undefined
        ? 'Please select an email to display.'
        : undefined,
  }),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.url('Please enter a valid URL.'),
      })
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  bio: 'I own a computer.',
  urls: [
    { value: 'https://shadcn.com' },
    { value: 'http://twitter.com/shadcn' },
  ],
}

export function ProfileForm() {
  const form = createForm({
    schema: profileFormSchema,
    defaultValues,
    mode: 'onChange',
    onSubmit: (data) => showSubmittedData(data),
  })

  const urls = () => (form.values.urls as { value: string }[]) ?? []
  const append = (url: { value: string }) =>
    form.setValue('urls', [...urls(), url])

  return (
    <form onSubmit={form.handleSubmit} class='space-y-8'>
      <FormField form={form} name='username'>
        {(field) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <Input placeholder='shadcn' {...field.inputProps} />
            <FormDescription>
              This is your public display name. It can be your real name or a
              pseudonym. You can only change this once every 30 days.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      </FormField>
      <FormField form={form} name='email'>
        {(field) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <SelectDropdown
              id={field.id}
              value={field.value()}
              onValueChange={field.setValue}
              invalid={!!field.error()}
              placeholder='Select a verified email to display'
              class='w-full'
              items={[
                { label: 'm@example.com', value: 'm@example.com' },
                { label: 'm@google.com', value: 'm@google.com' },
                { label: 'm@support.com', value: 'm@support.com' },
              ]}
            />
            <FormDescription>
              You can manage verified email addresses in your{' '}
              <Link to='/'>email settings</Link>.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      </FormField>
      <FormField form={form} name='bio'>
        {(field) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <Textarea
              placeholder='Tell us a little bit about yourself'
              class='resize-none'
              {...field.inputProps}
            />
            <FormDescription>
              You can <span>@mention</span> other users and organizations to
              link to them.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      </FormField>
      <div>
        <For each={urls()}>
          {(_, index) => (
            <FormField form={form} name={`urls.${index()}.value`}>
              {(field) => (
                <FormItem>
                  <FormLabel class={cn(index() !== 0 && 'sr-only')}>
                    URLs
                  </FormLabel>
                  <FormDescription class={cn(index() !== 0 && 'sr-only')}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <Input
                    class={cn(index() !== 0 && 'mt-1.5')}
                    {...field.inputProps}
                  />
                  <FormMessage />
                </FormItem>
              )}
            </FormField>
          )}
        </For>
        <Button
          type='button'
          variant='outline'
          size='sm'
          class='mt-2'
          onClick={() => append({ value: '' })}
        >
          Add URL
        </Button>
      </div>
      <Button type='submit'>Update profile</Button>
    </form>
  )
}
