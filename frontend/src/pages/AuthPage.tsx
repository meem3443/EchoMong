// src/pages/AuthPage.tsx
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'

import type { AuthInput } from '@/schemas/auth'
import { authSchema } from '@/schemas/auth'
import { loginUser, registerUser, setAuthToken } from '@/api/auth'
import useAuthStore from '@/store/useAuthStore'

export function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthInput>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    reset()
    setApiError(null)
  }, [isLoginMode, reset])

  const onSubmit = async (data: AuthInput) => {
    setApiError(null)
    try {
      if (isLoginMode) {
        // 로그인: email과 password만 필요
        const response = await loginUser({
          email: data.email,
          password: data.password,
        })
        setAuthToken(response.token)
        login({ token: response.token, username: data.username })
        alert('로그인에 성공했습니다!')
      } else {
        // 회원가입
        await registerUser(data)
        alert('회원가입에 성공했습니다! 자동으로 로그인합니다.')

        // 회원가입 후 자동 로그인
        const response = await loginUser({
          email: data.email,
          password: data.password,
        })
        setAuthToken(response.token)
        login({ token: response.token, username: data.username })
      }
      navigate({ to: '/home' })
    } catch (error: any) {
      const message =
        error.response?.data?.message || '요청 처리에 실패했습니다.'
      setApiError(message)
    }
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      key={isLoginMode ? 'login' : 'register'}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col p-6 w-full max-w-sm border shadow-lg rounded-lg space-y-4 bg-gray-50"
      >
        <h2 className="text-2xl font-bold text-center text-black">
          {isLoginMode ? '로그인' : '회원가입'}
        </h2>

        <div className="flex flex-col">
          <label
            htmlFor="username"
            className="mb-1 text-sm font-medium text-black"
          >
            사용자 이름
          </label>
          <input
            id="username"
            type="text"
            {...register('username')}
            placeholder="사용자 이름을 입력하세요"
            className="border p-2 rounded focus:ring-blue-500 focus:border-blue-500 text-black"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="mb-1 text-sm font-medium text-black"
          >
            이메일
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            placeholder="이메일을 입력하세요"
            className="border p-2 rounded focus:ring-blue-500 focus:border-blue-500 text-black"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="mb-1 text-sm font-medium text-black"
          >
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            placeholder="비밀번호를 입력하세요"
            className="border p-2 rounded focus:ring-blue-500 focus:border-blue-500 text-black"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {!isLoginMode && (
          <div className="flex flex-col">
            <label
              htmlFor="confirmPassword"
              className="mb-1 text-sm font-medium text-black"
            >
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              placeholder="비밀번호를 다시 입력하세요"
              className="border p-2 rounded focus:ring-blue-500 focus:border-blue-500 text-black"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        {apiError && (
          <p className="text-red-500 text-sm text-center">{apiError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-600 text-white p-2 rounded-md transition duration-150 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? '처리 중...' : isLoginMode ? '로그인' : '회원가입'}
        </button>

        <p className="text-center text-sm text-gray-600">
          {isLoginMode ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          <button
            type="button"
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="font-semibold text-blue-600 hover:text-blue-800 ml-2"
          >
            {isLoginMode ? '회원가입' : '로그인'}
          </button>
        </p>
      </form>
    </div>
  )
}
