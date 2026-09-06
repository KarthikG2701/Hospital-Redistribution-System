import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { mapNodes } from "../data/predictiveMockData";

const createCustomIcon = (status) => {
  const color = status === 'critical' ? '#ef4444' : status === 'surplus' ? '#10b981' : status === 'warning' ? '#eab308' : '#3b82f6';
  const pulseClass = status === 'critical' ? 'animate-ping' : '';
  
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="position: relative; width: 16px; height: 16px;">
        <div class="${pulseClass}" style="position: absolute; width: 100%; height: 100%; background-color: ${color}; border-radius: 50%; opacity: 0.5;"></div>
        <div style="position: absolute; width: 100%; height: 100%; background-color: ${color}; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color};"></div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

export default function RedistributionMap() {
  const mapCenter = [12.9716, 77.5946]; 
  
  // Calculate distinct transfer routes by matching critical facilities to surplus facilities for specific medicines
  const amoxCritical = mapNodes.find(n => n.status === 'critical' && n.medicine === 'Amoxicillin');
  const amoxSurplus = mapNodes.find(n => n.status === 'surplus' && n.medicine === 'Amoxicillin');
  const amoxRoute = amoxCritical && amoxSurplus ? [[amoxSurplus.lat, amoxSurplus.lng], [amoxCritical.lat, amoxCritical.lng]] : [];

  const insCritical = mapNodes.find(n => n.status === 'critical' && n.medicine === 'Insulin');
  const insSurplus = mapNodes.find(n => n.status === 'surplus' && n.medicine === 'Insulin');
  const insRoute = insCritical && insSurplus ? [[insSurplus.lat, insSurplus.lng], [insCritical.lat, insCritical.lng]] : [];

  return (
    <Card className="col-span-1 bg-gray-900 border-gray-800 text-white flex flex-col h-[400px]">
      <CardHeader>
        <CardTitle className="text-emerald-400 text-lg tracking-wider">LIVE REDISTRIBUTION ROUTES</CardTitle>
      </CardHeader>
      
      {/* Inline style injected to force dark mode on the map tiles */}
      <style>{`.dark-tiles { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); }`}</style>
      
      <CardContent className="flex-grow p-0 m-4 mt-0 rounded-md overflow-hidden border border-gray-800">
        <MapContainer 
          center={mapCenter} 
          zoom={11} 
          style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
          zoomControl={false}
        >
          <TileLayer
            className="dark-tiles"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          {mapNodes.map((node) => (
            <Marker 
              key={node.id} 
              position={[node.lat, node.lng]} 
              icon={createCustomIcon(node.status)}
            >
              <Popup className="font-mono text-gray-900">
                <strong>{node.id}</strong><br/>
                Status: {node.status.toUpperCase()}<br/>
                Medicine: {node.medicine}
              </Popup>
            </Marker>
          ))}

          {amoxRoute.length > 0 && (
            <Polyline positions={amoxRoute} pathOptions={{ color: '#10b981', weight: 3, dashArray: '5, 10' }}>
              <Tooltip sticky>Amoxicillin Transfer</Tooltip>
            </Polyline>
          )}

          {insRoute.length > 0 && (
            <Polyline positions={insRoute} pathOptions={{ color: '#3b82f6', weight: 3, dashArray: '5, 10' }}>
              <Tooltip sticky>Insulin Transfer</Tooltip>
            </Polyline>
          )}
        </MapContainer>
      </CardContent>
    </Card>
  );
}