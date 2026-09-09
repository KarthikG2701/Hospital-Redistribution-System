import React from 'react';
import { useDashboardStore } from '../store/useDashboardStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export default function BedCapacityChart() {
  const hospitals = useDashboardStore((state) => state.hospitals);

  // Transform our Zustand data into the format Recharts needs
  const chartData = hospitals.map((hosp) => ({
    name: hosp.name,
    "ICU (Occupied)": hosp.beds.icu.occupied,
    "ICU (Available)": hosp.beds.icu.total - hosp.beds.icu.occupied,
    "HDU (Step-Down)": hosp.beds.hdu.occupied,
    "General Ward": hosp.beds.general.occupied,
  }));

  return (
    <Card className="col-span-12 lg:col-span-8 bg-slate-900 border-slate-800 text-white">
      <CardHeader>
        <CardTitle className="text-xl">Network Bed Utilization (Tiered Capacity)</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} 
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }}/>
            {/* Stack ID groups them in the same column */}
            <Bar dataKey="ICU (Occupied)" stackId="icu" fill="#ef4444" />
            <Bar dataKey="ICU (Available)" stackId="icu" fill="#22c55e" />
            <Bar dataKey="HDU (Step-Down)" fill="#f59e0b" />
            <Bar dataKey="General Ward" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}