import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend,
  PieChart, Pie, Cell 
} from 'recharts';

const medColors = {
  "Amoxicillin": { top: "#3b82f6", bottom: "#1e3a8a" },      
  "Insulin": { top: "#ec4899", bottom: "#831843" },          
  "O-Negative Blood": { top: "#ef4444", bottom: "#7f1d1d" }, 
  "Azithromycin": { top: "#eab308", bottom: "#713f12" },     
  "Propofol": { top: "#a855f7", bottom: "#4c1d95" }          
};

export default function ShortageForecastChart({ nodes = [] }) {
  if (!nodes.length) return null;

  const [selectedHospital, setSelectedHospital] = useState(nodes[0].hospital);
  const medicines = Object.keys(nodes[0].inventory);
  
  const hospitalData = nodes.find(n => n.hospital === selectedHospital) || nodes[0];

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

  const pieData = useMemo(() => {
    return medicines.map(med => ({
      name: med,
      value: hospitalData.inventory[med].current_stock
    }));
  }, [hospitalData, medicines]);

  const totalStock = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full bg-[#020617] border border-slate-800 rounded-xl shadow-2xl overflow-hidden font-mono text-slate-200">
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <span className="ml-2 text-xs text-slate-400 tracking-widest uppercase font-bold">Predictive Models</span>
        </div>

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
        
        {/* Left Column: Original 2D Donut Chart */}
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
                  paddingAngle={4} 
                  dataKey="value"
                  stroke="#020617" 
                  strokeWidth={2}
                  isAnimationActive={true}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={medColors[entry.name].top} />
                  ))}
                </Pie>

                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', color: '#f8fafc', fontSize: '11px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 mt-3 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white shadow-black drop-shadow-md">{totalStock}</span>
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
                
                <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} />
                
                {medicines.map(med => (
                  <Line 
                    key={med}
                    type="monotone" 
                    dataKey={med} 
                    stroke={medColors[med]?.top || "#10b981"} 
                    strokeWidth={2} 
                    dot={{ r: 2, fill: medColors[med]?.top || "#10b981", stroke: "#020617", strokeWidth: 1 }}
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