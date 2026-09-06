export const inventoryData = [
  { id: 1, facility: "Victoria Hospital", medicine: "Insulin", stock: 250, dailyConsumption: 50, daysOnHand: 5, replenishment: "Delayed", confidence: "Low" },
  { id: 2, facility: "Aster CMI (Hebbal)", medicine: "Amoxicillin", stock: 45, dailyConsumption: 30, daysOnHand: 1.5, replenishment: "Delayed", confidence: "Low" },
  { id: 3, facility: "Manipal Hospital (HAL)", medicine: "Amoxicillin", stock: 8000, dailyConsumption: 100, daysOnHand: 80, replenishment: "Stable", confidence: "High" },
  { id: 4, facility: "Apollo (Jayanagar)", medicine: "Insulin", stock: 1200, dailyConsumption: 40, daysOnHand: 30, replenishment: "Stable", confidence: "High" },
  { id: 5, facility: "Fortis (Bannerghatta)", medicine: "Metformin", stock: 2500, dailyConsumption: 120, daysOnHand: 20.8, replenishment: "Stable", confidence: "High" },
  { id: 6, facility: "NIMHANS", medicine: "Amoxicillin", stock: 1500, dailyConsumption: 80, daysOnHand: 18.7, replenishment: "Expected +3 Days", confidence: "High" }
];

export const forecastData = {
  Amoxicillin: Array.from({ length: 14 }, (_, i) => {
    const asterBase = Math.max(0, 45 - (30 * i));
    return {
      day: `Day ${i + 1}`,
      "Aster CMI": asterBase,
      "Aster_Min": Math.max(0, asterBase - 15),
      "Aster_Max": asterBase + 15,
      "Manipal Hospital": Math.max(0, 8000 - (100 * i)),
      "NIMHANS": Math.max(0, 1500 - (80 * i))
    };
  }),
  Insulin: Array.from({ length: 14 }, (_, i) => {
    const victoriaBase = Math.max(0, 250 - (50 * i));
    return {
      day: `Day ${i + 1}`,
      "Victoria Hospital": victoriaBase,
      "Victoria_Min": Math.max(0, victoriaBase - 20),
      "Victoria_Max": victoriaBase + 20,
      "Apollo Hospital": Math.max(0, 1200 - (40 * i))
    };
  }),
  Metformin: Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    "Fortis Hospital": Math.max(0, 2500 - (120 * i))
  }))
};

export const mapNodes = [
  { id: "Aster CMI", lat: 13.0535, lng: 77.5944, status: "critical", medicine: "Amoxicillin" },
  { id: "Manipal Hospital", lat: 12.9588, lng: 77.6446, status: "surplus", medicine: "Amoxicillin" },
  { id: "Victoria Hospital", lat: 12.9635, lng: 77.5739, status: "critical", medicine: "Insulin" },
  { id: "Apollo Hospital", lat: 12.9226, lng: 77.5944, status: "surplus", medicine: "Insulin" },
  { id: "Fortis Hospital", lat: 12.8942, lng: 77.5982, status: "stable", medicine: "Metformin" },
  { id: "NIMHANS", lat: 12.9372, lng: 77.5954, status: "stable", medicine: "Amoxicillin" }
];
export const alerts = [
  { 
    id: 1, 
    priority: "CRITICAL", 
    facility: "Aster CMI (Hebbal)", 
    message: "Amoxicillin stockout in < 36h. Replenishment delayed.", 
    action: "Redistribute from Manipal Hospital (11km)" 
  },
  { 
    id: 2, 
    priority: "WARNING", 
    facility: "Victoria Hospital", 
    message: "Insulin buffer dropping below 10-day threshold.", 
    action: "Request emergency supply from Apollo Hospital (6km)" 
  }
];