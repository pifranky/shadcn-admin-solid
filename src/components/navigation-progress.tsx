import { createEffect, createSignal, onCleanup } from 'solid-js'
import { useRouterState } from '@tanstack/solid-router'

/** Thin top loading bar shown while the router is pending (replaces react-top-loading-bar). */
export function NavigationProgress() {
  const status = useRouterState({ select: (s) => s.status })
  const [progress, setProgress] = createSignal(0)
  const [visible, setVisible] = createSignal(false)
  let timer: ReturnType<typeof setInterval> | undefined

  createEffect(() => {
    clearInterval(timer)
    if (status() === 'pending') {
      setVisible(true)
      setProgress(10)
      timer = setInterval(
        () => setProgress((p) => Math.min(p + (90 - p) * 0.1, 90)),
        200
      )
    } else if (visible()) {
      setProgress(100)
      setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 300)
    }
  })

  onCleanup(() => clearInterval(timer))

  return (
    <div
      aria-hidden='true'
      class='pointer-events-none fixed inset-x-0 top-0 z-[9999] h-0.5'
      style={{ opacity: visible() ? 1 : 0, transition: 'opacity 300ms' }}
    >
      <div
        class='h-full bg-muted-foreground shadow-[0_0_10px_var(--muted-foreground)]'
        style={{
          width: `${progress()}%`,
          transition: 'width 200ms ease-out',
        }}
      />
    </div>
  )
}
