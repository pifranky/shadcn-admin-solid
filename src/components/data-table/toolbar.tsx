import { For, Show } from 'solid-js'
import { type Table } from '@tanstack/solid-table'
import { X } from 'lucide-solid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DataTableFacetedFilter,
  type FacetedFilterOption,
} from './faceted-filter'
import { DataTableViewOptions } from './view-options'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
  searchKey?: string
  filters?: {
    columnId: string
    title: string
    options: FacetedFilterOption[]
  }[]
}

export function DataTableToolbar<TData>(props: DataTableToolbarProps<TData>) {
  const isFiltered = () =>
    props.table.getState().columnFilters.length > 0 ||
    !!props.table.getState().globalFilter

  return (
    <div class='flex items-center justify-between'>
      <div class='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Show
          when={props.searchKey}
          fallback={
            <Input
              placeholder={props.searchPlaceholder ?? 'Filter...'}
              value={props.table.getState().globalFilter ?? ''}
              onInput={(event) =>
                props.table.setGlobalFilter(event.currentTarget.value)
              }
              class='h-8 w-37.5 lg:w-62.5'
            />
          }
        >
          {(searchKey) => (
            <Input
              placeholder={props.searchPlaceholder ?? 'Filter...'}
              value={
                (props.table
                  .getColumn(searchKey())
                  ?.getFilterValue() as string) ?? ''
              }
              onInput={(event) =>
                props.table
                  .getColumn(searchKey())
                  ?.setFilterValue(event.currentTarget.value)
              }
              class='h-8 w-37.5 lg:w-62.5'
            />
          )}
        </Show>
        <div class='flex gap-x-2'>
          <For each={props.filters ?? []}>
            {(filter) => (
              <Show when={props.table.getColumn(filter.columnId)}>
                {(column) => (
                  <DataTableFacetedFilter
                    column={column()}
                    title={filter.title}
                    options={filter.options}
                  />
                )}
              </Show>
            )}
          </For>
        </div>
        <Show when={isFiltered()}>
          <Button
            variant='ghost'
            onClick={() => {
              props.table.resetColumnFilters()
              props.table.setGlobalFilter('')
            }}
            class='h-8 px-2 lg:px-3'
          >
            Reset
            <X class='ms-2 h-4 w-4' />
          </Button>
        </Show>
      </div>
      <DataTableViewOptions table={props.table} />
    </div>
  )
}
