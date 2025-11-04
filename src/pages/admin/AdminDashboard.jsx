import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'
import { 
  Warehouse,
  Users,
  TrendingUp,
  IndianRupee,
  CheckCircle,
  XCircle,
  BarChart3,
  Settings,
  Search,
  Filter,
  Package,
  MapPin,
  Printer,
  Download,
  FileText,
  Clock,
  Calendar,
  Truck
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const AdminDashboard = () => {
  const location = useLocation()
  const { warehouses: warehouseData, storageRequests, transferRequests, dispatchRequests, approveStorageRequest, approveTransfer, rejectTransfer } = useData()
  
  // Debug: log the pathname
  console.log('AdminDashboard pathname:', location.pathname)
  
  // Check for exact match - exclude /add and /edit routes
  const pathname = location.pathname
  const isWarehouses = pathname === '/admin/warehouses' || pathname === 'admin/warehouses'
  const isUsers = pathname === '/admin/users' || pathname === 'admin/users'
  const isApprovals = pathname === '/admin/approvals' || pathname === 'admin/approvals'
  const isInternalTransports = pathname === '/admin/internal-transports' || pathname === 'admin/internal-transports'
  
  console.log('isWarehouses:', isWarehouses, 'isUsers:', isUsers, 'isApprovals:', isApprovals, 'isInternalTransports:', isInternalTransports, 'pathname:', pathname)
  
  // Get all pending approvals (excluding storage requests - those only go to warehouse)
  const pendingApprovalsList = [
    ...transferRequests.filter(t => t.status === 'Pending Approval'),
    ...dispatchRequests.filter(d => d.status === 'Pending Approval')
  ]

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const stats = useMemo(() => {
    const totalCapacity = warehouseData.reduce((sum, w) => sum + w.capacity, 0)
    const totalOccupied = warehouseData.reduce((sum, w) => sum + w.occupied, 0)
    const avgUtilization = warehouseData.reduce((sum, w) => sum + w.utilization, 0) / (warehouseData.length || 1)
    return {
      totalWarehouses: warehouseData.length,
      totalCapacity,
      totalOccupied,
      avgUtilization: Math.round(avgUtilization),
      regions: [...new Set(warehouseData.map(w => w.region))].length,
      districts: [...new Set(warehouseData.map(w => w.district))].length
    }
  }, [warehouseData])

  const [overviewStats] = useState({
    totalWarehouses: stats.totalWarehouses,
    totalFarmers: 10000,
    totalCapacity: stats.totalCapacity,
    occupiedCapacity: stats.totalOccupied,
    totalRevenue: 12500000,
    pendingApprovals: pendingApprovalsList.length
  })

  // Get unique regions
  const regions = useMemo(() => {
    return [...new Set(warehouseData.map(w => w.region))].sort()
  }, [])

  // Filter and paginate warehouses
  const filteredWarehouses = useMemo(() => {
    let filtered = warehouseData

    if (searchQuery) {
      filtered = filtered.filter(w => 
        w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.district.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(w => w.region === selectedRegion)
    }

    return filtered
  }, [searchQuery, selectedRegion])

  const paginatedWarehouses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredWarehouses.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredWarehouses, currentPage])

  const totalPages = Math.ceil(filteredWarehouses.length / itemsPerPage)

  // Sample warehouses for dashboard view (first 5)
  const sampleWarehouses = useMemo(() => {
    if (!warehouseData || warehouseData.length === 0) return []
    return warehouseData.slice(0, 5)
  }, [warehouseData])

  // Format pending approvals for display
  const pendingApprovals = pendingApprovalsList.map((item, idx) => {
    if (item.type || item.transferId) {
      // Transfer request
      return {
        id: item.id || idx,
        type: 'Inter-Warehouse Transfer',
        from: item.from || `${item.fromWarehouse}`,
        to: item.to || `${item.toWarehouse}`,
        product: item.product,
        quantity: item.quantity,
        requestedBy: item.requestedBy || 'Warehouse Manager',
        requestDate: item.requestDate,
        originalItem: item
      }
    } else if (item.farmerId || item.farmerName) {
      // Storage request
      return {
        id: item.id || idx,
        type: 'Storage Request',
        farmer: item.farmerName || item.farmerId,
        product: item.product,
        quantity: item.quantity,
        warehouse: item.warehouse,
        requestedBy: 'Farmer',
        requestDate: item.requestDate,
        originalItem: item
      }
    } else {
      // Dispatch request
      return {
        id: item.id || idx,
        type: 'Dispatch Request',
        farmer: item.farmerName || item.farmerId,
        product: item.product,
        quantity: item.quantity,
        from: item.from,
        to: item.to,
        requestedBy: 'Farmer',
        requestDate: item.requestDate,
        originalItem: item
      }
    }
  })

  // Get top warehouses by utilization for charts
  const topWarehouses = useMemo(() => {
    if (!warehouseData || warehouseData.length === 0) return []
    return warehouseData
      .sort((a, b) => b.utilization - a.utilization)
      .slice(0, 10)
      .map(w => ({
        name: w.name.length > 15 ? w.name.substring(0, 15) + '...' : w.name,
        utilization: w.utilization
      }))
  }, [warehouseData])

  // Group by region for pie chart
  const regionDistribution = useMemo(() => {
    if (!warehouseData || warehouseData.length === 0) return []
    const regionCounts = warehouseData.reduce((acc, w) => {
      acc[w.region] = (acc[w.region] || 0) + 1
      return acc
    }, {})
    
    return Object.entries(regionCounts).map(([name, value]) => ({
      name,
      value
    }))
  }, [warehouseData])

  const productDistribution = [
    { name: 'Wheat', value: 35 },
    { name: 'Rice', value: 28 },
    { name: 'Soybeans', value: 20 },
    { name: 'Corn', value: 12 },
    { name: 'Other', value: 5 }
  ]

  // Region distribution for pie chart
  const regionPieData = regionDistribution

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

  // Debug warehouseData
  console.log('warehouseData in AdminDashboard:', warehouseData)

  if (isInternalTransports) {
    return <AdminInternalTransportsView 
      transferRequests={transferRequests}
      approveTransfer={approveTransfer}
      rejectTransfer={rejectTransfer}
    />
  }

  if (isWarehouses) {
    console.log('Rendering WarehousesView')
    try {
      return <WarehousesView />
    } catch (error) {
      console.error('Error rendering WarehousesView:', error)
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Warehouses</h1>
          <p className="mt-2 text-gray-600">There was an error loading the warehouses view.</p>
          <p className="mt-1 text-sm text-gray-500">Error: {error.message}</p>
        </div>
      )
    }
  }

  if (isUsers) {
    return <UserManagement />
  }

  if (isApprovals) {
    return <ApprovalsView approvals={pendingApprovals} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Settings className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600">
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Warehouses</p>
              <p className="text-2xl font-bold text-gray-900">{overviewStats.totalWarehouses}</p>
            <p className="text-xs text-gray-500 mt-1">Across Maharashtra</p>
            </div>
            <Warehouse className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Farmers</p>
              <p className="text-2xl font-bold text-gray-900">{overviewStats.totalFarmers.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Capacity Utilization</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.avgUtilization}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalOccupied.toLocaleString()} / {stats.totalCapacity.toLocaleString()} tonnes
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.regions} Regions, {stats.districts} Districts
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{overviewStats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <IndianRupee className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Warehouse Utilization</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topWarehouses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="utilization" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

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
                outerRadius={80}
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

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Warehouses by Region</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionPieData.slice(0, 10)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {regionPieData.slice(0, 10).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Warehouse-wise Product Distribution */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Warehouse-wise Product Storage</h2>
          <p className="text-sm text-gray-600 mt-1">Showing sample of {sampleWarehouses.length} warehouses (Total: {stats.totalWarehouses} warehouses across Maharashtra)</p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {sampleWarehouses.map((warehouse) => (
              <div key={warehouse.id} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Warehouse className="w-5 h-5 text-primary" />
                      {warehouse.name} ({warehouse.id})
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{warehouse.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Capacity Utilization</p>
                    <p className="text-2xl font-bold text-primary">{warehouse.utilization}%</p>
                    <p className="text-xs text-gray-500">{warehouse.occupied} / {warehouse.capacity} tonnes</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {warehouse.products.map((product, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <Package className="w-4 h-4 text-primary" />
                        <span className="text-xs text-gray-500">{(product.quantity / warehouse.occupied * 100).toFixed(1)}%</span>
                      </div>
                      <h4 className="font-semibold mb-1">{product.product}</h4>
                      <p className="text-2xl font-bold text-gray-900">{product.quantity}</p>
                      <p className="text-xs text-gray-600 mt-1">{product.unit}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Products: {warehouse.products.length} types</span>
                    <span className="font-semibold">Total Quantity: {warehouse.products.reduce((sum, p) => sum + p.quantity, 0)} tonnes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Pending Approvals</h2>
            <button className="text-primary hover:text-green-600 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {pendingApprovals.slice(0, 3).map((approval) => (
              <div key={approval.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{approval.type}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {approval.type === 'Inter-Warehouse Transfer' 
                      ? `${approval.from} → ${approval.to}`
                      : approval.user
                    }
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Requested on {approval.requestDate}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                    <XCircle className="w-4 h-4 inline mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const WarehousesView = () => {
  const { warehouses: warehouseData } = useData()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Debug logging
  console.log('WarehousesView - warehouseData:', warehouseData)

  // Safety check for warehouseData
  const safeWarehouseData = Array.isArray(warehouseData) ? warehouseData : []

  if (!Array.isArray(warehouseData)) {
    console.warn('warehouseData is not an array:', warehouseData)
  }
  
  console.log('WarehousesView - safeWarehouseData length:', safeWarehouseData.length)

  const regions = useMemo(() => {
    if (!safeWarehouseData || safeWarehouseData.length === 0) return []
    return [...new Set(safeWarehouseData.map(w => w.region))].sort()
  }, [safeWarehouseData])

  const filteredWarehouses = useMemo(() => {
    let filtered = safeWarehouseData

    if (searchQuery) {
      filtered = filtered.filter(w => 
        w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.district.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(w => w.region === selectedRegion)
    }

    return filtered
  }, [searchQuery, selectedRegion, safeWarehouseData])

  const paginatedWarehouses = filteredWarehouses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredWarehouses.length / itemsPerPage)

  // Print functionality
  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    const printContent = generatePrintHTML(filteredWarehouses, selectedRegion, searchQuery)
    
    printWindow.document.write(printContent)
    printWindow.document.close()
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  // PDF Export functionality
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank')
    const printContent = generatePrintHTML(filteredWarehouses, selectedRegion, searchQuery)
    
    printWindow.document.write(printContent)
    printWindow.document.close()
    
    // Wait for content to load, then trigger save as PDF via print dialog
    setTimeout(() => {
      printWindow.print()
      // Note: User can select "Save as PDF" in the print dialog
    }, 250)
  }

  // Generate HTML content for printing/PDF
  const generatePrintHTML = (warehouses, region, query) => {
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    const tableRows = warehouses.map(w => `
      <tr>
        <td>${w.id}</td>
        <td>${w.name}</td>
        <td>${w.region}</td>
        <td>${w.district}</td>
        <td>${w.location}</td>
        <td>${w.capacity} tonnes</td>
        <td>${w.occupied} tonnes</td>
        <td>${w.available} tonnes</td>
        <td>${w.utilization}%</td>
      </tr>
    `).join('')

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>All Warehouses Report</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              .no-print { display: none; }
            }
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              padding: 20px;
            }
            .header {
              margin-bottom: 30px;
              border-bottom: 3px solid #10b981;
              padding-bottom: 15px;
            }
            .header h1 {
              color: #10b981;
              margin: 0;
              font-size: 28px;
            }
            .header p {
              color: #666;
              margin: 5px 0;
            }
            .filters {
              margin-bottom: 20px;
              padding: 15px;
              background: #f5f5f5;
              border-radius: 5px;
            }
            .filters strong {
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background-color: #10b981;
              color: white;
              padding: 12px 8px;
              text-align: left;
              font-weight: bold;
              font-size: 12px;
              text-transform: uppercase;
            }
            td {
              padding: 10px 8px;
              border-bottom: 1px solid #ddd;
              font-size: 12px;
            }
            tr:hover {
              background-color: #f9f9f9;
            }
            .summary {
              margin-top: 30px;
              padding: 15px;
              background: #f0f9ff;
              border-radius: 5px;
              border-left: 4px solid #10b981;
            }
            .summary h3 {
              margin-top: 0;
              color: #10b981;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #666;
              font-size: 11px;
            }
            @page {
              margin: 1cm;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FWMS - All Warehouses Report</h1>
            <p>Generated on: ${date}</p>
            <p>Total Warehouses: ${warehouses.length}</p>
          </div>
          
          <div class="filters no-print">
            ${region !== 'all' ? `<p><strong>Region Filter:</strong> ${region}</p>` : ''}
            ${query ? `<p><strong>Search Query:</strong> ${query}</p>` : ''}
          </div>

          <table>
            <thead>
              <tr>
                <th>Warehouse ID</th>
                <th>Name</th>
                <th>Region</th>
                <th>District</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Occupied</th>
                <th>Available</th>
                <th>Utilization</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Warehouses:</strong> ${warehouses.length}</p>
            <p><strong>Total Capacity:</strong> ${warehouses.reduce((sum, w) => sum + w.capacity, 0).toLocaleString()} tonnes</p>
            <p><strong>Total Occupied:</strong> ${warehouses.reduce((sum, w) => sum + w.occupied, 0).toLocaleString()} tonnes</p>
            <p><strong>Total Available:</strong> ${warehouses.reduce((sum, w) => sum + w.available, 0).toLocaleString()} tonnes</p>
            <p><strong>Average Utilization:</strong> ${(warehouses.reduce((sum, w) => sum + w.utilization, 0) / warehouses.length).toFixed(2)}%</p>
            <p><strong>Regions:</strong> ${[...new Set(warehouses.map(w => w.region))].length}</p>
            <p><strong>Districts:</strong> ${[...new Set(warehouses.map(w => w.district))].length}</p>
          </div>

          <div class="footer">
            <p>Farmer Warehouse Management System (FWMS)</p>
            <p>This is a system-generated report. Generated on ${date}</p>
          </div>

          <script>
            window.onload = function() {
              // Auto-close after printing (optional)
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Warehouses</h1>
          <p className="text-sm text-gray-600 mt-1">
            {filteredWarehouses.length} Warehouse{filteredWarehouses.length !== 1 ? 's' : ''} 
            {selectedRegion !== 'all' ? ` in ${selectedRegion}` : ' across Maharashtra'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 font-medium"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 font-medium"
          >
            <Download className="w-4 h-4" />
            Export to PDF
          </button>
          <button
            onClick={() => navigate('/admin/warehouses/add')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 flex items-center gap-2 font-medium"
          >
            <Warehouse className="w-4 h-4" />
            Add Warehouse
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search by Warehouse ID, Name, Location, or District..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {paginatedWarehouses.length} of {filteredWarehouses.length} warehouses
          </span>
          {selectedRegion !== 'all' && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              Region: {selectedRegion}
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">District</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occupied</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedWarehouses.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                    <Warehouse className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No warehouses found</p>
                    <p className="text-sm mt-1">
                      {searchQuery || selectedRegion !== 'all' 
                        ? 'Try adjusting your search or filter criteria'
                        : 'Click "Add Warehouse" to create a new warehouse'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedWarehouses.map((warehouse) => (
                <tr key={warehouse.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{warehouse.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{warehouse.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3 h-3 text-primary" />
                      {warehouse.region}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{warehouse.district}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{warehouse.capacity} tonnes</td>
                  <td className="px-6 py-4 whitespace-nowrap">{warehouse.occupied} tonnes</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">{warehouse.available} tonnes</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                        <div 
                          className={`h-2 rounded-full ${
                            warehouse.utilization >= 80 ? 'bg-red-500' :
                            warehouse.utilization >= 60 ? 'bg-yellow-500' :
                            'bg-primary'
                          }`}
                          style={{ width: `${warehouse.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12">{warehouse.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/admin/warehouses/${warehouse.id}/edit`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => navigate(`/admin/analytics/${warehouse.id}`)}
                        className="text-primary hover:text-green-600 text-sm font-medium"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const UserManagement = () => {
  const [users] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      role: 'farmer',
      phone: '+91 9876543210',
      status: 'Active',
      registeredDate: '2024-01-10'
    },
    {
      id: 2,
      name: 'Amit Sharma',
      email: 'amit@example.com',
      role: 'warehouse_manager',
      phone: '+91 9876543211',
      status: 'Active',
      registeredDate: '2024-01-15'
    }
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Users</h2>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600">
              Add User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.registeredDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-primary hover:text-green-600 text-sm">Edit</button>
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

const ApprovalsView = ({ approvals }) => {
  const handleApprove = (id) => {
    alert(`Approval ${id} approved!`)
  }

  const handleReject = (id) => {
    alert(`Approval ${id} rejected!`)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="space-y-4">
            {approvals.map((approval) => (
              <div key={approval.id} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{approval.type}</h3>
                    {approval.type === 'Inter-Warehouse Transfer' ? (
                      <p className="text-sm text-gray-600 mt-1">
                        {approval.from} → {approval.to}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600 mt-1">
                        User: {approval.user} • {approval.currentRole} → {approval.requestedRole}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Requested by {approval.requestedBy} on {approval.requestDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(approval.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(approval.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Admin Storage Requests View - Shows all storage requests across all warehouses
const AdminStorageRequestsView = ({ storageRequests, approveStorageRequest }) => {
  // Get all storage requests across all warehouses (for admin)
  const allStorageRequests = storageRequests
  const pendingStorageRequests = allStorageRequests.filter(req => req.status === 'Pending Approval')
  const approvedRequests = allStorageRequests.filter(req => req.status === 'Approved')
  const rejectedRequests = allStorageRequests.filter(req => req.status === 'Rejected')
  
  const [filterStatus, setFilterStatus] = useState('all') // all, pending, approved, rejected
  const [selectedWarehouse, setSelectedWarehouse] = useState('all')
  const { warehouses: warehouseData } = useData()
  
  // Get unique warehouses from requests
  const warehouses = useMemo(() => {
    const warehouseIds = [...new Set(storageRequests.map(req => req.warehouse))].sort()
    return warehouseIds
  }, [storageRequests])
  
  const filteredRequests = allStorageRequests.filter(req => {
    // Filter by status
    if (filterStatus !== 'all') {
      if (filterStatus === 'pending' && req.status !== 'Pending Approval') return false
      if (filterStatus === 'approved' && req.status !== 'Approved') return false
      if (filterStatus === 'rejected' && req.status !== 'Rejected') return false
    }
    
    // Filter by warehouse
    if (selectedWarehouse !== 'all' && req.warehouse !== selectedWarehouse) return false
    
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Storage Requests (All Warehouses)</h1>
          <p className="text-gray-600 mt-1">Manage and approve farmer storage requests across all warehouses</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Warehouses</option>
            {warehouses.map(whId => (
              <option key={whId} value={whId}>{whId}</option>
            ))}
          </select>
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
              {selectedWarehouse !== 'all' && ` • ${selectedWarehouse}`}
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
                <AdminRequestCard 
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

// Admin Request Card Component (reusing PendingRequestCard from WarehouseDashboard with warehouse display)
const AdminRequestCard = ({ request, approveStorageRequest }) => {
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

    approveStorageRequest(request.id, parseFloat(paymentAmount))
    
    setTimeout(() => {
      setIsSubmitting(false)
      setShowApproveModal(false)
      setPaymentAmount('')
      setNotes('')
    }, 1000)
  }

  const handleReject = () => {
    if (window.confirm(`Are you sure you want to reject this storage request from ${request.farmerName}?`)) {
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
                <p className="text-xs text-gray-500 mt-1">Warehouse: <span className="font-medium text-primary">{request.warehouse}</span></p>
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
                  ×
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
                    <p className="text-gray-600">Warehouse</p>
                    <p className="font-semibold">{request.warehouse}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Product</p>
                    <p className="font-semibold">{request.product}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Quantity</p>
                    <p className="font-semibold">{request.quantity} {request.unit}</p>
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

// Admin Internal Transports View - Shows internal transport requests from warehouses
const AdminInternalTransportsView = ({ transferRequests, approveTransfer, rejectTransfer }) => {
  // Get all internal transport requests (warehouse to warehouse)
  const allTransportRequests = transferRequests
  const pendingRequests = allTransportRequests.filter(req => req.status === 'Pending Approval')
  const approvedRequests = allTransportRequests.filter(req => req.status === 'Approved' || req.status === 'In Transit')
  const rejectedRequests = allTransportRequests.filter(req => req.status === 'Rejected')
  const deliveredRequests = allTransportRequests.filter(req => req.status === 'Delivered')
  
  const [filterStatus, setFilterStatus] = useState('all') // all, pending, approved, rejected, delivered
  const [selectedWarehouse, setSelectedWarehouse] = useState('all')
  const { warehouses: warehouseData } = useData()
  
  // Get unique warehouses from requests
  const warehouses = useMemo(() => {
    const warehouseIds = [...new Set([
      ...transferRequests.map(req => req.fromWarehouse),
      ...transferRequests.map(req => req.toWarehouse)
    ])].sort()
    return warehouseIds
  }, [transferRequests])
  
  const filteredRequests = allTransportRequests.filter(req => {
    // Filter by status
    if (filterStatus !== 'all') {
      if (filterStatus === 'pending' && req.status !== 'Pending Approval') return false
      if (filterStatus === 'approved' && req.status !== 'Approved' && req.status !== 'In Transit') return false
      if (filterStatus === 'rejected' && req.status !== 'Rejected') return false
      if (filterStatus === 'delivered' && req.status !== 'Delivered') return false
    }
    
    // Filter by warehouse
    if (selectedWarehouse !== 'all') {
      if (req.fromWarehouse !== selectedWarehouse && req.toWarehouse !== selectedWarehouse) return false
    }
    
    return true
  })

  const handleApprove = (transferId) => {
    approveTransfer(transferId)
  }

  const handleReject = (transferId) => {
    if (window.confirm('Are you sure you want to reject this internal transport request?')) {
      rejectTransfer(transferId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Internal Transport Requests</h1>
          <p className="text-gray-600 mt-1">Approve or reject warehouse-to-warehouse transport requests</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Warehouses</option>
            {warehouses.map(whId => (
              <option key={whId} value={whId}>{whId}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved/In Transit</option>
            <option value="delivered">Delivered</option>
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
              <p className="text-2xl font-bold text-gray-900">{allTransportRequests.length}</p>
            </div>
            <Truck className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-orange-600">{pendingRequests.length}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved/In Transit</p>
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
              {filterStatus === 'all' ? 'All Transport Requests' :
               filterStatus === 'pending' ? 'Pending Approval Requests' :
               filterStatus === 'approved' ? 'Approved/In Transit Requests' :
               filterStatus === 'delivered' ? 'Delivered Requests' :
               'Rejected Requests'}
              {selectedWarehouse !== 'all' && ` • ${selectedWarehouse}`}
            </h2>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {filteredRequests.length} {filteredRequests.length === 1 ? 'Request' : 'Requests'}
            </span>
          </div>
        </div>
        <div className="p-6">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No {filterStatus === 'all' ? '' : filterStatus} transport requests found</p>
              <p className="text-sm mt-1">
                {filterStatus === 'pending' 
                  ? 'All transport requests have been processed'
                  : 'No transport requests match this filter'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <InternalTransportCard 
                  key={request.id} 
                  request={request}
                  approveTransfer={handleApprove}
                  rejectTransfer={handleReject}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Internal Transport Card Component
const InternalTransportCard = ({ request, approveTransfer, rejectTransfer }) => {
  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{request.transferId || `Transfer #${request.id}`}</h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-primary">{request.fromWarehouse}</span> → <span className="font-medium text-green-600">{request.toWarehouse}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">Requested by: {request.requestedBy}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-xs text-gray-600">Product</p>
              <p className="font-semibold">{request.product}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Quantity</p>
              <p className="font-semibold">{request.quantity} {request.unit || 'tonnes'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Priority</p>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                request.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {request.priority?.toUpperCase() || 'NORMAL'}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-600">Request Date</p>
              <p className="font-semibold">{request.requestDate}</p>
            </div>
          </div>

          {request.reason && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Reason:</p>
              <p className="text-sm text-gray-800">{request.reason}</p>
            </div>
          )}

          {request.expectedDate && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Expected Delivery: {request.expectedDate}</span>
            </div>
          )}

          {request.approvedDate && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Approved on: {request.approvedDate}</span>
            </div>
          )}

          {request.rejectedDate && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
              <XCircle className="w-4 h-4" />
              <span>Rejected on: {request.rejectedDate}</span>
            </div>
          )}
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
          request.status === 'Approved' || request.status === 'In Transit' ? 'bg-green-100 text-green-800' :
          request.status === 'Delivered' ? 'bg-blue-100 text-blue-800' :
          request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {request.status}
        </span>
      </div>

      {/* Action buttons only for pending requests */}
      {request.status === 'Pending Approval' && (
        <div className="flex items-center gap-3 pt-4 border-t">
          <button
            onClick={() => approveTransfer(request.id)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition"
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={() => rejectTransfer(request.id)}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

