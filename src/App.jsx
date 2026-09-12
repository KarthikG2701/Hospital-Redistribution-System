import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Activity, Map as MapIcon, TrendingUp, Package, LogOut, AlertTriangle, Play, Pause, SkipBack, SkipForward } from 'lucide-react';

import TerminalLogin from './components/TerminalLogin';
import MedicineInventoryMatrix from './components/MedicineInventoryMatrix';
import ShortageForecastChart from './components/ShortageForecastChart';
import RedistributionMap from './components/RedistributionMap';
import InterventionAlerts from './components/InterventionAlerts';
import simulationTimeline from './data/liveDashboardData.json';

const DashboardLayout = ({ children, onLogout, currentDay, setCurrentDay, isPlaying, setIsPlaying, maxDays, currentData }) => {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Command Center', icon: Activity },
    { path: '/inventory', label: 'Inventory Matrix', icon: Package },
    { path: '/forecast', label: 'Predictive Models', icon: TrendingUp },
    { path: '/logistics', label: 'Full Topology Map', icon: MapIcon },
  ];

  return (
    <div className="flex h-screen bg-[#000000] text-slate-200 font-mono overflow-hidden">
      <aside className="w-64 bg-[#020617] border-r border-slate-800 flex flex-col shadow-2xl z-10 shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-base font-black text-slate-100 tracking-wider uppercase leading-snug">
            Predictive <span className="text-emerald-500">Healthcare</span> Dashboard
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded text-xs tracking-wider transition-all duration-200 ${
                  isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:bg-slate-900 hover:text-emerald-300'
                }`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-600'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded text-xs tracking-wider text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="bg-[#0f172a] border-b border-slate-800 p-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3 w-1/4">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
            <span className="text-xs tracking-widest text-slate-400 uppercase font-bold">Time Engine</span>
          </div>
          
          <div className="flex items-center gap-6 flex-1 max-w-2xl justify-center">
            <button onClick={() => setCurrentDay(0)} className="text-slate-500 hover:text-emerald-400 transition-colors"><SkipBack className="w-4 h-4" /></button>
            <button onClick={() => setIsPlaying(!isPlaying)} className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2 rounded-full hover:bg-emerald-500/20 transition-all">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button onClick={() => setCurrentDay(maxDays)} className="text-slate-500 hover:text-emerald-400 transition-colors"><SkipForward className="w-4 h-4" /></button>
            
            <input 
              type="range" min="0" max={maxDays} 
              value={currentDay} 
              onChange={(e) => { setCurrentDay(Number(e.target.value)); setIsPlaying(false); }} 
              className="flex-1 accent-emerald-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="w-1/4 text-right">
            <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase bg-emerald-950/30 px-3 py-1.5 rounded border border-emerald-900/50">
              DAY {currentDay}: {currentData.date}
            </span>
          </div>
        </div>

        <main className="flex-1 overflow-auto bg-[#000000] p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentDay, setCurrentDay] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const maxDays = simulationTimeline.length - 1;

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentDay(prev => {
          if (prev >= maxDays) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500); 
    }
    return () => clearInterval(interval);
  }, [isPlaying, maxDays]);

  const currentData = simulationTimeline[currentDay] || simulationTimeline[0];

  const criticalNodes = currentData.nodes.flatMap(node => {
    const criticalMeds = Object.entries(node.inventory)
      .filter(([med, data]) => data.status.includes('Deficit'))
      .map(([med, data]) => ({ name: med, ...data }));
    if (criticalMeds.length > 0) return [{ hospital: node.hospital, criticalMeds }];
    return [];
  });

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <TerminalLogin onLoginSuccess={() => setIsAuthenticated(true)} /> : <Navigate to="/" replace />} />
        
        <Route path="/*" element={isAuthenticated ? (
          <DashboardLayout 
            onLogout={() => setIsAuthenticated(false)}
            currentDay={currentDay} setCurrentDay={setCurrentDay}
            isPlaying={isPlaying} setIsPlaying={setIsPlaying}
            maxDays={maxDays} currentData={currentData}
          >
            <Routes>
              <Route path="/" element={
                <div className="space-y-6 max-w-[1600px] mx-auto h-full flex flex-col">
                  <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                    <div>
                      <h1 className="text-lg font-bold text-emerald-400 tracking-widest uppercase">Executive Dashboard</h1>
                      <p className="text-xs text-slate-500 mt-1">Active risk factors and predictive inventory modeling.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                      <ShortageForecastChart nodes={currentData.nodes} />
                      <MedicineInventoryMatrix nodes={currentData.nodes} />
                    </div>
                    <div className="lg:col-span-1 h-[700px] bg-[#020617] border border-slate-800 rounded-xl shadow-2xl flex flex-col">
                      <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${criticalNodes.length > 0 ? 'bg-red-500/80 animate-pulse' : 'bg-emerald-500/80'}`}></div>
                          <span className={`text-xs tracking-widest uppercase font-bold ${criticalNodes.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>Critical Diagnostics</span>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase">{criticalNodes.length} Nodes at Risk</span>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin transition-all">
                        {criticalNodes.length === 0 ? (
                          <div className="text-emerald-500 text-xs text-center mt-10">NETWORK STABLE. NO CRITICAL DEFICITS.</div>
                        ) : (
                          criticalNodes.map((node, i) => (
                            <div key={i} className="border border-red-900/30 bg-red-950/10 rounded-lg p-3 animate-fade-in">
                              <h3 className="text-red-400 font-bold text-xs uppercase mb-2 border-b border-red-900/30 pb-2 flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3" /> {node.hospital}
                              </h3>
                              <div className="space-y-3 mt-2">
                                {node.criticalMeds.map((med, j) => (
                                  <div key={j} className="text-[10px]">
                                    <div className="flex justify-between text-slate-300 font-semibold mb-1">
                                      <span>{med.name}</span>
                                      <span className="text-red-400">{med.current_stock} units left</span>
                                    </div>
                                    <div className="text-slate-500">
                                      <span className="text-red-400/80 mr-1">&gt;</span> 
                                      {med.status === 'Critical Deficit' ? `Stockout imminent. Current trajectory depletion in ${med.days_to_stockout} days.` : `Day-7 projection drops below threshold.`}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              } />

              <Route path="/inventory" element={<div className="max-w-7xl mx-auto"><MedicineInventoryMatrix nodes={currentData.nodes} /></div>} />
              <Route path="/forecast" element={<div className="max-w-7xl mx-auto"><ShortageForecastChart nodes={currentData.nodes} /></div>} />
              
              <Route path="/logistics" element={
                <div className="max-w-[1600px] mx-auto flex flex-col">
                  <div className="mb-4 border-b border-slate-800 pb-2 shrink-0">
                    <h1 className="text-lg font-bold text-emerald-400 tracking-widest uppercase">Topology & Routing</h1>
                    <p className="text-xs text-slate-500 mt-1">Live spatial visualization and execution logs.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
                    <div className="lg:col-span-2 h-[500px] lg:h-[750px]">
                      <RedistributionMap nodes={currentData.nodes} routes={currentData.routes} />
                    </div>
                    <div className="lg:col-span-1 h-[500px] lg:h-[750px]">
                      <InterventionAlerts routes={currentData.routes} logs={currentData.logs} />
                    </div>
                  </div>
                </div>
              } />
              
            </Routes>
          </DashboardLayout>
        ) : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}