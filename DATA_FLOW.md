# FWMS Data Flow Documentation

## Overview
All modules are now connected through a centralized `DataContext` that manages the flow of data across the entire system.

## Connected Data Flows

### 1. Farmer → Warehouse (Storage Request Flow)
- **Farmer creates storage request** (`/farmer/storage-request`)
  - Data added to `storageRequests` in DataContext
  - Status: "Pending Approval"
  
- **Warehouse sees pending requests**
  - Displayed in Warehouse Dashboard
  - Shows in "Pending Storage Requests" section
  
- **Warehouse creates intake entry** (`/warehouse/intake`)
  - Links to storage request if found
  - Creates inventory entry
  - Auto-approves related storage request
  - Status updates flow back to farmer

### 2. Warehouse → Transport (Transfer Request Flow)
- **Warehouse creates transfer** (`/warehouse/transfers`)
  - Data added to `transferRequests` in DataContext
  - Status: "Pending Approval"
  
- **Admin/Transport Manager approves**
  - Status changes to "Approved"
  - Becomes available for driver assignment

### 3. Transport → Driver (Trip Assignment Flow)
- **Transport assigns driver** (`/transport/dashboard`)
  - Creates trip in `trips` array
  - Links trip to transfer request
  - Updates transfer with trip info
  - Driver sees trip in their dashboard

### 4. Driver → Warehouse (Delivery Flow)
- **Driver accepts trip** (`/driver/trip/:tripId`)
  - Updates trip status to "ASSIGNED"
  
- **Driver starts trip**
  - Updates status to "IN_TRANSIT"
  - GPS tracking begins (mock)
  
- **Driver marks delivered**
  - Updates status to "DELIVERED"
  - Automatically adds inventory to destination warehouse
  - Updates transfer request status
  - Calculates earnings

### 5. Farmer → Warehouse (Dispatch Request Flow)
- **Farmer creates dispatch request** (`/farmer/dispatch`)
  - Data added to `dispatchRequests` in DataContext
  - Status: "Pending Approval"
  
- **Warehouse approves dispatch**
  - Status updates
  - Can trigger external transport assignment

### 6. Admin Overview
- **Admin sees all pending approvals** (`/admin/approvals`)
  - Storage requests
  - Transfer requests
  - Dispatch requests
  - Can approve/reject all requests

## Key Features

### Data Context (`src/contexts/DataContext.jsx`)
Centralized state management for:
- `storageRequests` - Farmer storage requests
- `inventory` - Warehouse inventory (shared across warehouses)
- `transferRequests` - Inter-warehouse transfers
- `trips` - Driver trip assignments
- `dispatchRequests` - Farmer dispatch requests

### Connected Modules
1. **Farmer Dashboard** - Uses inventory and storageRequests
2. **Warehouse Dashboard** - Uses inventory, storageRequests, transferRequests
3. **Transport Dashboard** - Uses transferRequests and trips
4. **Driver Dashboard** - Uses trips from DataContext
5. **Admin Dashboard** - Sees all requests and approvals

### Status Flow
```
Storage Request: Pending Approval → Approved → Added to Inventory
Transfer Request: Pending Approval → Approved → In Transit → Delivered → Inventory Updated
Trip: ASSIGNED → IN_TRANSIT → DELIVERED → Inventory Added
```

## Usage
All modules automatically stay in sync through the DataContext. Changes in one module immediately reflect in others that use the same data.

