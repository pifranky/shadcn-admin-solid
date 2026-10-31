import '@tanstack/solid-table'

declare module '@tanstack/solid-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    class?: string // apply to both th and td
    tdClass?: string
    thClass?: string
  }
}
