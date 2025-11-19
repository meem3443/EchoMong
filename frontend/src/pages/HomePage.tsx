import { useState } from 'react'
import type { MarkerData } from '@/mocks/mocks'
import KakaoMap from '@/components/maps/KakaoMap'
import CustomMarker from '@/components/maps/CustomMarker'
import { markers } from '@/mocks/mocks'
import { Modal } from '@/components/Modal'

export default function HomePage() {
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null)

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

      <Modal isOpen={!!selectedMarker} onClose={closeModal}>
        {selectedMarker && (
          <selectedMarker.modalComponent
            {...selectedMarker.modalProps}
            onClick={() => alert(`${selectedMarker.title} 팀 확정!`)}
          />
        )}
      </Modal>
    </div>
  )
}
