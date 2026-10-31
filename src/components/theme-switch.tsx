import { createEffect } from 'solid-js'
import { Check, Moon, Sun } from 'lucide-solid'
import { cn } from '@/lib/utils'
import { useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  /* Update theme-color meta tag
   * when theme is updated */
  createEffect(() => {
    const themeColor = theme() === 'dark' ? '#020817' : '#fff'
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor)
  })

  return (
    <DropdownMenu modal={false} placement='bottom-end'>
      <DropdownMenuTrigger
        as={Button}
        variant='ghost'
        size='icon'
        class='scale-95 rounded-full'
      >
        <Sun class='size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
        <Moon class='absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
        <span class='sr-only'>Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => setTheme('light')}>
          Light{' '}
          <Check
            size={14}
            class={cn('ms-auto', theme() !== 'light' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme('dark')}>
          Dark
          <Check
            size={14}
            class={cn('ms-auto', theme() !== 'dark' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme('system')}>
          System
          <Check
            size={14}
            class={cn('ms-auto', theme() !== 'system' && 'hidden')}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
