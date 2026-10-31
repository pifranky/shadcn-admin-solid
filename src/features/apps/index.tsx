import { createMemo, createSignal, For } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { getRouteApi } from '@tanstack/solid-router'
import { SlidersHorizontal, ArrowUpAZ, ArrowDownAZ } from 'lucide-solid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { SelectDropdown } from '@/components/select-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { apps } from './data/apps'

const route = getRouteApi('/_authenticated/apps/')

type AppType = 'all' | 'connected' | 'notConnected'
type SortOrder = 'asc' | 'desc'

const sortOptions = [
  { value: 'asc' as const, label: 'Ascending', icon: ArrowUpAZ },
  { value: 'desc' as const, label: 'Descending', icon: ArrowDownAZ },
]

export function Apps() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const [sort, setSort] = createSignal<SortOrder>(search().sort ?? 'asc')
  const [appType, setAppType] = createSignal<AppType>(search().type ?? 'all')
  const [searchTerm, setSearchTerm] = createSignal(search().filter ?? '')

  const filteredApps = createMemo(() =>
    [...apps]
      .sort((a, b) =>
        sort() === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      )
      .filter((app) =>
        appType() === 'connected'
          ? app.connected
          : appType() === 'notConnected'
            ? !app.connected
            : true
      )
      .filter((app) =>
        app.name.toLowerCase().includes(searchTerm().toLowerCase())
      )
  )

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    navigate({
      search: (prev) => ({
        ...prev,
        filter: value || undefined,
      }),
    })
  }

  const handleTypeChange = (value: AppType) => {
    setAppType(value)
    navigate({
      search: (prev) => ({
        ...prev,
        type: value === 'all' ? undefined : value,
      }),
    })
  }

  const handleSortChange = (sort: SortOrder) => {
    setSort(sort)
    navigate({ search: (prev) => ({ ...prev, sort }) })
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search class='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <div>
          <h1 class='text-2xl font-bold tracking-tight'>App Integrations</h1>
          <p class='text-muted-foreground'>
            Here&apos;s a list of your apps for the integration!
          </p>
        </div>
        <div class='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div class='flex flex-col gap-4 sm:my-4 sm:flex-row'>
            <Input
              placeholder='Filter apps...'
              class='h-9 w-40 lg:w-62.5'
              value={searchTerm()}
              onInput={(e) => handleSearch(e.currentTarget.value)}
            />
            <SelectDropdown
              value={appType()}
              onValueChange={(v) => handleTypeChange(v as AppType)}
              aria-label='Filter apps by connection'
              class='w-36'
              items={[
                { value: 'all', label: 'All Apps' },
                { value: 'connected', label: 'Connected' },
                { value: 'notConnected', label: 'Not Connected' },
              ]}
            />
          </div>

          <Select<(typeof sortOptions)[number]>
            options={sortOptions}
            optionValue='value'
            optionTextValue='label'
            value={sortOptions.find((o) => o.value === sort())}
            onChange={(opt) => opt && handleSortChange(opt.value)}
            placement='bottom-end'
            class='contents'
            itemComponent={(props) => (
              <SelectItem item={props.item}>
                <div class='flex items-center gap-4'>
                  <Dynamic component={props.item.rawValue.icon} size={16} />
                  <span>{props.item.rawValue.label}</span>
                </div>
              </SelectItem>
            )}
          >
            <SelectTrigger class='w-16' aria-label='Sort apps'>
              <SelectValue>{() => <SlidersHorizontal size={18} />}</SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </div>
        <Separator class='shadow-sm' />
        <ul class='faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3'>
          <For each={filteredApps()}>
            {(app) => (
              <li class='rounded-lg border p-4 hover:shadow-md'>
                <div class='mb-8 flex items-center justify-between'>
                  <div
                    class={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
                  >
                    <Dynamic component={app.logo} />
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    class={`${app.connected ? 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900' : ''}`}
                  >
                    {app.connected ? 'Connected' : 'Connect'}
                  </Button>
                </div>
                <div>
                  <h2 class='mb-1 font-semibold'>{app.name}</h2>
                  <p class='line-clamp-2 text-gray-500'>{app.desc}</p>
                </div>
              </li>
            )}
          </For>
        </ul>
      </Main>
    </>
  )
}
