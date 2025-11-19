import { TrashRecyleIntroModalContent } from '@/components/TrashRecyleIntroModalContent'
import { EchomongModalContent } from '@/components/EchomongModalContent'

// 타입 정의 (TS 에러 방지용)
export interface MarkerData {
  id: number
  lat: number
  lng: number
  img: string
  title: string
  // 핵심: 컴포넌트를 변수 타입으로 저장
  modalComponent: React.ComponentType<any>
  // 핵심: 해당 컴포넌트에 들어갈 props들을 객체로 저장
  modalProps: Record<string, any>
}

export const markers: MarkerData[] = [
  {
    id: 1,
    lat: 36.3684119,
    lng: 127.3445475,
    img: '/echomong_1.png',
    title: '하늘다람쥐',
    // 1번 마커는 쓰레기 재활용 모달 사용
    modalComponent: TrashRecyleIntroModalContent,
    modalProps: {
      // TrashRecyleIntroContent가 props를 안 받는다면 빈 객체
    },
  },
  {
    id: 2,
    lat: 36.3694119,
    lng: 127.3455475,
    img: '/echomong_2.png',
    title: '황조롱이',
    // 2번 마커는 에코몽 모달 사용
    modalComponent: EchomongModalContent,
    modalProps: {
      lyrics: '날카로운 시선과 빠른 날갯짓, 하늘의 사냥꾼',
      imgSrc: '/echomong_2.png', // 배경이 투명한 캐릭터 이미지
      backgroundSrc: '/background.png', // 배경 이미지
      // onClick 같은 함수는 여기서 정의해도 되고, HomePage에서 공통으로 주입해도 됨
    },
  },
]
