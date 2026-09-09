import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function TerminalLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Require at least some input to proceed
    if (!password) {
      setError(true);
      return;
    }

    setIsAuthenticating(true);
    setError(false);

    // Simulate a brief authentication delay for the terminal effect
    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-4 bg-black pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-gray-950 border border-emerald-900/40 rounded-lg shadow-2xl shadow-emerald-900/10 overflow-hidden font-mono"
      >
        {/* Terminal Header */}
        <div className="bg-gray-900 px-4 py-2 border-b border-emerald-900/50 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <span className="ml-2 text-xs text-emerald-500/60 font-semibold tracking-widest">SYS.AUTH_TERMINAL</span>
        </div>

        {/* Terminal Body */}
        <div className="p-8 text-emerald-500">
          <div className="mb-6 space-y-2 opacity-80 text-sm">
            <p>INITIALIZING SECURE CONNECTION...</p>
            <p>ESTABLISHING ENCRYPTED LINK...</p>
            <p>CONNECTION ESTABLISHED.</p>
            <p className="pt-2 text-emerald-400">PLEASE ENTER CREDENTIALS TO ACCESS REGIONAL SUPPLY PREDICT.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-bold">root@system:~$</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isAuthenticating}
                className="flex-1 bg-transparent border-none outline-none text-emerald-400 focus:ring-0 placeholder-emerald-900 w-full"
                placeholder="Enter password..."
                autoFocus
              />
            </div>
            
            {error && (
              <p className="mt-4 text-red-500 text-sm">ACCESS DENIED: Valid credentials required.</p>
            )}

            {isAuthenticating && (
              <p className="mt-4 text-emerald-400 text-sm animate-pulse">AUTHENTICATING... PLEASE WAIT...</p>
            )}
            
            {/* Hidden submit button to allow Enter key submission */}
            <button type="submit" className="hidden">Submit</button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}