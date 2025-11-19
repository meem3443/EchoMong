import { create } from 'zustand'
import type { StateCreator } from 'zustand'

// 1. 사용자 데이터 타입 정의
interface User {
  token: string
  username: string
  // 필요한 다른 정보도 추가할 수 있습니다 (e.g., role: 'admin' | 'user')
}

// 2. Auth 상태 타입 정의
interface AuthState {
  isLoggedIn: boolean
  user: User | null // 로그인하지 않았을 때는 null
}

// 3. Auth 액션 타입 정의
interface AuthActions {
  login: (userData: User) => void
  logout: () => void
}

// 4. StateCreator를 사용하여 상태와 액션 타입을 결합
// set 함수도 타입 안전하게 사용할 수 있습니다.
const stateCreator: StateCreator<AuthState & AuthActions> = (set) => ({
  // 5. 초기 상태 (Initial State)
  isLoggedIn: false,
  user: null,

  // 6. 액션 구현 (Actions Implementation)
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
})

// 7. 스토어 생성 및 익스포트
const useAuthStore = create<AuthState & AuthActions>(stateCreator)

export default useAuthStore
