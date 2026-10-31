import { z } from 'zod'
import { MailPlus, Send } from 'lucide-solid'
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
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import { roles } from '../data/data'

const formSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === '' ? 'Please enter an email to invite.' : undefined,
  }),
  role: z.string().min(1, 'Role is required.'),
  desc: z.string().optional(),
})

type UserInviteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersInviteDialog(props: UserInviteDialogProps) {
  const form = createForm({
    schema: formSchema,
    defaultValues: { email: '', role: '', desc: '' },
    onSubmit: (values) => {
      form.reset()
      showSubmittedData(values)
      props.onOpenChange(false)
    },
  })

  return (
    <Dialog
      open={props.open}
      onOpenChange={(state) => {
        form.reset()
        props.onOpenChange(state)
      }}
    >
      <DialogContent class='sm:max-w-md'>
        <DialogHeader class='text-start'>
          <DialogTitle class='flex items-center gap-2'>
            <MailPlus /> Invite User
          </DialogTitle>
          <DialogDescription>
            Invite new user to join your team by sending them an email
            invitation. Assign a role to define their access level.
          </DialogDescription>
        </DialogHeader>
        <form
          id='user-invite-form'
          onSubmit={form.handleSubmit}
          class='space-y-4'
          novalidate
        >
          <FormField form={form} name='email'>
            {(field) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input
                  type='email'
                  placeholder='eg: john.doe@gmail.com'
                  {...field.inputProps}
                />
                <FormMessage />
              </FormItem>
            )}
          </FormField>
          <FormField form={form} name='role'>
            {(field) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <SelectDropdown
                  id={field.id}
                  value={field.value()}
                  onValueChange={field.setValue}
                  invalid={!!field.error()}
                  placeholder='Select a role'
                  class='w-full'
                  items={roles.map(({ label, value }) => ({
                    label,
                    value,
                  }))}
                />
                <FormMessage />
              </FormItem>
            )}
          </FormField>
          <FormField form={form} name='desc'>
            {(field) => (
              <FormItem>
                <FormLabel>Description (optional)</FormLabel>
                <Textarea
                  class='resize-none'
                  placeholder='Add a personal note to your invitation (optional)'
                  {...field.inputProps}
                />
                <FormMessage />
              </FormItem>
            )}
          </FormField>
        </form>
        <DialogFooter class='gap-y-2'>
          <DialogClose as={Button} variant='outline'>
            Cancel
          </DialogClose>
          <Button type='submit' form='user-invite-form'>
            Invite <Send />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
