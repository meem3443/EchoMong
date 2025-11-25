import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import type { ChangeEvent } from 'react'
import type { MarkerData } from '@/mocks/mocks'
import KakaoMap from '@/components/maps/KakaoMap'
import CustomMarker from '@/components/maps/CustomMarker'

import { markers } from '@/mocks/mocks'
import { Modal } from '@/components/Modal'
import useAuthStore from '@/stores/useAuthStore'
import { setUserTeam } from '@/api/auth'

export default function HomePage() {
  const navigate = useNavigate()
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false)

  const [activeMissionType, setActiveMissionType] = useState<
    'photo' | 'recycle' | null
  >(null)

  const [completedMissions, setCompletedMissions] = useState({
    photo: false,
    recycle: false,
    instagram: false,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const { teamRegister, isLoggedIn, logout, user } = useAuthStore()

  useEffect(() => {
    if (!isLoggedIn) {
      logout()
      navigate({ to: '/' })
    }
  }, [isLoggedIn, logout, navigate])

  if (!isLoggedIn) {
    return null
  }

  const handleMarkerClick = (marker: MarkerData) => {
    setSelectedMarker(marker)
  }

  // ✅ [복구 완료] 삭제되었던 hanldeTeamRegister 함수를 원상복구했습니다.
  const hanldeTeamRegister = (teamName: string) => {
    setUserTeam(teamName)
      .then(() => {
        teamRegister(teamName)
        toast.success('팀 등록 완료~!')
        closeModal()
      })
      .catch(() => toast.error('팀 등록에 실패했습니다.'))
  }

  const closeModal = () => {
    setSelectedMarker(null)
  }

  const handleImageMissionClick = (type: 'photo' | 'recycle') => {
    setActiveMissionType(type)
    fileInputRef.current?.click()
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (activeMissionType === 'photo') {
      toast.success('📸 사진 미션 완료! (' + file.name + ')')
      setCompletedMissions((prev) => ({ ...prev, photo: true }))
    } else if (activeMissionType === 'recycle') {
      toast.success('♻️ 재활용 인증 완료! (' + file.name + ')')
      setCompletedMissions((prev) => ({ ...prev, recycle: true }))
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleInstagramClick = () => {
    setCompletedMissions((prev) => ({ ...prev, instagram: true }))

    const userAgent = navigator.userAgent.toLowerCase()
    const isAndroid = userAgent.indexOf('android') > -1
    const isIOS =
      userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1

    if (isAndroid || isIOS) {
      const visitedAt = new Date().getTime()
      window.location.href = 'instagram://story-camera'

      setTimeout(() => {
        if (new Date().getTime() - visitedAt < 2000) {
          window.location.href = 'https://www.instagram.com/'
        }
      }, 1500)
    } else {
      window.open('https://www.instagram.com/', '_blank')
      toast('PC에서는 인스타그램 웹으로 이동합니다.')
    }
  }

  const handleGoToInfo = (id?: number) => {
    navigate({ to: `/booth` })
    closeModal()
  }

  const handleGoToQuiz = (id?: number) => {
    navigate({ to: `/quiz` })
    closeModal()
  }

  const getMissionButtonStyle = (isCompleted: boolean) => {
    return `rounded-2xl w-20 h-20 flex flex-col items-center justify-center gap-1 p-2 cursor-pointer transition-all duration-300 ${
      isCompleted
        ? 'bg-blue-600 hover:bg-blue-700 shadow-md scale-105'
        : 'bg-gray-400 hover:bg-gray-800'
    }`
  }

  return (
    <div className="relative w-full h-full">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onFileChange}
      />

      <KakaoMap
        level={3}
        latitude={markers[0]?.lat}
        longitude={markers[0]?.lng}
        useCurrentLocation={true}
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
          onClick={() => setIsTeamModalOpen(true)}
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 active:scale-95 transition-all border border-gray-100"
        >
          <span className="text-xl">🏰</span>
        </button>

        <button
          onClick={() => setIsMissionModalOpen(true)}
          className="w-12 h-12 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 active:scale-95 transition-all shadow-blue-200"
        >
          <span className="text-xl">🎯</span>
        </button>
      </div>

      <Modal isOpen={!!selectedMarker} onClose={closeModal}>
        {selectedMarker && (
          <selectedMarker.modalComponent
            {...selectedMarker.modalProps}
            // ✅ 기존: 팀 등록을 위한 onClick 복구
            onClick={() => hanldeTeamRegister(selectedMarker.title)}
            // ✅ 추가: 부스 정보/퀴즈 이동을 위한 onClick1, onClick2 전달
            onClick1={() => handleGoToInfo(selectedMarker.id)}
            onClick2={() => handleGoToQuiz(selectedMarker.id)}
          />
        )}
      </Modal>

      <Modal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)}>
        <div className="p-6 bg-white rounded-xl min-w-[280px] flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">나의 팀 정보</h2>

          {user?.team ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                🏰
              </div>
              <p className="text-gray-500 text-sm">현재 소속된 팀</p>
              <p className="text-2xl font-extrabold text-blue-600">
                {user.team}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                열심히 활동해서 점수를 모아보세요!
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <p className="text-gray-500">아직 소속된 팀이 없습니다.</p>
              <p className="text-sm text-blue-500">
                지도의 마커를 눌러 팀에 가입해보세요!
              </p>
            </div>
          )}
          <button
            onClick={() => setIsTeamModalOpen(false)}
            className="mt-2 w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            닫기
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isMissionModalOpen}
        onClose={() => setIsMissionModalOpen(false)}
      >
        <div className="p-6 bg-white rounded-xl min-w-[280px] flex flex-col">
          <h2 className="text-xl font-bold text-gray-900">미션 수행하기</h2>

          <div className="flex w-full gap-2 items-center justify-center mx-auto mt-4">
            <div
              onClick={() => handleImageMissionClick('photo')}
              className={getMissionButtonStyle(completedMissions.photo)}
            >
              <span className="text-white text-[10px] font-bold text-center break-keep">
                {completedMissions.photo ? '완료됨' : '사진 찍기'}
              </span>
              <img
                className="w-10 h-10 object-contain"
                src={'festival_1.png'}
                alt="camera"
              />
            </div>

            <div
              onClick={() => handleImageMissionClick('recycle')}
              className={getMissionButtonStyle(completedMissions.recycle)}
            >
              <span className="text-white text-[10px] font-bold text-center break-keep">
                {completedMissions.recycle ? '완료됨' : '재활용 인증'}
              </span>
              <img
                className="w-10 h-10 object-contain"
                src={'festival_2.png'}
                alt="festival"
              />
            </div>

            <div
              onClick={handleInstagramClick}
              className={getMissionButtonStyle(completedMissions.instagram)}
            >
              <span className="text-white text-[10px] font-bold text-center break-keep">
                {completedMissions.instagram ? '완료됨' : '공유하기'}
              </span>
              <img
                className="w-10 h-10 object-contain"
                src={'instagram_logo.png'}
                alt="instagram"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
