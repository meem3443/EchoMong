import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { MarkerData } from '@/mocks/mocks'
import KakaoMap from '@/components/maps/KakaoMap'
import CustomMarker from '@/components/maps/CustomMarker'

import { markers } from '@/mocks/mocks'
import { Modal } from '@/components/Modal'
import useAuthStore from '@/stores/useAuthStore'

export default function HomePage() {
  const naviagte = useNavigate()

  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null)
  const { teamRegister, isLoggedIn, logout } = useAuthStore()

  if (!isLoggedIn) {
    logout()
    naviagte({ to: '/' })
  }

  const handleMarkerClick = (marker: MarkerData) => {
    setSelectedMarker(marker)
  }

  const closeModal = () => {
    setSelectedMarker(null)
  }

  return (
    <div className="relative w-full h-full">
      <KakaoMap
        level={3}
        latitude={markers[0]?.lat}
        longitude={markers[0]?.lng}
      >
        {markers.map((marker) => (
          <CustomMarker
            key={marker.id}
            latitude={marker.lat}
            longitude={marker.lng}
            imageUrl={marker.img}
            title={marker.title}
            onClick={() => handleMarkerClick(marker)}
          />
        ))}
      </KakaoMap>

      <div className="absolute bottom-6 right-4 flex flex-col gap-3 z-40">
        <button
          onClick={() => alert('나의 팀 정보 확인')}
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 active:scale-95 transition-all border border-gray-100"
          aria-label="My Team"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 5.472m0 0a9.09 9.09 0 0 0-3.279 1.304 1.115 1.115 0 0 1 1.466-1.638c.466.326.997.6 1.55.8m6-17c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4Z"
            />
          </svg>
        </button>

        <button
          onClick={() => alert('오늘의 미션 확인')}
          className="w-12 h-12 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 active:scale-95 transition-all shadow-blue-200"
          aria-label="Missions"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
            />
          </svg>
        </button>
      </div>

      <Modal isOpen={!!selectedMarker} onClose={closeModal}>
        {selectedMarker && (
          <selectedMarker.modalComponent
            {...selectedMarker.modalProps}
            onClick={() => teamRegister(`${selectedMarker.title}`)}
          />
        )}
      </Modal>
    </div>
  )
}
