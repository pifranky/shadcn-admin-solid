import { createRoot } from 'solid-js'
import { createStore } from 'solid-js/store'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'

interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
}

interface AuthState {
  user: AuthUser | null
  accessToken: string
}

/**
 * Global auth store (replaces the zustand store in the React version).
 * Created in its own root so it can be imported anywhere.
 */
export const authStore = createRoot(() => {
  const cookieState = getCookie(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''

  const [state, setState] = createStore<AuthState>({
    user: null,
    accessToken: initToken,
  })

  return {
    get user() {
      return state.user
    },
    setUser: (user: AuthUser | null) => setState('user', user),
    get accessToken() {
      return state.accessToken
    },
    setAccessToken: (accessToken: string) => {
      setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
      setState('accessToken', accessToken)
    },
    resetAccessToken: () => {
      removeCookie(ACCESS_TOKEN)
      setState('accessToken', '')
    },
    reset: () => {
      removeCookie(ACCESS_TOKEN)
      setState({ user: null, accessToken: '' })
    },
  }
})

export const useAuthStore = () => ({ auth: authStore })
