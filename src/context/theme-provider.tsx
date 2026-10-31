import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  useContext,
  type Accessor,
  type ParentProps,
} from 'solid-js'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = Exclude<Theme, 'system'>

const DEFAULT_THEME = 'system'
const THEME_COOKIE_NAME = 'vite-ui-theme'
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

type ThemeProviderProps = ParentProps<{
  defaultTheme?: Theme
  storageKey?: string
}>

type ThemeProviderState = {
  defaultTheme: Theme
  resolvedTheme: Accessor<ResolvedTheme>
  theme: Accessor<Theme>
  setTheme: (theme: Theme) => void
  resetTheme: () => void
}

const ThemeContext = createContext<ThemeProviderState>()

export function ThemeProvider(props: ThemeProviderProps) {
  const defaultTheme = props.defaultTheme ?? DEFAULT_THEME
  const storageKey = props.storageKey ?? THEME_COOKIE_NAME
  const [theme, _setTheme] = createSignal<Theme>(
    (getCookie(storageKey) as Theme) || defaultTheme
  )

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const [systemDark, setSystemDark] = createSignal(mediaQuery.matches)
  const handleChange = () => setSystemDark(mediaQuery.matches)
  mediaQuery.addEventListener('change', handleChange)
  onCleanup(() => mediaQuery.removeEventListener('change', handleChange))

  const resolvedTheme = createMemo<ResolvedTheme>(() => {
    if (theme() === 'system') return systemDark() ? 'dark' : 'light'
    return theme() as ResolvedTheme
  })

  createEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark') // Remove existing theme classes
    root.classList.add(resolvedTheme()) // Add the new theme class
  })

  const setTheme = (theme: Theme) => {
    setCookie(storageKey, theme, THEME_COOKIE_MAX_AGE)
    _setTheme(theme)
  }

  const resetTheme = () => {
    removeCookie(storageKey)
    _setTheme(DEFAULT_THEME)
  }

  return (
    <ThemeContext.Provider
      value={{ defaultTheme, resolvedTheme, theme, setTheme, resetTheme }}
    >
      {props.children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
