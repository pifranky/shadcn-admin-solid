import { For } from 'solid-js'
import { z } from 'zod'
import { createForm } from '@/lib/form'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemLabel,
} from '@/components/ui/radio-group'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SelectDropdown } from '@/components/select-dropdown'
import { type Task } from '../data/schema'

type TaskMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Task
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  status: z.string().min(1, 'Please select a status.'),
  label: z.string().min(1, 'Please select a label.'),
  priority: z.string().min(1, 'Please choose a priority.'),
})

function RadioOptions(props: {
  value: string
  onChange: (value: string) => void
  invalid: boolean
  options: { value: string; label: string }[]
}) {
  return (
    <RadioGroup
      value={props.value}
      onChange={props.onChange}
      validationState={props.invalid ? 'invalid' : 'valid'}
      class='flex flex-col space-y-1'
    >
      <For each={props.options}>
        {(option) => (
          <RadioGroupItem value={option.value}>
            <RadioGroupItemLabel class='text-sm font-normal'>
              {option.label}
            </RadioGroupItemLabel>
          </RadioGroupItem>
        )}
      </For>
    </RadioGroup>
  )
}

export function TasksMutateDrawer(props: TaskMutateDrawerProps) {
  const isUpdate = () => !!props.currentRow
  const formId = props.currentRow
    ? `tasks-form-${props.currentRow.id}`
    : 'tasks-form'

  const form = createForm({
    schema: formSchema,
    defaultValues: props.currentRow ?? {
      title: '',
      status: '',
      label: '',
      priority: '',
    },
    onSubmit: (data) => {
      // do something with the form data
      props.onOpenChange(false)
      form.reset()
      showSubmittedData(data)
    },
  })

  return (
    <Sheet
      open={props.open}
      onOpenChange={(v) => {
        props.onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent class='flex flex-col'>
        <SheetHeader class='text-start'>
          <SheetTitle>{isUpdate() ? 'Update' : 'Create'} Task</SheetTitle>
          <SheetDescription>
            {isUpdate()
              ? 'Update the task by providing necessary info.'
              : 'Add a new task by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <form
          id={formId}
          onSubmit={form.handleSubmit}
          class='flex-1 space-y-6 overflow-y-auto px-4'
        >
          <FormField form={form} name='title'>
            {(field) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <Input {...field.inputProps} placeholder='Enter a title' />
                <FormMessage />
              </FormItem>
            )}
          </FormField>
          <FormField form={form} name='status'>
            {(field) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <SelectDropdown
                  id={field.id}
                  value={field.value()}
                  onValueChange={field.setValue}
                  invalid={!!field.error()}
                  placeholder='Select dropdown'
                  class='w-full'
                  items={[
                    { label: 'In Progress', value: 'in progress' },
                    { label: 'Backlog', value: 'backlog' },
                    { label: 'Todo', value: 'todo' },
                    { label: 'Canceled', value: 'canceled' },
                    { label: 'Done', value: 'done' },
                  ]}
                />
                <FormMessage />
              </FormItem>
            )}
          </FormField>
          <FormField form={form} name='label'>
            {(field) => (
              <FormItem class='relative'>
                <FormLabel>Label</FormLabel>
                <RadioOptions
                  value={field.value()}
                  onChange={field.setValue}
                  invalid={!!field.error()}
                  options={[
                    { value: 'documentation', label: 'Documentation' },
                    { value: 'feature', label: 'Feature' },
                    { value: 'bug', label: 'Bug' },
                  ]}
                />
                <FormMessage />
              </FormItem>
            )}
          </FormField>
          <FormField form={form} name='priority'>
            {(field) => (
              <FormItem class='relative'>
                <FormLabel>Priority</FormLabel>
                <RadioOptions
                  value={field.value()}
                  onChange={field.setValue}
                  invalid={!!field.error()}
                  options={[
                    { value: 'high', label: 'High' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'low', label: 'Low' },
                  ]}
                />
                <FormMessage />
              </FormItem>
            )}
          </FormField>
        </form>
        <SheetFooter class='gap-2'>
          <SheetClose as={Button} variant='outline'>
            Close
          </SheetClose>
          <Button form={formId} type='submit'>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
