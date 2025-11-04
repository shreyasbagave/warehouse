import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Bell, User, LogOut, Home, Menu, X } from 'lucide-react'

const Header = ({ onMenuToggle, isMenuOpen }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    // Mockup mode - just reset to default user
    logout()
  }

  const getRoleDisplay = (role) => {
    const roleMap = {
      farmer: 'Farmer',
      warehouse_manager: 'Warehouse Manager',
      transport_manager: 'Transport Manager',
      admin: 'Admin'
    }
    return roleMap[role] || role
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16 sm:h-20">
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          
          <button
            onClick={() => navigate('/farmer/dashboard')}
            className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-100 rounded-lg transition"
          >
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">Home</span>
          </button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary truncate">FWMS</h1>
          <span className="hidden lg:inline text-sm text-gray-500 ml-2">Farmer Warehouse Management System • Maharashtra</span>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
          <div className="hidden md:flex items-center gap-2 text-sm">
            <User className="w-4 h-4" />
            <span className="font-medium">{user?.name || 'User'}</span>
            <span className="text-gray-500">({getRoleDisplay(user?.role)})</span>
          </div>
          
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

