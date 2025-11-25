import { createFileRoute } from '@tanstack/react-router'
import { BoothInfoPage } from '@/pages/BoothInfoPage'

export const Route = createFileRoute('/booth')({
  component: BoothInfoPage,
  staticData: {
    hideNavbar: true,
  },
})
