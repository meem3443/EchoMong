import { useEffect, useState } from 'react'

interface Location {
  latitude: number
  longitude: number
}

type PermissionState = 'granted' | 'denied' | 'prompt' | 'unknown'

interface UseCurrentLocationReturn {
  location: Location | null
  isLoading: boolean
  error: string | null
  permissionState: PermissionState
  requestPermission: () => void
}

export function useCurrentLocation(): UseCurrentLocationReturn {
  const [location, setLocation] = useState<Location | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [permissionState, setPermissionState] =
    useState<PermissionState>('unknown')

  // 권한 상태 확인
  const checkPermission = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!navigator.permissions) {
        requestLocation()
        return
      }

      const result = await navigator.permissions.query({
        name: 'geolocation' as PermissionName,
      })
      setPermissionState(result.state as PermissionState)

      result.addEventListener('change', () => {
        setPermissionState(result.state as PermissionState)
      })

      if (result.state === 'granted') {
        requestLocation()
      } else if (result.state === 'prompt') {
        setIsLoading(false)
      } else {
        setError('위치 권한이 거부되었습니다')
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Permission check error:', err)
      requestLocation()
    }
  }

  // 위치 요청
  const requestLocation = () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!navigator.geolocation) {
      setError('Geolocation을 지원하지 않는 브라우저입니다')
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setIsLoading(false)
        setError(null)
        setPermissionState('granted')
      },
      (err) => {
        let errorMessage = '위치를 가져올 수 없습니다'
        let newPermissionState: PermissionState = 'unknown'

        switch (err.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = '위치 권한이 거부되었습니다'
            newPermissionState = 'denied'
            break
          case 2: // POSITION_UNAVAILABLE
            errorMessage = '위치 정보를 사용할 수 없습니다'
            break
          case 3: // TIMEOUT
            errorMessage = '위치 요청 시간이 초과되었습니다'
            break
        }

        setError(errorMessage)
        setPermissionState(newPermissionState)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  useEffect(() => {
    checkPermission()
  }, [])

  return {
    location,
    isLoading,
    error,
    permissionState,
    requestPermission: requestLocation,
  }
}
