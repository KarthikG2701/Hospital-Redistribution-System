// src/data/mockData.js

export const initialDashboardData = {
  hospitals: [
    {
      id: "HOSP-BLR-01",
      name: "Victoria Hospital",
      coordinates: [12.9634, 77.5755], // Bengaluru coords
      oxygenPressure: 88, 
      beds: {
        icu: { total: 50, occupied: 48 },
        hdu: { total: 40, occupied: 35 },
        general: { total: 200, occupied: 180 }
      }
    },
    {
      id: "HOSP-BLR-02",
      name: "Bowring & Lady Curzon",
      coordinates: [12.9814, 77.6033],
      oxygenPressure: 42, 
      beds: {
        icu: { total: 40, occupied: 40 }, 
        hdu: { total: 30, occupied: 29 },
        general: { total: 250, occupied: 240 }
      }
    },
    {
      id: "HOSP-BLR-03",
      name: "NIMHANS",
      coordinates: [12.9385, 77.5956],
      oxygenPressure: 95, 
      beds: {
        icu: { total: 30, occupied: 15 }, 
        hdu: { total: 20, occupied: 10 },
        general: { total: 150, occupied: 80 }
      }
    }
  ],
  
  bloodInventory: [
    { id: "BLD-1", hospital: "Bowring & Lady Curzon", type: "O-", units: 2, expires_in_days: 1, status: "Critical" },
    { id: "BLD-2", hospital: "Victoria Hospital", type: "AB-", units: 5, expires_in_days: 4, status: "Stable" },
    { id: "BLD-3", hospital: "NIMHANS", type: "O-", units: 15, expires_in_days: 12, status: "Stable" },
    { id: "BLD-4", hospital: "Bowring & Lady Curzon", type: "A-", units: 1, expires_in_days: 2, status: "Critical" }
  ],

  amcBottlenecks: [
    { id: "EQ-01", hospital: "Victoria Hospital", equipment: "MRI Scanner (GE)", daysOffline: 45, blocker: "Awaiting Finance Signature", status: "Critical" },
    { id: "EQ-02", hospital: "Bowring & Lady Curzon", equipment: "Ventilator (Philips)", daysOffline: 12, blocker: "Vendor Parts Delayed", status: "Warning" },
    { id: "EQ-03", hospital: "NIMHANS", equipment: "Portable CT Scanner", daysOffline: 8, blocker: "Pending AMC Renewal", status: "Warning" }
  ],

  ambulances: [
    { id: "AMB-108-A", coordinates: [12.9700, 77.5800], destination: "Bowring & Lady Curzon", etaMins: 12, type: "ALS", status: "En Route" },
    { id: "AMB-108-B", coordinates: [12.9450, 77.5850], destination: "NIMHANS", etaMins: 5, type: "BLS", status: "En Route" }
  ]
};