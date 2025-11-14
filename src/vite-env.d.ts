/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    kakao: any
  }
}

export {}
