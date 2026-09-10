import React from 'react';
import { Clock, ShieldAlert, ArrowRight } from 'lucide-react';

export default function InterventionAlerts({ routes = [], logs = [] }) {
  return (
    <div className="flex flex-col h-full bg-[#020617] border border-slate-800 rounded-xl shadow-2xl overflow-hidden font-mono text-slate-200">
      {/* Terminal Window Header Bar */}
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <span className="ml-2 text-xs text-slate-400 tracking-widest uppercase">SYS.ROUTING_FEED</span>
        </div>
        <span className="text-[10px] text-emerald-400">OSRM ACTIVE</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-6">
        <div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Verified Interventions</h3>
          {routes.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No active redistribution required.</p>
          ) : (
            <div className="space-y-3">
              {routes.map((route, i) => (
                <div key={i} className="p-3 bg-[#0f172a] border border-slate-800 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-emerald-400 text-xs">{route.medicine}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      route.confidence === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {route.confidence} Viability
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-300 mb-3">
                    <span className="truncate">{route.from}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                    <span className="truncate font-semibold text-white">{route.to}</span>
                  </div>

                  <div className="flex gap-4 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {route.total_time}m travel
                    </div>
                    <div className="flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-red-400/80" />
                      +{route.traffic_delay}m delay
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Engine Execution Feed</h3>
          <div className="bg-[#000000] border border-slate-900 rounded-lg p-3 h-40 overflow-y-auto text-[10px] leading-relaxed">
            {logs.map((log, i) => {
              const isWarning = log.includes("rejected") || log.includes("CRITICAL");
              return (
                <div key={i} className={`mb-1.5 ${isWarning ? 'text-red-400' : 'text-emerald-500'}`}>
                  <span className="opacity-40 text-slate-600 mr-2">{'>'}</span>
                  {log}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}