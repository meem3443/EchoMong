import type { Echomong } from '@/types/echomong'

// mocks/marker.ts
export const markers = [
  {
    id: 1,
    lat: 36.3684119,
    lng: 127.3445475,
    img: '/echomong_1.png',
    title: '하늘다람쥐',
  },
  {
    id: 2,
    lat: 36.3694119,
    lng: 127.3455475,
    img: '/echomong_2.png',
    title: '황조롱이',
  },
]

export const echomongs: Array<Echomong> = [
  {
    id: 1,
    lyrics: '나는 하늘다람쥐야! 잘 부탁해',
    img: '/echomong_1.png',
    title: '하늘다람쥐',
  },
  {
    id: 2,
    lyrics: '날카로운 시선과 빠른 날갯짓, 하늘의 사냥꾼',
    img: '/echomong_2.png',
    title: '황조롱이',
  },
]
