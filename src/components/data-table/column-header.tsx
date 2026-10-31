import { Match, Show, Switch } from 'solid-js'
import { type Column } from '@tanstack/solid-table'
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-solid'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>
  title: string
  class?: string
}

export function DataTableColumnHeader<TData, TValue>(
  props: DataTableColumnHeaderProps<TData, TValue>
) {
  return (
    <Show
      when={props.column.getCanSort()}
      fallback={<div class={cn(props.class)}>{props.title}</div>}
    >
      <div class={cn('flex items-center space-x-2', props.class)}>
        <DropdownMenu placement='bottom-start'>
          <DropdownMenuTrigger
            as={Button}
            variant='ghost'
            size='sm'
            class='-ms-3 h-8 data-expanded:bg-accent'
          >
            <span>{props.title}</span>
            <Switch fallback={<ChevronsUpDown class='ms-2 h-4 w-4' />}>
              <Match when={props.column.getIsSorted() === 'desc'}>
                <ArrowDown class='ms-2 h-4 w-4' />
              </Match>
              <Match when={props.column.getIsSorted() === 'asc'}>
                <ArrowUp class='ms-2 h-4 w-4' />
              </Match>
            </Switch>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={() => props.column.toggleSorting(false)}
            >
              <ArrowUp class='size-3.5 text-muted-foreground/70' />
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => props.column.toggleSorting(true)}>
              <ArrowDown class='size-3.5 text-muted-foreground/70' />
              Desc
            </DropdownMenuItem>
            <Show when={props.column.getCanHide()}>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => props.column.toggleVisibility(false)}
              >
                <EyeOff class='size-3.5 text-muted-foreground/70' />
                Hide
              </DropdownMenuItem>
            </Show>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Show>
  )
}
