import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend,
  PieChart, Pie, Cell 
} from 'recharts';

// Global color dictionary to sync the Pie Chart and Line Chart
const medColors = {
  "Amoxicillin": "#3b82f6",      // Blue
  "Insulin": "#ec4899",          // Pink
  "O-Negative Blood": "#ef4444", // Red
  "Azithromycin": "#eab308",     // Yellow
  "Propofol": "#a855f7"          // Purple
};

export default function ShortageForecastChart({ nodes = [] }) {
  if (!nodes.length) return null;

  const [selectedHospital, setSelectedHospital] = useState(nodes[0].hospital);
  const medicines = Object.keys(nodes[0].inventory);
  
  const hospitalData = nodes.find(n => n.hospital === selectedHospital) || nodes[0];

  // Data for the Multi-Line Trajectory
  const chartData = useMemo(() => {
    const transformed = [];
    const daysCount = hospitalData.inventory[medicines[0]].forecast.length;
    
    for (let i = 0; i < daysCount; i++) {
      const dayObj = { date: hospitalData.inventory[medicines[0]].forecast[i].date };
      medicines.forEach(med => {
        dayObj[med] = hospitalData.inventory[med].forecast[i].projected_stock;
      });
      transformed.push(dayObj);
    }
    return transformed;
  }, [hospitalData, medicines]);

  // Data for the Donut Pie Chart
  const pieData = useMemo(() => {
    return medicines.map(med => ({
      name: med,
      value: hospitalData.inventory[med].current_stock
    }));
  }, [hospitalData, medicines]);

  // Calculate total for the center of the Donut
  const totalStock = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full bg-[#020617] border border-slate-800 rounded-xl shadow-2xl overflow-hidden font-mono text-slate-200">
      {/* Terminal Window Header Bar */}
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <span className="ml-2 text-xs text-slate-400 tracking-widest uppercase">SYS.PREDICTIVE_MODELS</span>
        </div>

        {/* Dynamic Hospital Selector */}
        <select 
          className="bg-[#020617] border border-slate-700 text-slate-200 text-xs rounded px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          value={selectedHospital}
          onChange={(e) => setSelectedHospital(e.target.value)}
        >
          {nodes.map(node => (
            <option key={node.hospital} value={node.hospital}>{node.hospital}</option>
          ))}
        </select>
      </div>

      <div className="p-6 flex flex-col xl:flex-row gap-8">
        
        {/* Left Column: Donut Pie Chart */}
        <div className="w-full xl:w-1/3 flex flex-col">
          <div className="mb-2 text-xs text-slate-400">
            <span>TARGET: <strong className="text-white">{selectedHospital}</strong></span>
            <div className="text-[10px] mt-1 text-slate-500 tracking-widest uppercase">CURRENT STOCK RATIO</div>
          </div>

          <div className="w-full h-[280px] relative mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={105}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={medColors[entry.name]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', color: '#f8fafc', fontSize: '11px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white">{totalStock}</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Total Units</span>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Line Chart */}
        <div className="w-full xl:w-2/3 flex flex-col">
          <div className="mb-4 text-xs text-slate-400">
            <div className="text-[10px] mt-1 text-emerald-500 tracking-widest uppercase font-bold">15-DAY PREDICTIVE TRAJECTORY</div>
          </div>

          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', color: '#f8fafc', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
                
                {/* Day-7 Predictive Stockout Threshold Line */}
                <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} />
                
                {medicines.map(med => (
                  <Line 
                    key={med}
                    type="monotone" 
                    dataKey={med} 
                    stroke={medColors[med] || "#10b981"} 
                    strokeWidth={2} 
                    dot={{ r: 2, fill: medColors[med] || "#10b981", stroke: "#020617", strokeWidth: 1 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}