import { createMemo, For } from 'solid-js'
import { niceTicks, useElementWidth } from './use-element-width'

type Series = {
  key: string
  class: string
  fillOpacity?: number
}

type AreaChartProps = {
  data: Record<string, string | number>[]
  xKey: string
  series: Series[]
  height?: number
}

const MARGIN = { top: 5, right: 10, bottom: 24, left: 40 }

/** Minimal responsive SVG area chart with smooth curves (replaces recharts' AreaChart). */
export function AreaChart(props: AreaChartProps) {
  const [width, ref] = useElementWidth()
  const height = () => props.height ?? 300
  const ticks = createMemo(() =>
    niceTicks(
      Math.max(
        ...props.data.flatMap((d) => props.series.map((s) => Number(d[s.key])))
      )
    )
  )
  const max = () => ticks()[ticks().length - 1] || 1
  const innerW = () => Math.max(width() - MARGIN.left - MARGIN.right, 0)
  const innerH = () => height() - MARGIN.top - MARGIN.bottom
  const x = (i: number) =>
    MARGIN.left + (innerW() * i) / Math.max(props.data.length - 1, 1)
  const y = (v: number) => MARGIN.top + innerH() - (v / max()) * innerH()

  // Monotone-ish smoothing using cubic bezier midpoints
  const linePath = (key: string) => {
    const pts = props.data.map((d, i) => [x(i), y(Number(d[key]))] as const)
    return pts.reduce((acc, [px, py], i) => {
      if (i === 0) return `M${px},${py}`
      const [prevX, prevY] = pts[i - 1]
      const midX = (prevX + px) / 2
      return `${acc} C${midX},${prevY} ${midX},${py} ${px},${py}`
    }, '')
  }
  const areaPath = (key: string) =>
    `${linePath(key)} L${x(props.data.length - 1)},${y(0)} L${x(0)},${y(0)} Z`

  return (
    <div ref={ref} class='w-full' style={{ height: `${height()}px` }} dir='ltr'>
      <svg width={width()} height={height()} class='overflow-visible'>
        <For each={ticks()}>
          {(tick) => (
            <text
              x={MARGIN.left - 8}
              y={y(tick)}
              text-anchor='end'
              dominant-baseline='middle'
              class='fill-[#888888] text-xs'
            >
              {tick}
            </text>
          )}
        </For>
        <For each={props.data}>
          {(d, i) => (
            <text
              x={x(i())}
              y={height() - 6}
              text-anchor='middle'
              class='fill-[#888888] text-xs'
            >
              {d[props.xKey]}
            </text>
          )}
        </For>
        <For each={props.series}>
          {(s) => (
            <g class={s.class}>
              <path
                d={areaPath(s.key)}
                fill='currentColor'
                fill-opacity={s.fillOpacity ?? 0.15}
              />
              <path
                d={linePath(s.key)}
                fill='none'
                stroke='currentColor'
                stroke-width='1'
              />
            </g>
          )}
        </For>
      </svg>
    </div>
  )
}
