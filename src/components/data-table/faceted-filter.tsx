import { For, Show, type Component } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { type Column } from '@tanstack/solid-table'
import { Check, CirclePlus } from 'lucide-solid'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

export type FacetedFilterOption = {
  label: string
  value: string
  icon?: Component<{ class?: string }>
}

type DataTableFacetedFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>
  title?: string
  options: FacetedFilterOption[]
}

export function DataTableFacetedFilter<TData, TValue>(
  props: DataTableFacetedFilterProps<TData, TValue>
) {
  const facets = () => props.column?.getFacetedUniqueValues()
  const selectedValues = () =>
    new Set((props.column?.getFilterValue() as string[]) ?? [])

  const toggle = (value: string) => {
    const next = selectedValues()
    if (next.has(value)) {
      next.delete(value)
    } else {
      next.add(value)
    }
    const filterValues = Array.from(next)
    props.column?.setFilterValue(filterValues.length ? filterValues : undefined)
  }

  return (
    <Popover placement='bottom-start'>
      <PopoverTrigger
        as={Button}
        variant='outline'
        size='sm'
        class='h-8 border-dashed'
      >
        <CirclePlus class='size-4' />
        {props.title}
        <Show when={selectedValues().size > 0}>
          <Separator orientation='vertical' class='mx-2 h-4' />
          <Badge
            variant='secondary'
            class='rounded-sm px-1 font-normal lg:hidden'
          >
            {selectedValues().size}
          </Badge>
          <div class='hidden space-x-1 lg:flex'>
            <Show
              when={selectedValues().size <= 2}
              fallback={
                <Badge variant='secondary' class='rounded-sm px-1 font-normal'>
                  {selectedValues().size} selected
                </Badge>
              }
            >
              <For
                each={props.options.filter((option) =>
                  selectedValues().has(option.value)
                )}
              >
                {(option) => (
                  <Badge
                    variant='secondary'
                    class='rounded-sm px-1 font-normal'
                  >
                    {option.label}
                  </Badge>
                )}
              </For>
            </Show>
          </div>
        </Show>
      </PopoverTrigger>
      <PopoverContent class='w-50 p-0'>
        <Command>
          <CommandInput placeholder={props.title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <For each={props.options}>
                {(option) => {
                  const isSelected = () => selectedValues().has(option.value)
                  return (
                    <CommandItem
                      value={option.label}
                      onSelect={() => toggle(option.value)}
                    >
                      <div
                        class={cn(
                          'flex size-4 items-center justify-center rounded-sm border border-primary',
                          isSelected()
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <Check class='h-4 w-4 text-background' />
                      </div>
                      <Show when={option.icon}>
                        <Dynamic
                          component={option.icon}
                          class='size-4 text-muted-foreground'
                        />
                      </Show>
                      <span>{option.label}</span>
                      <Show when={facets()?.get(option.value)}>
                        <span class='ms-auto flex h-4 w-4 items-center justify-center font-mono text-xs'>
                          {facets()?.get(option.value)}
                        </span>
                      </Show>
                    </CommandItem>
                  )
                }}
              </For>
            </CommandGroup>
            <Show when={selectedValues().size > 0}>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  value='Clear filters'
                  onSelect={() => props.column?.setFilterValue(undefined)}
                  class='justify-center text-center'
                >
                  Clear filters
                </CommandItem>
              </CommandGroup>
            </Show>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
