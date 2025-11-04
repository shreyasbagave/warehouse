import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'
import { 
  Truck, 
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Warehouse,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import warehouseData from '../../data/warehouses'

const TransportDashboard = () => {
  const location = useLocation()
  const { transferRequests, trips, assignTripToDriver } = useData()
  const isInternal = location.pathname.includes('internal')
  const isExternal = location.pathname.includes('external')

  // Warehouse data for integration - Sample of 300 warehouses (show first 10 in overview)
  const sampleWarehouses = warehouseData.slice(0, 10)

  // Get internal transfers from DataContext
  const internalTransfers = transferRequests.filter(t => 
    t.status === 'Pending Approval' || t.status === 'In Transit' || t.status === 'Approved'
  ).map(t => ({
    id: t.id,
    transferId: t.transferId,
    fromWarehouse: t.fromWarehouse,
    from: t.from,
    toWarehouse: t.toWarehouse,
    to: t.to,
    product: t.product,
    quantity: t.quantity,
    vehicle: t.vehicle,
    driver: t.driver,
    status: t.status,
    requestDate: t.requestDate,
    estimatedDelivery: t.estimatedArrival
  }))
  
  const [internalTransfersLegacy] = useState([
    {
      id: 1,
      transferId: 'TRF-001',
      fromWarehouse: 'WH-101',
      from: 'WH-101, Pune',
      fromCapacity: 1000,
      fromOccupied: 650,
      fromAvailable: 350,
      toWarehouse: 'WH-103',
      to: 'WH-103, Nagpur',
      toCapacity: 1200,
      toOccupied: 780,
      toAvailable: 420,
      product: 'Wheat',
      quantity: 25,
      vehicle: 'TRK-1234',
      driver: 'Ramesh Kumar',
      status: 'In Transit',
      dispatchedDate: '2024-01-26',
      estimatedDelivery: '2024-01-28',
      currentLocation: 'Highway NH-44, 150km from destination'
    },
    {
      id: 2,
      transferId: 'TRF-002',
      fromWarehouse: 'WH-102',
      from: 'WH-102, Nashik',
      fromCapacity: 800,
      fromOccupied: 520,
      fromAvailable: 280,
      toWarehouse: 'WH-101',
      to: 'WH-101, Pune',
      toCapacity: 1000,
      toOccupied: 650,
      toAvailable: 350,
      product: 'Rice',
      quantity: 30,
      vehicle: 'TRK-5678',
      driver: 'Suresh Patel',
      status: 'Dispatched',
      dispatchedDate: '2024-01-27',
      estimatedDelivery: '2024-01-29',
      currentLocation: 'Depot'
    },
    {
      id: 3,
      transferId: 'TRF-003',
      fromWarehouse: 'WH-104',
      from: 'WH-104, Mumbai',
      fromCapacity: 1500,
      fromOccupied: 950,
      fromAvailable: 550,
      toWarehouse: 'WH-105',
      to: 'WH-105, Aurangabad',
      toCapacity: 900,
      toOccupied: 580,
      toAvailable: 320,
      product: 'Soybeans',
      quantity: 50,
      vehicle: 'TRK-9012',
      driver: 'Anil Kumar',
      status: 'Pending',
      dispatchedDate: '2024-01-28',
      estimatedDelivery: '2024-01-30',
      currentLocation: 'Not Dispatched'
    }
  ])

  const [externalDispatches] = useState([
    {
      id: 1,
      dispatchId: 'EXT-001',
      from: 'WH-101, Pune',
      to: 'Market Hub, Mumbai',
      buyer: 'ABC Trading Co.',
      product: 'Wheat',
      quantity: 50,
      vehicle: 'EXT-TRK-001',
      driver: 'Mahesh Singh',
      status: 'Delivered',
      dispatchedDate: '2024-01-25',
      deliveredDate: '2024-01-26',
      eChallan: 'ECH-2024-001',
      invoice: 'INV-2024-001'
    },
    {
      id: 2,
      dispatchId: 'EXT-002',
      from: 'WH-105, Mumbai',
      to: 'Export Terminal, Mumbai Port',
      buyer: 'Global Exports Ltd.',
      product: 'Rice',
      quantity: 100,
      vehicle: 'EXT-TRK-002',
      driver: 'Ravi Sharma',
      status: 'In Transit',
      dispatchedDate: '2024-01-27',
      estimatedDelivery: '2024-01-28',
      eChallan: 'ECH-2024-002'
    }
  ])

  if (isInternal) {
    return <InternalTransfers transfers={internalTransfers} />
  }

  if (isExternal) {
    return <ExternalDispatches dispatches={externalDispatches} />
  }

  const totalInTransit = [...internalTransfers, ...externalDispatches].filter(
    t => t.status === 'In Transit'
  ).length
  const totalDelivered = [...internalTransfers, ...externalDispatches].filter(
    t => t.status === 'Delivered'
  ).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Transport Dashboard</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600">
          <Plus className="w-4 h-4" />
          New Assignment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Transfers</p>
              <p className="text-2xl font-bold text-gray-900">
                {internalTransfers.length + externalDispatches.length}
              </p>
            </div>
            <Truck className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">{totalInTransit}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">{totalDelivered}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Warehouse Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Warehouse Overview</h2>
            <button className="text-primary hover:text-green-600 text-sm font-medium">
              View All Warehouses
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4 text-sm text-gray-600">
            <p>Showing sample of 10 warehouses (Total: {warehouseData.length} warehouses across Maharashtra)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {sampleWarehouses.map((warehouse) => (
              <div key={warehouse.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <Warehouse className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-gray-600">{warehouse.id}</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">{warehouse.name}</h3>
                <p className="text-xs text-gray-600 mb-3">{warehouse.location}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">{warehouse.capacity} tonnes</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Occupied:</span>
                    <span className="font-medium">{warehouse.occupied} tonnes</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-medium text-green-600">{warehouse.available} tonnes</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-primary h-1 rounded-full" 
                      style={{ width: `${warehouse.utilization}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Internal Transfers</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {internalTransfers.slice(0, 3).map((transfer) => (
                <div key={transfer.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{transfer.transferId}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      transfer.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                      transfer.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {transfer.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {transfer.from} → {transfer.to}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Vehicle: {transfer.vehicle} • Driver: {transfer.driver}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">External Dispatches</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {externalDispatches.slice(0, 3).map((dispatch) => (
                <div key={dispatch.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{dispatch.dispatchId}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      dispatch.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                      dispatch.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {dispatch.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {dispatch.from} → {dispatch.to}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Buyer: {dispatch.buyer} • Vehicle: {dispatch.vehicle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const InternalTransfers = ({ transfers }) => {
  const [selectedStatus, setSelectedStatus] = useState('all')

  const filteredTransfers = selectedStatus === 'all' 
    ? transfers 
    : transfers.filter(t => t.status === selectedStatus)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Internal Transfers</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Filter className="w-4 h-4" />
          </button>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Dispatched">Dispatched</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transfer ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{transfer.transferId}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium flex items-center gap-2">
                        <Warehouse className="w-4 h-4 text-primary" />
                        {transfer.from}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Occupied: {transfer.fromOccupied}/{transfer.fromCapacity} tonnes
                      </div>
                      <div className="text-xs text-green-600">
                        Available: {transfer.fromAvailable} tonnes
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium flex items-center gap-2">
                        <Warehouse className="w-4 h-4 text-blue-600" />
                        {transfer.to}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Occupied: {transfer.toOccupied}/{transfer.toCapacity} tonnes
                      </div>
                      <div className={`text-xs ${
                        transfer.toAvailable >= transfer.quantity ? 'text-green-600' : 'text-red-600'
                      }`}>
                        Available: {transfer.toAvailable} tonnes
                        {transfer.toAvailable < transfer.quantity && ' ⚠️ Insufficient space'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{transfer.product}</div>
                    <div className="text-xs text-gray-600">{transfer.quantity} tonnes</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(transfer.fromOccupied / transfer.fromCapacity) * 100}%` }}
                          ></div>
                        </div>
                        <span>{(transfer.fromOccupied / transfer.fromCapacity * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(transfer.toOccupied / transfer.toCapacity) * 100}%` }}
                          ></div>
                        </div>
                        <span>{(transfer.toOccupied / transfer.toCapacity * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{transfer.vehicle}</div>
                    <div className="text-xs text-gray-600">{transfer.driver}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      transfer.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                      transfer.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      transfer.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {transfer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-primary hover:text-green-600 text-sm">Track</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const ExternalDispatches = ({ dispatches }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">External Dispatches</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dispatch ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dispatches.map((dispatch) => (
                <tr key={dispatch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{dispatch.dispatchId}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <div>
                        <div className="font-medium">{dispatch.from}</div>
                        <div className="text-xs text-gray-500">→ {dispatch.to}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{dispatch.buyer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {dispatch.product} ({dispatch.quantity} tonnes)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{dispatch.vehicle}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      dispatch.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                      dispatch.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {dispatch.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs">
                      {dispatch.eChallan && (
                        <span className="text-blue-600">{dispatch.eChallan}</span>
                      )}
                      {dispatch.invoice && (
                        <span className="text-green-600">{dispatch.invoice}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="text-primary hover:text-green-600 text-sm">View</button>
                      <button className="text-blue-600 hover:text-blue-700 text-sm">Download</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TransportDashboard

