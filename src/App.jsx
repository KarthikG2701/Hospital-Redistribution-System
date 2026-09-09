import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Activity, Map, TrendingUp, Package, LogOut } from 'lucide-react';

// Import your existing login and new predictive components
import TerminalLogin from './components/TerminalLogin'; // Swap with Login.jsx if preferred
import MedicineInventoryMatrix from './components/MedicineInventoryMatrix';
import ShortageForecastChart from './components/ShortageForecastChart';
import RedistributionMap from './components/RedistributionMap';
import InterventionAlerts from './components/InterventionAlerts';

// Persistent Navigation Layout
const DashboardLayout = ({ children, onLogout }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'System Alerts', icon: Activity },
    { path: '/inventory', label: 'Stock Matrix', icon: Package },
    { path: '/forecast', label: 'Shortage Forecast', icon: TrendingUp },
    { path: '/logistics', label: 'Redistribution', icon: Map },
  ];

  return (
    <div className="flex h-screen bg-black text-gray-100 font-mono overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 bg-gray-950 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-emerald-500 font-bold tracking-widest text-sm">SYS.PREDICT</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive ? 'bg-gray-800 text-emerald-400' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'}`}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={onLogout} className="flex items-center gap-3 text-gray-500 hover:text-red-400 transition-colors w-full px-4 py-2">
            <LogOut size={18} />
            <span className="text-sm">Disconnect</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// Main App Component
export default function App() {
  // Replace this local state with your useDashboardStore logic if applicable
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? (
              <TerminalLogin onLoginSuccess={() => setIsAuthenticated(true)} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={() => setIsAuthenticated(false)}>
                <Routes>
                  {/* Tieing the system together: High-level reasoning on the home page */}
                  <Route path="/" element={<InterventionAlerts />} />
                  {/* Deep dive pages for specific system capabilities */}
                  <Route path="/inventory" element={<MedicineInventoryMatrix />} />
                  <Route path="/forecast" element={<ShortageForecastChart />} />
                  <Route path="/logistics" element={<RedistributionMap />} />
                </Routes>
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}