import { Toaster as Sonner, type ToasterProps } from 'solid-sonner'
import { useTheme } from '@/context/theme-provider'

function Toaster(props: ToasterProps) {
  const { theme } = useTheme()
  return (
    <Sonner
      theme={theme()}
      class='toaster group [&_div[data-content]]:w-full'
      style={{
        '--normal-bg': 'var(--popover)',
        '--normal-text': 'var(--popover-foreground)',
        '--normal-border': 'var(--border)',
      }}
      {...props}
    />
  )
}

export { Toaster }
