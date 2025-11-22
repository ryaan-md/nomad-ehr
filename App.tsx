import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Landing } from './pages/Landing';
import { Access } from './pages/Access';
import { Dashboard } from './pages/Dashboard';
import { CreateRecord } from './pages/CreateRecord';
import { AnimatePresence, motion } from 'framer-motion';

const AppContent = () => {
  const { currentView } = useApp();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentView === 'landing' && <Landing />}
        {currentView === 'access' && <Access />}
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'create' && <CreateRecord />}
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;