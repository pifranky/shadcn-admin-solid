import {
  createContext,
  createSignal,
  onCleanup,
  onMount,
  useContext,
  type Accessor,
  type ParentProps,
  type Setter,
} from 'solid-js'
import { CommandMenu } from '@/components/command-menu'

type SearchContextType = {
  open: Accessor<boolean>
  setOpen: Setter<boolean>
}

const SearchContext = createContext<SearchContextType>()

export function SearchProvider(props: ParentProps) {
  const [open, setOpen] = createSignal(false)

  onMount(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    onCleanup(() => document.removeEventListener('keydown', down))
  })

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {props.children}
      <CommandMenu />
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const searchContext = useContext(SearchContext)
  if (!searchContext) {
    throw new Error('useSearch has to be used within SearchProvider')
  }
  return searchContext
}
