import { splitProps, type ComponentProps } from 'solid-js'
import { cn } from '@/lib/utils'

type MainProps = ComponentProps<'main'> & {
  fixed?: boolean
  fluid?: boolean
}

export function Main(props: MainProps) {
  const [local, others] = splitProps(props, ['fixed', 'class', 'fluid'])
  return (
    <main
      data-layout={local.fixed ? 'fixed' : 'auto'}
      class={cn(
        'px-4 py-6',

        // If layout is fixed, make the main container flex and grow
        local.fixed && 'flex grow flex-col overflow-hidden',

        // If layout is not fluid, set the max-width
        !local.fluid &&
          '@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl',
        local.class
      )}
      {...others}
    />
  )
}
