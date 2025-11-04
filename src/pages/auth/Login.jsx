import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Warehouse, Home } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    loginType: 'phone' // phone, aadhaar, farmer_id
  })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Mockup mode - No authentication required, just redirect
    // Mock authentication - In real app, this would call API
    const mockUsers = {
      farmer: { id: 1, name: 'Rajesh Kumar', role: 'farmer', email: 'farmer@example.com' },
      warehouse_manager: { id: 2, name: 'Amit Sharma', role: 'warehouse_manager', email: 'warehouse@example.com' },
      transport_manager: { id: 3, name: 'Priya Patel', role: 'transport_manager', email: 'transport@example.com' },
      admin: { id: 4, name: 'Admin User', role: 'admin', email: 'admin@example.com' }
    }

    // Simple demo logic - use identifier to determine role
    let user = null
    if (formData.identifier.includes('admin')) {
      user = mockUsers.admin
    } else if (formData.identifier.includes('warehouse')) {
      user = mockUsers.warehouse_manager
    } else if (formData.identifier.includes('transport')) {
      user = mockUsers.transport_manager
    } else {
      user = mockUsers.farmer
    }

    // Always allow login in mockup mode
    login(user)
    const redirectPath = `/${user.role === 'farmer' ? 'farmer' : user.role === 'warehouse_manager' ? 'warehouse' : user.role === 'transport_manager' ? 'transport' : 'admin'}/dashboard`
    navigate(redirectPath)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Link
          to="/farmer/dashboard"
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 text-gray-700 transition"
        >
          <Home className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary p-3 rounded-full mb-4">
            <Warehouse className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">FWMS</h1>
          <p className="text-gray-600 mt-2">Farmer Warehouse Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login Type
            </label>
            <select
              value={formData.loginType}
              onChange={(e) => setFormData({ ...formData, loginType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="phone">Phone Number</option>
              <option value="aadhaar">Aadhaar Number</option>
              <option value="farmer_id">Farmer ID</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.loginType === 'phone' ? 'Phone Number' : 
               formData.loginType === 'aadhaar' ? 'Aadhaar Number' : 'Farmer ID'}
            </label>
            <input
              type="text"
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={formData.loginType === 'phone' ? 'Enter phone number' : 
                          formData.loginType === 'aadhaar' ? 'Enter Aadhaar number' : 
                          'Enter Farmer ID'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter any password (not required in mockup)"
              />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
            <p className="mb-2 font-medium">Mockup Mode - No Authentication Required:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Any identifier + any password = Login</li>
              <li>Include "warehouse" = Warehouse Manager</li>
              <li>Include "transport" = Transport Manager</li>
              <li>Include "admin" = Admin</li>
              <li>Or click any menu item in sidebar to navigate directly</li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-green-600 transition shadow-lg"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

