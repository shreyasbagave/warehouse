import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <Header onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      <div className="flex w-full">
        <Sidebar isOpen={isMenuOpen} onClose={closeMenu} />
        <main className="flex-1 w-full min-w-0 p-3 sm:p-4 md:p-6 pt-20 sm:pt-20 lg:pt-16 lg:ml-64 transition-all duration-300 overflow-x-hidden max-w-full">
          <div className="w-full max-w-full overflow-x-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

