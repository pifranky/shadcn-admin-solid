import {
  createContext,
  createEffect,
  createSignal,
  useContext,
  type Accessor,
  type ParentProps,
} from 'solid-js'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import { fonts } from '@/config/fonts'

type Font = (typeof fonts)[number]

const FONT_COOKIE_NAME = 'font'
const FONT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

type FontContextType = {
  font: Accessor<Font>
  setFont: (font: Font) => void
  resetFont: () => void
}

const FontContext = createContext<FontContextType>()

export function FontProvider(props: ParentProps) {
  const savedFont = getCookie(FONT_COOKIE_NAME)
  const [font, _setFont] = createSignal<Font>(
    fonts.includes(savedFont as Font) ? (savedFont as Font) : fonts[0]
  )

  createEffect(() => {
    const root = document.documentElement
    root.classList.forEach((cls) => {
      if (cls.startsWith('font-')) root.classList.remove(cls)
    })
    root.classList.add(`font-${font()}`)
  })

  const setFont = (font: Font) => {
    setCookie(FONT_COOKIE_NAME, font, FONT_COOKIE_MAX_AGE)
    _setFont(font)
  }

  const resetFont = () => {
    removeCookie(FONT_COOKIE_NAME)
    _setFont(fonts[0])
  }

  return (
    <FontContext.Provider value={{ font, setFont, resetFont }}>
      {props.children}
    </FontContext.Provider>
  )
}

export const useFont = () => {
  const context = useContext(FontContext)
  if (!context) {
    throw new Error('useFont must be used within a FontProvider')
  }
  return context
}
