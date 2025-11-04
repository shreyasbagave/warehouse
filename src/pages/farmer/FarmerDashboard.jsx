import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { 
  Package, 
  Truck, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Plus,
  Search,
  Filter,
  Eye,
  FileText
} from 'lucide-react'
import Modal from '../../components/common/Modal'
import warehouseData from '../../data/warehouses'

const FarmerDashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { inventory, storageRequests, dispatchRequests } = useData()
  const isStorageRequest = location.pathname.includes('storage-request')
  const isDispatch = location.pathname.includes('dispatch')
  const isTracking = location.pathname.includes('tracking')

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [toast, setToast] = useState(null)

  // Get stored produce for this farmer from inventory
  const storedProduce = inventory.filter(item => 
    item.farmerId === user?.id?.toString() || 
    item.farmerId === 'FARM-001' // Mock farmer ID
  ).map(item => ({
    id: item.id,
    product: item.product,
    quantity: item.quantity,
    unit: item.unit,
    storedDate: item.storedDate,
    location: `Warehouse ${item.warehouse}, ${item.location}`,
    status: item.status,
    storageFee: item.quantity * 50, // Mock calculation
    daysInStorage: Math.floor((new Date() - new Date(item.storedDate)) / (1000 * 60 * 60 * 24))
  }))

  // Get transfer requests for this farmer from DataContext
  const transferRequests = [] // Will be populated from DataContext trips/transfers

  // Get storage requests for this farmer
  const farmerStorageRequests = storageRequests.filter(req => 
    req.farmerId === user?.id?.toString() || req.farmerId === 'FARM-001'
  )

  const totalStored = storedProduce.reduce((sum, item) => sum + item.quantity, 0)
  const totalFees = storedProduce.reduce((sum, item) => sum + item.storageFee, 0)
  
  // Calculate total pending payment from approved requests
  const totalPendingPayment = farmerStorageRequests
    .filter(req => req.status === 'Approved' && req.paymentAmount)
    .reduce((sum, req) => sum + (req.paymentAmount || 0), 0)

  // Group products by warehouse
  const warehouseWiseProducts = storedProduce.reduce((acc, item) => {
    const warehouse = item.location.split(',')[0] // Extract warehouse ID
    if (!acc[warehouse]) {
      acc[warehouse] = {
        warehouseId: warehouse,
        location: item.location,
        products: [],
        totalQuantity: 0
      }
    }
    acc[warehouse].products.push({
      product: item.product,
      quantity: item.quantity,
      unit: item.unit
    })
    acc[warehouse].totalQuantity += item.quantity
    return acc
  }, {})

  if (isStorageRequest) {
    return <StorageRequestForm />
  }

  if (isDispatch) {
    return <DispatchRequest storedProduce={storedProduce} />
  }

  if (isTracking) {
    return <TrackingView transferRequests={transferRequests} />
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
        <button 
          onClick={() => navigate('/farmer/storage-request')}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Storage Request</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Total Stored</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalStored} tonnes</p>
            </div>
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0 ml-2" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Storage Fees</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{totalFees.toLocaleString()}</p>
            </div>
            <IndianRupee className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0 ml-2" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Active Items</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{storedProduce.length}</p>
            </div>
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0 ml-2" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Pending Requests</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {farmerStorageRequests.filter(r => r.status === 'Pending Approval').length}
              </p>
            </div>
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 flex-shrink-0 ml-2" />
          </div>
        </div>
      </div>

      {/* Storage Requests Status */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">Storage Requests</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Track your storage request status and payments</p>
            </div>
            {totalPendingPayment > 0 && (
              <span className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                ₹{totalPendingPayment.toLocaleString()} Pending Payment
              </span>
            )}
          </div>
        </div>
        <div className="p-4 sm:p-6">
          {farmerStorageRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No storage requests</p>
              <p className="text-sm mt-1">Create a new storage request to get started</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {farmerStorageRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 sm:p-6 hover:shadow-md transition">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          request.status === 'Approved' ? 'bg-green-100' :
                          request.status === 'Rejected' ? 'bg-red-100' :
                          'bg-orange-100'
                        }`}>
                          <Package className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            request.status === 'Approved' ? 'text-green-600' :
                            request.status === 'Rejected' ? 'text-red-600' :
                            'text-orange-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg truncate">{request.product}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">Warehouse: {request.warehouse}</p>
                        </div>
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap self-start ${
                          request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-600">Quantity</p>
                          <p className="font-semibold">{request.quantity} {request.unit}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Storage Type</p>
                          <p className="font-semibold capitalize">{request.storageType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Request Date</p>
                          <p className="font-semibold">{request.requestDate}</p>
                        </div>
                        {request.approvedDate && (
                          <div>
                            <p className="text-xs text-gray-600">Approved Date</p>
                            <p className="font-semibold">{request.approvedDate}</p>
                          </div>
                        )}
                      </div>

                      {request.status === 'Approved' && request.paymentAmount && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Payment Amount</p>
                              <p className="text-2xl font-bold text-green-600">₹{request.paymentAmount.toLocaleString()}</p>
                              <p className="text-xs text-gray-500 mt-1">Pay this amount to the warehouse</p>
                            </div>
                            <IndianRupee className="w-8 h-8 text-green-600" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Warehouse-wise Product Summary */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold">Products by Warehouse</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">View your stored products organized by warehouse location</p>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(warehouseWiseProducts).map((warehouse, idx) => (
              <div 
                key={idx} 
                onClick={() => {
                  setSelectedItem({ type: 'warehouse', data: warehouse })
                  setShowDetailsModal(true)
                }}
                className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-lg">{warehouse.warehouseId}</h3>
                  </div>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                    {warehouse.totalQuantity} tonnes
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{warehouse.location}</p>
                <div className="space-y-2">
                  {warehouse.products.map((product, pIdx) => (
                    <div key={pIdx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium text-sm">{product.product}</span>
                      <span className="text-sm text-gray-700 font-semibold">
                        {product.quantity} {product.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stored Produce Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-semibold">Stored Produce</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={() => setShowSearchModal(!showSearchModal)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowFilterModal(!showFilterModal)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Filter"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stored Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {storedProduce.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item.product}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.storedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.daysInStorage} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ₹{item.storageFee.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'Stored' ? 'bg-green-100 text-green-800' :
                      item.status === 'Pending Dispatch' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => {
                        setSelectedItem({ type: 'product', data: item })
                        setShowDetailsModal(true)
                      }}
                      className="text-primary hover:text-green-600 transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Search Modal */}
      <Modal 
        isOpen={showSearchModal} 
        onClose={() => setShowSearchModal(false)}
        title="Search Products"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, warehouse, or location..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                // Filter logic would go here
                setToast({ message: `Searching for: ${searchQuery}`, type: 'info' })
                setShowSearchModal(false)
              }}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
            >
              Search
            </button>
            <button
              onClick={() => {
                setSearchQuery('')
                setShowSearchModal(false)
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Filter Modal */}
      <Modal 
        isOpen={showFilterModal} 
        onClose={() => setShowFilterModal(false)}
        title="Filter Products"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="Stored">Stored</option>
              <option value="Pending Dispatch">Pending Dispatch</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setToast({ message: `Filtered by: ${filterStatus}`, type: 'success' })
                setShowFilterModal(false)
              }}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
            >
              Apply Filter
            </button>
            <button
              onClick={() => {
                setFilterStatus('all')
                setShowFilterModal(false)
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal 
        isOpen={showDetailsModal} 
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedItem(null)
        }}
        title={selectedItem?.type === 'warehouse' ? 'Warehouse Details' : 'Product Details'}
        size="md"
      >
        {selectedItem && (
          <div className="space-y-4">
            {selectedItem.type === 'warehouse' ? (
              <>
                <div>
                  <p className="text-sm text-gray-600">Warehouse ID</p>
                  <p className="font-semibold text-lg">{selectedItem.data.warehouseId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{selectedItem.data.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Quantity</p>
                  <p className="font-semibold text-xl">{selectedItem.data.totalQuantity} tonnes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Products</p>
                  <div className="space-y-2">
                    {selectedItem.data.products.map((product, idx) => (
                      <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{product.product}</span>
                        <span>{product.quantity} {product.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Product</p>
                    <p className="font-semibold text-lg">{selectedItem.data.product}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="font-semibold text-lg">{selectedItem.data.quantity} {selectedItem.data.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{selectedItem.data.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium">{selectedItem.data.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Stored Date</p>
                    <p className="font-medium">{selectedItem.data.storedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Days in Storage</p>
                    <p className="font-medium">{selectedItem.data.daysInStorage} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Storage Fee</p>
                    <p className="font-semibold text-lg">₹{selectedItem.data.storageFee.toLocaleString()}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <button
                    onClick={() => {
                      navigate('/farmer/dispatch')
                      setShowDetailsModal(false)
                    }}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
                  >
                    Request Dispatch
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-slide-in">
          <div className={`flex items-center gap-2 ${
            toast.type === 'success' ? 'text-green-600' :
            toast.type === 'error' ? 'text-red-600' :
            'text-blue-600'
          }`}>
            <p className="font-medium">{toast.message}</p>
            <button 
              onClick={() => setToast(null)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const StorageRequestForm = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addStorageRequest } = useData()
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    unit: 'tonnes',
    warehouse: '',
    storageType: 'normal',
    quality: 'A',
    expectedDate: ''
  })
  const [showToast, setShowToast] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add storage request through DataContext
    addStorageRequest({
      farmerId: user?.id?.toString() || 'FARM-001',
      farmerName: user?.name || 'Demo Farmer',
      product: formData.product,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      warehouse: formData.warehouse,
      storageType: formData.storageType,
      quality: formData.quality,
      expectedDate: formData.expectedDate
    })
    
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      navigate('/farmer/dashboard')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">New Storage Request</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="tonnes">Tonnes</option>
                  <option value="quintals">Quintals</option>
                  <option value="kg">Kg</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse Location</label>
              <select
                value={formData.warehouse}
                onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Warehouse</option>
                {warehouseData.slice(0, 50).map((wh) => (
                  <option key={wh.id} value={wh.id}>
                    {wh.id} - {wh.name}, {wh.district}, {wh.region}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Showing first 50 of {warehouseData.length} warehouses across Maharashtra
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Storage Type</label>
              <select
                value={formData.storageType}
                onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="normal">Normal Storage</option>
                <option value="cold">Cold Storage (Premium)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality Grade</label>
              <select
                value={formData.quality}
                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery Date</label>
              <input
                type="date"
                value={formData.expectedDate}
                onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
            >
              Submit Request
            </button>
            <button
              type="button"
              onClick={() => navigate('/farmer/dashboard')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
          {showToast && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              Storage request submitted successfully! Redirecting...
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

const DispatchRequest = ({ storedProduce }) => {
  const navigate = useNavigate()
  const [selectedItems, setSelectedItems] = useState([])
  const [dispatchType, setDispatchType] = useState('Sale to Market')
  const [preferredDate, setPreferredDate] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleDispatch = () => {
    if (selectedItems.length === 0) {
      alert('Please select items to dispatch')
      return
    }
    if (!preferredDate) {
      alert('Please select preferred date')
      return
    }
    setShowSuccess(true)
    setTimeout(() => {
      navigate('/farmer/dashboard')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dispatch Request</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Select Items for Dispatch</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {storedProduce.map((item) => (
              <label key={item.id} className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems([...selectedItems, item.id])
                    } else {
                      setSelectedItems(selectedItems.filter(id => id !== item.id))
                    }
                  }}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex-1">
                  <div className="font-medium">{item.product}</div>
                  <div className="text-sm text-gray-600">
                    {item.quantity} {item.unit} • {item.location}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Storage Fee: ₹{item.storageFee.toLocaleString()}
                </div>
              </label>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dispatch Type</label>
                <select 
                  value={dispatchType}
                  onChange={(e) => setDispatchType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option>Sale to Market</option>
                  <option>Transfer to Another Warehouse</option>
                  <option>Return to Farm</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <input 
                  type="date" 
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <button
              onClick={handleDispatch}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
            >
              Submit Dispatch Request
            </button>
            {showSuccess && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                Dispatch request submitted successfully! Redirecting...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const TrackingView = ({ transferRequests }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Track Movement</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {transferRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No active transfers
            </div>
          ) : (
            <div className="space-y-6">
              {transferRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{request.product}</h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {request.quantity} tonnes
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      request.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500">From</p>
                        <p className="font-medium">{request.from}</p>
                      </div>
                      <Truck className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">To</p>
                        <p className="font-medium">{request.to}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Request Date</p>
                      <p className="text-sm">{request.requestDate}</p>
                      <p className="text-xs text-gray-500 mt-1">Est. Delivery</p>
                      <p className="text-sm">{request.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FarmerDashboard

