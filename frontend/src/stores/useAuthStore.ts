import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface User {
  token: string
  username: string
  team?: string
}

interface AuthState {
  isLoggedIn: boolean
  user: User | null
}

interface AuthActions {
  login: (userData: User) => void
  logout: () => void
  teamRegister: (teamName: string) => void
  setToken: (token: string) => void
}

type AuthStore = AuthState & AuthActions

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,

      login: (userData) => {
        set({
          isLoggedIn: true,
          user: userData,
        })
      },

      logout: () => {
        set({
          isLoggedIn: false,
          user: null,
        })
      },

      teamRegister: (teamName) => {
        set((state) => {
          if (!state.user) {
            return state
          }

          return {
            user: {
              ...state.user,
              team: teamName,
            },
          }
        })
      },
      setToken: (token) => {
        set((state) => {
          if (!state.user) return state // 유저가 없으면 무시
          return {
            user: {
              ...state.user,
              token: token,
            },
          }
        })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useAuthStore
