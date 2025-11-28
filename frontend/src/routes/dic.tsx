import { createFileRoute } from '@tanstack/react-router'
import { DictionaryPage } from '@/pages/DictionaryPage'

export const Route = createFileRoute('/dic')({
  component: DictionaryPage,
})
