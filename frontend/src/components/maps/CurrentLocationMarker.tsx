import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { useKakaoMapContext } from '@/contexts/KakaoMapContext'

function CurrentLocationContent() {
  return (
    <div className="relative w-6 h-6">
      <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping" />
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
    if (
      !map ||
      !isLoaded ||
      !window.kakao ||
      !props.latitude ||
      !props.longitude
    )
      return

    const container = document.createElement('div')
    container.style.width = '24px'
    container.style.height = '24px'

    const root = createRoot(container)
    root.render(<CurrentLocationContent />)

    const overlay = new window.kakao.maps.CustomOverlay({
      map: map,
      position: new window.kakao.maps.LatLng(props.latitude, props.longitude),
      content: container,
      yAnchor: 0.5,
      zIndex: 999,
    })

    overlayRef.current = overlay

    return () => {
      setTimeout(() => {
        overlay.setMap(null)
        root.unmount()
      }, 0)
    }
  }, [map, isLoaded, props.latitude, props.longitude])

  return null
}
