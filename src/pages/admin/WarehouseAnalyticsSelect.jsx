import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Warehouse, MapPin, TrendingUp } from 'lucide-react'
import { useData } from '../../contexts/DataContext'

const WarehouseAnalyticsSelect = () => {
  const navigate = useNavigate()
  const { warehouses: warehouseData } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')

  // Get unique regions
  const regions = useMemo(() => {
    return [...new Set(warehouseData.map(w => w.region))].sort()
  }, [warehouseData])

  // Filter warehouses
  const filteredWarehouses = useMemo(() => {
    let filtered = warehouseData

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(w =>
        w.id.toLowerCase().includes(query) ||
        w.name.toLowerCase().includes(query) ||
        w.district.toLowerCase().includes(query) ||
        w.region.toLowerCase().includes(query)
      )
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(w => w.region === selectedRegion)
    }

    return filtered.sort((a, b) => a.id.localeCompare(b.id))
  }, [searchQuery, selectedRegion, warehouseData])

  const handleSelectWarehouse = (warehouseId) => {
    navigate(`/admin/analytics/${warehouseId}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">View Analytics</h1>
        <p className="text-gray-600 mt-1">Select a warehouse to view detailed analytics and visualizations</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by warehouse ID, name, district, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Showing {filteredWarehouses.length} of {warehouseData.length} warehouses
        </div>

        {/* Warehouse Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWarehouses.map(warehouse => (
            <div
              key={warehouse.id}
              onClick={() => handleSelectWarehouse(warehouse.id)}
              className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 hover:border-primary transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Warehouse className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{warehouse.id}</h3>
                    <p className="text-sm text-gray-600">{warehouse.name}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  warehouse.utilization >= 80 ? 'bg-red-100 text-red-800' :
                  warehouse.utilization >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {warehouse.utilization}%
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{warehouse.district}, {warehouse.region}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">
                    {warehouse.occupied.toLocaleString()} / {warehouse.capacity.toLocaleString()} tonnes
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      warehouse.utilization >= 80 ? 'bg-red-500' :
                      warehouse.utilization >= 60 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${warehouse.utilization}%` }}
                  />
                </div>
              </div>

              <button className="mt-3 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 font-medium">
                <TrendingUp className="w-4 h-4" />
                View Analytics
              </button>
            </div>
          ))}
        </div>

        {filteredWarehouses.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Warehouse className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No warehouses found matching your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default WarehouseAnalyticsSelect

