import { z } from 'zod'

export const authSchema = z
  .object({
    username: z.string().min(3, '사용자 이름은 3자 이상이어야 합니다'),
    email: z.email('유효한 이메일을 입력하세요'),
    password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.confirmPassword !== undefined && data.confirmPassword !== '') {
        return data.password === data.confirmPassword
      }
      return true
    },
    {
      message: '비밀번호가 일치하지 않습니다',
      path: ['confirmPassword'],
    },
  )

export type AuthInput = z.infer<typeof authSchema>
