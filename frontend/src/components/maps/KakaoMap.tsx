import { useEffect } from 'react'
import CurrentLocationMarker from './CurrentLocationMarker'
import type { ReactNode } from 'react'
import { useKakaoMap } from '@/hooks/useKakaoMap'
import { useCurrentLocation } from '@/hooks/useCurrentLocation'
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '@/constants/location'
import KakaoMapContext from '@/contexts/KakaoMapContext'

export default function KakaoMap(props: {
  latitude?: number
  longitude?: number
  level?: number
  className?: string
  useCurrentLocation?: boolean
  children?: ReactNode
}) {
  const {
    location,
    isLoading: locationLoading,
    error: locationError,
    permissionState,
    requestPermission,
  } = useCurrentLocation()

  const latitude =
    props.useCurrentLocation && location?.latitude
      ? location.latitude
      : (props.latitude ?? DEFAULT_LATITUDE)

  const longitude =
    props.useCurrentLocation && location?.longitude
      ? location.longitude
      : (props.longitude ?? DEFAULT_LONGITUDE)

  const { mapRef, isLoaded, error, mapInstance } = useKakaoMap({
    latitude,
    longitude,
    level: props.level ?? 3,
  })

  useEffect(() => {
    if (props.useCurrentLocation && mapInstance && location) {
      const moveLatLon = new window.kakao.maps.LatLng(
        location.latitude,
        location.longitude,
      )
      mapInstance.panTo(moveLatLon)
    }
  }, [mapInstance, location, props.useCurrentLocation])

  const className = props.className ?? 'w-full h-full'

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100`}
      >
        <p className="text-red-500">지도 로딩 실패</p>
      </div>
    )
  }

  if (locationError) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100`}
      >
        <p className="text-red-500">{locationError}</p>
      </div>
    )
  }

  if (
    props.useCurrentLocation &&
    (permissionState === 'prompt' || permissionState === 'unknown') &&
    !locationLoading &&
    !location
  ) {
    return (
      <div
        className={`${className} flex flex-col items-center justify-center bg-gray-100 gap-4`}
      >
        <p className="text-gray-700">위치 권한이 필요합니다</p>
        <button
          onClick={requestPermission}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          위치 권한 허용
        </button>
      </div>
    )
  }

  if (props.useCurrentLocation && permissionState === 'denied') {
    return (
      <div
        className={`${className} flex flex-col items-center justify-center bg-gray-100 gap-2 `}
      >
        <p className="text-red-500">위치 권한이 거부되었습니다</p>
        <p className="text-sm text-gray-600">
          브라우저 설정에서 위치 권한을 허용해주세요
        </p>
      </div>
    )
  }
  return (
    <KakaoMapContext.Provider value={{ map: mapInstance, isLoaded }}>
      <div className={`relative ${className}`}>
        {(!isLoaded || (props.useCurrentLocation && locationLoading)) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
        {isLoaded && (
          <>
            {props.useCurrentLocation && location && (
              <CurrentLocationMarker
                latitude={location.latitude}
                longitude={location.longitude}
              />
            )}
            {props.children}
          </>
        )}
      </div>
    </KakaoMapContext.Provider>
  )
}
