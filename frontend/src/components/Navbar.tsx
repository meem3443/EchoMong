import { Link } from '@tanstack/react-router'
import { BookOpen, HomeIcon } from 'lucide-react'

export default function Navbar() {
  return (
    <div className="flex bg-blue-400 w-full justify-center">
      <Link to="/home">
        <HomeIcon className="w-6 h-6 text-white m-4" />
      </Link>
      <Link to="/dic">
        <BookOpen className="w-6 h-6 text-white m-4" />
      </Link>
    </div>
  )
}
