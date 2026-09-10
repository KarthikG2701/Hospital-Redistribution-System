import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function MedicineInventoryMatrix({ nodes = [] }) {
  if (!nodes.length) return null;
  const medicines = Object.keys(nodes[0].inventory);

  return (
    <div className="bg-[#020617] border border-slate-800 rounded-xl shadow-2xl overflow-hidden font-mono text-slate-200">
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <span className="ml-2 text-xs text-slate-400 tracking-widest uppercase">SYS.INVENTORY_MATRIX</span>
        </div>
        <span className="text-[10px] text-emerald-400">DATABASE SYNCED</span>
      </div>
      
      <div className="overflow-x-auto p-4">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0f172a] text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="p-3 border-b border-slate-800">Facility</th>
              {medicines.map(med => (
                <th key={med} className="p-3 border-b border-slate-800">{med} Level</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {nodes.map((node, i) => (
              <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                <td className="p-3 font-semibold text-slate-300">{node.hospital}</td>
                {medicines.map(med => {
                  const data = node.inventory[med];
                  
                  const isCritical = data.status.includes('Deficit') || data.days_to_stockout <= 7;
                  const isSurplus = data.status === 'Surplus';
                  
                  return (
                    <td key={med} className="p-3">
                      <div className="flex items-center gap-2">
                        {isCritical ? (
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                        ) : isSurplus ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                        )}
                        <div>
                          <div className={`font-bold ${isCritical ? 'text-red-400' : isSurplus ? 'text-emerald-400' : 'text-blue-400'}`}>
                            {data.current_stock} units
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {data.days_to_stockout} days left
                          </div>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}