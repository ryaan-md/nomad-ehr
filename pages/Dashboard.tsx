import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Overview } from './dashboard/Overview';
import { Notes } from './dashboard/Notes';
import { History } from './dashboard/History';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { LayoutDashboard, FileText, GitCommit, UserCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { activeTab, setActiveTab, record, emergencyMode, syncRecord, isLoading } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const lastSyncedRecordRef = useRef<string>('');

  // Track record changes - if record changes after being synced, mark as not synced
  useEffect(() => {
    // Skip change detection while syncing
    if (isSyncing) return;

    // Create a simple hash of the record to detect changes
    const recordHash = JSON.stringify({
      notesCount: record.notes.length,
      commitsCount: record.commits.length,
      lastCommitHash: record.commits[0]?.hash || '',
      lastCommitTimestamp: record.commits[0]?.timestamp || ''
    });

    // Initialize on first load
    if (lastSyncedRecordRef.current === '') {
      lastSyncedRecordRef.current = recordHash;
      setIsSynced(false); // Start as not synced
      return;
    }

    // If record changed and we were synced, mark as not synced
    // (This happens when user makes a change like adding a note)
    if (lastSyncedRecordRef.current !== recordHash) {
      // Only mark as not synced if we were previously synced
      // (Don't override if we're already not synced)
      if (isSynced) {
        setIsSynced(false);
      }
    }
  }, [record, isSynced, isSyncing]);

  // Update sync reference after sync completes and record updates
  useEffect(() => {
    // When sync completes (isSyncing goes from true to false) and we're marked as synced,
    // update the reference to the current record state
    if (!isSyncing && isSynced) {
      const recordHash = JSON.stringify({
        notesCount: record.notes.length,
        commitsCount: record.commits.length,
        lastCommitHash: record.commits[0]?.hash || '',
        lastCommitTimestamp: record.commits[0]?.timestamp || ''
      });
      // Only update if it's different (record has been refreshed from sync)
      if (lastSyncedRecordRef.current !== recordHash) {
        lastSyncedRecordRef.current = recordHash;
      }
    }
  }, [isSyncing, isSynced, record]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncRecord();
      // Mark as synced - the useEffect will update the reference when record updates
      setIsSynced(true);
    } catch (err) {
      // Error is handled by context
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${emergencyMode ? 'bg-black' : 'bg-nomad-light'}`}>
      <Navbar />
      
      <div className="flex-grow container mx-auto max-w-5xl p-4 md:p-6">
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
          <div className="flex flex-col items-end gap-2">
            <div className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${
              emergencyMode ? 'bg-black border-yellow-600 text-yellow-400' : 'bg-white border-gray-200 text-gray-600'
            }`}>
              <motion.div 
                className={`w-2 h-2 rounded-full ${isSynced ? 'bg-green-500' : 'bg-orange-500'}`}
                animate={isSyncing || isLoading ? { 
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1]
                } : { 
                  scale: 1,
                  opacity: 1
                }}
                transition={{ 
                  duration: 1,
                  repeat: isSyncing || isLoading ? Infinity : 0,
                  ease: "easeInOut"
                }}
              />
              {isSynced ? 'Synced' : 'Not synced'}
            </div>
            <button
              onClick={handleSync}
              disabled={isSyncing || isLoading}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                emergencyMode 
                  ? 'bg-black border-yellow-600 text-yellow-400 hover:bg-yellow-900/30' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <motion.div
                animate={isSyncing || isLoading ? { rotate: 360 } : { rotate: 0 }}
                transition={{ 
                  duration: 1,
                  repeat: isSyncing || isLoading ? Infinity : 0,
                  ease: "linear"
                }}
              >
                <RefreshCw size={14} />
              </motion.div>
              {isSyncing || isLoading ? 'Syncing...' : 'Sync'}
            </button>
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
      </div>

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