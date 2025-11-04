import { useParams, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { useData } from '../../contexts/DataContext'
import { 
  Warehouse, 
  TrendingUp, 
  Package, 
  IndianRupee,
  ArrowLeft,
  Users,
  Truck,
  Calendar
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts'

const WarehouseAnalytics = () => {
  const { warehouseId } = useParams()
  const navigate = useNavigate()
  const { warehouses: warehouseData, inventory, transferRequests, dispatchRequests, trips } = useData()

  // Find warehouse
  const warehouse = useMemo(() => {
    return warehouseData.find(w => w.id === warehouseId) || warehouseData[0]
  }, [warehouseId, warehouseData])

  // Filter data for this warehouse
  const warehouseInventory = useMemo(() => {
    if (!warehouse || !warehouse.id) return []
    return inventory.filter(item => item.warehouse === warehouse.id)
  }, [inventory, warehouse])

  const warehouseTransfers = useMemo(() => {
    if (!warehouse || !warehouse.id) return []
    return transferRequests.filter(t => 
      t.fromWarehouse === warehouse.id || t.toWarehouse === warehouse.id
    )
  }, [transferRequests, warehouse])

  const warehouseDispatches = useMemo(() => {
    if (!warehouse || !warehouse.id) return []
    return dispatchRequests.filter(d => {
      const inv = inventory.find(i => i.id === d.inventoryId)
      return inv && inv.warehouse === warehouse.id
    })
  }, [dispatchRequests, inventory, warehouse])

  const warehouseTrips = useMemo(() => {
    if (!warehouse || !warehouse.id) return []
    return trips.filter(trip => {
      const fromMatch = trip.from.includes(warehouse.id)
      const toMatch = trip.to.includes(warehouse.id)
      return fromMatch || toMatch
    })
  }, [trips, warehouse])

  // Product distribution
  const productDistribution = useMemo(() => {
    const products = {}
    warehouseInventory.forEach(item => {
      products[item.product] = (products[item.product] || 0) + item.quantity
    })
    
    return Object.entries(products).map(([name, value]) => ({
      name,
      value: Math.round(value)
    })).sort((a, b) => b.value - a.value)
  }, [warehouseInventory])

  // Monthly utilization trend (mock data)
  const utilizationTrend = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map(month => ({
      month,
      utilization: Math.floor(Math.random() * 20) + warehouse.utilization - 10,
      inbound: Math.floor(Math.random() * 100) + 50,
      outbound: Math.floor(Math.random() * 80) + 40
    }))
  }, [warehouse.utilization])

  // Top farmers
  const topFarmers = useMemo(() => {
    const farmers = {}
    warehouseInventory.forEach(item => {
      const key = `${item.farmerId}-${item.farmer}`
      if (!farmers[key]) {
        farmers[key] = { farmerId: item.farmerId, farmerName: item.farmer, quantity: 0, items: 0 }
      }
      farmers[key].quantity += item.quantity
      farmers[key].items += 1
    })
    
    return Object.values(farmers)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)
      .map((f, index) => ({
        name: `${f.farmerName} (${f.farmerId})`,
        quantity: Math.round(f.quantity),
        items: f.items
      }))
  }, [warehouseInventory])

  // Transfer statistics
  const transferStats = useMemo(() => {
    const incoming = warehouseTransfers.filter(t => t.toWarehouse === warehouse.id).length
    const outgoing = warehouseTransfers.filter(t => t.fromWarehouse === warehouse.id).length
    return { incoming, outgoing, total: incoming + outgoing }
  }, [warehouseTransfers, warehouse.id])

  // Revenue calculation (mock)
  const revenueData = useMemo(() => {
    const storageRevenue = warehouseInventory.reduce((sum, item) => {
      const daysInStorage = Math.floor((Date.now() - new Date(item.storedDate).getTime()) / (1000 * 60 * 60 * 24))
      const rate = item.storageType === 'cold' ? 50 : 30 // per day per ton
      return sum + (daysInStorage * item.quantity * rate)
    }, 0)
    
    return {
      storage: Math.round(storageRevenue),
      handling: warehouseDispatches.length * 5000,
      total: Math.round(storageRevenue) + (warehouseDispatches.length * 5000)
    }
  }, [warehouseInventory, warehouseDispatches])

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#a855f7']

  // If warehouse not found, show error message
  if (!warehouse) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-semibold">Warehouse not found</p>
          <button
            onClick={() => navigate('/admin/analytics')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
          >
            Back to Analytics
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/analytics')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{warehouse.name} - Analytics</h1>
            <p className="text-gray-600 mt-1">{warehouse.id} • {warehouse.district}, {warehouse.region}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Capacity Utilization</p>
              <p className="text-2xl font-bold text-gray-900">{warehouse.utilization}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {warehouse.occupied.toLocaleString()} / {warehouse.capacity.toLocaleString()} tonnes
              </p>
              <p className="text-xs font-medium text-gray-700 mt-2">
                Available: {(warehouse.capacity - warehouse.occupied).toLocaleString()} tonnes
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                warehouse.utilization >= 80 ? 'bg-red-500' :
                warehouse.utilization >= 60 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${warehouse.utilization}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">{warehouseInventory.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Set(warehouseInventory.map(i => i.product)).size} unique types
              </p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{revenueData.total.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">
                Storage: ₹{revenueData.storage.toLocaleString()}
              </p>
            </div>
            <IndianRupee className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Transfers</p>
              <p className="text-2xl font-bold text-gray-900">{transferStats.total}</p>
              <p className="text-xs text-gray-500 mt-1">
                In: {transferStats.incoming} • Out: {transferStats.outgoing}
              </p>
            </div>
            <Truck className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Capacity Utilization Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Utilization Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={utilizationTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="utilization" stroke="#10b981" strokeWidth={2} name="Utilization %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Product Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Product Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {productDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Farmers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Top Farmers by Quantity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topFarmers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#3b82f6" name="Quantity (tonnes)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inbound vs Outbound */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Movement</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={utilizationTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="inbound" fill="#10b981" name="Inbound (tonnes)" />
              <Bar dataKey="outbound" fill="#ef4444" name="Outbound (tonnes)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Capacity Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Warehouse className="w-6 h-6 text-primary" />
          Warehouse Capacity Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border-r border-gray-200 pr-6">
            <p className="text-sm text-gray-600 mb-1">Total Capacity</p>
            <p className="text-3xl font-bold text-gray-900">{warehouse.capacity.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">tonnes</p>
          </div>
          <div className="border-r border-gray-200 pr-6">
            <p className="text-sm text-gray-600 mb-1">Occupied Capacity</p>
            <p className="text-3xl font-bold text-red-600">{warehouse.occupied.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">tonnes ({warehouse.utilization}%)</p>
          </div>
          <div className="border-r border-gray-200 pr-6">
            <p className="text-sm text-gray-600 mb-1">Available Capacity</p>
            <p className="text-3xl font-bold text-green-600">{(warehouse.capacity - warehouse.occupied).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">tonnes ({(100 - warehouse.utilization).toFixed(1)}%)</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Capacity Status</p>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-4 h-4 rounded-full ${
                warehouse.utilization >= 80 ? 'bg-red-500' :
                warehouse.utilization >= 60 ? 'bg-yellow-500' :
                'bg-green-500'
              }`} />
              <p className={`text-lg font-semibold ${
                warehouse.utilization >= 80 ? 'text-red-600' :
                warehouse.utilization >= 60 ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {warehouse.utilization >= 80 ? 'Critical' :
                 warehouse.utilization >= 60 ? 'Moderate' : 'Good'}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {warehouse.utilization >= 80 ? 'Action needed' :
               warehouse.utilization >= 60 ? 'Monitor closely' : 'Sufficient space'}
            </p>
          </div>
        </div>
        
        {/* Visual Capacity Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Capacity Breakdown</span>
            <span className="text-sm text-gray-500">{warehouse.utilization}% utilized</span>
          </div>
          <div className="relative w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-green-500 flex items-center justify-end pr-2"
              style={{ width: `${(warehouse.capacity - warehouse.occupied) / warehouse.capacity * 100}%` }}
            >
              {(warehouse.capacity - warehouse.occupied) / warehouse.capacity * 100 > 5 && (
                <span className="text-xs font-medium text-white">
                  Available: {(warehouse.capacity - warehouse.occupied).toLocaleString()}t
                </span>
              )}
            </div>
            <div
              className="absolute right-0 top-0 h-full flex items-center pl-2 ${
                warehouse.utilization >= 80 ? 'bg-red-500' :
                warehouse.utilization >= 60 ? 'bg-yellow-500' :
                'bg-green-500'
              }"
              style={{ 
                width: `${warehouse.utilization}%`,
                backgroundColor: warehouse.utilization >= 80 ? '#ef4444' :
                                warehouse.utilization >= 60 ? '#f59e0b' : '#10b981'
              }}
            >
              {warehouse.utilization > 10 && (
                <span className="text-xs font-medium text-white">
                  Occupied: {warehouse.occupied.toLocaleString()}t
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
            <span>0 tonnes</span>
            <span>{warehouse.capacity.toLocaleString()} tonnes</span>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Active Farmers
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {new Set(warehouseInventory.map(i => i.farmerId)).size}
          </p>
          <p className="text-sm text-gray-500 mt-2">Farmers with stored products</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-600" />
            Total Trips
          </h3>
          <p className="text-3xl font-bold text-gray-900">{warehouseTrips.length}</p>
          <p className="text-sm text-gray-500 mt-2">Transport trips associated</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Average Storage Days
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round(warehouseInventory.reduce((sum, item) => {
              const days = Math.floor((Date.now() - new Date(item.storedDate).getTime()) / (1000 * 60 * 60 * 24))
              return sum + days
            }, 0) / (warehouseInventory.length || 1))}
          </p>
          <p className="text-sm text-gray-500 mt-2">Days products stored on average</p>
        </div>
      </div>
    </div>
  )
}

export default WarehouseAnalytics

