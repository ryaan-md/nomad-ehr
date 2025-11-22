import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Calendar, AlertCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DecryptOverlay } from '../components/DecryptOverlay';

export const Access = () => {
  const { login, createNewRecord, error, isLoading, setCurrentView } = useApp();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showCreateOption, setShowCreateOption] = useState(false);
  
  // Patient fields
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  const [word3, setWord3] = useState("");
  
  // Accessor fields
  const [accessorName, setAccessorName] = useState("");
  const [accessorDob, setAccessorDob] = useState("");
  const [accessorWord1, setAccessorWord1] = useState("");
  const [accessorWord2, setAccessorWord2] = useState("");
  const [accessorWord3, setAccessorWord3] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setShowCreateOption(false);
    
    // Validate patient inputs
    if (!name.trim()) {
      setFormError('Please enter patient name');
      return;
    }
    if (!dob) {
      setFormError('Please enter patient date of birth');
      return;
    }
    if (!word1.trim() || !word2.trim() || !word3.trim()) {
      setFormError('Please enter all three words for patient access key');
      return;
    }
    
    // Validate accessor inputs
    if (!accessorName.trim()) {
      setFormError('Please enter accessor name');
        return;
      }
    if (!accessorDob) {
      setFormError('Please enter accessor date of birth');
        return;
      }
    if (!accessorWord1.trim() || !accessorWord2.trim() || !accessorWord3.trim()) {
      setFormError('Please enter all three words for accessor access key');
        return;
    }
    
    setIsDecrypting(true);
    // Login triggered after animation via onComplete in Overlay
  };

  const onDecryptComplete = async () => {
    try {
      await login(
        {
          name: accessorName.trim(),
          role: 'clinician',
          threeWords: [accessorWord1.trim(), accessorWord2.trim(), accessorWord3.trim()]
        },
        {
          name: name.trim(),
          dob: dob,
          threeWords: [word1.trim().toLowerCase(), word2.trim().toLowerCase(), word3.trim().toLowerCase()]
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access record';
      setFormError(errorMessage);
      // If record not found, show option to create new one
      if (errorMessage.includes('Record not found')) {
        setShowCreateOption(true);
      }
      setIsDecrypting(false);
    }
  };

  const handleCreateNewRecord = async () => {
    setFormError(null);
    setIsDecrypting(true);
    
    try {
      await createNewRecord(
        {
          name: accessorName.trim(),
          role: 'clinician',
          threeWords: [accessorWord1.trim(), accessorWord2.trim(), accessorWord3.trim()]
        },
        {
          name: name.trim(),
          dob: dob,
          threeWords: [word1.trim().toLowerCase(), word2.trim().toLowerCase(), word3.trim().toLowerCase()]
        }
      );
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create record');
      setIsDecrypting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 md:p-6">
      <DecryptOverlay isDecrypting={isDecrypting} onComplete={onDecryptComplete} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl relative"
      >
        {/* Close Button */}
        <button
          onClick={() => setCurrentView('landing')}
          className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-200 z-10"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Access Health Record
          </h1>
          <p className="text-gray-600">
            Identify both the patient and the person accessing the record.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Two Cards Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Patient Identity Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <User size={20} className="text-teal-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Patient Identity</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                These details unlock your health record.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    placeholder="Enter patient name."
                    required
                    disabled={isDecrypting || isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar size={16} /> Date of Birth
                  </label>
                  <input 
                    type="date" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    required
                    disabled={isDecrypting || isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Three Words
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input 
                      type="text" 
                      value={word1}
                      onChange={(e) => setWord1(e.target.value)}
                      placeholder="sunrise"
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center text-sm focus:ring-2 focus:ring-teal-500 outline-none" 
                      required 
                      disabled={isDecrypting || isLoading}
                    />
                    <input 
                      type="text" 
                      value={word2}
                      onChange={(e) => setWord2(e.target.value)}
                      placeholder="ripple"
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center text-sm focus:ring-2 focus:ring-teal-500 outline-none" 
                      required 
                      disabled={isDecrypting || isLoading}
                    />
                    <input 
                      type="text" 
                      value={word3}
                      onChange={(e) => setWord3(e.target.value)}
                      placeholder="hope"
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center text-sm focus:ring-2 focus:ring-teal-500 outline-none" 
                      required 
                      disabled={isDecrypting || isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Accessor Identity Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Lock size={20} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Accessor Identity</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Identify who is updating this record.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input 
                    type="text" 
                    value={accessorName}
                    onChange={(e) => setAccessorName(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    placeholder="Clinician or helper name."
                    required
                    disabled={isDecrypting || isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar size={16} /> Date of Birth
                  </label>
                  <input 
                    type="date" 
                    value={accessorDob}
                    onChange={(e) => setAccessorDob(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    required
                    disabled={isDecrypting || isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Three Words
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input 
                      type="text" 
                      value={accessorWord1}
                      onChange={(e) => setAccessorWord1(e.target.value)}
                      placeholder="sunrise"
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center text-sm focus:ring-2 focus:ring-teal-500 outline-none" 
                      required 
                      disabled={isDecrypting || isLoading}
                    />
                    <input 
                      type="text" 
                      value={accessorWord2}
                      onChange={(e) => setAccessorWord2(e.target.value)}
                      placeholder="ripple"
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center text-sm focus:ring-2 focus:ring-teal-500 outline-none" 
                      required 
                      disabled={isDecrypting || isLoading}
                    />
                    <input 
                      type="text" 
                      value={accessorWord3}
                      onChange={(e) => setAccessorWord3(e.target.value)}
                      placeholder="hope"
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center text-sm focus:ring-2 focus:ring-teal-500 outline-none" 
                      required 
                      disabled={isDecrypting || isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {(formError || error) && (
            <div className={`mb-6 px-4 py-3 rounded-xl flex flex-col gap-2 ${
              showCreateOption 
                ? 'bg-blue-50 border border-blue-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className={showCreateOption ? 'text-blue-700' : 'text-red-700'} />
                <span className={`text-sm ${showCreateOption ? 'text-blue-700' : 'text-red-700'}`}>
                  {formError || error}
                </span>
              </div>
              {showCreateOption && (
                <div className="mt-2 pt-2 border-t border-blue-300">
                  <p className="text-sm text-blue-600 mb-3">
                    No record found with these credentials. Would you like to create a new record?
                  </p>
                  <button
                    type="button"
                    onClick={handleCreateNewRecord}
                    disabled={isDecrypting || isLoading}
                    className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDecrypting || isLoading ? 'Creating...' : 'Create New Record'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Unlock Record Button */}
          <div className="flex justify-center mb-8">
            <button 
              type="submit"
              disabled={isDecrypting || isLoading}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-400 text-white rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-blue-500 transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock size={18} strokeWidth={2} />
              {isDecrypting || isLoading ? 'Unlocking...' : 'Unlock Record'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
          <Lock size={16} className="text-gray-400" />
          <p>All data encrypted end-to-end (simulated for prototype).</p>
        </div>
      </motion.div>
    </div>
  );
};