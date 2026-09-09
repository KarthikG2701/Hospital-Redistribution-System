import { create } from 'zustand';
import { initialDashboardData } from '../data/mockData';

export const useDashboardStore = create((set) => ({
  // Load the initial mock data into state
  hospitals: initialDashboardData.hospitals,
  bloodInventory: initialDashboardData.bloodInventory,
  amcBottlenecks: initialDashboardData.amcBottlenecks,
  ambulances: initialDashboardData.ambulances,

  // Action: Deduct an ICU bed (Simulating an ambulance arrival)
  admitPatient: (hospitalId) => set((state) => ({
    hospitals: state.hospitals.map((hosp) => {
      if (hosp.id === hospitalId && hosp.beds.icu.occupied < hosp.beds.icu.total) {
        return {
          ...hosp,
          beds: {
            ...hosp.beds,
            icu: { ...hosp.beds.icu, occupied: hosp.beds.icu.occupied + 1 }
          }
        };
      }
      return hosp;
    })
  })),

  // Action: One-Click Blood Transfer
  transferBlood: (bloodId) => set((state) => ({
    bloodInventory: state.bloodInventory.filter(blood => blood.id !== bloodId)
  })),

  // Action: Drop Oxygen Pressure manually
  dropOxygen: (hospitalId, amount) => set((state) => ({
    hospitals: state.hospitals.map(hosp => 
      hosp.id === hospitalId 
        ? { ...hosp, oxygenPressure: Math.max(0, hosp.oxygenPressure - amount) }
        : hosp
    )
  })),

  // --- HACKATHON MAGIC: DUAL TIMERS ---

  // 1. The Data Tick (Runs every 3 seconds to update numbers)
  progressSimulation: () => set((state) => {
    // Drop oxygen for Bowring Hospital to trigger a UI alert
    const updatedHospitals = state.hospitals.map(hosp => {
      if (hosp.id === "HOSP-BLR-02" && hosp.oxygenPressure > 15) {
        return { ...hosp, oxygenPressure: hosp.oxygenPressure - 1 };
      }
      return hosp;
    });

    // Countdown the ETA for ambulances
    const updatedAmbulances = state.ambulances.map(amb => {
      if (amb.etaMins > 0) {
        return { ...amb, etaMins: amb.etaMins - 1 };
      }
      return amb;
    });

    return { hospitals: updatedHospitals, ambulances: updatedAmbulances };
  }),

  // 2. The Smooth Vector Animation Tick (Runs every 100ms)
  moveAmbulances: () => set((state) => {
    // We need the exact coordinates of the hospitals to drive towards them
    const hospitalLocations = {
      "Victoria Hospital": [12.9634, 77.5755],
      "Bowring & Lady Curzon": [12.9814, 77.6033],
      "NIMHANS": [12.9385, 77.5956]
    };

    // SPEED CONTROLLER: Lower this number to make them move even slower
    const SPEED = 0.000015; 

    const updatedAmbulances = state.ambulances.map(amb => {
      const target = hospitalLocations[amb.destination];
      
      // Calculate distance to the destination using geometry
      const dLat = target[0] - amb.coordinates[0];
      const dLng = target[1] - amb.coordinates[1];
      const distance = Math.sqrt(dLat * dLat + dLng * dLng);

      // REDIRECTION LOGIC: If ambulance is hovering over the hospital (distance is tiny)
      if (distance < 0.002) {
        let nextDestination = "";
        
        // If at Bowring, divert to Victoria
        if (amb.destination === "Bowring & Lady Curzon") nextDestination = "Victoria Hospital";
        // If at NIMHANS, divert to Victoria
        else if (amb.destination === "NIMHANS") nextDestination = "Victoria Hospital";
        // If at Victoria, bounce back to Bowring so the loop never stops during your pitch
        else nextDestination = "Bowring & Lady Curzon";

        return {
          ...amb,
          destination: nextDestination,
          status: "Diverted (ICU Full)", // Instantly changes the popup status!
          etaMins: 15 // Reset the ETA clock
        };
      }

      // If it hasn't arrived yet, keep driving smoothly toward the target
      const moveLat = (dLat / distance) * SPEED;
      const moveLng = (dLng / distance) * SPEED;

      return {
        ...amb,
        coordinates: [amb.coordinates[0] + moveLat, amb.coordinates[1] + moveLng]
      };
    });

    return { ambulances: updatedAmbulances };
  })
}));