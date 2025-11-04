import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'
import { 
  Package, 
  Warehouse,
  Users,
  TrendingUp,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Thermometer,
  Droplet,
  Truck,
  MapPin,
  Calendar,
  FileText,
  AlertCircle,
  Save,
  X,
  IndianRupee
} from 'lucide-react'

const WarehouseDashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { inventory: inventoryData, storageRequests, transferRequests, dispatchRequests, approveStorageRequest } = useData()
  const isStorageRequests = location.pathname.includes('storage-requests')
  const isInventory = location.pathname.includes('inventory')
  const isIntake = location.pathname.includes('intake')
  const isTransfers = location.pathname.includes('transfers')

  // Filter inventory for this warehouse (WH-101)
  const inventory = inventoryData.filter(item => item.warehouse === 'WH-101')
  
  // Filter pending storage requests for this warehouse
  const pendingStorageRequests = storageRequests.filter(req => 
    req.warehouse === 'WH-101' && req.status === 'Pending Approval'
  )
  
  // Filter incoming transfers
  const incoming = transferRequests.filter(t => 
    t.toWarehouse === 'WH-101' && (t.status === 'In Transit' || t.status === 'Approved')
  )
  
  // Filter outgoing transfers
  const outgoing = transferRequests.filter(t => 
    t.fromWarehouse === 'WH-101'
  )

  const totalOccupied = inventory.reduce((sum, item) => sum + item.quantity, 0)
  
  const warehouseStats = {
    totalCapacity: 1000,
    occupied: totalOccupied,
    available: 1000 - totalOccupied,
    activeFarmers: [...new Set(inventory.map(i => i.farmerId))].length,
    activeProducts: [...new Set(inventory.map(i => i.product))].length,
    pendingRequests: pendingStorageRequests.length,
    inTransit: incoming.length
  }

  // Group products by type with total quantities
  const productSummary = inventory.reduce((acc, item) => {
    if (!acc[item.product]) {
      acc[item.product] = {
        product: item.product,
        totalQuantity: 0,
        items: [],
        sections: []
      }
    }
    acc[item.product].totalQuantity += item.quantity
    acc[item.product].items.push(item)
    acc[item.product].sections.push(item.location)
    return acc
  }, {})

  const pendingTransfers = transferRequests.filter(t => 
    t.fromWarehouse === 'WH-101' && t.status === 'Pending Approval'
  )

  const utilizationPercent = (warehouseStats.occupied / warehouseStats.totalCapacity) * 100

  if (isStorageRequests) {
    return <StorageRequestsView 
      pendingStorageRequests={pendingStorageRequests}
      approveStorageRequest={approveStorageRequest}
    />
  }

  if (isInventory) {
    return <InventoryView inventory={inventory} />
  }

  if (isIntake) {
    return <IntakeManagement />
  }

  if (isTransfers) {
    return <TransfersManagement pendingTransfers={pendingTransfers} incomingTransfers={incoming} outgoingTransfers={outgoing} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Warehouse Dashboard</h1>
          <p className="text-gray-600 mt-1">WH-101, Pune</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600">
          <Plus className="w-4 h-4" />
          New Intake
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Capacity Utilization</p>
              <p className="text-2xl font-bold text-gray-900">{utilizationPercent.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {warehouseStats.occupied} / {warehouseStats.totalCapacity} tonnes
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${utilizationPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Farmers</p>
              <p className="text-2xl font-bold text-gray-900">{warehouseStats.activeFarmers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{warehouseStats.pendingRequests}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">{warehouseStats.inTransit}</p>
            </div>
            <Package className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* IoT Sensor Data (for cold storage) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Temperature</p>
              <p className="text-2xl font-bold text-gray-900">4°C</p>
              <p className="text-xs text-green-600 mt-1">Optimal</p>
            </div>
            <Thermometer className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="text-2xl font-bold text-gray-900">65%</p>
              <p className="text-xs text-green-600 mt-1">Optimal</p>
            </div>
            <Droplet className="w-8 h-8 text-cyan-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">{warehouseStats.activeProducts}</p>
            </div>
            <Package className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Product Summary by Quantity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Products Stored in WH-101, Pune</h2>
          <p className="text-sm text-gray-600 mt-1">Total quantity of each product type stored in this warehouse</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Object.values(productSummary).map((product, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-5 h-5 text-primary" />
                  <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium">
                    {product.items.length} {product.items.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-1">{product.product}</h3>
                <p className="text-2xl font-bold text-gray-900">{product.totalQuantity} tonnes</p>
                <p className="text-xs text-gray-600 mt-2">
                  Sections: {product.sections.join(', ')}
                </p>
              </div>
            ))}
          </div>
          
          {/* Detailed Breakdown */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Detailed Product Breakdown</h3>
            <div className="space-y-4">
              {Object.values(productSummary).map((product, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg">{product.product}</h4>
                    <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-bold">
                      Total: {product.totalQuantity} tonnes
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-sm">{item.farmer}</p>
                          <p className="text-xs text-gray-600">{item.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{item.quantity} {item.unit}</p>
                          <p className="text-xs text-gray-500">Grade {item.quality}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transport Integration - Incoming Transfers */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Incoming Transfers
              </h2>
              <p className="text-sm text-gray-600 mt-1">Transfers coming to WH-101, Pune</p>
            </div>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {incoming.length} Active
            </span>
          </div>
        </div>
        <div className="p-6">
          {incoming.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No incoming transfers
            </div>
          ) : (
            <div className="space-y-4">
              {incoming.map((transfer) => (
                <div key={transfer.id} className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">{transfer.transferId}</div>
                        <div className="text-sm text-gray-600">
                          {transfer.from} → <span className="font-medium text-primary">{transfer.to}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transfer.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                      transfer.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {transfer.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-600">Product</p>
                      <p className="font-semibold">{transfer.product}</p>
                      <p className="text-xs text-gray-500">{transfer.quantity} tonnes</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Vehicle</p>
                      <p className="font-semibold">{transfer.vehicle}</p>
                      <p className="text-xs text-gray-500">Driver: {transfer.driver}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Est. Arrival</p>
                      <p className="font-semibold">{transfer.estimatedArrival}</p>
                      <p className="text-xs text-gray-500">{transfer.currentLocation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Action</p>
                      <button className="px-3 py-1 bg-primary text-white rounded text-xs hover:bg-green-600">
                        Track Shipment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transport Integration - Outgoing Transfers */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-600" />
            Outgoing Transfers
          </h2>
          <p className="text-sm text-gray-600 mt-1">Transfers going out from WH-101, Pune</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {pendingTransfers.filter(t => t.from.includes('WH-101')).map((transfer) => (
              <div key={transfer.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold">{transfer.transferId || `Transfer #${transfer.id}`}</div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-primary">{transfer.from}</span> → {transfer.to}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    transfer.status === 'Pending Approval' ? 'bg-orange-100 text-orange-800' :
                    transfer.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {transfer.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-600">Product & Quantity</p>
                    <p className="font-semibold">{transfer.product}</p>
                    <p className="text-xs text-gray-500">{transfer.quantity} tonnes</p>
                  </div>
                  {transfer.vehicle && (
                    <div>
                      <p className="text-xs text-gray-600">Vehicle</p>
                      <p className="font-semibold">{transfer.vehicle}</p>
                      <p className="text-xs text-gray-500">Driver: {transfer.driver}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-600">Date</p>
                    <p className="font-semibold">{transfer.requestDate}</p>
                    {transfer.estimatedArrival && (
                      <p className="text-xs text-gray-500">Est. Arrival: {transfer.estimatedArrival}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Storage Requests */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Pending Storage Requests</h2>
              <p className="text-sm text-gray-600 mt-1">Approve or reject farmer storage requests</p>
            </div>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
              {pendingStorageRequests.length} Pending
            </span>
          </div>
        </div>
        <div className="p-6">
          {pendingStorageRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No pending requests</p>
              <p className="text-sm mt-1">All storage requests have been processed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingStorageRequests.map((request) => (
                <PendingRequestCard 
                  key={request.id} 
                  request={request}
                  approveStorageRequest={approveStorageRequest}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {inventory.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{item.product}</div>
                  <div className="text-sm text-gray-600">
                    {item.farmer} • {item.quantity} {item.unit}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  item.status === 'Stored' ? 'bg-green-100 text-green-800' :
                  item.status === 'Pending QC' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const StorageRequestsView = ({ pendingStorageRequests, approveStorageRequest }) => {
  const { storageRequests } = useData()
  
  // Get all storage requests for this warehouse (including approved/rejected)
  const allStorageRequests = storageRequests.filter(req => req.warehouse === 'WH-101')
  const approvedRequests = allStorageRequests.filter(req => req.status === 'Approved')
  const rejectedRequests = allStorageRequests.filter(req => req.status === 'Rejected')
  
  const [filterStatus, setFilterStatus] = useState('all') // all, pending, approved, rejected
  
  const filteredRequests = allStorageRequests.filter(req => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'pending') return req.status === 'Pending Approval'
    if (filterStatus === 'approved') return req.status === 'Approved'
    if (filterStatus === 'rejected') return req.status === 'Rejected'
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Storage Requests</h1>
          <p className="text-gray-600 mt-1">Manage and approve farmer storage requests</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{allStorageRequests.length}</p>
            </div>
            <FileText className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-orange-600">{pendingStorageRequests.length}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{approvedRequests.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{rejectedRequests.length}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {filterStatus === 'all' ? 'All Storage Requests' :
               filterStatus === 'pending' ? 'Pending Approval Requests' :
               filterStatus === 'approved' ? 'Approved Requests' :
               'Rejected Requests'}
            </h2>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {filteredRequests.length} {filteredRequests.length === 1 ? 'Request' : 'Requests'}
            </span>
          </div>
        </div>
        <div className="p-6">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No {filterStatus === 'all' ? '' : filterStatus} requests found</p>
              <p className="text-sm mt-1">
                {filterStatus === 'pending' 
                  ? 'All storage requests have been processed'
                  : 'No storage requests match this filter'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <PendingRequestCard 
                  key={request.id} 
                  request={request}
                  approveStorageRequest={approveStorageRequest}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PendingRequestCard = ({ request, approveStorageRequest }) => {
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleApprove = async (e) => {
    e.preventDefault()
    
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      setError('Please enter a valid payment amount')
      return
    }

    setIsSubmitting(true)
    setError('')

    // Approve with payment amount
    approveStorageRequest(request.id, parseFloat(paymentAmount))
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowApproveModal(false)
      setPaymentAmount('')
      setNotes('')
    }, 1000)
  }

  const handleReject = () => {
    if (window.confirm(`Are you sure you want to reject this storage request from ${request.farmerName}?`)) {
      // Update request status to rejected
      approveStorageRequest(request.id, null)
    }
  }

  return (
    <>
      <div className="border rounded-lg p-6 hover:shadow-md transition">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{request.farmerName}</h3>
                <p className="text-sm text-gray-600">Farmer ID: {request.farmerId}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-600">Product</p>
                <p className="font-semibold">{request.product}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Quantity</p>
                <p className="font-semibold">{request.quantity} {request.unit}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Storage Type</p>
                <p className="font-semibold capitalize">{request.storageType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Quality Grade</p>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  Grade {request.quality}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Expected: {request.expectedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>Requested: {request.requestDate}</span>
              </div>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            request.status === 'Approved' ? 'bg-green-100 text-green-800' :
            request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
            'bg-orange-100 text-orange-800'
          }`}>
            {request.status}
          </span>
        </div>

        {/* Show payment amount if approved */}
        {request.status === 'Approved' && request.paymentAmount && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Payment Amount</p>
                <p className="text-xl font-bold text-green-600">₹{request.paymentAmount.toLocaleString()}</p>
                {request.approvedDate && (
                  <p className="text-xs text-gray-500 mt-1">Approved on: {request.approvedDate}</p>
                )}
              </div>
              <IndianRupee className="w-8 h-8 text-green-600" />
            </div>
          </div>
        )}

        {/* Show rejection info if rejected */}
        {request.status === 'Rejected' && request.approvedDate && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">Request Rejected</p>
                <p className="text-xs text-red-600 mt-1">Rejected on: {request.approvedDate}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons only for pending requests */}
        {request.status === 'Pending Approval' && (
          <div className="flex items-center gap-3 pt-4 border-t">
            <button
              onClick={() => setShowApproveModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition"
            >
              <CheckCircle className="w-4 h-4" />
              Approve & Set Payment
            </button>
            <button
              onClick={handleReject}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Approve Storage Request</h3>
                <button
                  onClick={() => {
                    setShowApproveModal(false)
                    setPaymentAmount('')
                    setNotes('')
                    setError('')
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleApprove} className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Farmer</p>
                    <p className="font-semibold">{request.farmerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Product</p>
                    <p className="font-semibold">{request.product}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Quantity</p>
                    <p className="font-semibold">{request.quantity} {request.unit}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Storage Type</p>
                    <p className="font-semibold capitalize">{request.storageType}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={paymentAmount}
                    onChange={(e) => {
                      setPaymentAmount(e.target.value)
                      setError('')
                    }}
                    className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      error ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter amount farmer needs to pay"
                    required
                  />
                </div>
                {error && (
                  <p className="text-xs text-red-600 mt-1">{error}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  This amount will be charged to the farmer for storage services
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Add any additional notes or terms..."
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowApproveModal(false)
                    setPaymentAmount('')
                    setNotes('')
                    setError('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Approve Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

const InventoryView = ({ inventory }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Current Inventory</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Export
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600">
                Print
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quality</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stored Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{item.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.farmer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.quantity} {item.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Grade {item.quality}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{item.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.storedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'Stored' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-primary hover:text-green-600 text-sm">View Details</button>
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

const IntakeManagement = () => {
  const { addInventory, storageRequests, approveStorageRequest } = useData()
  
  const [formData, setFormData] = useState({
    // Farmer Information
    farmerId: '',
    farmerName: '',
    farmerMobile: '',
    farmerEmail: '',
    
    // Product Information
    product: '',
    quantity: '',
    unit: 'tonnes',
    batchNumber: '',
    productionDate: '',
    expiryDate: '',
    
    // Quality & Storage
    quality: 'A',
    moistureContent: '',
    storageType: 'normal',
    section: '',
    rackNumber: '',
    
    // Intake Details
    intakeDate: new Date().toISOString().split('T')[0],
    vehicleNumber: '',
    driverName: '',
    invoiceNumber: '',
    challanNumber: '',
    
    // Documents
    invoiceDocument: null,
    qualityCertificate: null,
    
    // Additional Information
    notes: '',
    temperature: '',
    humidity: ''
  })

  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableSections = ['A-01', 'A-02', 'A-12', 'B-05', 'B-10', 'C-08', 'D-05', 'E-03']
  const productTypes = ['Wheat', 'Rice', 'Soybeans', 'Corn', 'Pulses', 'Other']

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.farmerId && !formData.farmerName) {
      newErrors.farmerId = 'Farmer ID or Name is required'
    }
    if (!formData.product) {
      newErrors.product = 'Product is required'
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required'
    }
    if (!formData.section) {
      newErrors.section = 'Storage section is required'
    }
    if (!formData.intakeDate) {
      newErrors.intakeDate = 'Intake date is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    // Check if this is from a storage request
    const relatedRequest = storageRequests.find(req => 
      req.farmerId === formData.farmerId &&
      req.product === formData.product &&
      req.warehouse === 'WH-101'
    )
    
    // Add to inventory through DataContext
    addInventory({
      farmerId: formData.farmerId || relatedRequest?.farmerId || 'FARM-001',
      farmer: formData.farmerName || relatedRequest?.farmerName || 'Unknown Farmer',
      product: formData.product,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      quality: formData.quality,
      location: formData.section,
      warehouse: 'WH-101',
      batchNumber: formData.batchNumber,
      storageType: formData.storageType
    })
    
    // Note: Storage requests should be approved separately using the approval flow
    // Only create inventory entry here, approval should be done through the approval interface
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          farmerId: '',
          farmerName: '',
          farmerMobile: '',
          farmerEmail: '',
          product: '',
          quantity: '',
          unit: 'tonnes',
          batchNumber: '',
          productionDate: '',
          expiryDate: '',
          quality: 'A',
          moistureContent: '',
          storageType: 'normal',
          section: '',
          rackNumber: '',
          intakeDate: new Date().toISOString().split('T')[0],
          vehicleNumber: '',
          driverName: '',
          invoiceNumber: '',
          challanNumber: '',
          invoiceDocument: null,
          qualityCertificate: null,
          notes: '',
          temperature: '',
          humidity: ''
        })
        setShowSuccess(false)
      }, 3000)
    }, 1500)
  }

  const handleFileChange = (field, file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, [field]: 'File size must be less than 5MB' })
      return
    }
    setFormData({ ...formData, [field]: file })
    setErrors({ ...errors, [field]: null })
  }

  const calculateAvailableSpace = () => {
    // This would be calculated from warehouse capacity
    return 350 // Mock available space in tonnes
  }

  const availableSpace = calculateAvailableSpace()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Intake Entry</h1>
          <p className="text-gray-600 mt-1">Record new product intake to warehouse WH-101, Pune</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Warehouse className="w-4 h-4" />
          <span>Available Space: <strong className="text-primary">{availableSpace} tonnes</strong></span>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-semibold text-green-800">Intake Entry Created Successfully!</p>
            <p className="text-sm text-green-700">The product has been recorded in the inventory.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Farmer Information Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Farmer Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farmer ID / Aadhaar Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.farmerId}
                onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.farmerId ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter Farmer ID or Aadhaar"
              />
              {errors.farmerId && (
                <p className="text-xs text-red-600 mt-1">{errors.farmerId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farmer Name
              </label>
              <input
                type="text"
                value={formData.farmerName}
                onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter farmer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                value={formData.farmerMobile}
                onChange={(e) => setFormData({ ...formData, farmerMobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="10-digit mobile"
                maxLength="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.farmerEmail}
                onChange={(e) => setFormData({ ...formData, farmerEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="farmer@example.com"
              />
            </div>
          </div>
        </div>

        {/* Product Information Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Product Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.product ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select Product</option>
                {productTypes.map((product) => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
              {errors.product && (
                <p className="text-xs text-red-600 mt-1">{errors.product}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.quantity ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter quantity"
                  required
                />
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="tonnes">Tonnes</option>
                  <option value="quintals">Quintals</option>
                  <option value="kg">Kg</option>
                </select>
              </div>
              {errors.quantity && (
                <p className="text-xs text-red-600 mt-1">{errors.quantity}</p>
              )}
              {formData.quantity && parseFloat(formData.quantity) > availableSpace && (
                <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Exceeds available space. Available: {availableSpace} tonnes
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Number
              </label>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter batch number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality Grade <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.quality}
                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="A">Grade A (Premium)</option>
                <option value="B">Grade B (Good)</option>
                <option value="C">Grade C (Standard)</option>
                <option value="D">Grade D (Below Standard)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Production Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={formData.productionDate}
                  onChange={(e) => setFormData({ ...formData, productionDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moisture Content (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.moistureContent}
                onChange={(e) => setFormData({ ...formData, moistureContent: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., 12.5"
              />
            </div>
          </div>
        </div>

        {/* Storage Information Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <Warehouse className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Storage Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage Section <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.section ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select Section</option>
                {availableSections.map((section) => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
              {errors.section && (
                <p className="text-xs text-red-600 mt-1">{errors.section}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rack Number
              </label>
              <input
                type="text"
                value={formData.rackNumber}
                onChange={(e) => setFormData({ ...formData, rackNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., R-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.storageType}
                onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="normal">Normal Storage</option>
                <option value="cold">Cold Storage (Premium)</option>
              </select>
              {formData.storageType === 'cold' && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Temperature (°C)</label>
                    <input
                      type="number"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="e.g., 4"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Humidity (%)</label>
                    <input
                      type="number"
                      value={formData.humidity}
                      onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="e.g., 65"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intake Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={formData.intakeDate}
                  onChange={(e) => setFormData({ ...formData, intakeDate: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.intakeDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
              </div>
              {errors.intakeDate && (
                <p className="text-xs text-red-600 mt-1">{errors.intakeDate}</p>
              )}
            </div>
          </div>
        </div>

        {/* Transport Information Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <Truck className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Transport Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Number
              </label>
              <input
                type="text"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., MH-12-AB-1234"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Driver Name
              </label>
              <input
                type="text"
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter driver name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter invoice number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Challan Number
              </label>
              <input
                type="text"
                value={formData.challanNumber}
                onChange={(e) => setFormData({ ...formData, challanNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter challan number"
              />
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Documents</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Document
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('invoiceDocument', e.target.files[0])}
                  className="hidden"
                  id="invoiceDocument"
                />
                <label htmlFor="invoiceDocument" className="cursor-pointer">
                  {formData.invoiceDocument ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                      <FileText className="w-4 h-4" />
                      <span>{formData.invoiceDocument.name}</span>
                    </div>
                  ) : (
                    <div>
                      <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload invoice</p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality Certificate
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('qualityCertificate', e.target.files[0])}
                  className="hidden"
                  id="qualityCertificate"
                />
                <label htmlFor="qualityCertificate" className="cursor-pointer">
                  {formData.qualityCertificate ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                      <FileText className="w-4 h-4" />
                      <span>{formData.qualityCertificate.name}</span>
                    </div>
                  ) : (
                    <div>
                      <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload certificate</p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Additional Notes</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes / Remarks
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter any additional notes or remarks..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow p-6">
          <button
            type="button"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
            onClick={() => window.location.reload()}
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              className="px-6 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2"
              onClick={() => {
                // Save as draft functionality
                alert('Draft saved successfully!')
              }}
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Create Intake Entry
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

const TransfersManagement = ({ pendingTransfers, incomingTransfers, outgoingTransfers }) => {
  const { createTransferRequest, warehouses } = useData()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    toWarehouse: '',
    product: '',
    quantity: '',
    unit: 'tonnes',
    reason: '',
    priority: 'normal',
    expectedDate: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  const handleCreateTransfer = async (e) => {
    e.preventDefault()
    
    // Validation
    const newErrors = {}
    if (!formData.toWarehouse) newErrors.toWarehouse = 'Destination warehouse is required'
    if (!formData.product) newErrors.product = 'Product is required'
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) newErrors.quantity = 'Valid quantity is required'
    if (!formData.expectedDate) newErrors.expectedDate = 'Expected date is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    // Get destination warehouse details
    const destWarehouse = warehouses.find(w => w.id === formData.toWarehouse)
    
    const newTransfer = createTransferRequest({
      from: 'WH-101, Pune',
      fromWarehouse: 'WH-101',
      to: destWarehouse ? `${destWarehouse.id}, ${destWarehouse.location}` : formData.toWarehouse,
      toWarehouse: formData.toWarehouse,
      product: formData.product,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      reason: formData.reason,
      priority: formData.priority,
      expectedDate: formData.expectedDate,
      requestedBy: 'Warehouse Manager (WH-101)',
      status: 'Pending Approval' // This will go to admin for approval
    })

    // Reset form and show success message
    setTimeout(() => {
      setIsSubmitting(false)
      setShowCreateModal(false)
      setShowSuccess(true)
      setFormData({
        toWarehouse: '',
        product: '',
        quantity: '',
        unit: 'tonnes',
        reason: '',
        priority: 'normal',
        expectedDate: ''
      })
      setErrors({})
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <p className="font-semibold text-green-800">Transport Request Submitted Successfully!</p>
            <p className="text-sm text-green-700">Your request has been sent to admin for approval. You will be notified once it's reviewed.</p>
          </div>
          <button
            onClick={() => setShowSuccess(false)}
            className="text-green-600 hover:text-green-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Internal Transport Requests</h1>
          <p className="text-gray-600 mt-1">Create transport requests that will be sent to admin for approval</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition"
        >
          <Plus className="w-4 h-4" />
          Create Transport Request
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intake Box - Incoming Transfers */}
        <div className="bg-white rounded-lg shadow border-2 border-blue-200">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Intake</h2>
                  <p className="text-sm text-gray-600">Incoming Transfers</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-bold">
                {incomingTransfers.length}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            {incomingTransfers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No incoming transfers</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {incomingTransfers.map((transfer) => (
                  <div key={transfer.id} className="border rounded-lg p-4 bg-blue-50 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="font-semibold text-sm">{transfer.transferId}</div>
                          <div className="text-xs text-gray-600">
                            {transfer.from} → <span className="font-medium text-blue-600">{transfer.to}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transfer.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                        transfer.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {transfer.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-600">Product</p>
                        <p className="font-semibold">{transfer.product}</p>
                        <p className="text-gray-500">{transfer.quantity} tonnes</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Vehicle</p>
                        <p className="font-semibold">{transfer.vehicle}</p>
                        <p className="text-gray-500">{transfer.driver}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Est. Arrival</p>
                        <p className="font-semibold">{transfer.estimatedArrival}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Location</p>
                        <p className="text-gray-500 text-xs">{transfer.currentLocation}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                        Track Shipment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Outwards Box - Outgoing Transfers */}
        <div className="bg-white rounded-lg shadow border-2 border-orange-200">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Outwards</h2>
                  <p className="text-sm text-gray-600">Outgoing Transfers</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm font-bold">
                {outgoingTransfers.length}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            {outgoingTransfers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No outgoing transfers</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {outgoingTransfers.map((transfer) => (
                  <div key={transfer.id} className="border rounded-lg p-4 bg-orange-50 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        <div>
                          <div className="font-semibold text-sm">{transfer.transferId || `Transfer #${transfer.id}`}</div>
                          <div className="text-xs text-gray-600">
                            <span className="font-medium text-orange-600">{transfer.from}</span> → {transfer.to}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transfer.status === 'Pending Approval' ? 'bg-orange-100 text-orange-800' :
                        transfer.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {transfer.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <p className="text-gray-600">Product</p>
                        <p className="font-semibold">{transfer.product}</p>
                        <p className="text-gray-500">{transfer.quantity} tonnes</p>
                      </div>
                      {transfer.vehicle && (
                        <div>
                          <p className="text-gray-600">Vehicle</p>
                          <p className="font-semibold">{transfer.vehicle}</p>
                          <p className="text-gray-500">{transfer.driver}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-600">Request Date</p>
                        <p className="font-semibold">{transfer.requestDate}</p>
                      </div>
                      {transfer.estimatedArrival && (
                        <div>
                          <p className="text-gray-600">Est. Arrival</p>
                          <p className="font-semibold">{transfer.estimatedArrival}</p>
                        </div>
                      )}
                    </div>
                    {transfer.status === 'Pending Approval' && (
                      <div className="mt-3 pt-3 border-t border-orange-200">
                        <div className="flex items-center gap-2 text-sm text-orange-700 bg-orange-50 p-2 rounded">
                          <Clock className="w-4 h-4" />
                          <span>Awaiting admin approval</span>
                        </div>
                      </div>
                    )}
                    {transfer.status !== 'Pending Approval' && (
                      <div className="mt-3 pt-3 border-t border-orange-200">
                        <button className="w-full px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Transport Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Create Internal Transport Request</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setFormData({
                      toWarehouse: '',
                      product: '',
                      quantity: '',
                      unit: 'tonnes',
                      reason: '',
                      priority: 'normal',
                      expectedDate: ''
                    })
                    setErrors({})
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">Request will be sent to admin for approval</p>
            </div>

            <form onSubmit={handleCreateTransfer} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Warehouse
                  </label>
                  <input
                    type="text"
                    value="WH-101, Pune"
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Warehouse <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.toWarehouse}
                    onChange={(e) => {
                      setFormData({ ...formData, toWarehouse: e.target.value })
                      setErrors({ ...errors, toWarehouse: '' })
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.toWarehouse ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Destination Warehouse</option>
                    {warehouses.filter(w => w.id !== 'WH-101').map(wh => (
                      <option key={wh.id} value={wh.id}>
                        {wh.id} - {wh.name}, {wh.location}
                      </option>
                    ))}
                  </select>
                  {errors.toWarehouse && (
                    <p className="text-xs text-red-600 mt-1">{errors.toWarehouse}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.product}
                    onChange={(e) => {
                      setFormData({ ...formData, product: e.target.value })
                      setErrors({ ...errors, product: '' })
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.product ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Wheat, Rice"
                    required
                  />
                  {errors.product && (
                    <p className="text-xs text-red-600 mt-1">{errors.product}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => {
                        setFormData({ ...formData, quantity: e.target.value })
                        setErrors({ ...errors, quantity: '' })
                      }}
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.quantity ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter quantity"
                      required
                    />
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="tonnes">Tonnes</option>
                      <option value="quintals">Quintals</option>
                      <option value="kg">Kg</option>
                    </select>
                  </div>
                  {errors.quantity && (
                    <p className="text-xs text-red-600 mt-1">{errors.quantity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Delivery Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.expectedDate}
                    onChange={(e) => {
                      setFormData({ ...formData, expectedDate: e.target.value })
                      setErrors({ ...errors, expectedDate: '' })
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.expectedDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.expectedDate && (
                    <p className="text-xs text-red-600 mt-1">{errors.expectedDate}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason / Notes
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Reason for transfer or additional notes..."
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setFormData({
                      toWarehouse: '',
                      product: '',
                      quantity: '',
                      unit: 'tonnes',
                      reason: '',
                      priority: 'normal',
                      expectedDate: ''
                    })
                    setErrors({})
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Submit Request to Admin
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default WarehouseDashboard

