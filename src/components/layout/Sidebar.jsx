import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Settings, 
  FileText, 
  BarChart3,
  CreditCard,
  Warehouse,
  IndianRupee,
  Navigation,
  LogIn,
  UserPlus,
  CheckCircle
} from 'lucide-react'

const Sidebar = () => {
  const { user } = useAuth()

  const farmerMenu = [
    { path: '/farmer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/farmer/storage-request', label: 'Storage Request', icon: Package },
    { path: '/farmer/dispatch', label: 'Dispatch Request', icon: Truck },
    { path: '/farmer/tracking', label: 'Track Movement', icon: BarChart3 },
    { path: '/billing', label: 'Billing & Invoices', icon: CreditCard },
  ]

  const warehouseMenu = [
    { path: '/warehouse/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/warehouse/storage-requests', label: 'Storage Requests', icon: CheckCircle },
    { path: '/warehouse/inventory', label: 'Inventory', icon: Package },
    { path: '/warehouse/intake', label: 'New Intake', icon: Warehouse },
    { path: '/warehouse/transfers', label: 'Transfers', icon: Truck },
  ]

  const adminMenu = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/internal-transports', label: 'Internal Transports', icon: Truck },
    { path: '/admin/warehouses', label: 'All Warehouses', icon: Warehouse },
    { path: '/admin/analytics', label: 'View Analytics', icon: BarChart3 },
    { path: '/admin/users', label: 'User Management', icon: Settings },
    { path: '/admin/approvals', label: 'Approvals', icon: FileText },
  ]

  const driverMenu = [
    { path: '/driver/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/driver/earnings', label: 'Earnings & Payments', icon: IndianRupee },
    { path: '/driver/trip-select', label: 'Trip Details', icon: Navigation },
  ]

  const authMenu = [
    { path: '/login', label: 'Login Page', icon: LogIn },
    { path: '/signup', label: 'Signup Page', icon: UserPlus },
    { path: '/driver/login', label: 'Driver Login', icon: LogIn },
    { path: '/driver/register', label: 'Driver Register', icon: UserPlus },
  ]

  // Get menu based on user role
  const getMenuByRole = () => {
    const role = user?.role
    
    // Mockup/Demo mode - Show all menus for easy navigation
    // In production, uncomment the role-based switch below
    const isMockupMode = true // Set to false for production role-based access
    
    if (isMockupMode) {
      // Show all menus in mockup mode
      return [
        { section: 'Farmer', items: farmerMenu },
        { section: 'Warehouse', items: warehouseMenu },
        { section: 'Admin', items: adminMenu },
        { section: 'Driver', items: driverMenu },
        { section: 'Authentication', items: authMenu }
      ]
    }
    
    // Production mode - Role-based menu access
    switch (role) {
      case 'farmer':
        return [{ section: 'Farmer', items: farmerMenu }]
      case 'warehouse_manager':
      case 'warehouse':
        return [{ section: 'Warehouse', items: warehouseMenu }]
      case 'admin':
        return [{ section: 'Admin', items: adminMenu }]
      case 'driver':
        return [{ section: 'Driver', items: driverMenu }]
      default:
        // Fallback - Show all menus if role is not recognized
        return [
          { section: 'Farmer', items: farmerMenu },
          { section: 'Warehouse', items: warehouseMenu },
          { section: 'Admin', items: adminMenu },
          { section: 'Driver', items: driverMenu },
          { section: 'Authentication', items: authMenu }
        ]
    }
  }

  const menuSections = getMenuByRole()

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4">
        {menuSections.map((section) => (
          <div key={section.section} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
              {section.section}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar

