import { createMemo, For } from 'solid-js'
import { niceTicks, useElementWidth } from './use-element-width'

type BarChartProps = {
  data: { name: string; value: number }[]
  height?: number
  tickFormatter?: (value: number) => string
  barClass?: string
}

const MARGIN = { top: 5, right: 5, bottom: 24, left: 60 }

/** Minimal responsive SVG bar chart (replaces recharts' BarChart). */
export function BarChart(props: BarChartProps) {
  const [width, ref] = useElementWidth()
  const height = () => props.height ?? 350
  const ticks = createMemo(() =>
    niceTicks(Math.max(...props.data.map((d) => d.value)))
  )
  const max = () => ticks()[ticks().length - 1] || 1
  const innerW = () => Math.max(width() - MARGIN.left - MARGIN.right, 0)
  const innerH = () => height() - MARGIN.top - MARGIN.bottom
  const band = () => innerW() / Math.max(props.data.length, 1)
  const y = (v: number) => MARGIN.top + innerH() - (v / max()) * innerH()
  const format = (v: number) => props.tickFormatter?.(v) ?? `${v}`

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
              {format(tick)}
            </text>
          )}
        </For>
        <For each={props.data}>
          {(d, i) => {
            const barW = () => band() * 0.8
            const x = () => MARGIN.left + band() * i() + (band() - barW()) / 2
            const h = () => innerH() - (y(d.value) - MARGIN.top)
            const r = () => Math.min(4, barW() / 2, h())
            return (
              <g>
                <path
                  class={props.barClass ?? 'fill-primary'}
                  d={`M${x()},${y(d.value) + r()}
                      a${r()},${r()} 0 0 1 ${r()},${-r()}
                      h${barW() - 2 * r()}
                      a${r()},${r()} 0 0 1 ${r()},${r()}
                      v${h() - r()} h${-barW()} z`}
                >
                  <title>{`${d.name}: ${format(d.value)}`}</title>
                </path>
                <text
                  x={MARGIN.left + band() * i() + band() / 2}
                  y={height() - 6}
                  text-anchor='middle'
                  class='fill-[#888888] text-xs'
                >
                  {d.name}
                </text>
              </g>
            )
          }}
        </For>
      </svg>
    </div>
  )
}
