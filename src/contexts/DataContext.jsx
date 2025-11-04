import { createContext, useContext, useState } from 'react'
import warehouseData from '../data/warehouses'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  // Warehouses - initialize with static data
  const [warehouses, setWarehouses] = useState(warehouseData)
  // Storage Requests (Farmer → Warehouse)
  const [storageRequests, setStorageRequests] = useState([
    {
      id: 1,
      farmerId: 'FARM-001',
      farmerName: 'Rajesh Kumar',
      product: 'Wheat',
      quantity: 50,
      unit: 'tonnes',
      warehouse: 'WH-101',
      storageType: 'normal',
      quality: 'A',
      expectedDate: '2024-01-28',
      requestDate: '2024-01-26',
      status: 'Pending Approval'
    },
    {
      id: 2,
      farmerId: 'FARM-002',
      farmerName: 'Priya Singh',
      product: 'Rice',
      quantity: 30,
      unit: 'tonnes',
      warehouse: 'WH-101',
      storageType: 'cold',
      quality: 'A',
      expectedDate: '2024-01-29',
      requestDate: '2024-01-27',
      status: 'Pending Approval'
    }
  ])

  // Inventory (Warehouse storage)
  const [inventory, setInventory] = useState([
    {
      id: 1,
      farmerId: 'FARM-001',
      farmer: 'Rajesh Kumar',
      product: 'Wheat',
      quantity: 50,
      unit: 'tonnes',
      storedDate: '2024-01-15',
      quality: 'A',
      status: 'Stored',
      location: 'Section A-12',
      warehouse: 'WH-101',
      intakeId: 'INTAKE-001'
    },
    {
      id: 2,
      farmerId: 'FARM-002',
      farmer: 'Priya Singh',
      product: 'Rice',
      quantity: 30,
      unit: 'tonnes',
      storedDate: '2024-01-20',
      quality: 'A',
      status: 'Pending QC',
      location: 'Section B-05',
      warehouse: 'WH-101',
      intakeId: 'INTAKE-002'
    }
  ])

  // Transfer Requests (Warehouse → Transport)
  const [transferRequests, setTransferRequests] = useState([
    {
      id: 1,
      transferId: 'TRF-001',
      from: 'WH-101, Pune',
      fromWarehouse: 'WH-101',
      to: 'WH-103, Nagpur',
      toWarehouse: 'WH-103',
      product: 'Wheat',
      quantity: 25,
      requestDate: '2024-01-26',
      requestedBy: 'Warehouse Manager',
      status: 'Pending Approval',
      vehicle: null,
      driver: null,
      tripId: null
    },
    {
      id: 2,
      transferId: 'TRF-002',
      from: 'WH-102, Nashik',
      fromWarehouse: 'WH-102',
      to: 'WH-101, Pune',
      toWarehouse: 'WH-101',
      product: 'Rice',
      quantity: 30,
      requestDate: '2024-01-27',
      requestedBy: 'Warehouse Manager',
      status: 'In Transit',
      vehicle: 'TRK-5678',
      driver: 'Suresh Patel',
      tripId: 'TRP-002',
      estimatedArrival: '2024-01-29'
    }
  ])

  // Driver Trips (initialized from existing transfers)
  const [trips, setTrips] = useState([
    {
      id: 1,
      tripId: 'TRP-001',
      type: 'Internal',
      transferId: null,
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
      driverId: null,
      driverName: null,
      assignedDate: '2024-01-27'
    },
    {
      id: 2,
      tripId: 'TRP-002',
      type: 'Internal',
      transferId: 'TRF-002',
      from: 'WH-102, Nashik',
      to: 'WH-101, Pune',
      product: 'Rice',
      quantity: 30,
      scheduledStart: '2024-01-27 10:00',
      scheduledEnd: '2024-01-27 16:00',
      status: 'IN_TRANSIT',
      distance: 180,
      paymentRate: 15,
      vehicleNumber: 'TRK-5678',
      driverId: 1,
      driverName: 'Suresh Patel',
      assignedDate: '2024-01-27',
      currentLocation: 'Highway NH-44, 120km away'
    }
  ])

  // Dispatch Requests (Farmer → Warehouse)
  const [dispatchRequests, setDispatchRequests] = useState([
    {
      id: 1,
      farmerId: 'FARM-001',
      farmerName: 'Rajesh Kumar',
      inventoryId: 1,
      product: 'Wheat',
      quantity: 25,
      unit: 'tonnes',
      from: 'WH-101, Pune',
      to: 'Market Hub, Delhi',
      requestDate: '2024-01-27',
      status: 'Pending Approval'
    }
  ])

  // Functions to manage data flow
  const addStorageRequest = (request) => {
    const newRequest = {
      ...request,
      id: Date.now(),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending Approval'
    }
    setStorageRequests([...storageRequests, newRequest])
    return newRequest
  }

  const approveStorageRequest = (requestId, paymentAmount) => {
    setStorageRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { 
          ...req, 
          status: paymentAmount === null ? 'Rejected' : 'Approved',
          paymentAmount: paymentAmount,
          approvedDate: new Date().toISOString().split('T')[0]
        } : req
      )
    )
  }

  const addInventory = (item) => {
    const newItem = {
      ...item,
      id: Date.now(),
      intakeId: `INTAKE-${Date.now()}`,
      storedDate: new Date().toISOString().split('T')[0],
      status: 'Stored'
    }
    setInventory([...inventory, newItem])
    return newItem
  }

  const createTransferRequest = (transfer) => {
    const newTransfer = {
      ...transfer,
      id: Date.now(),
      transferId: `TRF-${String(Date.now()).slice(-6)}`,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending Approval',
      vehicle: null,
      driver: null,
      tripId: null
    }
    setTransferRequests([...transferRequests, newTransfer])
    return newTransfer
  }

  const approveTransfer = (transferId) => {
    setTransferRequests(prev =>
      prev.map(t =>
        t.id === transferId
          ? { ...t, status: 'Approved', awaitingDriver: true, approvedDate: new Date().toISOString().split('T')[0] }
          : t
      )
    )
  }

  const rejectTransfer = (transferId) => {
    setTransferRequests(prev =>
      prev.map(t =>
        t.id === transferId
          ? { ...t, status: 'Rejected', rejectedDate: new Date().toISOString().split('T')[0] }
          : t
      )
    )
  }

  const assignTripToDriver = (transferId, driverId, driverName, vehicleNumber) => {
    // Create trip
    const transfer = transferRequests.find(t => t.id === transferId)
    if (!transfer) return null

    const newTrip = {
      id: Date.now(),
      tripId: `TRP-${String(Date.now()).slice(-6)}`,
      type: 'Internal',
      transferId: transfer.transferId,
      from: transfer.from,
      to: transfer.to,
      product: transfer.product,
      quantity: transfer.quantity,
      scheduledStart: new Date().toISOString(),
      scheduledEnd: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      status: 'ASSIGNED',
      distance: 180, // Mock calculation
      paymentRate: 15,
      vehicleNumber: vehicleNumber,
      driverId: driverId,
      driverName: driverName,
      assignedDate: new Date().toISOString().split('T')[0]
    }

    setTrips([...trips, newTrip])

    // Update transfer with trip info
    setTransferRequests(prev =>
      prev.map(t =>
        t.id === transferId
          ? {
              ...t,
              status: 'In Transit',
              vehicle: vehicleNumber,
              driver: driverName,
              tripId: newTrip.tripId
            }
          : t
      )
    )

    return newTrip
  }

  const updateTripStatus = (tripId, status, updates = {}) => {
    setTrips(prev =>
      prev.map(trip =>
        trip.tripId === tripId
          ? { ...trip, status, ...updates }
          : trip
      )
    )

    // If trip is delivered, update inventory
    if (status === 'DELIVERED' && updates.deliveredDate) {
      const trip = trips.find(t => t.tripId === tripId)
      if (trip) {
        // Find corresponding transfer
        const transfer = transferRequests.find(t => t.tripId === tripId)
        if (transfer) {
          // Add to destination warehouse inventory
          addInventory({
            farmerId: 'TRANSFER',
            farmer: `Transferred from ${transfer.from}`,
            product: trip.product,
            quantity: trip.quantity,
            unit: 'tonnes',
            quality: 'A',
            location: 'Section A-01',
            warehouse: transfer.toWarehouse,
            storedDate: updates.deliveredDate
          })

          // Update transfer status
          setTransferRequests(prev =>
            prev.map(t =>
              t.tripId === tripId ? { ...t, status: 'Delivered' } : t
            )
            )
        }
      }
    }
  }

  const addDispatchRequest = (request) => {
    const newRequest = {
      ...request,
      id: Date.now(),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending Approval'
    }
    setDispatchRequests([...dispatchRequests, newRequest])
    return newRequest
  }

  const approveDispatch = (dispatchId) => {
    setDispatchRequests(prev =>
      prev.map(req =>
        req.id === dispatchId ? { ...req, status: 'Approved' } : req
      )
    )
  }

  // Warehouse Management Functions
  const addWarehouse = (warehouse) => {
    setWarehouses(prev => [...prev, warehouse])
  }

  const updateWarehouse = (warehouseId, updatedWarehouse) => {
    setWarehouses(prev =>
      prev.map(w => w.id === warehouseId ? updatedWarehouse : w)
    )
  }

  const deleteWarehouse = (warehouseId) => {
    setWarehouses(prev => prev.filter(w => w.id !== warehouseId))
  }

  const value = {
    // Data
    warehouses,
    storageRequests,
    inventory,
    transferRequests,
    trips,
    dispatchRequests,

    // Actions
    addStorageRequest,
    approveStorageRequest,
    addInventory,
    createTransferRequest,
    approveTransfer,
    rejectTransfer,
    assignTripToDriver,
    updateTripStatus,
    addDispatchRequest,
    approveDispatch,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

