import { For } from 'solid-js'
import { z } from 'zod'
import { Check, ChevronsUpDown } from 'lucide-solid'
import { createForm } from '@/lib/form'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { DatePicker } from '@/components/date-picker'

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Please enter your name.')
    .min(2, 'Name must be at least 2 characters.')
    .max(30, 'Name must not be longer than 30 characters.'),
  dob: z.date('Please select your date of birth.'),
  language: z.string('Please select a language.'),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  name: '',
}

export function AccountForm() {
  const form = createForm({
    schema: accountFormSchema,
    defaultValues,
    onSubmit: (data) => showSubmittedData(data),
  })

  return (
    <form onSubmit={form.handleSubmit} class='space-y-8'>
      <FormField form={form} name='name'>
        {(field) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Your name' {...field.inputProps} />
            <FormDescription>
              This is the name that will be displayed on your profile and in
              emails.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      </FormField>
      <FormField form={form} name='dob'>
        {(field) => (
          <FormItem class='flex flex-col'>
            <FormLabel>Date of birth</FormLabel>
            <DatePicker
              id={field.id}
              selected={field.value()}
              onSelect={field.setValue}
            />
            <FormDescription>
              Your date of birth is used to calculate your age.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      </FormField>
      <FormField form={form} name='language'>
        {(field) => (
          <FormItem class='flex flex-col'>
            <FormLabel>Language</FormLabel>
            <Popover placement='bottom-start'>
              <PopoverTrigger
                as={Button}
                id={field.id}
                variant='outline'
                role='combobox'
                aria-invalid={!!field.error()}
                class={cn(
                  'w-50 justify-between',
                  !field.value() && 'text-muted-foreground'
                )}
              >
                {field.value()
                  ? languages.find(
                      (language) => language.value === field.value()
                    )?.label
                  : 'Select language'}
                <ChevronsUpDown class='ms-2 h-4 w-4 shrink-0 opacity-50' />
              </PopoverTrigger>
              <PopoverContent class='w-50 p-0'>
                <Command>
                  <CommandInput placeholder='Search language...' />
                  <CommandEmpty>No language found.</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      <For each={languages}>
                        {(language) => (
                          <CommandItem
                            value={language.label}
                            onSelect={() => field.setValue(language.value)}
                          >
                            <Check
                              class={cn(
                                'size-4',
                                language.value === field.value()
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {language.label}
                          </CommandItem>
                        )}
                      </For>
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription>
              This is the language that will be used in the dashboard.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      </FormField>
      <Button type='submit'>Update account</Button>
    </form>
  )
}
