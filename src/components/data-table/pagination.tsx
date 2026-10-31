import { For, Show } from 'solid-js'
import { type Table } from '@tanstack/solid-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-solid'
import { cn, getPageNumbers } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SelectDropdown } from '@/components/select-dropdown'

type DataTablePaginationProps<TData> = {
  table: Table<TData>
  class?: string
}

export function DataTablePagination<TData>(
  props: DataTablePaginationProps<TData>
) {
  const currentPage = () => props.table.getState().pagination.pageIndex + 1
  const totalPages = () => props.table.getPageCount()
  const pageNumbers = () => getPageNumbers(currentPage(), totalPages())

  return (
    <div
      class={cn(
        'flex items-center justify-between overflow-clip px-2',
        '@max-2xl/content:flex-col-reverse @max-2xl/content:gap-4',
        props.class
      )}
      style={{ 'overflow-clip-margin': '1px' }}
    >
      <div class='flex w-full items-center justify-between'>
        <div class='flex w-25 items-center justify-center text-sm font-medium @2xl/content:hidden'>
          Page {currentPage()} of {totalPages()}
        </div>
        <div class='flex items-center gap-2 @max-2xl/content:flex-row-reverse'>
          <SelectDropdown
            value={`${props.table.getState().pagination.pageSize}`}
            onValueChange={(value) => props.table.setPageSize(Number(value))}
            items={[10, 20, 30, 40, 50].map((size) => ({
              label: `${size}`,
              value: `${size}`,
            }))}
            aria-label='Rows per page'
            class='h-8 w-17.5'
          />
          <p class='hidden text-sm font-medium sm:block'>Rows per page</p>
        </div>
      </div>

      <div class='flex items-center sm:space-x-6 lg:space-x-8'>
        <div class='flex w-25 items-center justify-center text-sm font-medium @max-3xl/content:hidden'>
          Page {currentPage()} of {totalPages()}
        </div>
        <div class='flex items-center space-x-2'>
          <Button
            variant='outline'
            class='size-8 p-0 @max-md/content:hidden'
            onClick={() => props.table.setPageIndex(0)}
            disabled={!props.table.getCanPreviousPage()}
          >
            <span class='sr-only'>Go to first page</span>
            <ChevronsLeft class='h-4 w-4 rtl:rotate-180' />
          </Button>
          <Button
            variant='outline'
            class='size-8 p-0'
            onClick={() => props.table.previousPage()}
            disabled={!props.table.getCanPreviousPage()}
          >
            <span class='sr-only'>Go to previous page</span>
            <ChevronLeft class='h-4 w-4 rtl:rotate-180' />
          </Button>

          {/* Page number buttons */}
          <For each={pageNumbers()}>
            {(pageNumber) => (
              <div class='flex items-center'>
                <Show
                  when={pageNumber !== '...'}
                  fallback={
                    <span class='px-1 text-sm text-muted-foreground'>...</span>
                  }
                >
                  <Button
                    variant={
                      currentPage() === pageNumber ? 'default' : 'outline'
                    }
                    class='h-8 min-w-8 px-2'
                    onClick={() =>
                      props.table.setPageIndex((pageNumber as number) - 1)
                    }
                  >
                    <span class='sr-only'>Go to page {pageNumber}</span>
                    {pageNumber}
                  </Button>
                </Show>
              </div>
            )}
          </For>

          <Button
            variant='outline'
            class='size-8 p-0'
            onClick={() => props.table.nextPage()}
            disabled={!props.table.getCanNextPage()}
          >
            <span class='sr-only'>Go to next page</span>
            <ChevronRight class='h-4 w-4 rtl:rotate-180' />
          </Button>
          <Button
            variant='outline'
            class='size-8 p-0 @max-md/content:hidden'
            onClick={() =>
              props.table.setPageIndex(props.table.getPageCount() - 1)
            }
            disabled={!props.table.getCanNextPage()}
          >
            <span class='sr-only'>Go to last page</span>
            <ChevronsRight class='h-4 w-4 rtl:rotate-180' />
          </Button>
        </div>
      </div>
    </div>
  )
}
