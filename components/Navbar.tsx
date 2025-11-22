import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Download, AlertTriangle, LogOut, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const { emergencyMode, toggleEmergencyMode, currentView, logout, currentUser } = useApp();

  return (
    <nav className={`w-full p-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
      emergencyMode 
        ? 'bg-black border-yellow-600' 
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-lg ${emergencyMode ? 'bg-yellow-600 text-black' : 'bg-nomad-teal text-white'}`}>
          <ShieldCheck size={24} />
        </div>
        <div className="leading-none">
          <h1 className={`font-heading font-bold text-lg tracking-tight ${emergencyMode ? 'text-yellow-400' : 'text-gray-900'}`}>
            Nomad EHR
          </h1>
          <span className={`text-xs font-medium ${emergencyMode ? 'text-yellow-600' : 'text-gray-500'}`}>
            Decentralized Health
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {currentView === 'dashboard' && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                emergencyMode 
                  ? 'border-yellow-600 text-yellow-400 hover:bg-yellow-900' 
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => alert("Simulated PDF Generation")}
            >
              <Download size={16} />
              <span>Export PDF</span>
            </motion.button>

            <div className={`h-6 w-px ${emergencyMode ? 'bg-yellow-800' : 'bg-gray-300'}`} />
          </>
        )}

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleEmergencyMode}
          className={`p-2 rounded-full transition-colors ${
            emergencyMode 
              ? 'bg-red-900 text-white animate-pulse' 
              : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
          }`}
          title="Emergency Mode"
        >
          <AlertTriangle size={20} />
        </motion.button>

        {currentView === 'dashboard' && (
           <motion.button
           whileTap={{ scale: 0.9 }}
           onClick={logout}
           className={`p-2 rounded-full transition-colors ${
             emergencyMode 
               ? 'bg-yellow-900 text-yellow-400' 
               : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
           }`}
           title="Logout"
         >
           <LogOut size={20} />
         </motion.button>
        )}
      </div>
    </nav>
  );
};