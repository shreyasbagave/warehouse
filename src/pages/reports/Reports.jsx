import { useState } from 'react'
import { 
  Download,
  FileText,
  BarChart3,
  TrendingUp,
  Calendar,
  Filter
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('occupancy')
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-31'
  })

  const occupancyData = [
    { month: 'Jan', utilization: 65 },
    { month: 'Feb', utilization: 70 },
    { month: 'Mar', utilization: 68 },
    { month: 'Apr', utilization: 72 },
    { month: 'May', utilization: 75 },
    { month: 'Jun', utilization: 78 }
  ]

  const revenueData = [
    { month: 'Jan', revenue: 1250000 },
    { month: 'Feb', revenue: 1350000 },
    { month: 'Mar', revenue: 1420000 },
    { month: 'Apr', revenue: 1500000 },
    { month: 'May', revenue: 1650000 },
    { month: 'Jun', revenue: 1720000 }
  ]

  const productDistribution = [
    { name: 'Wheat', value: 35 },
    { name: 'Rice', value: 28 },
    { name: 'Soybeans', value: 20 },
    { name: 'Corn', value: 12 },
    { name: 'Other', value: 5 }
  ]

  const transportData = [
    { month: 'Jan', internal: 45, external: 120 },
    { month: 'Feb', internal: 52, external: 135 },
    { month: 'Mar', internal: 48, external: 142 },
    { month: 'Apr', internal: 55, external: 150 },
    { month: 'May', internal: 60, external: 165 },
    { month: 'Jun', internal: 65, external: 175 }
  ]

  const qualityData = [
    { grade: 'A', count: 850, percentage: 70 },
    { grade: 'B', count: 280, percentage: 23 },
    { grade: 'C', count: 90, percentage: 7 }
  ]

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

  const handleExport = (format) => {
    alert(`Exporting ${selectedReport} report as ${format}...`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Filter className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
          >
            <Download className="w-4 h-4 inline mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex gap-4">
          {[
            { id: 'occupancy', label: 'Warehouse Occupancy', icon: BarChart3 },
            { id: 'revenue', label: 'Revenue Analysis', icon: TrendingUp },
            { id: 'products', label: 'Product Distribution', icon: FileText },
            { id: 'transport', label: 'Transport Performance', icon: BarChart3 },
            { id: 'quality', label: 'Quality & Spoilage', icon: FileText }
          ].map((report) => {
            const Icon = report.icon
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  selectedReport === report.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {report.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Report Content */}
      {selectedReport === 'occupancy' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Warehouse Occupancy Report</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="utilization" fill="#10b981" name="Utilization %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Top Warehouses by Utilization</h3>
            <div className="space-y-4">
              {[
                { name: 'WH-104, Mumbai', utilization: 78 },
                { name: 'WH-103, Nagpur', utilization: 75 },
                { name: 'WH-101, Pune', utilization: 72 },
                { name: 'WH-105, Aurangabad', utilization: 68 },
                { name: 'WH-102, Nashik', utilization: 65 }
              ].map((wh, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                  <span className="font-medium">{wh.name}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${wh.utilization}%` }}
                      ></div>
                    </div>
                    <span className="font-medium">{wh.utilization}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'revenue' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Revenue Analysis</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹8,889,000</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Average Monthly</p>
              <p className="text-3xl font-bold text-gray-900">₹1,481,500</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Growth Rate</p>
              <p className="text-3xl font-bold text-green-600">+15.2%</p>
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'products' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Product Distribution</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={productDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
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
            <h3 className="text-lg font-semibold mb-4">Product Statistics</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { product: 'Wheat', quantity: 35000, warehouses: 120, duration: '45 days' },
                    { product: 'Rice', quantity: 28000, warehouses: 95, duration: '38 days' },
                    { product: 'Soybeans', quantity: 20000, warehouses: 75, duration: '52 days' },
                    { product: 'Corn', quantity: 12000, warehouses: 50, duration: '40 days' }
                  ].map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{item.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.quantity.toLocaleString()} tonnes</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.warehouses}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'transport' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Transport Performance</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={transportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="internal" fill="#3b82f6" name="Internal Transfers" />
                <Bar dataKey="external" fill="#10b981" name="External Dispatches" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Total Transfers</p>
              <p className="text-3xl font-bold text-gray-900">1,225</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Internal</p>
              <p className="text-3xl font-bold text-blue-600">325</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">External</p>
              <p className="text-3xl font-bold text-green-600">900</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">On-Time Delivery</p>
              <p className="text-3xl font-bold text-gray-900">94%</p>
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'quality' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quality & Spoilage Trends</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {qualityData.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Grade {item.grade}</span>
                    <span className="text-2xl font-bold text-primary">{item.percentage}%</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.count.toLocaleString()} items</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Spoilage Report</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Total Spoilage This Month</p>
                  <p className="text-sm text-gray-600">Across all warehouses</p>
                </div>
                <span className="text-2xl font-bold text-red-600">2.5%</span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Spoiled Quantity</p>
                  <p className="text-sm text-gray-600">In tonnes</p>
                </div>
                <span className="text-xl font-bold">312 tonnes</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports

