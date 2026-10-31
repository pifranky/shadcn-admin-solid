import { Show } from 'solid-js'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { TasksImportDialog } from './tasks-import-dialog'
import { TasksMutateDrawer } from './tasks-mutate-drawer'
import { useTasks } from './tasks-provider'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTasks()
  return (
    <>
      <TasksMutateDrawer
        open={open() === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <TasksImportDialog
        open={open() === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {/* Keyed so the drawer's form re-initialises for each row */}
      <Show when={currentRow()} keyed>
        {(row) => (
          <>
            <TasksMutateDrawer
              open={open() === 'update'}
              onOpenChange={() => {
                setOpen('update')
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }}
              currentRow={row}
            />

            <ConfirmDialog
              destructive
              open={open() === 'delete'}
              onOpenChange={() => {
                setOpen('delete')
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }}
              handleConfirm={() => {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
                showSubmittedData(row, 'The following task has been deleted:')
              }}
              class='max-w-md'
              title={`Delete this task: ${row.id} ?`}
              desc={
                <>
                  You are about to delete a task with the ID{' '}
                  <strong>{row.id}</strong>. <br />
                  This action cannot be undone.
                </>
              }
              confirmText='Delete'
            />
          </>
        )}
      </Show>
    </>
  )
}
