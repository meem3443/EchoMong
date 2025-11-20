// src/api/auth.ts
import { api } from './client'
import type { AuthInput } from '@/schemas/auth'

export interface RegisteredUser {
  email: string
  username: string
  created_at: string
}

export interface LoginResponse {
  token: string
}

export interface RegisterUserTeam {
  title: string
}

/**
 * 회원가입 API 요청 함수
 * POST /register
 * @param credentials - 사용자 이름, 이메일, 비밀번호가 포함된 객체
 * @returns Promise<RegisteredUser> - 성공 시 생성된 사용자 정보 반환
 */
export async function registerUser(
  credentials: AuthInput,
): Promise<RegisteredUser> {
  const { confirmPassword, ...registerData } = credentials
  const response = await api.post<RegisteredUser>('/register', registerData)
  return response.data
}

/**
 * 로그인 API 요청 함수
 * POST /login
 * @param credentials - 이메일, 비밀번호가 포함된 객체
 * @returns Promise<LoginResponse> - 성공 시 JWT 토큰이 포함된 객체 반환
 */
export async function loginUser(
  credentials: Pick<AuthInput, 'email' | 'password'>,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/login', credentials)
  return response.data
}

/**
 * axios 인스턴스에 JWT 토큰을 설정하거나 제거하는 헬퍼 함수
 * @param token - 로그인 시 발급받은 JWT 토큰 또는 null
 */
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export async function setUserTeam(title: string): Promise<RegisterUserTeam> {
  const response = await api.post('/user/team', { title })
  return response.data
}
