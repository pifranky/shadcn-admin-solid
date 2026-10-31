import { type Row } from '@tanstack/solid-table'
import { Ellipsis, Trash2, UserPen } from 'lucide-solid'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type User } from '../data/schema'
import { useUsers } from './users-provider'

type DataTableRowActionsProps = {
  row: Row<User>
}

export function DataTableRowActions(props: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useUsers()
  return (
    <DropdownMenu modal={false} placement='bottom-end'>
      <DropdownMenuTrigger
        as={Button}
        variant='ghost'
        class='flex h-8 w-8 p-0 data-expanded:bg-muted'
      >
        <Ellipsis class='h-4 w-4' />
        <span class='sr-only'>Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent class='w-40'>
        <DropdownMenuItem
          onSelect={() => {
            setCurrentRow(props.row.original)
            setOpen('edit')
          }}
        >
          Edit
          <DropdownMenuShortcut>
            <UserPen size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            setCurrentRow(props.row.original)
            setOpen('delete')
          }}
          class='text-red-500!'
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
