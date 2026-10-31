import {
  createContext,
  createSignal,
  useContext,
  type Accessor,
  type ParentProps,
  type Setter,
} from 'solid-js'
import useDialogState from '@/hooks/use-dialog-state'
import { type Task } from '../data/schema'

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

type TasksContextType = {
  open: Accessor<TasksDialogType | null>
  setOpen: (str: TasksDialogType | null) => void
  currentRow: Accessor<Task | null>
  setCurrentRow: Setter<Task | null>
}

const TasksContext = createContext<TasksContextType>()

export function TasksProvider(props: ParentProps) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = createSignal<Task | null>(null)

  return (
    <TasksContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {props.children}
    </TasksContext.Provider>
  )
}

export const useTasks = () => {
  const tasksContext = useContext(TasksContext)

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return tasksContext
}
