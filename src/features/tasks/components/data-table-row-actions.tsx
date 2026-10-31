import { For } from 'solid-js'
import { type Row } from '@tanstack/solid-table'
import { Ellipsis, Trash2 } from 'lucide-solid'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { labels } from '../data/data'
import { taskSchema } from '../data/schema'
import { useTasks } from './tasks-provider'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>(
  props: DataTableRowActionsProps<TData>
) {
  const task = taskSchema.parse(props.row.original)

  const { setOpen, setCurrentRow } = useTasks()

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
            setCurrentRow(task)
            setOpen('update')
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Make a copy</DropdownMenuItem>
        <DropdownMenuItem disabled>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.label}>
              <For each={labels}>
                {(label) => (
                  <DropdownMenuRadioItem value={label.value}>
                    {label.label}
                  </DropdownMenuRadioItem>
                )}
              </For>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            setCurrentRow(task)
            setOpen('delete')
          }}
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
