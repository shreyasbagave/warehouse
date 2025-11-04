// Maharashtra Districts Data
export const maharashtraDistricts = [
  { name: 'Pune', districts: ['Pune', 'Pimpri-Chinchwad', 'Baramati', 'Shirur', 'Daund'] },
  { name: 'Mumbai', districts: ['Mumbai', 'Thane', 'Navi Mumbai', 'Kalyan', 'Vasai'] },
  { name: 'Nashik', districts: ['Nashik', 'Malegaon', 'Igatpuri', 'Sinnar', 'Yeola'] },
  { name: 'Nagpur', districts: ['Nagpur', 'Wardha', 'Kamptee', 'Katol', 'Umred'] },
  { name: 'Aurangabad', districts: ['Aurangabad', 'Jalna', 'Gangapur', 'Kannad', 'Sillod'] },
  { name: 'Kolhapur', districts: ['Kolhapur', 'Ichalkaranji', 'Shirol', 'Gadhinglaj', 'Kagal'] },
  { name: 'Sangli', districts: ['Sangli', 'Miraj', 'Tasgaon', 'Vita', 'Kavathe Mahankal'] },
  { name: 'Satara', districts: ['Satara', 'Karad', 'Wai', 'Mahabaleshwar', 'Phaltan'] },
  { name: 'Solapur', districts: ['Solapur', 'Barshi', 'Akalkot', 'Pandharpur', 'Malshiras'] },
  { name: 'Amravati', districts: ['Amravati', 'Daryapur', 'Anjangaon', 'Morshi', 'Chandurbazar'] },
  { name: 'Akola', districts: ['Akola', 'Akot', 'Balapur', 'Murtijapur', 'Telhara'] },
  { name: 'Yavatmal', districts: ['Yavatmal', 'Wani', 'Umarkhed', 'Digras', 'Ghatanji'] },
  { name: 'Latur', districts: ['Latur', 'Ahmadpur', 'Udgir', 'Ausa', 'Renapur'] },
  { name: 'Osmanabad', districts: ['Osmanabad', 'Tuljapur', 'Omerga', 'Paranda', 'Bhum'] },
  { name: 'Nanded', districts: ['Nanded', 'Mudkhed', 'Kinwat', 'Himayatnagar', 'Deglur'] },
  { name: 'Beed', districts: ['Beed', 'Gevrai', 'Ambajogai', 'Kaij', 'Parli'] },
  { name: 'Jalgaon', districts: ['Jalgaon', 'Bhusawal', 'Amalner', 'Erandol', 'Yawal'] },
  { name: 'Dhule', districts: ['Dhule', 'Nandurbar', 'Shahada', 'Sakri', 'Shirpur'] },
  { name: 'Ahmednagar', districts: ['Ahmednagar', 'Shrirampur', 'Kopargaon', 'Sangamner', 'Rahata'] },
  { name: 'Parbhani', districts: ['Parbhani', 'Jintur', 'Gangakhed', 'Purna', 'Pathri'] },
  { name: 'Hingoli', districts: ['Hingoli', 'Kalamnuri', 'Sengaon', 'Basmath', 'Aundha'] },
  { name: 'Nandurbar', districts: ['Nandurbar', 'Navapur', 'Taloda', 'Shahada', 'Akkalkuwa'] },
  { name: 'Gadchiroli', districts: ['Gadchiroli', 'Aheri', 'Chamorshi', 'Dhanora', 'Sironcha'] },
  { name: 'Chandrapur', districts: ['Chandrapur', 'Ballarpur', 'Warora', 'Bhadravati', 'Gondpipri'] },
  { name: 'Bhandara', districts: ['Bhandara', 'Tumsar', 'Pauni', 'Lakhandur', 'Mohadi'] },
  { name: 'Gondia', districts: ['Gondia', 'Tiroda', 'Amgaon', 'Goregaon', 'Arjuni'] },
  { name: 'Washim', districts: ['Washim', 'Mangrulpir', 'Karanja', 'Risod', 'Malegaon'] },
  { name: 'Buldhana', districts: ['Buldhana', 'Chikhli', 'Malkapur', 'Khamgaon', 'Jalgaon'] },
  { name: 'Jalna', districts: ['Jalna', 'Ambad', 'Ghansawangi', 'Jafferabad', 'Mantha'] },
  { name: 'Ratnagiri', districts: ['Ratnagiri', 'Khed', 'Dapoli', 'Chiplun', 'Guhagar'] },
  { name: 'Sindhudurg', districts: ['Sindhudurg', 'Malvan', 'Vengurla', 'Kudal', 'Devgad'] },
  { name: 'Raigad', districts: ['Raigad', 'Alibaug', 'Pen', 'Panvel', 'Mahad'] },
  { name: 'Palghar', districts: ['Palghar', 'Vasai', 'Dahanu', 'Talasari', 'Jawhar'] }
]

