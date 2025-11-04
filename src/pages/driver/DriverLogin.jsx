import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Truck, Smartphone, Home } from 'lucide-react'

const DriverLogin = () => {
  const [loginType, setLoginType] = useState('mobile') // mobile or license
  const [formData, setFormData] = useState({
    mobile: '',
    license: '',
    otp: '',
    vehicleNumber: ''
  })
  const [step, setStep] = useState('input') // input, otp, verify
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSendOTP = () => {
    if (loginType === 'mobile' && formData.mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }
    if (loginType === 'license' && !formData.license) {
      setError('Please enter driving license number')
      return
    }
    
    // Mock OTP - In real app, this would send OTP via SMS
    setStep('otp')
    setError('')
    alert('OTP sent to your mobile number')
  }

  const handleVerifyOTP = () => {
    if (formData.otp.length !== 6) {
      setError('Please enter 6-digit OTP')
      return
    }
    
    // Mock verification - In real app, this would verify OTP
    const driverUser = {
      id: 1,
      name: 'Ramesh Kumar',
      role: 'driver',
      mobile: formData.mobile || '9876543210',
      license: formData.license || 'DL1234567890',
      vehicleNumber: formData.vehicleNumber || 'TRK-1234',
      email: 'driver@fwms.com'
    }
    
    login(driverUser)
    navigate('/driver/dashboard')
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
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary p-3 rounded-full mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Login</h1>
          <p className="text-gray-600 mt-2">FWMS - Driver Portal</p>
        </div>

        {/* Login Type Selection */}
        <div className="mb-6">
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => {
                setLoginType('mobile')
                setStep('input')
                setError('')
              }}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                loginType === 'mobile'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mobile Number
            </button>
            <button
              onClick={() => {
                setLoginType('license')
                setStep('input')
                setError('')
              }}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                loginType === 'license'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              License Number
            </button>
          </div>
        </div>

        {step === 'input' && (
          <form onSubmit={(e) => { e.preventDefault(); handleSendOTP(); }} className="space-y-6">
            {loginType === 'mobile' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-gray-400 ml-2" />
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driving License Number
                  </label>
                  <input
                    type="text"
                    value={formData.license}
                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter DL number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter truck/vehicle number"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-green-600 transition shadow-lg"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={(e) => { e.preventDefault(); handleVerifyOTP(); }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="000000"
                maxLength="6"
                required
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                OTP sent to {formData.mobile || 'your registered mobile'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep('input')
                  setFormData({ ...formData, otp: '' })
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
              >
                Verify OTP
              </button>
            </div>

            <button
              type="button"
              onClick={handleSendOTP}
              className="w-full text-sm text-primary hover:underline"
            >
              Resend OTP
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            New driver?{' '}
            <button
              onClick={() => navigate('/driver/register')}
              className="text-primary font-medium hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default DriverLogin

