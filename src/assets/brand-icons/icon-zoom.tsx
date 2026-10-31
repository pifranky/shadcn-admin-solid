import { splitProps, type ComponentProps } from 'solid-js'
import { cn } from '@/lib/utils'

export function IconZoom(props: ComponentProps<'svg'>) {
  const [local, others] = splitProps(props, ['class'])
  return (
    <svg
      role='img'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      class={cn('[&>path]:stroke-current', local.class)}
      fill='none'
      stroke='currentColor'
      stroke-width='2'
      stroke-linecap='round'
      stroke-linejoin='round'
      {...others}
    >
      <title>Zoom</title>
      <path stroke-width='0' d='M0 0h24v24H0z' fill='none' />
      <path d='M17.011 9.385v5.128l3.989 3.487v-12z' />
      <path d='M3.887 6h10.08c1.468 0 3.033 1.203 3.033 2.803v8.196a.991 .991 0 0 1 -.975 1h-10.373c-1.667 0 -2.652 -1.5 -2.652 -3l.01 -8a.882 .882 0 0 1 .208 -.71a.841 .841 0 0 1 .67 -.287z' />
    </svg>
  )
}
