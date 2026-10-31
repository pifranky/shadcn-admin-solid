import { Show } from 'solid-js'
import { UsersActionDialog } from './users-action-dialog'
import { UsersDeleteDialog } from './users-delete-dialog'
import { UsersInviteDialog } from './users-invite-dialog'
import { useUsers } from './users-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()
  return (
    <>
      <UsersActionDialog
        open={open() === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      <UsersInviteDialog
        open={open() === 'invite'}
        onOpenChange={() => setOpen('invite')}
      />

      {/* Keyed so the dialogs re-initialise for each row */}
      <Show when={currentRow()} keyed>
        {(row) => (
          <>
            <UsersActionDialog
              open={open() === 'edit'}
              onOpenChange={() => {
                setOpen('edit')
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }}
              currentRow={row}
            />

            <UsersDeleteDialog
              open={open() === 'delete'}
              onOpenChange={() => {
                setOpen('delete')
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }}
              currentRow={row}
            />
          </>
        )}
      </Show>
    </>
  )
}
