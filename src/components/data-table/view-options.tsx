import { For } from 'solid-js'
import { type Table } from '@tanstack/solid-table'
import { SlidersHorizontal } from 'lucide-solid'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type DataTableViewOptionsProps<TData> = {
  table: Table<TData>
}

export function DataTableViewOptions<TData>(
  props: DataTableViewOptionsProps<TData>
) {
  return (
    <DropdownMenu modal={false} placement='bottom-end'>
      <DropdownMenuTrigger
        as={Button}
        variant='outline'
        size='sm'
        class='ms-auto hidden h-8 lg:flex'
      >
        <SlidersHorizontal class='size-4' />
        View
      </DropdownMenuTrigger>
      <DropdownMenuContent class='w-37.5'>
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <For
          each={props.table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide()
            )}
        >
          {(column) => (
            <DropdownMenuCheckboxItem
              class='capitalize'
              checked={column.getIsVisible()}
              onChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          )}
        </For>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
