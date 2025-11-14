// components/maps/CurrentLocationMarker.tsx
import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { useKakaoMapContext } from '@/contexts/KakaoMapContext'

function CurrentLocationContent() {
  return (
    <div className="relative w-6 h-6">
      {/* 외부 원 (펄스 효과) */}
      <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping" />

      {/* 내부 원 */}
      <div className="absolute inset-0 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>
    </div>
  )
}

export default function CurrentLocationMarker(props: {
  latitude: number
  longitude: number
}) {
  const { map, isLoaded } = useKakaoMapContext()
  const overlayRef = useRef<any>(null)

  useEffect(() => {
    if (!map || !isLoaded || !window.kakao) return

    const container = document.createElement('div')
    const root = createRoot(container)
    root.render(<CurrentLocationContent />)

    const overlay = new window.kakao.maps.CustomOverlay({
      map: map,
      position: new window.kakao.maps.LatLng(props.latitude, props.longitude),
      content: container,
      yAnchor: 0.5, // 중앙 기준
    })

    overlayRef.current = overlay

    return () => {
      overlay.setMap(null)
      root.unmount()
    }
  }, [map, isLoaded, props.latitude, props.longitude])

  // 위치 업데이트
  useEffect(() => {
    if (!overlayRef.current) return
    overlayRef.current.setPosition(
      new window.kakao.maps.LatLng(props.latitude, props.longitude),
    )
  }, [props.latitude, props.longitude])

  return null
}
