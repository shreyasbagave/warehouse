import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'
import { ArrowLeft, Warehouse, Save, X } from 'lucide-react'
import warehouseData, { maharashtraDistricts } from '../../data/warehouses'

const AddWarehouse = () => {
  const navigate = useNavigate()
  const { warehouses, addWarehouse } = useData()
  
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    district: '',
    capacity: '',
    occupied: 0
  })

  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  // Get next warehouse ID
  const getNextWarehouseId = () => {
    if (warehouses.length === 0) return 'WH-001'
    const maxId = Math.max(...warehouses.map(w => {
      const num = parseInt(w.id.replace('WH-', ''))
      return isNaN(num) ? 0 : num
    }))
    return `WH-${String(maxId + 1).padStart(3, '0')}`
  }

  // Get districts for selected region
  const getDistrictsForRegion = (regionName) => {
    const region = maharashtraDistricts.find(r => r.name === regionName)
    return region ? region.districts : []
  }

  const availableDistricts = formData.region ? getDistrictsForRegion(formData.region) : []

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'occupied' ? (value === '' ? '' : parseInt(value) || 0) : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
    // Reset district when region changes
    if (name === 'region') {
      setFormData(prev => ({ ...prev, district: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Warehouse name is required'
    }

    if (!formData.region) {
      newErrors.region = 'Region is required'
    }

    if (!formData.district) {
      newErrors.district = 'District is required'
    }

    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = 'Valid capacity is required (must be > 0)'
    }

    if (formData.occupied < 0) {
      newErrors.occupied = 'Occupied capacity cannot be negative'
    }

    if (formData.occupied > formData.capacity) {
      newErrors.occupied = 'Occupied capacity cannot exceed total capacity'
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const occupied = formData.occupied || 0
    const capacity = parseInt(formData.capacity)
    const available = capacity - occupied
    const utilization = Math.round((occupied / capacity) * 100)

    const newWarehouse = {
      id: getNextWarehouseId(),
      name: formData.name.trim(),
      location: formData.district,
      region: formData.region,
      district: formData.district,
      capacity: capacity,
      occupied: occupied,
      available: available,
      utilization: utilization,
      products: []
    }

    addWarehouse(newWarehouse)
    setShowSuccess(true)
    
    setTimeout(() => {
      navigate('/admin/warehouses')
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/warehouses')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Warehouse</h1>
            <p className="text-gray-600 mt-1">Create a new warehouse in the system</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Warehouse className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-800">Warehouse added successfully!</p>
              <p className="text-sm text-green-600">Redirecting to warehouses list...</p>
            </div>
          </div>
          <button onClick={() => setShowSuccess(false)}>
            <X className="w-5 h-5 text-green-600 hover:text-green-800" />
          </button>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Warehouse Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Pune Warehouse 1"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                  Region <span className="text-red-500">*</span>
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.region ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Region</option>
                  {maharashtraDistricts.map(region => (
                    <option key={region.name} value={region.name}>{region.name}</option>
                  ))}
                </select>
                {errors.region && <p className="text-xs text-red-500 mt-1">{errors.region}</p>}
              </div>

              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!formData.region}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.district ? 'border-red-500' : 'border-gray-300'
                  } ${!formData.region ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                >
                  <option value="">Select District</option>
                  {availableDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district}</p>}
                {!formData.region && (
                  <p className="text-xs text-gray-500 mt-1">Please select a region first</p>
                )}
              </div>
            </div>
          </div>

          {/* Capacity Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Capacity Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Capacity (tonnes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.capacity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 1000"
                />
                {errors.capacity && <p className="text-xs text-red-500 mt-1">{errors.capacity}</p>}
              </div>

              <div>
                <label htmlFor="occupied" className="block text-sm font-medium text-gray-700 mb-2">
                  Occupied Capacity (tonnes)
                </label>
                <input
                  type="number"
                  id="occupied"
                  name="occupied"
                  value={formData.occupied}
                  onChange={handleChange}
                  min="0"
                  max={formData.capacity || undefined}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.occupied ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 500 (optional)"
                />
                {errors.occupied && <p className="text-xs text-red-500 mt-1">{errors.occupied}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty or set to 0 for a new empty warehouse
                </p>
              </div>
            </div>

            {formData.capacity && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Capacity</p>
                    <p className="font-semibold text-gray-900">{formData.capacity || 0} tonnes</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Occupied</p>
                    <p className="font-semibold text-red-600">{formData.occupied || 0} tonnes</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Available</p>
                    <p className="font-semibold text-green-600">
                      {Math.max(0, (formData.capacity || 0) - (formData.occupied || 0))} tonnes
                    </p>
                  </div>
                </div>
                {formData.capacity > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Utilization</span>
                      <span className="text-xs font-medium text-gray-900">
                        {Math.round(((formData.occupied || 0) / formData.capacity) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ 
                          width: `${Math.min(100, Math.round(((formData.occupied || 0) / formData.capacity) * 100))}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/warehouses')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-600 font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Add Warehouse
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddWarehouse

