import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IndianRupee, CheckCircle, Clock, Download, FileText } from 'lucide-react'

const DriverEarnings = () => {
  const navigate = useNavigate()
  const [earnings] = useState([
    {
      id: 1,
      tripId: 'TRP-003',
      date: '2024-01-27',
      distance: 180,
      rate: 15,
      amount: 2700,
      status: 'PAID',
      paymentDate: '2024-01-30',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 2,
      tripId: 'TRP-002',
      date: '2024-01-26',
      distance: 480,
      rate: 15,
      amount: 7200,
      status: 'PENDING',
      estimatedPayment: '2024-02-02'
    },
    {
      id: 3,
      tripId: 'TRP-001',
      date: '2024-01-25',
      distance: 350,
      rate: 18,
      amount: 6300,
      status: 'PAID',
      paymentDate: '2024-01-29',
      paymentMethod: 'UPI'
    }
  ])

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0)
  const paidAmount = earnings.filter(e => e.status === 'PAID').reduce((sum, e) => sum + e.amount, 0)
  const pendingAmount = earnings.filter(e => e.status === 'PENDING').reduce((sum, e) => sum + e.amount, 0)

  const [selectedPeriod, setSelectedPeriod] = useState('all')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings & Payments</h1>
          <button
            onClick={() => navigate('/driver/dashboard')}
            className="mt-2 text-sm text-gray-600 hover:text-primary"
          >
            ← Back to Dashboard
          </button>
        </div>
        <button
          onClick={() => {
            alert('Downloading earnings statement...')
            // In real app, this would generate and download PDF
          }}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 flex items-center gap-2 font-medium"
        >
          <Download className="w-4 h-4" />
          Download Statement
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalEarnings.toLocaleString()}</p>
            </div>
            <IndianRupee className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid Amount</p>
              <p className="text-2xl font-bold text-green-600">₹{paidAmount.toLocaleString()}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payment</p>
              <p className="text-2xl font-bold text-orange-600">₹{pendingAmount.toLocaleString()}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Trips</p>
              <p className="text-2xl font-bold text-gray-900">{earnings.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Period:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Time</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="last_3_months">Last 3 Months</option>
          </select>
        </div>
      </div>

      {/* Earnings List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trip ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {earnings.map((earning) => (
                <tr key={earning.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{earning.tripId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{earning.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{earning.distance} km</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">₹{earning.rate}/km</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                    ₹{earning.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {earning.status === 'PAID' ? (
                      <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Paid
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {earning.status === 'PAID' ? (
                      <div>
                        <p className="text-xs">{earning.paymentDate}</p>
                        <p className="text-xs text-gray-500">{earning.paymentMethod}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-orange-600">
                        Est: {earning.estimatedPayment}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        // Navigate to trip details or show earnings details
                        const tripId = earning.tripId.replace('TRP-', '')
                        alert(`View details for ${earning.tripId}\nAmount: ₹${earning.amount.toLocaleString()}\nStatus: ${earning.status}`)
                      }}
                      className="text-primary hover:text-green-600 text-sm font-medium"
                    >
                      View
                    </button>
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

export default DriverEarnings