// Generate warehouse data - exactly 300 warehouses
export const generateWarehouses = () => {
  const warehouses = []
  let warehouseId = 1

  // Calculate total district locations
  const allDistricts = []
  maharashtraDistricts.forEach((region) => {
    region.districts.forEach((district) => {
      allDistricts.push({ region: region.name, district })
    })
  })

  // Distribute warehouses evenly (approximately 2-3 per location)
  const warehousesPerLocation = Math.floor(300 / allDistricts.length)
  const remainder = 300 % allDistricts.length

  allDistricts.forEach((loc, idx) => {
    const count = warehousesPerLocation + (idx < remainder ? 1 : 0)
    
    for (let i = 0; i < count; i++) {
      const capacity = Math.floor(Math.random() * 1000) + 500 // 500-1500 tonnes
      const occupied = Math.floor(capacity * (0.5 + Math.random() * 0.3)) // 50-80% utilization
      const available = capacity - occupied
      const utilization = Math.round((occupied / capacity) * 100)

      warehouses.push({
        id: `WH-${String(warehouseId).padStart(3, '0')}`,
        name: `${loc.district} Warehouse ${i + 1}`,
        location: loc.district,
        region: loc.region,
        district: loc.district,
        capacity: capacity,
        occupied: occupied,
        available: available,
        utilization: utilization,
        products: [
          { product: 'Wheat', quantity: Math.floor(occupied * 0.5), unit: 'tonnes' },
          { product: 'Rice', quantity: Math.floor(occupied * 0.3), unit: 'tonnes' },
          { product: 'Soybeans', quantity: Math.floor(occupied * 0.15), unit: 'tonnes' },
          { product: 'Corn', quantity: Math.floor(occupied * 0.05), unit: 'tonnes' }
        ]
      })
      warehouseId++
    }
  })

  return warehouses.slice(0, 300) // Ensure exactly 300
}

export const warehouseData = generateWarehouses()

// Get warehouses by region
export const getWarehousesByRegion = (regionName) => {
  return warehouseData.filter(w => w.region === regionName)
}

// Get warehouses by district
export const getWarehousesByDistrict = (districtName) => {
  return warehouseData.filter(w => w.district === districtName)
}

// Get warehouse statistics
export const getWarehouseStats = () => {
  const totalCapacity = warehouseData.reduce((sum, w) => sum + w.capacity, 0)
  const totalOccupied = warehouseData.reduce((sum, w) => sum + w.occupied, 0)
  const totalAvailable = warehouseData.reduce((sum, w) => sum + w.available, 0)
  const avgUtilization = warehouseData.reduce((sum, w) => sum + w.utilization, 0) / warehouseData.length

  return {
    totalWarehouses: warehouseData.length,
    totalCapacity,
    totalOccupied,
    totalAvailable,
    avgUtilization: Math.round(avgUtilization),
    regions: [...new Set(warehouseData.map(w => w.region))].length,
    districts: [...new Set(warehouseData.map(w => w.district))].length
  }
}

export default warehouseData

