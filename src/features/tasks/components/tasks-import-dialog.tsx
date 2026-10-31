import { z } from 'zod'
import { createForm } from '@/lib/form'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  file: z
    .instanceof(FileList, { message: 'Please upload a file.' })
    .refine((files) => files.length > 0, {
      message: 'Please upload a file.',
    })
    .refine(
      (files) => ['text/csv'].includes(files?.[0]?.type),
      'Please upload csv format.'
    ),
})

type TaskImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TasksImportDialog(props: TaskImportDialogProps) {
  const form = createForm({
    schema: formSchema,
    defaultValues: { file: undefined },
    onSubmit: (data) => {
      const file = data.file
      if (file && file[0]) {
        const fileDetails = {
          name: file[0].name,
          size: file[0].size,
          type: file[0].type,
        }
        showSubmittedData(fileDetails, 'You have imported the following file:')
      }
      props.onOpenChange(false)
    },
  })

  return (
    <Dialog
      open={props.open}
      onOpenChange={(val) => {
        props.onOpenChange(val)
        form.reset()
      }}
    >
      <DialogContent class='gap-2 sm:max-w-sm'>
        <DialogHeader class='text-start'>
          <DialogTitle>Import Tasks</DialogTitle>
          <DialogDescription>
            Import tasks quickly from a CSV file.
          </DialogDescription>
        </DialogHeader>
        <form id='task-import-form' onSubmit={form.handleSubmit}>
          <FormField form={form} name='file'>
            {(field) => (
              <FormItem class='my-2'>
                <FormLabel>File</FormLabel>
                <Input
                  id={field.id}
                  type='file'
                  accept='text/csv'
                  aria-invalid={!!field.error()}
                  onChange={(e) => field.setValue(e.currentTarget.files)}
                  class='h-8 py-0'
                />
                <FormMessage />
              </FormItem>
            )}
          </FormField>
        </form>
        <DialogFooter class='gap-2'>
          <DialogClose as={Button} variant='outline'>
            Close
          </DialogClose>
          <Button type='submit' form='task-import-form'>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
