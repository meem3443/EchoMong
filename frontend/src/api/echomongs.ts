import { api } from './client'
import { Echomong } from '@/types/api'

export const getEchomongs = async (): Promise<Echomong[]> => {
  const { data } = await api.get<Echomong[]>('/api/echomongs')
  return data
}

// 나중에 추가 기능
export const getEchomongById = async (id: number): Promise<Echomong> => {
  const { data } = await api.get<Echomong>(`/api/echomongs/${id}`)
  return data
}
