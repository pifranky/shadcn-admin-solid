import {
  createContext,
  createSignal,
  useContext,
  type Accessor,
  type ParentProps,
  type Setter,
} from 'solid-js'
import useDialogState from '@/hooks/use-dialog-state'
import { type User } from '../data/schema'

type UsersDialogType = 'invite' | 'add' | 'edit' | 'delete'

type UsersContextType = {
  open: Accessor<UsersDialogType | null>
  setOpen: (str: UsersDialogType | null) => void
  currentRow: Accessor<User | null>
  setCurrentRow: Setter<User | null>
}

const UsersContext = createContext<UsersContextType>()

export function UsersProvider(props: ParentProps) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = createSignal<User | null>(null)

  return (
    <UsersContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {props.children}
    </UsersContext.Provider>
  )
}

export const useUsers = () => {
  const usersContext = useContext(UsersContext)

  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersContext>')
  }

  return usersContext
}
