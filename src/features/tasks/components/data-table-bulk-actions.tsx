import { createSignal, For, type Component, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { type Table } from '@tanstack/solid-table'
import { Trash2, CircleArrowUp, ArrowUpDown, Download } from 'lucide-solid'
import { toast } from 'solid-sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { priorities, statuses } from '../data/data'
import { type Task } from '../data/schema'
import { TasksMultiDeleteDialog } from './tasks-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

/** An icon button that opens a dropdown and shows a tooltip on hover. */
function BulkDropdown(props: {
  label: string
  icon: JSX.Element
  options: {
    value: string
    label: string
    icon: Component<{ class?: string }>
  }[]
  onSelect: (value: string) => void
}) {
  return (
    <DropdownMenu gutter={14}>
      <Tooltip>
        <TooltipTrigger
          as={(triggerProps: Record<string, unknown>) => (
            <DropdownMenuTrigger
              as={Button}
              variant='outline'
              size='icon'
              class='size-8'
              aria-label={props.label}
              title={props.label}
              {...triggerProps}
            >
              {props.icon}
              <span class='sr-only'>{props.label}</span>
            </DropdownMenuTrigger>
          )}
        />
        <TooltipContent>
          <p>{props.label}</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent>
        <For each={props.options}>
          {(option) => (
            <DropdownMenuItem onSelect={() => props.onSelect(option.value)}>
              <Dynamic
                component={option.icon}
                class='size-4 text-muted-foreground'
              />
              {option.label}
            </DropdownMenuItem>
          )}
        </For>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DataTableBulkActions<TData>(
  props: DataTableBulkActionsProps<TData>
) {
  const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false)
  const selectedTasks = () =>
    props.table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original as Task)

  const handleBulkStatusChange = (status: string) => {
    const count = selectedTasks().length
    toast.promise(sleep(2000), {
      loading: 'Updating status...',
      success: () => {
        props.table.resetRowSelection()
        return `Status updated to "${status}" for ${count} task${count > 1 ? 's' : ''}.`
      },
      error: 'Error',
    })
    props.table.resetRowSelection()
  }

  const handleBulkPriorityChange = (priority: string) => {
    const count = selectedTasks().length
    toast.promise(sleep(2000), {
      loading: 'Updating priority...',
      success: () => {
        props.table.resetRowSelection()
        return `Priority updated to "${priority}" for ${count} task${count > 1 ? 's' : ''}.`
      },
      error: 'Error',
    })
    props.table.resetRowSelection()
  }

  const handleBulkExport = () => {
    const count = selectedTasks().length
    toast.promise(sleep(2000), {
      loading: 'Exporting tasks...',
      success: () => {
        props.table.resetRowSelection()
        return `Exported ${count} task${count > 1 ? 's' : ''} to CSV.`
      },
      error: 'Error',
    })
    props.table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={props.table} entityName='task'>
        <BulkDropdown
          label='Update status'
          icon={<CircleArrowUp />}
          options={statuses}
          onSelect={handleBulkStatusChange}
        />

        <BulkDropdown
          label='Update priority'
          icon={<ArrowUpDown />}
          options={priorities}
          onSelect={handleBulkPriorityChange}
        />

        <Tooltip>
          <TooltipTrigger
            as={Button}
            variant='outline'
            size='icon'
            onClick={() => handleBulkExport()}
            class='size-8'
            aria-label='Export tasks'
            title='Export tasks'
          >
            <Download />
            <span class='sr-only'>Export tasks</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export tasks</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            as={Button}
            variant='destructive'
            size='icon'
            onClick={() => setShowDeleteConfirm(true)}
            class='size-8'
            aria-label='Delete selected tasks'
            title='Delete selected tasks'
          >
            <Trash2 />
            <span class='sr-only'>Delete selected tasks</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected tasks</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <TasksMultiDeleteDialog
        open={showDeleteConfirm()}
        onOpenChange={setShowDeleteConfirm}
        table={props.table}
      />
    </>
  )
}
