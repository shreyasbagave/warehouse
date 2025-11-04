import { useState } from 'react'
import { 
  CreditCard,
  Download,
  Printer,
  IndianRupee,
  FileText,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const BillingPayments = () => {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState('invoices')

  const [invoices] = useState([
    {
      id: 1,
      invoiceNo: 'INV-2024-001',
      type: 'Storage Fee',
      amount: 2500,
      product: 'Wheat',
      quantity: '50 tonnes',
      period: '2024-01-15 to 2024-01-27',
      status: 'Paid',
      paymentDate: '2024-01-27',
      paymentMethod: 'UPI'
    },
    {
      id: 2,
      invoiceNo: 'INV-2024-002',
      type: 'Storage Fee',
      amount: 1800,
      product: 'Rice',
      quantity: '30 tonnes',
      period: '2024-01-20 to 2024-01-27',
      status: 'Pending',
      dueDate: '2024-01-30'
    },
    {
      id: 3,
      invoiceNo: 'INV-2024-003',
      type: 'Transport Fee',
      amount: 1500,
      product: 'Wheat Transfer',
      quantity: '25 tonnes',
      period: '2024-01-26',
      status: 'Paid',
      paymentDate: '2024-01-26',
      paymentMethod: 'Net Banking'
    },
    {
      id: 4,
      invoiceNo: 'INV-2024-004',
      type: 'Storage Fee (Cold)',
      amount: 3500,
      product: 'Soybeans',
      quantity: '25 tonnes',
      period: '2024-01-25 to 2024-01-27',
      status: 'Paid',
      paymentDate: '2024-01-27',
      paymentMethod: 'Credit Card'
    }
  ])

  const [paymentMethods] = useState([
    { id: 'upi', name: 'UPI', icon: '💳' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
    { id: 'wallet', name: 'Wallet', icon: '📱' }
  ])

  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0)
  const totalPending = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0)

  const handlePayment = (invoiceId) => {
    alert(`Processing payment for invoice ${invoiceId}...`)
  }

  const handleDownload = (invoiceId) => {
    alert(`Downloading invoice ${invoiceId}...`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Download className="w-4 h-4 inline mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Printer className="w-4 h-4 inline mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalPaid.toLocaleString()}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalPending.toLocaleString()}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(totalPaid + totalPending).toLocaleString()}
              </p>
            </div>
            <IndianRupee className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setSelectedTab('invoices')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                selectedTab === 'invoices'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Invoices
            </button>
            <button
              onClick={() => setSelectedTab('payment')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                selectedTab === 'payment'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Make Payment
            </button>
          </nav>
        </div>

        {selectedTab === 'invoices' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{invoice.invoiceNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{invoice.type}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{invoice.product}</div>
                        <div className="text-xs text-gray-500">{invoice.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{invoice.period}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        ₹{invoice.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {invoice.status === 'Paid' ? (
                          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Paid
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownload(invoice.invoiceNo)}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {invoice.status === 'Pending' && (
                            <button
                              onClick={() => handlePayment(invoice.id)}
                              className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-green-600 text-sm"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'payment' && (
          <div className="p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Select Invoice to Pay</h3>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4">
                  <option>Select an invoice</option>
                  {invoices.filter(i => i.status === 'Pending').map(invoice => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.invoiceNo} - ₹{invoice.amount.toLocaleString()} - {invoice.product}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-medium">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice Amount</span>
                    <span className="font-medium">₹1,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="font-medium">₹324</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-bold text-lg">₹2,124</span>
                  </div>
                </div>
              </div>

              <button className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-600 font-medium">
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BillingPayments

