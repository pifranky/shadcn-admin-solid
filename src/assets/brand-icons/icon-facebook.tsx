import { splitProps, type ComponentProps } from 'solid-js'
import { cn } from '@/lib/utils'

export function IconFacebook(props: ComponentProps<'svg'>) {
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
      <title>Facebook</title>
      <path stroke-width='0' d='M0 0h24v24H0z' fill='none' />
      <path d='M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3' />
    </svg>
  )
}
