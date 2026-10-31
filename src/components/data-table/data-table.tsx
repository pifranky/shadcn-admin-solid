import { For, Show } from 'solid-js'
import { flexRender, type Table as TableType } from '@tanstack/solid-table'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type DataTableProps<TData> = {
  table: TableType<TData>
  class?: string
  /** Extra classes for every header/body row (e.g. `group/row`). */
  rowClass?: string
  /** Extra classes for every header/body cell. */
  cellClass?: string
}

/** Renders a solid-table instance with column `meta` classes applied. */
export function DataTable<TData>(props: DataTableProps<TData>) {
  return (
    <Table class={props.class}>
      <TableHeader>
        <For each={props.table.getHeaderGroups()}>
          {(headerGroup) => (
            <TableRow class={props.rowClass}>
              <For each={headerGroup.headers}>
                {(header) => (
                  <TableHead
                    colSpan={header.colSpan}
                    class={cn(
                      props.cellClass,
                      header.column.columnDef.meta?.class,
                      header.column.columnDef.meta?.thClass
                    )}
                  >
                    <Show when={!header.isPlaceholder}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Show>
                  </TableHead>
                )}
              </For>
            </TableRow>
          )}
        </For>
      </TableHeader>
      <TableBody>
        <Show
          when={props.table.getRowModel().rows.length}
          fallback={
            <TableRow>
              <TableCell
                colSpan={props.table.getAllColumns().length}
                class='h-24 text-center'
              >
                No results.
              </TableCell>
            </TableRow>
          }
        >
          <For each={props.table.getRowModel().rows}>
            {(row) => (
              <TableRow
                data-state={row.getIsSelected() ? 'selected' : undefined}
                class={props.rowClass}
              >
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <TableCell
                      class={cn(
                        props.cellClass,
                        cell.column.columnDef.meta?.class,
                        cell.column.columnDef.meta?.tdClass
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  )}
                </For>
              </TableRow>
            )}
          </For>
        </Show>
      </TableBody>
    </Table>
  )
}
