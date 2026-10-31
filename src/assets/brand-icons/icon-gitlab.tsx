import { splitProps, type ComponentProps } from 'solid-js'
import { cn } from '@/lib/utils'

export function IconGitlab(props: ComponentProps<'svg'>) {
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
      <title>GitLab</title>
      <path stroke-width='0' d='M0 0h24v24H0z' fill='none' />
      <path d='M21 14l-9 7l-9 -7l3 -11l3 7h6l3 -7z' />
    </svg>
  )
}
