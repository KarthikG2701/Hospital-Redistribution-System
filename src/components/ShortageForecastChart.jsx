import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { forecastData } from "../data/predictiveMockData";

export default function ShortageForecastChart() {
  const [selectedMedicine, setSelectedMedicine] = useState("Amoxicillin");
  const data = forecastData[selectedMedicine];

  return (
    <Card className="col-span-2 bg-gray-900 border-gray-800 text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-emerald-400 text-lg tracking-wider">FORECAST & UNCERTAINTY BOUNDS</CardTitle>
        <select 
          className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-md px-3 py-1 outline-none focus:border-emerald-500"
          value={selectedMedicine}
          onChange={(e) => setSelectedMedicine(e.target.value)}
        >
          {Object.keys(forecastData).map(med => (
            <option key={med} value={med}>{med}</option>
          ))}
        </select>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="day" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '20px' }} />
            <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" label="Stockout" />
            
            {/* Dynamic Rendering Based on Selection */}
            {selectedMedicine === "Amoxicillin" && (
              <>
                <Area type="monotone" dataKey="Aster_Max" name="Uncertainty Bound" fill="#ef4444" fillOpacity={0.1} stroke="none" />
                <Area type="monotone" dataKey="Aster_Min" name="" fill="#000000" fillOpacity={0.5} stroke="none" />
                <Line type="monotone" dataKey="Aster CMI" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Manipal Hospital" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="NIMHANS" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </>
            )}

            {selectedMedicine === "Insulin" && (
              <>
                <Area type="monotone" dataKey="Victoria_Max" name="Uncertainty Bound" fill="#ef4444" fillOpacity={0.1} stroke="none" />
                <Area type="monotone" dataKey="Victoria_Min" name="" fill="#000000" fillOpacity={0.5} stroke="none" />
                <Line type="monotone" dataKey="Victoria Hospital" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Apollo Hospital" stroke="#10b981" strokeWidth={2} dot={false} />
              </>
            )}

            {selectedMedicine === "Metformin" && (
              <Line type="monotone" dataKey="Fortis Hospital" stroke="#3b82f6" strokeWidth={2} dot={false} />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}