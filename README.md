# Farmer Warehouse Management System (FWMS) - Frontend

A comprehensive frontend **mockup** application for managing farmer warehouses, inventory, transport, and billing operations.

**⚠️ Mockup Mode**: This is a frontend-only application with **no authentication required**. All pages are accessible directly for demonstration purposes.

## Features

### Farmer Module
- Dashboard with stored produce overview
- Storage request management
- Dispatch request handling
- Movement tracking

### Warehouse Manager Module
- Dashboard with capacity utilization
- Inventory management
- New intake entry creation
- Internal transfer management
- IoT sensor data display (temperature, humidity)

### Transport Management
- Internal transfers tracking
- External dispatches management
- Vehicle and driver assignment
- Real-time location tracking

### Admin Module
- Centralized view of all warehouses
- User management
- Approval workflows
- Analytics and reporting

### Billing & Payments
- Invoice management
- Payment processing (UPI, Card, Net Banking)
- Payment history
- PDF download

### Reports & Analytics
- Warehouse occupancy reports
- Revenue analysis
- Product distribution
- Transport performance
- Quality and spoilage trends
- Exportable reports (Excel, PDF)

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Recharts** - Charts and analytics
- **Lucide React** - Icons

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd fwms-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3001`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
fwms-frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx
│   │   └── layout/
│   │       ├── Header.jsx
│   │       ├── Layout.jsx
│   │       └── Sidebar.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── admin/
│   │   │   └── AdminDashboard.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── billing/
│   │   │   └── BillingPayments.jsx
│   │   ├── farmer/
│   │   │   └── FarmerDashboard.jsx
│   │   ├── reports/
│   │   │   └── Reports.jsx
│   │   ├── transport/
│   │   │   └── TransportDashboard.jsx
│   │   └── warehouse/
│   │       └── WarehouseDashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## User Roles

### 1. Farmer
- View stored produce
- Request new storage
- Request dispatch/sale
- Track movements
- View invoices and payments

### 2. Warehouse Manager
- Manage warehouse inventory
- Create storage intake entries
- Manage quality checks
- Approve dispatch requests
- Generate storage slips
- View IoT sensor data

### 3. Transport Manager
- Manage internal transfers
- Manage external dispatches
- Assign vehicles
- Track shipments

### 4. Admin
- View all warehouses
- Manage users
- Approve inter-warehouse transfers
- View analytics and reports
- Configure pricing rules

## Mockup Mode - No Authentication Required

**All pages are accessible without login!** 

- Navigate directly to any page using the sidebar menu
- All pages use mock data for demonstration
- Login page is available but optional (no real authentication)
- Sidebar shows all modules (Farmer, Warehouse, Transport, Admin) for easy navigation
- Default route redirects to `/farmer/dashboard`

### Quick Navigation

You can directly access:
- `/farmer/dashboard` - Farmer Dashboard
- `/warehouse/dashboard` - Warehouse Dashboard  
- `/transport/dashboard` - Transport Dashboard
- `/admin/dashboard` - Admin Dashboard
- `/billing` - Billing & Payments
- `/reports` - Reports & Analytics

Or use the sidebar menu to navigate to any page.

## Features Implementation Status

✅ All pages accessible without authentication (Mockup Mode)
✅ Complete navigation with sidebar showing all modules
✅ Farmer Dashboard & Operations
✅ Warehouse Manager Dashboard & Operations
✅ Transport Management
✅ Admin Dashboard & Operations
✅ Billing & Payments UI
✅ Reports & Analytics
✅ Responsive UI with Tailwind CSS
✅ Charts and visualizations
✅ Mock data for all modules

## Future Enhancements

- Backend API integration
- Real-time notifications
- Advanced filtering and search
- Multi-language support (English, Marathi, Hindi)
- Mobile app version
- IoT sensor data real-time updates
- Payment gateway integration

## License

This project is part of the FWMS system.

