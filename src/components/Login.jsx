import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Biohazard, ShieldAlert, Activity } from 'lucide-react';

const Pathogen = ({ delay, x, y, size, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.2, 1],
      x: x, 
      y: y 
    }}
    transition={{ 
      duration: 8, 
      repeat: Infinity, 
      delay: delay 
    }}
    className={`absolute rounded-full blur-xl ${color}`}
    style={{ width: size, height: size }}
  />
);

export default function Login({ onLogin }) {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 flex items-center justify-center overflow-hidden">
      {/* Hovering Pathogens Background */}
      <Pathogen delay={0} x={[-100, 100, -100]} y={[-50, 50, -50]} size="300px" color="bg-emerald-900/20" />
      <Pathogen delay={2} x={[200, -200, 200]} y={[100, -100, 100]} size="250px" color="bg-green-900/20" />
      <Pathogen delay={4} x={[-150, 150, -150]} y={[150, -150, 150]} size="350px" color="bg-lime-900/10" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-md px-4"
      >
        <Card className="bg-slate-900/80 border-emerald-900/50 backdrop-blur-md text-white shadow-[0_0_50px_rgba(16,185,129,0.1)]">
          <CardHeader className="text-center space-y-1">
            <div className="flex justify-center mb-4">
              <Biohazard className="w-12 h-12 text-emerald-500 animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tighter text-emerald-500">
              BIO-SECURE ACCESS
            </CardTitle>
            <p className="text-slate-400 text-sm">System Clearance Required</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-emerald-700 font-bold">Node Identifier</label>
              <input 
                type="text" 
                className="w-full bg-slate-950 border border-emerald-900/50 rounded-md p-2 text-emerald-400 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                placeholder="ADMIN_NODE_01"
              />
            </div>
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold tracking-widest border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all"
              onClick={onLogin}
            >
              INITIALIZE SYNC
            </Button>
            <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-900 font-mono">
              <ShieldAlert size={12} /> ENCRYPTION ACTIVE
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}