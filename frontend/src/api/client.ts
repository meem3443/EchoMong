import axios from 'axios'
import useAuthStore from '@/stores/useAuthStore' // 스토어 임포트

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// [요청 인터셉터]
// 매 요청마다 스토어에 있는 최신 토큰을 헤더에 넣습니다.
api.interceptors.request.use(
  (config) => {
    // Zustand 스토어에서 직접 상태를 꺼내옵니다.
    const { user } = useAuthStore.getState()

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// [응답 인터셉터]
// 401 에러가 발생하면 토큰 갱신을 시도합니다.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 401 에러(인증 실패)이고, 아직 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // 무한 루프 방지 플래그

      try {
        // 1. 리프레시 토큰으로 새로운 액세스 토큰 요청
        // (참고: 리프레시 토큰이 쿠키에 있다면 인자가 필요 없고,
        //  바디에 담아야 한다면 store에서 꺼내서 보내야 합니다.)
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/refresh`,
          {},
          {
            withCredentials: true, // 쿠키에 리프레시 토큰이 있다면 필수
          },
        )

        const newAccessToken = data.token

        // 2. Zustand 스토어 업데이트 (React 밖에서 상태 변경)
        useAuthStore.getState().setToken(newAccessToken)

        // 3. 실패했던 원래 요청의 헤더를 새 토큰으로 교체
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        // 4. Axios 인스턴스의 기본 헤더도 변경 (선택 사항이지만 권장)
        api.defaults.headers.common['Authorization'] =
          `Bearer ${newAccessToken}`

        // 5. 원래 요청 재시도
        return api(originalRequest)
      } catch (refreshError) {
        // 리프레시 토큰마저 만료되었거나 유효하지 않음 -> 강제 로그아웃
        console.error('Refresh token expired:', refreshError)

        useAuthStore.getState().logout() // 스토어 비우기
        window.location.href = '/' // 로그인 페이지로 강제 이동

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
