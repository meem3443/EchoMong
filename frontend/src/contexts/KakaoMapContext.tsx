import { createContext, useContext } from 'react'

interface KakaoMapContextType {
  map: any | null
  isLoaded: boolean
}

const KakaoMapContext = createContext<KakaoMapContextType | null>(null)

export const useKakaoMapContext = () => {
  const context = useContext(KakaoMapContext)
  if (!context) {
    throw new Error('useKakaoMapContext must be used within KakaoMap')
  }
  return context
}

export default KakaoMapContext
