import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Truck, Upload, FileText, X, Home } from 'lucide-react'

const DriverRegister = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    licenseNumber: '',
    vehicleNumber: '',
    vehicleType: 'truck',
    dlDocument: null,
    rcDocument: null,
    insuranceDocument: null
  })
  
  const [documents, setDocuments] = useState({
    dl: null,
    rc: null,
    insurance: null
  })
  
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  const handleFileChange = (type, file) => {
    if (!file) return
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      setErrors({ ...errors, [type]: 'Only JPEG, PNG, or PDF files allowed' })
      return
    }
    
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setErrors({ ...errors, [type]: 'File size must be less than 2MB' })
      return
    }
    
    setDocuments({ ...documents, [type]: file })
    setErrors({ ...errors, [type]: null })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    const newErrors = {}
    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.mobile || formData.mobile.length !== 10) newErrors.mobile = 'Valid 10-digit mobile number required'
    if (!formData.licenseNumber) newErrors.license = 'Driving license number is required'
    if (!formData.vehicleNumber) newErrors.vehicle = 'Vehicle number is required'
    if (!documents.dl) newErrors.dlDoc = 'Driver License document is required'
    if (!documents.rc) newErrors.rcDoc = 'RC document is required'
    if (!documents.insurance) newErrors.insDoc = 'Insurance document is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Mock registration - In real app, this would upload files and register
    setShowSuccess(true)
    
    // Simulate registration success
    setTimeout(() => {
      const driverUser = {
        id: Date.now(),
        name: formData.name,
        role: 'driver',
        mobile: formData.mobile,
        license: formData.licenseNumber,
        vehicleNumber: formData.vehicleNumber,
        status: 'pending_verification',
        email: `${formData.mobile}@fwms.com`
      }
      
      login(driverUser)
      navigate('/driver/dashboard')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Link
          to="/farmer/dashboard"
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 text-gray-700 transition"
        >
          <Home className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary p-3 rounded-full mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Registration</h1>
          <p className="text-gray-600 mt-2">Register as a driver for FWMS</p>
        </div>

        {showSuccess ? (
          <div className="text-center py-12">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
              <div className="text-green-600 text-4xl mb-2">✓</div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Registration Submitted!</h3>
              <p className="text-sm text-green-700">
                Your registration is under review. Admin will verify your documents and approve your profile.
              </p>
              <p className="text-xs text-green-600 mt-2">
                Redirecting to dashboard...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="10-digit mobile"
                    maxLength="10"
                    required
                  />
                  {errors.mobile && <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>}
                </div>
              </div>
            </div>

            {/* Vehicle & License Information */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-4">Vehicle & License Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driving License Number *
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="DL-XXXXXXXXX"
                    required
                  />
                  {errors.license && <p className="text-xs text-red-600 mt-1">{errors.license}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="MH-XX-XX-XXXX"
                    required
                  />
                  {errors.vehicle && <p className="text-xs text-red-600 mt-1">{errors.vehicle}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type
                  </label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="truck">Truck</option>
                    <option value="tempo">Tempo</option>
                    <option value="container">Container Truck</option>
                    <option value="refrigerated">Refrigerated Truck</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Upload Documents *</h3>
              <p className="text-xs text-gray-500 mb-4">Upload JPEG/PNG/PDF files (Max 2MB each)</p>
              
              <div className="space-y-4">
                {/* Driver License */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Driver License (DL) *
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                        onChange={(e) => handleFileChange('dl', e.target.files[0])}
                        className="hidden"
                      />
                      <div className="px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition text-center">
                        <Upload className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {documents.dl ? documents.dl.name : 'Click to upload DL'}
                        </span>
                      </div>
                    </label>
                    {documents.dl && (
                      <button
                        type="button"
                        onClick={() => setDocuments({ ...documents, dl: null })}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {errors.dlDoc && <p className="text-xs text-red-600 mt-1">{errors.dlDoc}</p>}
                  {errors.dl && <p className="text-xs text-red-600 mt-1">{errors.dl}</p>}
                </div>

                {/* RC Document */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Truck RC (Registration Certificate) *
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                        onChange={(e) => handleFileChange('rc', e.target.files[0])}
                        className="hidden"
                      />
                      <div className="px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition text-center">
                        <Upload className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {documents.rc ? documents.rc.name : 'Click to upload RC'}
                        </span>
                      </div>
                    </label>
                    {documents.rc && (
                      <button
                        type="button"
                        onClick={() => setDocuments({ ...documents, rc: null })}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {errors.rcDoc && <p className="text-xs text-red-600 mt-1">{errors.rcDoc}</p>}
                  {errors.rc && <p className="text-xs text-red-600 mt-1">{errors.rc}</p>}
                </div>

                {/* Insurance Document */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Insurance Copy *
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                        onChange={(e) => handleFileChange('insurance', e.target.files[0])}
                        className="hidden"
                      />
                      <div className="px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition text-center">
                        <Upload className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {documents.insurance ? documents.insurance.name : 'Click to upload Insurance'}
                        </span>
                      </div>
                    </label>
                    {documents.insurance && (
                      <button
                        type="button"
                        onClick={() => setDocuments({ ...documents, insurance: null })}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {errors.insDoc && <p className="text-xs text-red-600 mt-1">{errors.insDoc}</p>}
                  {errors.insurance && <p className="text-xs text-red-600 mt-1">{errors.insurance}</p>}
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> Your registration will be reviewed by Admin/Transport Manager. 
                  You will receive notification once your profile is approved.
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-600 font-medium"
              >
                Submit Registration
              </button>
              <button
                type="button"
                onClick={() => navigate('/driver/login')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default DriverRegister

