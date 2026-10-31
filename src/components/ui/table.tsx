import { splitProps, type ComponentProps } from 'solid-js'
import { cn } from '@/lib/utils'

function Table(props: ComponentProps<'table'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <div data-slot='table-container' class='relative w-full overflow-x-auto'>
      <table
        data-slot='table'
        class={cn('w-full caption-bottom text-sm', local.class)}
        {...others}
      />
    </div>
  )
}

function TableHeader(props: ComponentProps<'thead'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <thead
      data-slot='table-header'
      class={cn('[&_tr]:border-b', local.class)}
      {...others}
    />
  )
}

function TableBody(props: ComponentProps<'tbody'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <tbody
      data-slot='table-body'
      class={cn('[&_tr:last-child]:border-0', local.class)}
      {...others}
    />
  )
}

function TableFooter(props: ComponentProps<'tfoot'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <tfoot
      data-slot='table-footer'
      class={cn(
        'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
        local.class
      )}
      {...others}
    />
  )
}

function TableRow(props: ComponentProps<'tr'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <tr
      data-slot='table-row'
      class={cn(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        local.class
      )}
      {...others}
    />
  )
}

function TableHead(props: ComponentProps<'th'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <th
      data-slot='table-head'
      class={cn(
        'h-10 px-2 text-start align-middle font-medium whitespace-nowrap text-foreground *:[[role=checkbox]]:translate-y-0.5',
        local.class
      )}
      {...others}
    />
  )
}

function TableCell(props: ComponentProps<'td'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <td
      data-slot='table-cell'
      class={cn(
        'p-2 align-middle whitespace-nowrap *:[[role=checkbox]]:translate-y-0.5',
        local.class
      )}
      {...others}
    />
  )
}

function TableCaption(props: ComponentProps<'caption'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <caption
      data-slot='table-caption'
      class={cn('mt-4 text-sm text-muted-foreground', local.class)}
      {...others}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
