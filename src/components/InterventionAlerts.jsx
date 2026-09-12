import React from 'react';
import { Clock, ArrowRight, Terminal as TermIcon } from 'lucide-react';

export default function InterventionAlerts({ routes = [], logs = [] }) {
  const formatLog = (log) => {
    if (log.includes('SYS.ALERT') || log.includes('CRITICAL SYSTEM FAILURE')) {
      return <span className="text-red-500 font-bold animate-pulse">{log}</span>;
    }
    if (log.includes('rejected')) {
      const parts = log.split('rejected:');
      return (
        <>
          <span className="text-slate-400">{parts[0]} <span className="text-red-400 font-bold">REJECTED:</span></span>
          <span className="text-red-300/80">{parts[1]}</span>
        </>
      );
    }
    if (log.includes('dispatch')) {
      const parts = log.split('dispatch:');
      return (
        <>
          <span className="text-slate-400">{parts[0]} <span className="text-emerald-400 font-bold">DISPATCH:</span></span>
          <span className="text-emerald-300/80">{parts[1]}</span>
        </>
      );
    }
    return <span className="text-slate-400">{log}</span>;
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] border border-slate-800 rounded-xl shadow-2xl overflow-hidden font-mono text-slate-200">
      
      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <span className="ml-2 text-xs text-slate-400 tracking-widest uppercase font-bold">Routing Feed</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-emerald-400 tracking-widest font-bold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          OSRM ACTIVE
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col p-4 gap-6">
        
        <div className="flex-1 flex flex-col overflow-hidden">
           <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <TermIcon className="w-3 h-3" /> Execution Terminal
           </h3>
           <div className="flex-1 bg-[#000000] border border-slate-800/80 rounded-lg p-3 overflow-y-auto scrollbar-thin text-[11px] leading-relaxed shadow-inner">
            {logs.length === 0 ? (
              <span className="text-slate-600 italic">No operations recorded.</span>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="mb-2 font-mono flex items-start gap-2">
                  <span className="text-slate-700 select-none">{`>`}</span>
                  <div className="flex-1">{formatLog(log)}</div>
                </div>
              ))
            )}
           </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
           <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Clock className="w-3 h-3" /> Active Logistics Vectors
           </h3>
           <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2 pr-2">
            {routes.length === 0 ? (
              <div className="text-xs text-slate-500 italic border border-slate-800/50 bg-[#0f172a]/30 p-3 rounded-lg text-center">
                No active redistribution vectors.
              </div>
            ) : (
              routes.map((route, i) => (
                <div key={i} className="p-3 bg-[#0f172a] border border-slate-800 rounded-lg shadow-sm flex flex-col gap-2 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50 group-hover:bg-emerald-500 transition-colors"></div>
                  
                  <div className="flex justify-between items-center pl-2">
                    <span className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider">{route.medicine}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${
                      route.confidence === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {route.confidence} CONF
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs pl-2">
                    <span className="text-slate-400 truncate flex-1">{route.from}</span>
                    <ArrowRight className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="text-white font-semibold truncate flex-1 text-right">{route.to}</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] pl-2 pt-1 border-t border-slate-800/80 mt-1">
                    <div className="text-slate-400"><span className="text-slate-500">BASE:</span> {route.base_time}m</div>
                    <div className="text-yellow-500/80"><span className="text-yellow-600/80">DELAY:</span> +{route.traffic_delay}m</div>
                    <div className="text-emerald-400 font-bold"><span className="text-emerald-600">ETA:</span> {route.total_time}m</div>
                  </div>
                </div>
              ))
            )}
           </div>
        </div>

      </div>
    </div>
  );
}