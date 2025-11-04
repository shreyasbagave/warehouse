import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { 
  Truck, 
  MapPin, 
  Navigation,
  Search,
  Calendar,
  Package
} from 'lucide-react'
import warehouseData from '../../data/warehouses'

const TripSelect = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { trips } = useData()

  // Get trips for this driver and sort by date (most recent first)
  const driverTrips = trips
    .filter(t => 
      t.driverId === user?.id || t.driverId === 1 || t.status === 'ASSIGNED' || t.status === 'IN_TRANSIT'
    )
    .sort((a, b) => {
      // Sort by assigned date or scheduled start date (most recent first)
      const dateA = a.assignedDate || a.scheduledStart || ''
      const dateB = b.assignedDate || b.scheduledStart || ''
      return dateB.localeCompare(dateA)
    })

  const [selectedTripId, setSelectedTripId] = useState('')
  const [selectedStartLocation, setSelectedStartLocation] = useState('')
  const [selectedEndLocation, setSelectedEndLocation] = useState('')
  const [errors, setErrors] = useState({})

  // Get unique locations from trips
  const allLocations = [
    ...new Set([
      ...trips.map(t => t.from),
      ...trips.map(t => t.to),
      ...warehouseData.slice(0, 50).map(w => `${w.id}, ${w.name}, ${w.district}`)
    ])
  ].sort()

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors({})

    // Validate
    if (!selectedTripId) {
      setErrors({ tripId: 'Please select a Trip ID' })
      return
    }

    if (!selectedStartLocation) {
      setErrors({ startLocation: 'Please select start location' })
      return
    }

    if (!selectedEndLocation) {
      setErrors({ endLocation: 'Please select end location' })
      return
    }

    if (selectedStartLocation === selectedEndLocation) {
      setErrors({ endLocation: 'Start and end location cannot be the same' })
      return
    }

    // Find the trip
    const trip = trips.find(t => t.tripId === selectedTripId)
    
    if (!trip) {
      setErrors({ tripId: 'Trip not found' })
      return
    }

    // Navigate to trip details
    navigate(`/driver/trip/${selectedTripId}`)
  }

  const handleTripIdChange = (tripId) => {
    setSelectedTripId(tripId)
    const trip = trips.find(t => t.tripId === tripId)
    if (trip) {
      setSelectedStartLocation(trip.from)
      setSelectedEndLocation(trip.to)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Select Trip Details</h1>
          <p className="text-gray-600 mt-1">Select trip ID, start location, and end location to view trip details</p>
        </div>
        <button
          onClick={() => navigate('/driver/dashboard')}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip ID Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Trip ID <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedTripId}
              onChange={(e) => handleTripIdChange(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.tripId ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              <option value="">-- Select Trip ID --</option>
              {driverTrips.map((trip) => (
                <option key={trip.tripId} value={trip.tripId}>
                  {trip.tripId} - {trip.from} → {trip.to} ({trip.status})
                </option>
              ))}
            </select>
            {errors.tripId && (
              <p className="text-xs text-red-600 mt-1">{errors.tripId}</p>
            )}
          </div>

          {/* Start Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedStartLocation}
                onChange={(e) => setSelectedStartLocation(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.startLocation ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option value="">-- Select Start Location --</option>
                {allLocations.map((location, idx) => (
                  <option key={idx} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            {errors.startLocation && (
              <p className="text-xs text-red-600 mt-1">{errors.startLocation}</p>
            )}
          </div>

          {/* End Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Location / Destination <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedEndLocation}
                onChange={(e) => setSelectedEndLocation(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.endLocation ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option value="">-- Select End Location --</option>
                {allLocations
                  .filter(loc => loc !== selectedStartLocation)
                  .map((location, idx) => (
                    <option key={idx} value={location}>
                      {location}
                    </option>
                  ))}
              </select>
            </div>
            {errors.endLocation && (
              <p className="text-xs text-red-600 mt-1">{errors.endLocation}</p>
            )}
          </div>

          {/* Selected Trip Preview */}
          {selectedTripId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Trip Preview
              </h3>
              {(() => {
                const trip = trips.find(t => t.tripId === selectedTripId)
                return trip ? (
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Trip ID:</span>
                        <span className="ml-2 font-semibold">{trip.tripId}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className={`ml-2 font-semibold ${
                          trip.status === 'ASSIGNED' ? 'text-blue-600' :
                          trip.status === 'IN_TRANSIT' ? 'text-yellow-600' :
                          trip.status === 'DELIVERED' ? 'text-green-600' :
                          'text-gray-600'
                        }`}>
                          {trip.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Product:</span>
                        <span className="ml-2 font-semibold">{trip.product}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Quantity:</span>
                        <span className="ml-2 font-semibold">{trip.quantity} tonnes</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Distance:</span>
                        <span className="ml-2 font-semibold">{trip.distance} km</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Payment Rate:</span>
                        <span className="ml-2 font-semibold">₹{trip.paymentRate}/km</span>
                      </div>
                    </div>
                  </div>
                ) : null
              })()}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/driver/dashboard')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              View Trip Details
            </button>
          </div>
        </form>
      </div>

      {/* Quick Access - Recent Trips */}
      {driverTrips.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Available Trips</h2>
          <div className="space-y-3">
            {driverTrips.map((trip) => (
              <div
                key={trip.tripId}
                className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                onClick={() => {
                  setSelectedTripId(trip.tripId)
                  setSelectedStartLocation(trip.from)
                  setSelectedEndLocation(trip.to)
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{trip.tripId}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{trip.from} → {trip.to}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {trip.product} • {trip.quantity} tonnes • {trip.distance} km
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      trip.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                      trip.status === 'IN_TRANSIT' ? 'bg-yellow-100 text-yellow-800' :
                      trip.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {trip.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TripSelect

