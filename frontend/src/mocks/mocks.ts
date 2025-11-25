import { TrashRecyleIntroModalContent } from '@/components/TrashRecyleIntroModalContent'
import { EchomongModalContent } from '@/components/EchomongModalContent'
import { BoothInfoModalContent } from '@/components/BoothInfoModalContent'

export interface MarkerData {
  id: number
  lat: number
  lng: number
  img: string
  title: string
  modalComponent: React.ComponentType<any>
  modalProps: Record<string, any>
}

export const markers: Array<MarkerData> = [
  {
    id: 1,
    lat: 36.3684119,
    lng: 127.3445475,
    img: '/echomong_1.png',
    title: '하늘다람쥐',
    modalComponent: TrashRecyleIntroModalContent,
    modalProps: {},
  },
  {
    id: 2,
    lat: 36.3694119,
    lng: 127.3455475,
    img: '/echomong_2.png',
    title: '황조롱이',
    modalComponent: EchomongModalContent,
    modalProps: {
      lyrics: '날카로운 시선과 빠른 날갯짓, 하늘의 사냥꾼',
      imgSrc: '/echomong_2.png',
      backgroundSrc: '/background.png',
    },
  },
  {
    id: 3,
    lat: 36.3674119,
    lng: 127.3455475,
    img: '/club_1.jpg',
    title: '시나브로',
    modalComponent: BoothInfoModalContent,
    modalProps: {
      clubName: '시나브로',
      imgSrc: '/club_1.jpg',
      btnText1: '정보보기',
      btnText2: '퀴즈풀기',

      description: `매년 4회의 정기 공연을 올리며 신입생을 중심으로 진행되는 단막극,워크샵 공연도 있어 참여할 수 있는 기회가 많습니다.\n\n무대 디자인, 연출, 음향, 조명, 배우, 기획 등 많은 부분들로 나누어져있어서 배울 수 있는 것도 많고 경험도 많이 쌓을 수 있습니다.`,
      location: '충남대학교 1학생회관 306호 소극장',
      instagram: 'instagram.com/sinabeuro_cnu',
      contacts: [
        { role: '회장', phone: '010-4547-3418' },
        { role: '부회장', phone: '010-4421-3009' },
        { role: '총무', phone: '010-9579-6889' },
      ],
      footerText: '충남대 ACCESSIO 부스 진행중',
    },
  },
]
