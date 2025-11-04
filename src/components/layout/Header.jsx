import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Bell, User, LogOut, Home } from 'lucide-react'

const Header = () => {
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
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/farmer/dashboard')}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-100 rounded-lg transition"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <h1 className="text-2xl font-bold text-primary">FWMS</h1>
          <span className="text-sm text-gray-500">Farmer Warehouse Management System • Maharashtra</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
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
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

