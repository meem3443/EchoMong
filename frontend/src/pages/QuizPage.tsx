import { useNavigate, useRouter } from '@tanstack/react-router'

export function QuizPage() {
  const router = useRouter()

  const handleGoBack = () => {
    router.history.go(-1)
  }

  const navigate = useNavigate()

  return (
    <div className="flex flex-col w-full h-full bg-white">
      <div className="flex items-center p-4  sticky top-0 z-10">
        <button
          className="text-2xl mr-4 p-1 hover:bg-gray-100 rounded-full transition-colors font-black text-black cursor-pointer"
          onClick={handleGoBack}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <p className="text-xl font-bold text-gray-900">퀴즈 풀기</p>
      </div>
      <div className="flex flex-col mx-auto bg-white w-full h-auto text-black items-center justify-center">
        <img
          className="w-full h-full object-contain p-10"
          src={'poster_1.jpg'}
        />
        <p className="font-bold text-2xl bg-sky-200 p-2 rounded-2xl mb-5">
          위 공연의 이름은 무엇일까요?
        </p>
        <div className="grid grid-cols-1 w-full gap-2 justify-items-center">
          <button
            className=" border-2 border-b-black w-3/4 p-3 rounded-2xl"
            onClick={() => {
              navigate({ to: '/reward' })
            }}
          >
            오해
          </button>
          <button className=" border-2 border-b-black w-3/4 p-3 rounded-2xl">
            오예
          </button>
          <button className=" border-2 border-b-black w-3/4 p-3 rounded-2xl">
            오우예
          </button>
        </div>
      </div>
    </div>
  )
}
