import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle,
  Camera,
  Upload,
  FileText,
  MessageSquare,
  Navigation,
  Package,
  AlertCircle
} from 'lucide-react'
import Modal from '../../components/common/Modal'

const TripDetails = () => {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { trips, updateTripStatus } = useData()
  
  const defaultTrip = {
    id: 1,
    tripId: tripId || 'TRP-001',
    type: 'Internal',
    from: 'WH-101, Pune',
    to: 'WH-103, Nagpur',
    product: 'Wheat',
    quantity: 25,
    scheduledStart: '2024-01-28 08:00',
    scheduledEnd: '2024-01-28 18:00',
    status: 'ASSIGNED',
    distance: 480,
    paymentRate: 15,
    vehicleNumber: 'TRK-1234',
    driverName: 'Ramesh Kumar',
    licenseNumber: 'DL1234567890'
  }
  
  const trip = trips.find(t => t.tripId === tripId) || defaultTrip

  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [photoType, setPhotoType] = useState(null) // 'truck' or 'receipt'
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [comments, setComments] = useState('')
  const [uploadedPhotos, setUploadedPhotos] = useState({
    truck: null,
    receipt: null
  })

  const handleAcceptTrip = () => {
    alert('Trip accepted! You can now start the trip.')
  }

  const handleStartTrip = () => {
    if (!uploadedPhotos.truck) {
      alert('Please upload truck photo before starting the trip')
      return
    }
    updateTripStatus(trip.tripId, 'IN_TRANSIT', {
      startTime: new Date().toISOString(),
      currentLocation: 'Started from origin'
    })
    alert('Trip started! GPS tracking is now active.')
  }

  const handlePhotoUpload = (type, file) => {
    if (!file) return
    
    // Validate file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      alert('Only JPEG or PNG images allowed')
      return
    }
    
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB')
      return
    }
    
    setUploadedPhotos({ ...uploadedPhotos, [type]: file })
    setShowPhotoModal(false)
    alert(`${type === 'truck' ? 'Truck photo' : 'Delivery receipt'} uploaded successfully!`)
  }

  const handleMarkDelivered = () => {
    if (!uploadedPhotos.receipt) {
      alert('Please upload delivery receipt before marking as delivered')
      return
    }
    updateTripStatus(trip.tripId, 'DELIVERED', {
      deliveredDate: new Date().toISOString().split('T')[0],
      deliveredTime: new Date().toISOString(),
      earnings: trip.distance * trip.paymentRate
    })
    alert('Trip marked as delivered! Earnings will be credited to your account.')
    navigate('/driver/dashboard')
  }

  const handleReportIssue = () => {
    if (!comments.trim()) {
      alert('Please describe the issue')
      return
    }
    alert('Issue reported! Transport manager will be notified.')
    setShowIssueModal(false)
    setComments('')
  }

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trip Details</h1>
          <p className="text-gray-600 mt-1">Trip ID: {trip.tripId}</p>
        </div>
        <button
          onClick={() => navigate('/driver/dashboard')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Trip Status Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="font-bold text-2xl">{trip.tripId}</span>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(trip.status)}`}>
              {trip.status.replace('_', ' ')}
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              trip.type === 'Internal' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
            }`}>
              {trip.type} Transfer
            </span>
          </div>
        </div>

        {/* Route Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <span className="font-semibold">From</span>
            </div>
            <p className="text-lg font-medium">{trip.from}</p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <span className="font-semibold">To</span>
            </div>
            <p className="text-lg font-medium">{trip.to}</p>
          </div>
        </div>

        {/* Trip Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Product</p>
            <p className="font-semibold text-lg">{trip.product}</p>
            <p className="text-xs text-gray-500">{trip.quantity} tonnes</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Distance</p>
            <p className="font-semibold text-lg">{trip.distance} km</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Payment Rate</p>
            <p className="font-semibold text-lg">₹{trip.paymentRate}/km</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Est. Earnings</p>
            <p className="font-semibold text-lg text-green-600">
              ₹{(trip.distance * trip.paymentRate).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Schedule */}
        <div className="border-t pt-6 mb-6">
          <div className="flex items-center gap-4">
            <Clock className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Scheduled Start</p>
              <p className="font-medium">{trip.scheduledStart}</p>
            </div>
            <span className="text-gray-400">→</span>
            <div>
              <p className="text-sm text-gray-600">Scheduled End</p>
              <p className="font-medium">{trip.scheduledEnd}</p>
            </div>
          </div>
        </div>

        {/* Photo Uploads */}
        <div className="border-t pt-6 mb-6">
          <h3 className="font-semibold mb-4">Required Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Truck Photo</span>
                </div>
                {uploadedPhotos.truck ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Uploaded</span>
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Required</span>
                )}
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Photo of truck with cargo before dispatch
              </p>
              {uploadedPhotos.truck ? (
                <div className="text-sm text-gray-700">{uploadedPhotos.truck.name}</div>
              ) : (
                <button
                  onClick={() => {
                    setPhotoType('truck')
                    setShowPhotoModal(true)
                  }}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition text-sm"
                >
                  <Upload className="w-4 h-4 inline mr-1" />
                  Upload Truck Photo
                </button>
              )}
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Delivery Receipt</span>
                </div>
                {uploadedPhotos.receipt ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Uploaded</span>
                ) : (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">Pending</span>
                )}
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Signed delivery receipt or proof-of-delivery
              </p>
              {uploadedPhotos.receipt ? (
                <div className="text-sm text-gray-700">{uploadedPhotos.receipt.name}</div>
              ) : (
                <button
                  onClick={() => {
                    setPhotoType('receipt')
                    setShowPhotoModal(true)
                  }}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition text-sm"
                  disabled={trip.status === 'ASSIGNED'}
                >
                  <Upload className="w-4 h-4 inline mr-1" />
                  Upload Receipt
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t pt-6">
          <div className="flex flex-wrap gap-2">
            {trip.status === 'ASSIGNED' && (
              <>
                <button
                  onClick={handleAcceptTrip}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-600 font-medium"
                >
                  Accept Trip
                </button>
                <button
                  onClick={() => {
                    setPhotoType('truck')
                    setShowPhotoModal(true)
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Upload Truck Photo
                </button>
                <button
                  onClick={handleStartTrip}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Start Trip
                </button>
              </>
            )}

            {trip.status === 'IN_TRANSIT' && (
              <>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Track Location
                </button>
                <button
                  onClick={() => {
                    setPhotoType('receipt')
                    setShowPhotoModal(true)
                  }}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-600 font-medium flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload POD
                </button>
                <button
                  onClick={handleMarkDelivered}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Mark as Delivered
                </button>
                <button
                  onClick={() => setShowIssueModal(true)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  Report Issue
                </button>
              </>
            )}

            <button
              onClick={() => {
                const comment = prompt('Add comment or note:')
                if (comment) {
                  alert('Comment added: ' + comment)
                }
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Add Comment
            </button>
          </div>
        </div>
      </div>

      {/* GPS Tracking Section */}
      {trip.status === 'IN_TRANSIT' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary" />
            Live GPS Tracking
          </h2>
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <div className="mb-4">
              <Navigation className="w-12 h-12 mx-auto text-primary animate-pulse" />
            </div>
            <p className="font-semibold mb-2">Tracking Active</p>
            <p className="text-sm text-gray-600">
              GPS updates every 2-5 minutes. Your location is being tracked.
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium">Current Location</p>
              <p className="text-gray-600">Highway NH-44, 250km from destination</p>
            </div>
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      <Modal
        isOpen={showPhotoModal}
        onClose={() => {
          setShowPhotoModal(false)
          setPhotoType(null)
        }}
        title={photoType === 'truck' ? 'Upload Truck Photo' : 'Upload Delivery Receipt'}
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Requirements:</strong>
            </p>
            <ul className="text-xs text-blue-700 mt-2 list-disc list-inside space-y-1">
              {photoType === 'truck' ? (
                <>
                  <li>Photo must show truck and number plate clearly</li>
                  <li>Cargo should be visible in the photo</li>
                  <li>File formats: JPEG, PNG (Max 2MB)</li>
                </>
              ) : (
                <>
                  <li>Photo of signed delivery receipt</li>
                  <li>Receipt should be clearly readable</li>
                  <li>File formats: JPEG, PNG (Max 2MB)</li>
                </>
              )}
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Photo
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={(e) => handlePhotoUpload(photoType, e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> Photo will be tagged with Trip ID, Driver ID, Timestamp, and GPS Location automatically.
            </p>
          </div>
        </div>
      </Modal>

      {/* Issue Reporting Modal */}
      <Modal
        isOpen={showIssueModal}
        onClose={() => {
          setShowIssueModal(false)
          setComments('')
        }}
        title="Report Issue"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Type
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option>Breakdown</option>
              <option>Delay</option>
              <option>Damaged Goods</option>
              <option>Route Blockage</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Describe the issue..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo (Optional)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleReportIssue}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Report Issue
            </button>
            <button
              onClick={() => {
                setShowIssueModal(false)
                setComments('')
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default TripDetails

