import { splitProps, type ComponentProps } from 'solid-js'
import { cn } from '@/lib/utils'

export function IconGmail(props: ComponentProps<'svg'>) {
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
      <title>Gmail</title>
      <path stroke-width='0' d='M0 0h24v24H0z' fill='none' />
      <path d='M16 20h3a1 1 0 0 0 1 -1v-14a1 1 0 0 0 -1 -1h-3v16z' />
      <path d='M5 20h3v-16h-3a1 1 0 0 0 -1 1v14a1 1 0 0 0 1 1z' />
      <path d='M16 4l-4 4l-4 -4' />
      <path d='M4 6.5l8 7.5l8 -7.5' />
    </svg>
  )
}
