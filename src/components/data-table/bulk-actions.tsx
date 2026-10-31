import {
  createEffect,
  createSignal,
  on,
  onCleanup,
  Show,
  type JSX,
} from 'solid-js'
import { type Table } from '@tanstack/solid-table'
import { X } from 'lucide-solid'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
  entityName: string
  children: JSX.Element
}

/**
 * A modular toolbar for displaying bulk actions when table rows are selected.
 *
 * @template TData The type of data in the table.
 * @param {object} props The component props.
 * @param {Table<TData>} props.table The solid-table instance.
 * @param {string} props.entityName The name of the entity being acted upon (e.g., "task", "user").
 * @param {JSX.Element} props.children The action buttons to be rendered inside the toolbar.
 * @returns {JSX.Element} The rendered component or nothing if no rows are selected.
 */
export function DataTableBulkActions<TData>(
  props: DataTableBulkActionsProps<TData>
) {
  const selectedCount = () =>
    props.table.getFilteredSelectedRowModel().rows.length
  let toolbarRef: HTMLDivElement | undefined
  const [announcement, setAnnouncement] = createSignal('')

  // Announce selection changes to screen readers
  createEffect(
    on(selectedCount, (count) => {
      if (count > 0) {
        const message = `${count} ${props.entityName}${count > 1 ? 's' : ''} selected. Bulk actions toolbar is available.`
        setAnnouncement(message)

        // Clear announcement after a delay
        const timer = setTimeout(() => setAnnouncement(''), 3000)
        onCleanup(() => clearTimeout(timer))
      }
    })
  )

  const handleClearSelection = () => {
    props.table.resetRowSelection()
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    const buttons = toolbarRef?.querySelectorAll('button')
    if (!buttons) return

    const currentIndex = Array.from(buttons).findIndex(
      (button) => button === document.activeElement
    )

    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault()
        const nextIndex = (currentIndex + 1) % buttons.length
        buttons[nextIndex]?.focus()
        break
      }
      case 'ArrowLeft': {
        event.preventDefault()
        const prevIndex =
          currentIndex === 0 ? buttons.length - 1 : currentIndex - 1
        buttons[prevIndex]?.focus()
        break
      }
      case 'Home':
        event.preventDefault()
        buttons[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        buttons[buttons.length - 1]?.focus()
        break
      case 'Escape': {
        // Check if the Escape key came from a dropdown trigger or content
        const target = event.target as HTMLElement
        const activeElement = document.activeElement as HTMLElement

        const isFromDropdown =
          target?.closest('[aria-haspopup]') ||
          activeElement?.closest('[aria-haspopup]') ||
          activeElement?.closest('[data-slot="dropdown-menu-content"]') ||
          target?.closest('[data-slot="dropdown-menu-content"]')

        if (isFromDropdown) {
          // Escape was meant for the dropdown - don't clear selection
          return
        }

        // Escape was meant for the toolbar - clear selection
        event.preventDefault()
        handleClearSelection()
        break
      }
    }
  }

  return (
    <Show when={selectedCount() > 0}>
      {/* Live region for screen reader announcements */}
      <div aria-live='polite' aria-atomic='true' class='sr-only' role='status'>
        {announcement()}
      </div>

      <div
        ref={toolbarRef}
        role='toolbar'
        aria-label={`Bulk actions for ${selectedCount()} selected ${props.entityName}${selectedCount() > 1 ? 's' : ''}`}
        aria-describedby='bulk-actions-description'
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        class={cn(
          'fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl',
          'transition-all delay-100 duration-300 ease-out hover:scale-105',
          'focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none'
        )}
      >
        <div
          class={cn(
            'p-2 shadow-xl',
            'rounded-xl border',
            'bg-background/95 backdrop-blur-lg supports-backdrop-filter:bg-background/60',
            'flex items-center gap-x-2'
          )}
        >
          <Tooltip>
            <TooltipTrigger
              as={Button}
              variant='outline'
              size='icon'
              onClick={handleClearSelection}
              class='size-6 rounded-full'
              aria-label='Clear selection'
              title='Clear selection (Escape)'
            >
              <X />
              <span class='sr-only'>Clear selection</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear selection (Escape)</p>
            </TooltipContent>
          </Tooltip>

          <Separator class='h-5' orientation='vertical' aria-hidden='true' />

          <div
            class='flex items-center gap-x-1 text-sm'
            id='bulk-actions-description'
          >
            <Badge
              variant='default'
              class='min-w-8 rounded-lg'
              aria-label={`${selectedCount()} selected`}
            >
              {selectedCount()}
            </Badge>{' '}
            <span class='hidden sm:inline'>
              {props.entityName}
              {selectedCount() > 1 ? 's' : ''}
            </span>{' '}
            selected
          </div>

          <Separator class='h-5' orientation='vertical' aria-hidden='true' />

          {props.children}
        </div>
      </div>
    </Show>
  )
}
