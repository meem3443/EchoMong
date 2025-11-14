// components/maps/CustomMarker.tsx
import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import { useKakaoMapContext } from '@/contexts/KakaoMapContext'

function MarkerContent(props: { imageUrl: string; title: string }) {
  return (
    <div className="relative w-[60px] h-20 cursor-pointer">
      <div className="absolute left-1/2 -translate-x-1/2 -rotate-45 w-[60px] h-[60px] bg-white rounded-tl-[50%] rounded-tr-[50%] rounded-br-[50%] shadow-md" />
      <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[50px] h-[50px] rounded-full overflow-hidden border-[3px] border-white shadow-sm z-10">
        <img
          src={props.imageUrl}
          alt={props.title || 'marker'}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 제목 */}
      {props.title && (
        <div className="absolute -top-[25px] left-1/2 -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          {props.title}
        </div>
      )}
    </div>
  )
}

export default function CustomMarker(props: {
  latitude: number
  longitude: number
  imageUrl: string
  title: string
  onClick?: () => void
}) {
  const { map, isLoaded } = useKakaoMapContext()
  const overlayRef = useRef<any>(null)
  const rootRef = useRef<Root | null>(null) // ← root를 ref로 저장

  useEffect(() => {
    if (!map || !isLoaded || !window.kakao) return

    // React 컴포넌트를 DOM으로 렌더링
    const container = document.createElement('div')

    const root = createRoot(container)
    rootRef.current = root // ← ref에 저장
    root.render(<MarkerContent imageUrl={props.imageUrl} title={props.title} />)

    const overlay = new window.kakao.maps.CustomOverlay({
      map: map,
      position: new window.kakao.maps.LatLng(props.latitude, props.longitude),
      content: container,
      yAnchor: 1,
    })

    overlayRef.current = overlay

    // 클릭 이벤트
    if (props.onClick) {
      container.addEventListener('click', props.onClick)
    }

    return () => {
      if (props.onClick) {
        container.removeEventListener('click', props.onClick)
      }
      overlay.setMap(null)

      // 비동기로 unmount ← 수정
      if (rootRef.current) {
        const rootToUnmount = rootRef.current
        rootRef.current = null
        setTimeout(() => {
          rootToUnmount.unmount()
        }, 0)
      }
    }
  }, [
    map,
    isLoaded,
    props.latitude,
    props.longitude,
    props.imageUrl,
    props.title,
    props.onClick,
  ])

  // 위치 업데이트
  useEffect(() => {
    if (!overlayRef.current) return
    overlayRef.current.setPosition(
      new window.kakao.maps.LatLng(props.latitude, props.longitude),
    )
  }, [props.latitude, props.longitude])

  return null
}
