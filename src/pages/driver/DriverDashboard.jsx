import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertCircle,
  IndianRupee,
  Bell,
  Package,
  Camera,
  MessageSquare,
  FileCheck
} from 'lucide-react'

const DriverDashboard = () => {
  const { user } = useAuth()
  const { trips: allTrips, updateTripStatus } = useData()
  const navigate = useNavigate()
  
  // Get trips for this driver and sort by date (most recent first)
  const trips = allTrips
    .filter(t => 
      t.driverId === user?.id || t.driverId === 1 || t.status === 'ASSIGNED' || t.status === 'IN_TRANSIT'
    )
    .sort((a, b) => {
      // Sort by assigned date or scheduled start date (most recent first)
      const dateA = a.assignedDate || a.scheduledStart || ''
      const dateB = b.assignedDate || b.scheduledStart || ''
      return dateB.localeCompare(dateA)
    })
  
  const [tripsLegacy] = useState([
    {
      id: 1,
      tripId: 'TRP-001',
      type: 'Internal',
      from: 'WH-101, Pune',
      to: 'WH-103, Nagpur',
      product: 'Wheat',
      quantity: 25,
      scheduledStart: '2024-01-28 08:00',
      scheduledEnd: '2024-01-28 18:00',
      status: 'ASSIGNED',
      distance: 480,
      paymentRate: 15, // per km
      vehicleNumber: 'TRK-1234'
    },
    {
      id: 2,
      tripId: 'TRP-002',
      type: 'External',
      from: 'WH-105, Mumbai',
      to: 'Market Hub, Delhi',
      product: 'Rice',
      quantity: 30,
      scheduledStart: '2024-01-29 06:00',
      scheduledEnd: '2024-01-30 20:00',
      status: 'IN_TRANSIT',
      distance: 1400,
      paymentRate: 18,
      vehicleNumber: 'EXT-TRK-001',
      currentLocation: 'Highway NH-8, 250km from destination'
    },
    {
      id: 3,
      tripId: 'TRP-003',
      type: 'Internal',
      from: 'WH-102, Nashik',
      to: 'WH-104, Mumbai',
      product: 'Soybeans',
      quantity: 20,
      scheduledStart: '2024-01-27 10:00',
      scheduledEnd: '2024-01-27 16:00',
      status: 'DELIVERED',
      distance: 180,
      paymentRate: 15,
      vehicleNumber: 'TRK-5678',
      deliveredDate: '2024-01-27 15:30',
      earnings: 2700
    }
  ])

  const [notifications] = useState([
    {
      id: 1,
      type: 'trip_assigned',
      message: 'New trip assigned: TRP-001',
      timestamp: '2024-01-27 14:30',
      read: false
    },
    {
      id: 2,
      type: 'route_update',
      message: 'Route alert: Heavy traffic on NH-8',
      timestamp: '2024-01-27 12:00',
      read: false
    },
    {
      id: 3,
      type: 'payment',
      message: 'Payment released for TRP-003',
      timestamp: '2024-01-27 10:00',
      read: true
    }
  ])

  const activeTrips = trips.filter(t => ['ASSIGNED', 'IN_TRANSIT'].includes(t.status))
  const completedTrips = trips.filter(t => t.status === 'DELIVERED')
  const totalEarnings = completedTrips.reduce((sum, t) => sum + (t.earnings || 0), 0)
  const pendingEarnings = activeTrips.reduce((sum, t) => sum + (t.distance * t.paymentRate), 0)
  const totalTrips = trips.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome, {user?.name || 'Driver'}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>License: {user?.license || 'DL1234567890'}</span>
            <span>•</span>
            <span>Vehicle: {user?.vehicleNumber || 'TRK-1234'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/driver/earnings')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 font-medium flex items-center gap-2"
          >
            <IndianRupee className="w-4 h-4" />
            View Earnings
          </button>
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <Bell className="w-6 h-6" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Trips</p>
              <p className="text-2xl font-bold text-gray-900">{activeTrips.length}</p>
            </div>
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalEarnings.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Pending: ₹{pendingEarnings.toLocaleString()}</p>
            </div>
            <IndianRupee className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Trips</p>
              <p className="text-2xl font-bold text-gray-900">{completedTrips.length}</p>
              <p className="text-xs text-gray-500 mt-1">Total: {totalTrips} trips</p>
            </div>
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Notifications</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => !n.read).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Unread</p>
            </div>
            <Bell className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Active Trips */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" />
            Active Trips
          </h2>
        </div>
        <div className="p-6">
          {activeTrips.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No active trips</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Completed Trips */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Completed Trips
          </h2>
        </div>
        <div className="p-6">
          {completedTrips.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No completed trips yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            Notifications
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                  </div>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const TripCard = ({ trip }) => {
  const navigate = useNavigate()
  const [showTripDetails, setShowTripDetails] = useState(false)
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800'
      case 'IN_TRANSIT':
        return 'bg-yellow-100 text-yellow-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ASSIGNED':
        return 'Assigned'
      case 'IN_TRANSIT':
        return 'In Transit'
      case 'DELIVERED':
        return 'Delivered'
      default:
        return status
    }
  }

  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg">{trip.tripId}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
              {getStatusLabel(trip.status)}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              trip.type === 'Internal' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
            }`}>
              {trip.type}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{trip.from} → {trip.to}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTripDetails(!showTripDetails)}
            className="text-primary hover:text-green-600 text-sm font-medium"
          >
            {showTripDetails ? 'Hide Details' : 'View Details'}
          </button>
          <button
            onClick={() => navigate(`/driver/trip/${trip.tripId}`)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Full Details →
          </button>
        </div>
      </div>

      {showTripDetails && (
        <div className="mt-4 pt-4 border-t space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Product</p>
              <p className="font-semibold">{trip.product}</p>
              <p className="text-xs text-gray-500">{trip.quantity} tonnes</p>
            </div>
            <div>
              <p className="text-gray-600">Distance</p>
              <p className="font-semibold">{trip.distance} km</p>
            </div>
            <div>
              <p className="text-gray-600">Payment Rate</p>
              <p className="font-semibold">₹{trip.paymentRate}/km</p>
            </div>
            <div>
              <p className="text-gray-600">Estimated Earnings</p>
              <p className="font-semibold text-green-600">₹{(trip.distance * trip.paymentRate).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Scheduled: {trip.scheduledStart} to {trip.scheduledEnd}</span>
          </div>

          {trip.currentLocation && (
            <div className="text-sm text-gray-600">
              <p className="font-medium">Current Location:</p>
              <p className="text-gray-500">{trip.currentLocation}</p>
            </div>
          )}

          {trip.status === 'ASSIGNED' && (
            <div className="flex gap-2 pt-4 border-t">
              <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 font-medium">
                Accept Trip
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                View Route
              </button>
            </div>
          )}

          {trip.status === 'IN_TRANSIT' && (
            <div className="flex gap-2 pt-4 border-t">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Track Location
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600">
                Upload POD
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Mark Delivered
              </button>
            </div>
          )}

          {trip.status === 'DELIVERED' && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Delivered on:</span>
                <span className="font-semibold">{trip.deliveredDate}</span>
              </div>
              {trip.earnings && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Earnings:</span>
                  <span className="font-bold text-green-600">₹{trip.earnings.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DriverDashboard

