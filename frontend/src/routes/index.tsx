import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '@/pages/AuthPage'

export const Route = createFileRoute('/')({
  component: AuthPage,
  staticData: {
    hideNavbar: true,
  },
})
