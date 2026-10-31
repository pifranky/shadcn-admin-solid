import { createSignal, onCleanup, onMount } from 'solid-js'

/** Tracks an element's content width (used to make SVG charts responsive). */
export function useElementWidth() {
  const [width, setWidth] = createSignal(0)
  let el: HTMLElement | undefined
  const ref = (node: HTMLElement) => (el = node)
  onMount(() => {
    if (!el) return
    setWidth(el.clientWidth)
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    )
    observer.observe(el)
    onCleanup(() => observer.disconnect())
  })
  return [width, ref] as const
}

/** "Nice" axis ticks from 0 to roughly `max`. */
export function niceTicks(max: number, count = 4) {
  if (max <= 0) return [0]
  const raw = max / count
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const step =
    [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw
  const ticks: number[] = []
  for (let v = 0; v <= max + step * 0.001; v += step) ticks.push(v)
  if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + step)
  return ticks
}
