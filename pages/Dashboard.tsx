import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Overview } from './dashboard/Overview';
import { Notes } from './dashboard/Notes';
import { History } from './dashboard/History';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { LayoutDashboard, FileText, GitCommit, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { activeTab, setActiveTab, record, emergencyMode } = useApp();
  const [isRevealing, setIsRevealing] = useState(true);

  useEffect(() => {
    // Start revealing content after component mounts
    const revealTimer = setTimeout(() => {
      setIsRevealing(false);
    }, 1000); // Blur for 1 second before revealing

    return () => clearTimeout(revealTimer);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${emergencyMode ? 'bg-black' : 'bg-nomad-light'}`}>
      <Navbar />
      
      <motion.div 
        className="flex-grow container mx-auto max-w-5xl p-4 md:p-6"
        animate={{
          filter: isRevealing ? 'blur(20px)' : 'blur(0px)',
          opacity: isRevealing ? 0.3 : 1,
        }}
        transition={{
          duration: 0.8,
          ease: 'easeOut'
        }}
      >
        {/* Patient Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${
              emergencyMode ? 'bg-yellow-900 text-yellow-400' : 'bg-gradient-to-br from-nomad-teal to-blue-500 text-white shadow-lg'
            }`}>
              {record.name.charAt(0)}
            </div>
            <div>
              <h2 className={`text-2xl font-heading font-bold ${emergencyMode ? 'text-yellow-400' : 'text-gray-900'}`}>{record.name}</h2>
              <p className={`text-sm font-mono ${emergencyMode ? 'text-yellow-600' : 'text-gray-500'}`}>
                ID: {record.id} • DOB: {record.dob}
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${
            emergencyMode ? 'bg-black border-yellow-600 text-yellow-400' : 'bg-white border-gray-200 text-gray-600'
          }`}>
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             Synced just now
          </div>
        </header>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 no-scrollbar">
           <TabButton 
             active={activeTab === 'overview'} 
             onClick={() => setActiveTab('overview')} 
             icon={<LayoutDashboard size={18} />} 
             label="Overview" 
           />
           <TabButton 
             active={activeTab === 'notes'} 
             onClick={() => setActiveTab('notes')} 
             icon={<FileText size={18} />} 
             label="Structured Notes" 
           />
           <TabButton 
             active={activeTab === 'history'} 
             onClick={() => setActiveTab('history')} 
             icon={<GitCommit size={18} />} 
             label="Version History" 
           />
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'notes' && <Notes />}
          {activeTab === 'history' && <History />}
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => {
  const { emergencyMode } = useApp();
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
        active
          ? emergencyMode ? 'bg-yellow-600 text-black' : 'bg-nomad-dark text-white shadow-lg shadow-gray-900/10'
          : emergencyMode ? 'text-yellow-600 hover:bg-yellow-900/30' : 'text-gray-500 hover:bg-white hover:text-gray-900'
      }`}
    >
      {icon}
      {label}
    </button>
  );
};