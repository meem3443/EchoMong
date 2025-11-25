import { createFileRoute } from '@tanstack/react-router'
import { RewardPage } from '@/pages/RewardPage'

export const Route = createFileRoute('/reward')({
  component: RewardPage,
})
