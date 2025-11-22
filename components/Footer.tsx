import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer = () => {
  const { emergencyMode } = useApp();
  
  return (
    <footer className={`py-6 text-center border-t mt-auto ${
        emergencyMode ? 'bg-black border-yellow-900 text-yellow-700' : 'bg-white border-gray-100 text-gray-400'
    }`}>
      <div className="text-xs font-medium">
        Nomad EHR &copy; {new Date().getFullYear()}
      </div>
      <div className="text-[10px] mt-1 opacity-70">
        Decentralized • Open Source • Humanitarian
      </div>
    </footer>
  );
};