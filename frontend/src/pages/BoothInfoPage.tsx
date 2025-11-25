import { useRouter } from '@tanstack/react-router'
import { markers } from '@/mocks/mocks'

function ImageWithFallback({
  src,
  alt,
  className,
}: {
  src?: string
  alt: string
  className?: string
}) {
  if (!src) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center text-gray-400 ${className}`}
      >
        <span className="text-xs">이미지 없음</span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover w-full h-full ${className}`}
    />
  )
}

export function BoothInfoPage() {
  const router = useRouter()

  const id = 3

  const handleGoBack = () => {
    router.history.go(-1)
  }

  const marker = markers.find((m) => m.id === Number(id))

  if (!marker) {
    return <div className="p-10 text-center">데이터를 찾을 수 없습니다.</div>
  }

  const info = marker.modalProps

  return (
    <div className="flex flex-col w-full min-h-screen bg-sky-100">
      <div className="flex items-center p-4 bg-white sticky top-0 z-10">
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
        <p className="text-xl font-bold text-gray-900">부스 정보 보기</p>
      </div>
      <div className="flex-1 p-5 overflow-y-auto pb-10">
        <div className="flex flex-col w-full h-auto bg-white rounded-3xl p-6 shadow-lg space-y-6">
          <h2 className="text-2xl font-extrabold text-gray-900">
            {info.clubName}
          </h2>

          <div className="w-full aspect-3/4 rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <ImageWithFallback src={info.imgSrc} alt={info.clubName} />
          </div>

          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {info.description}
          </div>

          <hr className="border-gray-200" />

          <div className="flex flex-col gap-3 text-sm text-gray-800 font-medium">
            {info.location && (
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-gray-900 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{info.location}</span>
              </div>
            )}

            {info.instagram && (
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-gray-900 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <a
                  href={`https://${info.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {info.instagram}
                </a>
              </div>
            )}

            {info.contacts && (
              <div className="flex items-start gap-3 mt-1">
                <svg
                  className="w-5 h-5 text-gray-900 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div className="flex flex-col gap-1">
                  {info.contacts.map((contact: any, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <span className="font-bold">{contact.role}:</span>
                      <span>{contact.phone}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {info.footerImg && (
            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm border border-gray-100 mt-4">
              <img
                src={info.footerImg}
                alt="Club Activity"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {info.footerText && (
            <div className="text-center pt-2">
              <p className="text-lg font-bold text-gray-900">
                {info.footerText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
