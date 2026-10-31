import { createRoot, createSignal } from 'solid-js'
import { describe, expect, it, vi } from 'vitest'
import { type NavigateFn, useTableUrlState } from './use-table-url-state'

function lastSearch(navigate: ReturnType<typeof vi.fn>, prev: object) {
  const opts = navigate.mock.calls[navigate.mock.calls.length - 1]?.[0]
  return typeof opts.search === 'function' ? opts.search(prev) : opts.search
}

describe('useTableUrlState', () => {
  it('derives pagination reactively from search', () => {
    createRoot((dispose) => {
      const [search, setSearch] = createSignal<Record<string, unknown>>({
        page: 3,
        pageSize: 25,
      })
      const state = useTableUrlState({
        search,
        navigate: vi.fn() as NavigateFn,
      })
      expect(state.pagination()).toEqual({ pageIndex: 2, pageSize: 25 })
      setSearch({})
      expect(state.pagination()).toEqual({ pageIndex: 0, pageSize: 10 })
      dispose()
    })
  })

  it('omits default page and page size from the URL', () => {
    createRoot((dispose) => {
      const navigate = vi.fn()
      const state = useTableUrlState({
        search: () => ({ page: 2, filter: 'q' }),
        navigate: navigate as NavigateFn,
      })
      state.onPaginationChange({ pageIndex: 0, pageSize: 10 })
      expect(lastSearch(navigate, { page: 2, filter: 'q' })).toMatchObject({
        page: undefined,
        pageSize: undefined,
        filter: 'q',
      })
      dispose()
    })
  })

  it('serializes column filters and clears the page', () => {
    createRoot((dispose) => {
      const navigate = vi.fn()
      const state = useTableUrlState({
        search: () => ({ status: ['todo'] }),
        navigate: navigate as NavigateFn,
        columnFilters: [
          { columnId: 'status', searchKey: 'status', type: 'array' },
        ],
      })
      expect(state.columnFilters()).toEqual([{ id: 'status', value: ['todo'] }])
      state.onColumnFiltersChange([{ id: 'status', value: [] }])
      expect(lastSearch(navigate, { page: 3 })).toEqual({
        page: undefined,
        status: undefined,
      })
      dispose()
    })
  })

  it('resets the page when it is out of range', () => {
    createRoot((dispose) => {
      const navigate = vi.fn()
      const state = useTableUrlState({
        search: () => ({ page: 9 }),
        navigate: navigate as NavigateFn,
      })
      state.ensurePageInRange(3, { resetTo: 'last' })
      expect(navigate.mock.calls[0][0].replace).toBe(true)
      expect(lastSearch(navigate, { page: 9 })).toMatchObject({ page: 3 })
      dispose()
    })
  })
})
