import { createMemo, createSignal, For, splitProps } from 'solid-js'
import {
  addDays,
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-solid'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

type CalendarProps = {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  /** Show month / year dropdowns in the caption (like react-day-picker). */
  captionLayout?: 'label' | 'dropdown'
  fromYear?: number
  toYear?: number
  class?: string
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = Array.from({ length: 12 }, (_, i) =>
  format(new Date(2000, i, 1), 'MMM')
)

/** A minimal single-date calendar (replaces react-day-picker). */
function Calendar(props: CalendarProps) {
  const [local] = splitProps(props, [
    'selected',
    'onSelect',
    'disabled',
    'captionLayout',
    'fromYear',
    'toYear',
    'class',
  ])
  const [month, setMonth] = createSignal(
    startOfMonth(local.selected ?? new Date())
  )

  const days = createMemo(() => {
    const start = startOfWeek(month())
    return Array.from({ length: 42 }, (_, i) => addDays(start, i))
  })

  const years = () => {
    const from = local.fromYear ?? 1900
    const to = local.toYear ?? new Date().getFullYear()
    return Array.from({ length: to - from + 1 }, (_, i) => to - i)
  }

  const selectClass =
    'h-7 rounded-md border border-input bg-background px-1.5 text-sm font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50'

  return (
    <div data-slot='calendar' class={cn('w-fit p-3', local.class)}>
      <div class='relative flex h-8 items-center justify-center gap-1.5'>
        <button
          type='button'
          aria-label='Go to the Previous Month'
          class={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'absolute inset-s-0 size-8 p-0'
          )}
          onClick={() => setMonth((m) => addMonths(m, -1))}
        >
          <ChevronLeftIcon class='size-4 rtl:rotate-180' />
        </button>
        {local.captionLayout === 'dropdown' ? (
          <>
            <select
              aria-label='Choose the Month'
              class={selectClass}
              value={month().getMonth()}
              onChange={(e) =>
                setMonth(
                  new Date(month().getFullYear(), +e.currentTarget.value, 1)
                )
              }
            >
              <For each={MONTHS}>
                {(name, i) => <option value={i()}>{name}</option>}
              </For>
            </select>
            <select
              aria-label='Choose the Year'
              class={selectClass}
              value={month().getFullYear()}
              onChange={(e) =>
                setMonth(
                  new Date(+e.currentTarget.value, month().getMonth(), 1)
                )
              }
            >
              <For each={years()}>
                {(year) => <option value={year}>{year}</option>}
              </For>
            </select>
          </>
        ) : (
          <div class='text-sm font-medium'>{format(month(), 'MMMM yyyy')}</div>
        )}
        <button
          type='button'
          aria-label='Go to the Next Month'
          class={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'absolute inset-e-0 size-8 p-0'
          )}
          onClick={() => setMonth((m) => addMonths(m, 1))}
        >
          <ChevronRightIcon class='size-4 rtl:rotate-180' />
        </button>
      </div>
      <div class='mt-4 grid grid-cols-7 gap-y-1' role='grid'>
        <For each={WEEKDAYS}>
          {(day) => (
            <div class='flex h-8 items-center justify-center text-[0.8rem] font-normal text-muted-foreground'>
              {day}
            </div>
          )}
        </For>
        <For each={days()}>
          {(day) => {
            const isDisabled = () => local.disabled?.(day) ?? false
            const isSelected = () =>
              !!local.selected && isSameDay(day, local.selected)
            return (
              <button
                type='button'
                role='gridcell'
                disabled={isDisabled()}
                data-selected={isSelected()}
                data-outside={!isSameMonth(day, month())}
                aria-label={format(day, 'PPPP')}
                class={cn(
                  buttonVariants({ variant: 'ghost', size: 'icon' }),
                  'size-8 p-0 font-normal',
                  isToday(day) && 'bg-accent text-accent-foreground',
                  'data-[outside=true]:text-muted-foreground',
                  'data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:hover:bg-primary'
                )}
                onClick={() => local.onSelect?.(isSelected() ? undefined : day)}
              >
                {format(day, 'd')}
              </button>
            )
          }}
        </For>
      </div>
    </div>
  )
}

export { Calendar }
