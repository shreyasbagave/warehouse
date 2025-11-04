import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import FarmerDashboard from './pages/farmer/FarmerDashboard'
import WarehouseDashboard from './pages/warehouse/WarehouseDashboard'
import TransportDashboard from './pages/transport/TransportDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import WarehouseAnalyticsSelect from './pages/admin/WarehouseAnalyticsSelect'
import WarehouseAnalytics from './pages/admin/WarehouseAnalytics'
import AddWarehouse from './pages/admin/AddWarehouse'
import EditWarehouse from './pages/admin/EditWarehouse'
import BillingPayments from './pages/billing/BillingPayments'
import Reports from './pages/reports/Reports'
import DriverLogin from './pages/driver/DriverLogin'
import DriverRegister from './pages/driver/DriverRegister'
import DriverDashboard from './pages/driver/DriverDashboard'
import TripSelect from './pages/driver/TripSelect'
import TripDetails from './pages/driver/TripDetails'
import DriverEarnings from './pages/driver/DriverEarnings'
import Layout from './components/layout/Layout'

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route path="/driver/register" element={<DriverRegister />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/farmer/dashboard" replace />} />
            <Route path="farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="farmer/storage-request" element={<FarmerDashboard />} />
            <Route path="farmer/dispatch" element={<FarmerDashboard />} />
            <Route path="farmer/tracking" element={<FarmerDashboard />} />
            
            <Route path="warehouse/dashboard" element={<WarehouseDashboard />} />
            <Route path="warehouse/storage-requests" element={<WarehouseDashboard />} />
            <Route path="warehouse/inventory" element={<WarehouseDashboard />} />
            <Route path="warehouse/intake" element={<WarehouseDashboard />} />
            <Route path="warehouse/transfers" element={<WarehouseDashboard />} />
            
            <Route path="transport/dashboard" element={<TransportDashboard />} />
            <Route path="transport/internal" element={<TransportDashboard />} />
            <Route path="transport/external" element={<TransportDashboard />} />
            
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/internal-transports" element={<AdminDashboard />} />
            <Route path="admin/warehouses" element={<AdminDashboard />} />
            <Route path="admin/warehouses/add" element={<AddWarehouse />} />
            <Route path="admin/warehouses/:warehouseId/edit" element={<EditWarehouse />} />
            <Route path="admin/analytics" element={<WarehouseAnalyticsSelect />} />
            <Route path="admin/analytics/:warehouseId" element={<WarehouseAnalytics />} />
            <Route path="admin/users" element={<AdminDashboard />} />
            <Route path="admin/approvals" element={<AdminDashboard />} />
            
            <Route path="driver/dashboard" element={<DriverDashboard />} />
            <Route path="driver/trip-select" element={<TripSelect />} />
            <Route path="driver/trip/:tripId" element={<TripDetails />} />
            <Route path="driver/earnings" element={<DriverEarnings />} />
            
            <Route path="billing" element={<BillingPayments />} />
            
            <Route path="reports" element={<Reports />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/farmer/dashboard" replace />} />
        </Routes>
      </Router>
      </DataProvider>
    </AuthProvider>
  )
}

export default App

