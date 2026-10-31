import { For } from 'solid-js'
import { z } from 'zod'
import * as RadioGroupPrimitive from '@kobalte/core/radio-group'
import { ChevronDown } from 'lucide-solid'
import { createForm } from '@/lib/form'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { fonts } from '@/config/fonts'
import { useFont } from '@/context/font-provider'
import { useTheme } from '@/context/theme-provider'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark']),
  font: z.enum(fonts),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export function AppearanceForm() {
  const { font, setFont } = useFont()
  const { theme, setTheme } = useTheme()

  // This can come from your database or API.
  const defaultValues: Partial<AppearanceFormValues> = {
    theme: theme() as 'light' | 'dark',
    font: font(),
  }

  const form = createForm({
    schema: appearanceFormSchema,
    defaultValues,
    onSubmit: (data) => {
      if (data.font != font()) setFont(data.font)
      if (data.theme != theme()) setTheme(data.theme)

      showSubmittedData(data)
    },
  })

  return (
    <form onSubmit={form.handleSubmit} class='space-y-8'>
      <FormField form={form} name='font'>
        {(field) => (
          <FormItem>
            <FormLabel>Font</FormLabel>
            <div class='relative w-max'>
              <select
                class={cn(
                  buttonVariants({ variant: 'outline' }),
                  'w-50 appearance-none font-normal capitalize',
                  'dark:bg-background dark:hover:bg-background'
                )}
                {...field.inputProps}
              >
                <For each={fonts}>
                  {(font) => <option value={font}>{font}</option>}
                </For>
              </select>
              <ChevronDown class='absolute inset-e-3 top-2.5 h-4 w-4 opacity-50' />
            </div>
            <FormDescription class='font-manrope'>
              Set the font you want to use in the dashboard.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      </FormField>
      <FormField form={form} name='theme'>
        {(field) => (
          <FormItem>
            <FormLabel>Theme</FormLabel>
            <FormDescription>
              Select the theme for the dashboard.
            </FormDescription>
            <FormMessage />
            <RadioGroupPrimitive.Root
              value={field.value()}
              onChange={field.setValue}
              class='grid max-w-md grid-cols-2 gap-8 pt-2'
            >
              <RadioGroupPrimitive.Item value='light' class='group'>
                <RadioGroupPrimitive.ItemInput />
                <RadioGroupPrimitive.ItemLabel class='text-sm font-medium'>
                  <div class='items-center rounded-md border-2 border-muted p-1 group-data-checked:border-primary hover:border-accent'>
                    <div class='space-y-2 rounded-sm bg-[#ecedef] p-2'>
                      <div class='space-y-2 rounded-md bg-white p-2 shadow-xs'>
                        <div class='h-2 w-20 rounded-lg bg-[#ecedef]' />
                        <div class='h-2 w-25 rounded-lg bg-[#ecedef]' />
                      </div>
                      <div class='flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs'>
                        <div class='h-4 w-4 rounded-full bg-[#ecedef]' />
                        <div class='h-2 w-25 rounded-lg bg-[#ecedef]' />
                      </div>
                      <div class='flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs'>
                        <div class='h-4 w-4 rounded-full bg-[#ecedef]' />
                        <div class='h-2 w-25 rounded-lg bg-[#ecedef]' />
                      </div>
                    </div>
                  </div>
                  <span class='block w-full p-2 text-center font-normal'>
                    Light
                  </span>
                </RadioGroupPrimitive.ItemLabel>
              </RadioGroupPrimitive.Item>
              <RadioGroupPrimitive.Item value='dark' class='group'>
                <RadioGroupPrimitive.ItemInput />
                <RadioGroupPrimitive.ItemLabel class='text-sm font-medium'>
                  <div class='items-center rounded-md border-2 border-muted bg-popover p-1 group-data-checked:border-primary hover:bg-accent hover:text-accent-foreground'>
                    <div class='space-y-2 rounded-sm bg-slate-950 p-2'>
                      <div class='space-y-2 rounded-md bg-slate-800 p-2 shadow-xs'>
                        <div class='h-2 w-20 rounded-lg bg-slate-400' />
                        <div class='h-2 w-25 rounded-lg bg-slate-400' />
                      </div>
                      <div class='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs'>
                        <div class='h-4 w-4 rounded-full bg-slate-400' />
                        <div class='h-2 w-25 rounded-lg bg-slate-400' />
                      </div>
                      <div class='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs'>
                        <div class='h-4 w-4 rounded-full bg-slate-400' />
                        <div class='h-2 w-25 rounded-lg bg-slate-400' />
                      </div>
                    </div>
                  </div>
                  <span class='block w-full p-2 text-center font-normal'>
                    Dark
                  </span>
                </RadioGroupPrimitive.ItemLabel>
              </RadioGroupPrimitive.Item>
            </RadioGroupPrimitive.Root>
          </FormItem>
        )}
      </FormField>

      <Button type='submit'>Update preferences</Button>
    </form>
  )
}
