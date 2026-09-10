import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const hospitalCoordinates = {
  "Victoria Hospital": [12.9634, 77.5744], "Aster CMI (Hebbal)": [13.0416, 77.5912],
  "Manipal Hospital (HAL)": [12.9585, 77.6496], "Apollo (Jayanagar)": [12.9221, 77.5947],
  "Fortis (Bannerghatta)": [12.8943, 77.5979], "NIMHANS": [12.9381, 77.5942],
  "St. John's Medical": [12.9304, 77.6200], "Ramaiah Memorial": [13.0298, 77.5684],
  "Narayana Health": [12.8209, 77.6833], "BGS Gleneagles": [12.9031, 77.4988]
};

const getHospitalSeverity = (inventory) => {
  const statuses = Object.values(inventory).map(med => med.status);
  if (statuses.includes("Critical Deficit") || statuses.includes("Impending Deficit")) return "Critical";
  if (statuses.includes("Surplus")) return "Surplus";
  return "Stable";
};

const createTerminalIcon = (severity) => {
  let bgColor = 'bg-blue-500'; 
  let ring = 'ring-blue-500/30';

  if (severity === 'Critical') {
    bgColor = 'bg-red-500 animate-pulse';
    ring = 'ring-red-500/30';
  } else if (severity === 'Surplus') {
    bgColor = 'bg-emerald-500';
    ring = 'ring-emerald-500/30';
  }

  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div class="w-4 h-4 rounded-full border-2 border-[#020617] shadow-lg ${bgColor} ring-4 ${ring}"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export default function RedistributionMap({ nodes = [], routes = [] }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative z-0 border border-slate-800 bg-[#020617]">
      {/* attributionControl={false} hides the Leaflet/Carto watermark */}
      <MapContainer center={[12.9716, 77.5946]} zoom={11} style={{ width: '100%', height: '100%' }} attributionControl={false}>
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {routes.map((route, i) => {
          const fromCoords = hospitalCoordinates[route.from];
          const toCoords = hospitalCoordinates[route.to];
          if (!fromCoords || !toCoords) return null;

          return (
            <Polyline 
              key={i} positions={[fromCoords, toCoords]}
              pathOptions={{ color: '#10b981', weight: 3, dashArray: '6, 6', opacity: 0.8 }} 
            />
          );
        })}

        {nodes.map((node, index) => {
          const coords = hospitalCoordinates[node.hospital];
          if (!coords) return null;

          return (
            <Marker key={index} position={coords} icon={createTerminalIcon(getHospitalSeverity(node.inventory))}>
              <Popup>
                <div className="font-mono min-w-[210px]">
                  <strong className="block text-xs mb-3 pb-2 border-b border-slate-800 text-emerald-400 uppercase">
                    {node.hospital}
                  </strong>
                  <div className="space-y-3 text-[10px]">
                    {Object.entries(node.inventory).map(([med, data]) => {
                      const isCritical = data.status === 'Critical Deficit' || data.status === 'Impending Deficit';
                      const isSurplus = data.status === 'Surplus';
                      
                      return (
                        <div key={med} className="flex justify-between gap-3 items-center">
                          <span className="text-slate-400 truncate">{med}</span>
                          <div className="flex items-center gap-2">
                            {isCritical && (
                              <span className="text-[8px] uppercase tracking-widest text-red-400 bg-red-400/10 border border-red-500/20 px-1.5 py-0.5 rounded">
                                Critical
                              </span>
                            )}
                            <span className={`font-bold px-2 py-0.5 rounded text-right min-w-[32px] ${
                              isCritical ? 'text-red-400 bg-red-400/10' :
                              isSurplus ? 'text-emerald-400 bg-emerald-400/10' : 
                              'text-blue-400 bg-blue-400/10'
                            }`}>
                              {data.current_stock}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}