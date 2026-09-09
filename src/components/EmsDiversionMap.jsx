import React from 'react';
import { useDashboardStore } from '../store/useDashboardStore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // CRITICAL: Leaflet needs this CSS to render properly
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Navigation } from 'lucide-react';

// Custom glowing icons for the map
const hospitalIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div class="bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const ambulanceIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div class="bg-red-500 w-3 h-3 rounded-full border-2 border-white animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

export default function EmsDiversionMap() {
  const hospitals = useDashboardStore((state) => state.hospitals);
  const ambulances = useDashboardStore((state) => state.ambulances);

  // Center the map on Bengaluru
  const centerCoordinates = [12.9600, 77.5900];

  return (
    <Card className="col-span-12 lg:col-span-4 bg-slate-900 border-slate-800 text-white flex flex-col overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Navigation className="text-blue-400 h-5 w-5" />
          Active EMS Diversion
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 min-h-[350px] relative">
        <MapContainer 
          center={centerCoordinates} 
          zoom={12} 
          style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
          zoomControl={false}
        >
          {/* Dark Mode Map Tiles from CartoDB */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          {/* Render Hospitals */}
          {hospitals.map((hosp) => (
            <Marker key={hosp.id} position={hosp.coordinates} icon={hospitalIcon}>
              <Popup className="text-slate-900 font-bold">
                {hosp.name} <br/> ICU Beds: {hosp.beds.icu.total - hosp.beds.icu.occupied} Available
              </Popup>
            </Marker>
          ))}

          {/* Render Ambulances */}
          {ambulances.map((amb) => (
            <Marker key={amb.id} position={amb.coordinates} icon={ambulanceIcon}>
              <Popup className="text-slate-900 font-bold">
                {amb.id} ({amb.type}) <br/> Dest: {amb.destination} <br/> ETA: {amb.etaMins} mins
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
}