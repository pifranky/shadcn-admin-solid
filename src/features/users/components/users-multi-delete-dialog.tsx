import { createSignal } from 'solid-js'
import { type Table } from '@tanstack/solid-table'
import { AlertTriangle } from 'lucide-solid'
import { toast } from 'solid-sonner'
import { sleep } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

type UserMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function UsersMultiDeleteDialog<TData>(
  props: UserMultiDeleteDialogProps<TData>
) {
  const [value, setValue] = createSignal('')

  const selectedRows = () => props.table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    if (value().trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }

    props.onOpenChange(false)

    const count = selectedRows().length
    toast.promise(sleep(2000), {
      loading: 'Deleting users...',
      success: () => {
        setValue('')
        props.table.resetRowSelection()
        return `Deleted ${count} ${count > 1 ? 'users' : 'user'}`
      },
      error: 'Error',
    })
  }

  return (
    <ConfirmDialog
      open={props.open}
      onOpenChange={props.onOpenChange}
      form='users-multi-delete-form'
      disabled={value().trim() !== CONFIRM_WORD}
      title={
        <span class='text-destructive'>
          <AlertTriangle
            class='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete {selectedRows().length}{' '}
          {selectedRows().length > 1 ? 'users' : 'user'}
        </span>
      }
      desc={
        <form
          id='users-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          class='space-y-4'
        >
          <p class='mb-2'>
            Are you sure you want to delete the selected users? <br />
            This action cannot be undone.
          </p>

          <Label class='my-4 flex flex-col items-start gap-1.5'>
            <span class=''>Confirm by typing "{CONFIRM_WORD}":</span>
            <Input
              value={value()}
              onInput={(e) => setValue(e.currentTarget.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
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
