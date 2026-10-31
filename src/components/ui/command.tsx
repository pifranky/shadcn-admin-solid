import {
  createContext,
  createEffect,
  createSignal,
  onMount,
  splitProps,
  useContext,
  type Accessor,
  type ComponentProps,
  type JSX,
} from 'solid-js'
import { SearchIcon } from 'lucide-solid'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

/**
 * A small cmdk-like command palette for Solid.
 * Items filter themselves against the search text; empty groups and the
 * empty state are toggled with CSS `:has()` (see index.css).
 * Arrow keys / Enter navigate the visible items.
 */
type CommandContextValue = {
  search: Accessor<string>
  setSearch: (value: string) => void
  root: () => HTMLDivElement | undefined
}

const CommandContext = createContext<CommandContextValue>()

function useCommand() {
  const ctx = useContext(CommandContext)
  if (!ctx) throw new Error('Command components must be used within <Command>')
  return ctx
}

const ITEM_SELECTOR =
  '[data-slot=command-item]:not([hidden]):not([data-disabled=true])'

function matches(search: string, value: string) {
  const s = search.trim().toLowerCase()
  if (!s) return true
  const v = value.toLowerCase()
  return s.split(/\s+/).every((part) => v.includes(part))
}

function Command(props: ComponentProps<'div'>) {
  const [local, others] = splitProps(props, ['class', 'onKeyDown'])
  const [search, setSearch] = createSignal('')
  let rootRef: HTMLDivElement | undefined

  const items = () =>
    Array.from(rootRef?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? [])

  const select = (el: HTMLElement | undefined) => {
    rootRef
      ?.querySelectorAll('[data-slot=command-item][data-selected=true]')
      .forEach((n) => n.setAttribute('data-selected', 'false'))
    if (el) {
      el.setAttribute('data-selected', 'true')
      el.scrollIntoView({ block: 'nearest' })
    }
  }

  // Select the first visible item whenever the search changes
  createEffect(() => {
    search()
    queueMicrotask(() => select(items()[0]))
  })

  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    const list = items()
    const current = list.findIndex(
      (el) => el.getAttribute('data-selected') === 'true'
    )
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      select(list[Math.min(current + 1, list.length - 1)])
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      select(list[Math.max(current - 1, 0)])
    } else if (e.key === 'Enter' && current >= 0) {
      e.preventDefault()
      list[current].click()
    }
    if (typeof local.onKeyDown === 'function') local.onKeyDown(e)
  }

  return (
    <CommandContext.Provider value={{ search, setSearch, root: () => rootRef }}>
      <div
        ref={rootRef}
        data-slot='command'
        class={cn(
          'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
          local.class
        )}
        onKeyDown={onKeyDown}
        {...others}
      />
    </CommandContext.Provider>
  )
}

function CommandDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  class?: string
  showCloseButton?: boolean
  children: JSX.Element
}) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogHeader class='sr-only'>
        <DialogTitle>{props.title ?? 'Command Palette'}</DialogTitle>
        <DialogDescription>
          {props.description ?? 'Search for a command to run...'}
        </DialogDescription>
      </DialogHeader>
      <DialogContent
        class={cn('overflow-hidden p-0', props.class)}
        showCloseButton={props.showCloseButton ?? false}
      >
        <Command class='**:data-[slot=command-group]:px-2 **:data-[slot=command-group-heading]:px-2 **:data-[slot=command-group-heading]:font-medium **:data-[slot=command-group-heading]:text-muted-foreground **:data-[slot=command-input]:h-12 **:data-[slot=command-input-wrapper]:h-12 **:data-[slot=command-item]:px-2 **:data-[slot=command-item]:py-3 [&_[data-slot=command-input-wrapper]_svg]:h-5 [&_[data-slot=command-input-wrapper]_svg]:w-5 [&_[data-slot=command-item]_svg]:h-5 [&_[data-slot=command-item]_svg]:w-5'>
          {props.children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput(props: ComponentProps<'input'>) {
  const [local, others] = splitProps(props, ['class'])
  const ctx = useCommand()
  let inputRef: HTMLInputElement | undefined
  onMount(() => setTimeout(() => inputRef?.focus()))
  return (
    <div
      data-slot='command-input-wrapper'
      class='flex h-9 items-center gap-2 border-b px-3'
    >
      <SearchIcon class='size-4 shrink-0 opacity-50' />
      <input
        ref={inputRef}
        data-slot='command-input'
        class={cn(
          'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          local.class
        )}
        value={ctx.search()}
        onInput={(e) => ctx.setSearch(e.currentTarget.value)}
        autocomplete='off'
        spellcheck={false}
        {...others}
      />
    </div>
  )
}

function CommandList(props: ComponentProps<'div'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <div
      data-slot='command-list'
      role='listbox'
      class={cn(
        'max-h-75 scroll-py-1 overflow-x-hidden overflow-y-auto',
        local.class
      )}
      {...others}
    />
  )
}

function CommandEmpty(props: ComponentProps<'div'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <div
      data-slot='command-empty'
      class={cn('py-6 text-center text-sm', local.class)}
      {...others}
    />
  )
}

function CommandGroup(
  props: Omit<ComponentProps<'div'>, 'heading'> & { heading?: JSX.Element }
) {
  const [local, others] = splitProps(props, ['class', 'heading', 'children'])
  return (
    <div
      data-slot='command-group'
      role='group'
      class={cn('overflow-hidden p-1 text-foreground', local.class)}
      {...others}
    >
      {local.heading && (
        <div
          data-slot='command-group-heading'
          class='px-2 py-1.5 text-xs font-medium text-muted-foreground'
        >
          {local.heading}
        </div>
      )}
      {local.children}
    </div>
  )
}

function CommandSeparator(props: ComponentProps<'div'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <div
      data-slot='command-separator'
      class={cn('-mx-1 h-px bg-border', local.class)}
      {...others}
    />
  )
}

function CommandItem(
  props: Omit<ComponentProps<'div'>, 'onSelect'> & {
    value?: string
    disabled?: boolean
    onSelect?: () => void
  }
) {
  const [local, others] = splitProps(props, [
    'class',
    'value',
    'disabled',
    'onSelect',
  ])
  const ctx = useCommand()
  let ref: HTMLDivElement | undefined
  const [text, setText] = createSignal(local.value ?? '')
  onMount(() => {
    if (!local.value) setText(ref?.textContent ?? '')
  })
  const visible = () => matches(ctx.search(), local.value ?? text())

  return (
    <div
      ref={ref}
      data-slot='command-item'
      role='option'
      data-disabled={!!local.disabled}
      data-selected='false'
      hidden={!visible()}
      class={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        local.class
      )}
      onPointerMove={(e) => {
        const root = ctx.root()
        if (e.currentTarget.getAttribute('data-selected') === 'true') return
        root
          ?.querySelectorAll('[data-slot=command-item][data-selected=true]')
          .forEach((n) => n.setAttribute('data-selected', 'false'))
        e.currentTarget.setAttribute('data-selected', 'true')
      }}
      onClick={() => !local.disabled && local.onSelect?.()}
      {...others}
    />
  )
}

function CommandShortcut(props: ComponentProps<'span'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <span
      data-slot='command-shortcut'
      class={cn(
        'ms-auto text-xs tracking-widest text-muted-foreground',
        local.class
      )}
      {...others}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
