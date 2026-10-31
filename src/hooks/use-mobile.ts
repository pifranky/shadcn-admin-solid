import { createSignal, onCleanup } from 'solid-js'

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

export function useIsMobile() {
  const mql = window.matchMedia(MOBILE_QUERY)
  const [isMobile, setIsMobile] = createSignal(mql.matches)
  const onChange = () => setIsMobile(mql.matches)
  mql.addEventListener('change', onChange)
  onCleanup(() => mql.removeEventListener('change', onChange))
  return isMobile
}
