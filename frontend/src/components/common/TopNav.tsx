import { useRouter } from '@tanstack/react-router'

export default function TopNav(props: { title?: string }) {
  const router = useRouter()

  const handleGoBack = () => {
    router.history.go(-1)
  }

  return (
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
      <p className="text-xl font-bold text-gray-900">{props.title}</p>
    </div>
  )
}
