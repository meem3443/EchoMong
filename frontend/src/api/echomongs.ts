import { api } from './client'
import type { Echomong } from '@/types/api'

export const getEchomongs = async (): Promise<Array<Echomong>> => {
  const { data } = await api.get<Array<Echomong>>('/api/echomongs')
  return data
}
