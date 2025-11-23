import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ViewState, PatientRecord, UserSession, DashboardTab, Note, Commit, MedicalSection, MedicalEntry } from '../types';
import { MOCK_RECORD } from '../constants';
import { findRecordByAccessKeys, updatePatientRecord, createPatientRecord } from '../services/firebaseService';

interface AccessKeys {
  name: string;
  dob: string;
  threeWords: string[];
}

interface AppContextType {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  record: PatientRecord; // Always returns a record (falls back to MOCK_RECORD if none loaded)
  emergencyMode: boolean;
  toggleEmergencyMode: () => void;
  currentUser: UserSession | null;
  login: (session: UserSession, accessKeys: AccessKeys) => Promise<void>;
  createNewRecord: (session: UserSession, accessKeys: AccessKeys, medicalData?: Partial<PatientRecord>) => Promise<void>;
  logout: () => void;
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  addNote: (content: string) => Promise<void>;
  updateMedicalEntry: (sectionKey: keyof PatientRecord, entryId: string, newValue: string, newKey?: string) => Promise<void>;
  addMedicalEntry: (sectionKey: keyof PatientRecord, entryKey: string, entryValue: string) => Promise<void>;
  batchUpdateMedicalEntries: (sectionKey: keyof PatientRecord, updates: Array<{ id?: string; key: string; value: string }>) => Promise<void>;
  syncRecord: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [record, setRecord] = useState<PatientRecord | null>(null);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessKeys, setAccessKeys] = useState<AccessKeys | null>(null);

  const toggleEmergencyMode = () => setEmergencyMode(prev => !prev);

  const login = async (session: UserSession, keys: AccessKeys) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Query Firebase for the record using access keys
      const foundRecord = await findRecordByAccessKeys(keys.name, keys.dob, keys.threeWords);
      
      if (!foundRecord) {
        throw new Error('Record not found. Please verify your name, date of birth, and three-word key.');
      }
      
      // Store access keys for future updates
      setAccessKeys(keys);
      setRecord(foundRecord);
      setCurrentUser(session);
      setCurrentView('dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access record. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createNewRecord = async (session: UserSession, keys: AccessKeys, medicalData?: Partial<PatientRecord>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate a new record ID
      const recordId = `REC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
      const timestamp = new Date().toISOString();
      const authorName = session.name;
      
      // Create medical entries with timestamps
      const createMedicalEntry = (key: string, value: string): MedicalEntry => ({
        id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        key: key.trim(),
        value: value.trim(),
        lastUpdated: timestamp,
        updatedBy: authorName
      });
      
      // Create a new record with medical data if provided
      const newRecord: PatientRecord = {
        id: recordId,
        name: keys.name,
        dob: keys.dob,
        demographics: medicalData?.demographics || {
          title: "Demographics",
          entries: []
        },
        allergies: medicalData?.allergies || {
          title: "Allergies",
          entries: []
        },
        medications: medicalData?.medications || {
          title: "Current Medications",
          entries: []
        },
        history: medicalData?.history || {
          title: "Medical History",
          entries: []
        },
        notes: [],
        commits: [{
          hash: Math.random().toString(36).substring(2, 9),
          shortHash: Math.random().toString(36).substring(2, 9),
          timestamp,
          author: authorName,
          message: "Initial Record Creation",
          type: 'access'
        }]
      };
      
      // Create record in Firebase
      await createPatientRecord(newRecord, keys.threeWords);
      
      // Store access keys and set record
      setAccessKeys(keys);
      setRecord(newRecord);
      setCurrentUser(session);
      setCurrentView('dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create record. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setRecord(null);
    setAccessKeys(null);
    setError(null);
    setCurrentView('landing');
    setActiveTab('overview');
  };

  const addNote = async (content: string) => {
    if (!record || !accessKeys || !currentUser) {
      throw new Error('No record loaded or user not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const newHash = Math.random().toString(36).substring(2, 9);
      const timestamp = new Date().toISOString();
      const authorName = currentUser.name;
      
      const newNote: Note = {
        id: `n-${Date.now()}`,
        timestamp,
        author: authorName,
        content,
        commitHash: newHash
      };

      const newCommit: Commit = {
        hash: newHash,
        shortHash: newHash,
        timestamp,
        author: authorName,
        message: `Added clinical note via ${currentUser.role}`,
        type: 'note'
      };

      const updatedRecord: PatientRecord = {
        ...record,
        notes: [newNote, ...record.notes],
        commits: [newCommit, ...record.commits]
      };

      // Update in Firebase
      await updatePatientRecord(
        accessKeys.name,
        accessKeys.dob,
        accessKeys.threeWords,
        updatedRecord
      );

      // Update local state
      setRecord(updatedRecord);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add note. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMedicalEntry = async (sectionKey: keyof PatientRecord, entryId: string, newValue: string, newKey?: string) => {
    if (!record || !accessKeys || !currentUser) {
      throw new Error('No record loaded or user not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const newHash = Math.random().toString(36).substring(2, 9);
      const timestamp = new Date().toISOString();
      const authorName = currentUser.name;

      // Type assertion needed because TS doesn't know exactly which keys are MedicalSection
      const section = record[sectionKey] as MedicalSection; 
      if (!section || !section.entries) {
        throw new Error('Invalid section or entry not found');
      }

      const updatedEntries = section.entries.map(entry => 
        entry.id === entryId 
          ? { 
              ...entry, 
              value: newValue, 
              key: newKey !== undefined ? newKey : entry.key,
              lastUpdated: timestamp, 
              updatedBy: authorName 
            }
          : entry
      );

      const newCommit: Commit = {
        hash: newHash,
        shortHash: newHash,
        timestamp,
        author: authorName,
        message: `Updated ${section.title}: ${entryId}`,
        type: 'structure'
      };

      const updatedRecord: PatientRecord = {
        ...record,
        [sectionKey]: { ...section, entries: updatedEntries },
        commits: [newCommit, ...record.commits]
      };

      // Update in Firebase
      await updatePatientRecord(
        accessKeys.name,
        accessKeys.dob,
        accessKeys.threeWords,
        updatedRecord
      );

      // Update local state
      setRecord(updatedRecord);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update entry. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addMedicalEntry = async (sectionKey: keyof PatientRecord, entryKey: string, entryValue: string) => {
    if (!record || !accessKeys || !currentUser) {
      throw new Error('No record loaded or user not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const newHash = Math.random().toString(36).substring(2, 9);
      const timestamp = new Date().toISOString();
      const authorName = currentUser.name;

      // Type assertion needed because TS doesn't know exactly which keys are MedicalSection
      const section = record[sectionKey] as MedicalSection; 
      if (!section || !section.entries) {
        throw new Error('Invalid section');
      }

      // Create new entry
      const newEntry: MedicalEntry = {
        id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        key: entryKey.trim(),
        value: entryValue.trim(),
        lastUpdated: timestamp,
        updatedBy: authorName
      };

      const updatedEntries = [...section.entries, newEntry];

      const newCommit: Commit = {
        hash: newHash,
        shortHash: newHash,
        timestamp,
        author: authorName,
        message: `Added ${entryKey} to ${section.title}`,
        type: 'structure'
      };

      const updatedRecord: PatientRecord = {
        ...record,
        [sectionKey]: { ...section, entries: updatedEntries },
        commits: [newCommit, ...record.commits]
      };

      // Update in Firebase
      await updatePatientRecord(
        accessKeys.name,
        accessKeys.dob,
        accessKeys.threeWords,
        updatedRecord
      );

      // Update local state
      setRecord(updatedRecord);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add entry. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const batchUpdateMedicalEntries = async (
    sectionKey: keyof PatientRecord,
    updates: Array<{ id?: string; key: string; value: string }>
  ) => {
    if (!record || !accessKeys || !currentUser) {
      throw new Error('No record loaded or user not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const newHash = Math.random().toString(36).substring(2, 9);
      const timestamp = new Date().toISOString();
      const authorName = currentUser.name;

      const section = record[sectionKey] as MedicalSection;
      if (!section || !section.entries) {
        throw new Error('Invalid section');
      }

      // Build a map of existing entries by key for quick lookup
      const existingEntriesMap = new Map<string, MedicalEntry>();
      section.entries.forEach(entry => {
        existingEntriesMap.set(entry.key, entry);
      });

      // Process all updates
      const updatedEntries = [...section.entries];
      const newEntries: MedicalEntry[] = [];
      const updatedKeys = new Set<string>();

      updates.forEach(update => {
        if (!update.value.trim()) {
          // Skip empty values - remove existing entry if it exists
          const existing = existingEntriesMap.get(update.key);
          if (existing) {
            const index = updatedEntries.findIndex(e => e.id === existing.id);
            if (index !== -1) {
              updatedEntries.splice(index, 1);
            }
          }
          return;
        }

        if (update.id) {
          // Update existing entry
          const index = updatedEntries.findIndex(e => e.id === update.id);
          if (index !== -1) {
            updatedEntries[index] = {
              ...updatedEntries[index],
              value: update.value.trim(),
              lastUpdated: timestamp,
              updatedBy: authorName
            };
            updatedKeys.add(update.key);
          }
        } else {
          // Check if entry with this key already exists
          const existing = existingEntriesMap.get(update.key);
          if (existing) {
            // Update existing entry by key
            const index = updatedEntries.findIndex(e => e.id === existing.id);
            if (index !== -1) {
              updatedEntries[index] = {
                ...updatedEntries[index],
                value: update.value.trim(),
                lastUpdated: timestamp,
                updatedBy: authorName
              };
              updatedKeys.add(update.key);
            }
          } else {
            // Add new entry
            const newEntry: MedicalEntry = {
              id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              key: update.key.trim(),
              value: update.value.trim(),
              lastUpdated: timestamp,
              updatedBy: authorName
            };
            newEntries.push(newEntry);
            updatedKeys.add(update.key);
          }
        }
      });

      // Combine updated and new entries
      const finalEntries = [...updatedEntries, ...newEntries];

      const newCommit: Commit = {
        hash: newHash,
        shortHash: newHash,
        timestamp,
        author: authorName,
        message: `Batch updated ${section.title}: ${Array.from(updatedKeys).join(', ')}`,
        type: 'structure'
      };

      const updatedRecord: PatientRecord = {
        ...record,
        [sectionKey]: { ...section, entries: finalEntries },
        commits: [newCommit, ...record.commits]
      };

      // Single Firebase update with all changes
      await updatePatientRecord(
        accessKeys.name,
        accessKeys.dob,
        accessKeys.threeWords,
        updatedRecord
      );

      // Update local state
      setRecord(updatedRecord);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to batch update entries. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const syncRecord = async () => {
    if (!accessKeys) {
      throw new Error('No access keys available');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Refresh record from Firebase
      const refreshedRecord = await findRecordByAccessKeys(
        accessKeys.name,
        accessKeys.dob,
        accessKeys.threeWords
      );

      if (!refreshedRecord) {
        throw new Error('Record not found');
      }

      // Update local state with refreshed record
      setRecord(refreshedRecord);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync record. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      record: record || MOCK_RECORD, // Fallback to mock for development
      emergencyMode,
      toggleEmergencyMode,
      currentUser,
      login,
      createNewRecord,
      logout,
      activeTab,
      setActiveTab,
      addNote,
      updateMedicalEntry,
      addMedicalEntry,
      batchUpdateMedicalEntries,
      syncRecord,
      isLoading,
      error
    }}>
      <div className={emergencyMode ? 'emergency-mode bg-black text-yellow-400' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};