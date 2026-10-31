import { createSignal } from 'solid-js'
import { AlertTriangle } from 'lucide-solid'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type User } from '../data/schema'

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog(props: UserDeleteDialogProps) {
  const [value, setValue] = createSignal('')

  const handleDelete = () => {
    if (value().trim() !== props.currentRow.username) return

    props.onOpenChange(false)
    showSubmittedData(props.currentRow, 'The following user has been deleted:')
  }

  return (
    <ConfirmDialog
      open={props.open}
      onOpenChange={props.onOpenChange}
      form='users-delete-form'
      disabled={value().trim() !== props.currentRow.username}
      title={
        <span class='text-destructive'>
          <AlertTriangle
            class='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete User
        </span>
      }
      desc={
        <form
          id='users-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          class='space-y-4'
        >
          <p class='mb-2'>
            Are you sure you want to delete{' '}
            <span class='font-bold'>{props.currentRow.username}</span>?
            <br />
            This action will permanently remove the user with the role of{' '}
            <span class='font-bold'>
              {props.currentRow.role.toUpperCase()}
            </span>{' '}
            from the system. This cannot be undone.
          </p>

          <Label class='my-2 flex flex-col items-start gap-1.5'>
            Username:
            <Input
              value={value()}
              onInput={(e) => setValue(e.currentTarget.value)}
              placeholder='Enter username to confirm deletion.'
              autofocus
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText='Delete'
      destructive
    />
  )
}
