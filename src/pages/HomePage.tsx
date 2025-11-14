// pages/HomePage.tsx
import { useState } from 'react'
import KakaoMap from '@/components/maps/KakaoMap'
import CustomMarker from '@/components/maps/CustomMarker'
import { echomongs, markers } from '@/mocks/marker'
import { Modal } from '@/components/Modal'
import { EchomongModalContent } from '@/components/EchomongModalContent'

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  function toggleModal() {
    setIsModalOpen((prev) => !prev)
  }

  return (
    <div className="relative w-full h-screen">
      <KakaoMap
        level={5}
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
            onClick={toggleModal}
          />
        ))}
      </KakaoMap>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <EchomongModalContent
          lyrics={`${echomongs[0].lyrics}`}
          imgSrc={echomongs[0].img}
          backgroundSrc="background.png"
          onClick={() => alert('팀이 확정되었습니다!')}
        />
      </Modal>
    </div>
  )
}
