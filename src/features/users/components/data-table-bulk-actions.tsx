import { createSignal, type JSX } from 'solid-js'
import { type Table } from '@tanstack/solid-table'
import { Trash2, UserX, UserCheck, Mail } from 'lucide-solid'
import { toast } from 'solid-sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type User } from '../data/schema'
import { UsersMultiDeleteDialog } from './users-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

function ActionButton(props: {
  label: string
  variant?: 'outline' | 'destructive'
  onClick: () => void
  children: JSX.Element
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        as={Button}
        variant={props.variant ?? 'outline'}
        size='icon'
        onClick={props.onClick}
        class='size-8'
        aria-label={props.label}
        title={props.label}
      >
        {props.children}
        <span class='sr-only'>{props.label}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{props.label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export function DataTableBulkActions<TData>(
  props: DataTableBulkActionsProps<TData>
) {
  const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false)
  const selectedUsers = () =>
    props.table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original as User)

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    const count = selectedUsers().length
    toast.promise(sleep(2000), {
      loading: `${status === 'active' ? 'Activating' : 'Deactivating'} users...`,
      success: () => {
        props.table.resetRowSelection()
        return `${status === 'active' ? 'Activated' : 'Deactivated'} ${count} user${count > 1 ? 's' : ''}`
      },
      error: `Error ${status === 'active' ? 'activating' : 'deactivating'} users`,
    })
    props.table.resetRowSelection()
  }

  const handleBulkInvite = () => {
    const count = selectedUsers().length
    toast.promise(sleep(2000), {
      loading: 'Inviting users...',
      success: () => {
        props.table.resetRowSelection()
        return `Invited ${count} user${count > 1 ? 's' : ''}`
      },
      error: 'Error inviting users',
    })
    props.table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={props.table} entityName='user'>
        <ActionButton label='Invite selected users' onClick={handleBulkInvite}>
          <Mail />
        </ActionButton>
        <ActionButton
          label='Activate selected users'
          onClick={() => handleBulkStatusChange('active')}
        >
          <UserCheck />
        </ActionButton>
        <ActionButton
          label='Deactivate selected users'
          onClick={() => handleBulkStatusChange('inactive')}
        >
          <UserX />
        </ActionButton>
        <ActionButton
          label='Delete selected users'
          variant='destructive'
          onClick={() => setShowDeleteConfirm(true)}
        >
          <Trash2 />
        </ActionButton>
      </BulkActionsToolbar>

      <UsersMultiDeleteDialog
        table={props.table}
        open={showDeleteConfirm()}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
