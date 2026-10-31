import { For } from 'solid-js'
import { z } from 'zod'
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
import { Label } from '@/components/ui/label'

const items = [
  {
    id: 'recents',
    label: 'Recents',
  },
  {
    id: 'home',
    label: 'Home',
  },
  {
    id: 'applications',
    label: 'Applications',
  },
  {
    id: 'desktop',
    label: 'Desktop',
  },
  {
    id: 'downloads',
    label: 'Downloads',
  },
  {
    id: 'documents',
    label: 'Documents',
  },
] as const

const displayFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
})

type DisplayFormValues = z.infer<typeof displayFormSchema>

// This can come from your database or API.
const defaultValues: Partial<DisplayFormValues> = {
  items: ['recents', 'home'],
}

export function DisplayForm() {
  const form = createForm({
    schema: displayFormSchema,
    defaultValues,
    onSubmit: (data) => showSubmittedData(data),
  })

  return (
    <form onSubmit={form.handleSubmit} class='space-y-8'>
      <FormField form={form} name='items'>
        {(field) => (
          <FormItem>
            <div class='mb-4'>
              <FormLabel class='text-base'>Sidebar</FormLabel>
              <FormDescription>
                Select the items you want to display in the sidebar.
              </FormDescription>
            </div>
            <For each={items}>
              {(item) => {
                const value = () => (field.value() as string[]) ?? []
                return (
                  <div class='flex flex-row items-start gap-2'>
                    <Checkbox
                      id={`display-item-${item.id}`}
                      checked={value().includes(item.id)}
                      onChange={(checked) =>
                        checked
                          ? field.setValue([...value(), item.id])
                          : field.setValue(
                              value().filter((value) => value !== item.id)
                            )
                      }
                    />
                    <Label for={`display-item-${item.id}`} class='font-normal'>
                      {item.label}
                    </Label>
                  </div>
                )
              }}
            </For>
            <FormMessage />
          </FormItem>
        )}
      </FormField>
      <Button type='submit'>Update display</Button>
    </form>
  )
}
