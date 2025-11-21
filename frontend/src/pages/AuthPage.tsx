import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'

import toast from 'react-hot-toast'
import type { AuthInput } from '@/schemas/auth'
import { authSchema, loginSchema } from '@/schemas/auth'
import { loginUser, registerUser, setAuthToken } from '@/api/auth'
import useAuthStore from '@/stores/useAuthStore'

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
    resolver: zodResolver(isLoginMode ? loginSchema : authSchema) as any,
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
        const response = await loginUser({
          email: data.email,
          password: data.password,
        })
        setAuthToken(response.token)
        login({ token: response.token, username: data.username })
        toast.success('로그인에 성공했습니다!')
      } else {
        await registerUser(data)
        toast.success('회원가입에 성공했습니다! 자동으로 로그인합니다.')

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
      className="w-full h-full flex items-center justify-center bg-gray-900"
      key={isLoginMode ? 'login' : 'register'}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col p-6 w-full max-w-sm border border-gray-700 shadow-lg rounded-lg space-y-4 bg-gray-800 h-full"
      >
        <h2 className="text-2xl font-bold text-center text-white">
          {isLoginMode ? '로그인' : '회원가입'}
        </h2>
        {/* need to add logo some what*/}
        {!isLoginMode && (
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="mb-1 text-sm font-medium text-white"
            >
              사용자 이름
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              placeholder="사용자 이름을 입력하세요"
              className="border border-gray-600 bg-gray-700 p-2 rounded focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="mb-1 text-sm font-medium text-white"
          >
            이메일
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            placeholder="이메일을 입력하세요"
            className="border border-gray-600 bg-gray-700 p-2 rounded focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="mb-1 text-sm font-medium text-white"
          >
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            placeholder="비밀번호를 입력하세요"
            className="border border-gray-600 bg-gray-700 p-2 rounded focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
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
              className="mb-1 text-sm font-medium text-white"
            >
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              placeholder="비밀번호를 다시 입력하세요"
              className="border border-gray-600 bg-gray-700 p-2 rounded focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
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

        <p className="text-center text-sm text-gray-400">
          {isLoginMode ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          <button
            type="button"
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="font-semibold text-blue-400 hover:text-blue-300 ml-2"
          >
            {isLoginMode ? '회원가입' : '로그인'}
          </button>
        </p>
      </form>
    </div>
  )
}
