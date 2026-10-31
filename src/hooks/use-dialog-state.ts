import { createSignal } from 'solid-js'

/**
 * Custom primitive for confirm dialog
 * @param initialState string | null
 * @returns A signal accessor, and a function to toggle it.
 * @example const [open, setOpen] = useDialogState<"approve" | "reject">()
 */
export default function useDialogState<T extends string | boolean>(
  initialState: T | null = null
) {
  const [open, _setOpen] = createSignal<T | null>(initialState)

  const setOpen = (str: T | null) =>
    _setOpen((prev) => (prev === str ? null : str) as T | null)

  return [open, setOpen] as const
}
