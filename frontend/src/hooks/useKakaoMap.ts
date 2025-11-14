// hooks/useKakaoMap.tsx
import { useEffect, useRef, useState } from 'react'

export function useKakaoMap(props: {
  latitude: number
  longitude: number
  level: number
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { latitude, longitude, level } = props

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current) return

      window.kakao.maps.load(() => {
        try {
          const options = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: level,
          }

          const map = new window.kakao.maps.Map(mapRef.current, options)
          mapInstanceRef.current = map

          setIsLoaded(true)
          setError(null)
        } catch (err) {
          setError(err instanceof Error ? err : new Error('지도 생성 실패'))
        }
      })
    }

    if (window.kakao?.maps) {
      initializeMap()
      return
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = false
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_JS_KEY}&autoload=false&libraries=services,clusterer`

    script.onload = () => {
      initializeMap()
    }

    script.onerror = () => {
      setError(new Error('Kakao Map script loading failed'))
    }

    document.head.appendChild(script)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return

    try {
      const moveLatLon = new window.kakao.maps.LatLng(latitude, longitude)
      mapInstanceRef.current.setCenter(moveLatLon)
      mapInstanceRef.current.setLevel(level)
    } catch (err) {
      console.error('지도 업데이트 오류:', err)
    }
  }, [latitude, longitude, level, isLoaded])

  return {
    mapRef,
    isLoaded,
    error,
    mapInstance: mapInstanceRef.current,
  }
}
