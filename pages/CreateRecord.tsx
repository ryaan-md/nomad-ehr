import React, { useState } from 'react';
import { ArrowRight, Calendar, KeyRound, AlertCircle, ArrowLeft, X, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DecryptOverlay } from '../components/DecryptOverlay';
import { DEMOGRAPHICS_PROFILE_FIELDS, FAMILY_HISTORY_RELATIONS } from '../constants';
import { MedicalEntry } from '../types';

export const CreateRecord = () => {
  const { createNewRecord, error, isLoading, setCurrentView } = useApp();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  const [word3, setWord3] = useState("");
  
  // Medical Overview Form State
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    demographics: false,
    allergies: false,
    history: false,
    familyHistory: false,
    vaccinations: false
  });
  
  // Demographics
  const [demographics, setDemographics] = useState<Record<string, string>>({
    Ethnicity: '',
    Occupation: '',
    Languages: '',
    'Emergency Contact': ''
  });
  
  // Allergies
  const [allergies, setAllergies] = useState<Array<{ allergen: string; reaction: string }>>([]);
  const [newAllergen, setNewAllergen] = useState('');
  const [newReaction, setNewReaction] = useState('');
  
  // Medical History
  const [medicalHistory, setMedicalHistory] = useState<Array<{ condition: string; date: string; description: string; status: 'Active' | 'Resolved' }>>([]);
  const [newCondition, setNewCondition] = useState('');
  const [newDiagnosisDate, setNewDiagnosisDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState<'Active' | 'Resolved'>('Active');
  
  // Family History
  const [familyHistory, setFamilyHistory] = useState<Record<string, { condition: string; age: string; status: string }>>({
    Mother: { condition: '', age: '', status: '' },
    Father: { condition: '', age: '', status: '' }
  });
  
  // Vaccinations
  const [vaccinations, setVaccinations] = useState<Array<{ name: string; clinic: string; type: string; date: string }>>([]);
  const [newVaccine, setNewVaccine] = useState('');
  const [newClinic, setNewClinic] = useState('');
  const [newVaccineType, setNewVaccineType] = useState('Booster');
  const [newVaccineDate, setNewVaccineDate] = useState('');
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Validate inputs
    if (!name.trim()) {
      setFormError('Please enter a name');
      return;
    }
    if (!dob) {
      setFormError('Please enter a date of birth');
      return;
    }
    if (!word1.trim() || !word2.trim() || !word3.trim()) {
      setFormError('Please enter all three words for your access key');
      return;
    }
    
    setIsDecrypting(true);
  };

  const onDecryptComplete = async () => {
    try {
      const timestamp = new Date().toISOString();
      const authorName = name.trim();
      
      // Create medical entries
      const createEntry = (key: string, value: string): MedicalEntry => ({
        id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        key: key.trim(),
        value: value.trim(),
        lastUpdated: timestamp,
        updatedBy: authorName
      });
      
      // Build demographics entries
      const demographicsEntries: MedicalEntry[] = [];
      Object.entries(demographics).forEach(([key, value]) => {
        if (value.trim()) {
          demographicsEntries.push(createEntry(key, value));
        }
      });
      
      // Build allergies entries
      const allergiesEntries: MedicalEntry[] = allergies.map(allergy => 
        createEntry(allergy.allergen, `Reaction: ${allergy.reaction}`)
      );
      
      // Build medical history entries
      const historyEntries: MedicalEntry[] = medicalHistory.map(condition => {
        const statusMarker = condition.status === 'Resolved' ? ' (Resolved)' : '';
        const value = `Diagnosed: ${condition.date || 'N/A'}. ${condition.description || 'No additional details'}${statusMarker}`;
        return createEntry(condition.condition, value);
      });
      
      // Build family history entries
      Object.entries(familyHistory).forEach(([relation, data]) => {
        if (data.condition.trim() || data.age.trim()) {
          const value = `${data.condition}${data.age ? `, Age ${data.age}` : ''}${data.status ? `, ${data.status}` : ''}`;
          historyEntries.push(createEntry(`Family History: ${relation}`, value));
        }
      });
      
      // Build vaccinations entries
      vaccinations.forEach(vaccine => {
        const value = `${vaccine.clinic}, ${vaccine.type}, ${vaccine.date}`;
        historyEntries.push(createEntry(`Vaccination: ${vaccine.name}`, value));
      });
      
      const medicalData = {
        demographics: {
          title: "Demographics",
          entries: demographicsEntries
        },
        allergies: {
          title: "Allergies",
          entries: allergiesEntries
        },
        history: {
          title: "Medical History",
          entries: historyEntries
        }
      };
      
      await createNewRecord(
        {
          name: authorName,
          role: 'patient',
          threeWords: [word1.trim(), word2.trim(), word3.trim()]
        },
        {
          name: name.trim(),
          dob: dob,
          threeWords: [word1.trim().toLowerCase(), word2.trim().toLowerCase(), word3.trim().toLowerCase()]
        },
        medicalData
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create record';
      setFormError(errorMessage);
      setIsDecrypting(false);
    }
  };

  const addAllergy = () => {
    if (newAllergen.trim() && newReaction.trim()) {
      setAllergies([...allergies, { allergen: newAllergen.trim(), reaction: newReaction.trim() }]);
      setNewAllergen('');
      setNewReaction('');
    }
  };

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setMedicalHistory([...medicalHistory, {
        condition: newCondition.trim(),
        date: newDiagnosisDate.trim(),
        description: newDescription.trim(),
        status: newStatus
      }]);
      setNewCondition('');
      setNewDiagnosisDate('');
      setNewDescription('');
      setNewStatus('Active');
    }
  };

  const removeCondition = (index: number) => {
    setMedicalHistory(medicalHistory.filter((_, i) => i !== index));
  };

  const addVaccination = () => {
    if (newVaccine.trim()) {
      setVaccinations([...vaccinations, {
        name: newVaccine.trim(),
        clinic: newClinic.trim(),
        type: newVaccineType,
        date: newVaccineDate.trim()
      }]);
      setNewVaccine('');
      setNewClinic('');
      setNewVaccineType('Booster');
      setNewVaccineDate('');
    }
  };

  const removeVaccination = (index: number) => {
    setVaccinations(vaccinations.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DecryptOverlay isDecrypting={isDecrypting} onComplete={onDecryptComplete} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Home</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Record</h1>
        <button
          onClick={() => setCurrentView('landing')}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left: Patient Information */}
        <div className="w-1/2 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Patient Information
            </h2>
            <p className="text-gray-500 mb-6">
              Enter the basic details to create a new encrypted health record.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
            {(formError || error) && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-700" />
                <span className="text-sm text-red-700">
                  {formError || error}
                </span>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4 pb-4 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800">Basic Information</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Full Name
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nomad-teal transition-all"
                  placeholder="e.g. Alara Kovic"
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
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nomad-teal transition-all"
                  required
                  disabled={isDecrypting || isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <KeyRound size={16} /> Three Word Access Key
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Choose three memorable words. These will be used to encrypt and access your record.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <input 
                    type="text" 
                    placeholder="Word 1" 
                    value={word1}
                    onChange={(e) => setWord1(e.target.value)}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-sm focus:ring-2 focus:ring-nomad-teal outline-none" 
                    required 
                    disabled={isDecrypting || isLoading}
                  />
                  <input 
                    type="text" 
                    placeholder="Word 2" 
                    value={word2}
                    onChange={(e) => setWord2(e.target.value)}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-sm focus:ring-2 focus:ring-nomad-teal outline-none" 
                    required 
                    disabled={isDecrypting || isLoading}
                  />
                  <input 
                    type="text" 
                    placeholder="Word 3" 
                    value={word3}
                    onChange={(e) => setWord3(e.target.value)}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-sm focus:ring-2 focus:ring-nomad-teal outline-none" 
                    required 
                    disabled={isDecrypting || isLoading}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Store these words securely. You'll need them to access your record.</p>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isDecrypting || isLoading}
              className="w-full mt-4 bg-gradient-to-r from-nomad-teal to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-nomad-teal/20 hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span>{isDecrypting || isLoading ? 'Creating...' : 'Create Record'}</span>
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Right: Medical Overview */}
      <div className="w-1/2 bg-gray-50 overflow-y-auto">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Medical Overview
          </h2>
          <p className="text-gray-500 mb-6">
            Optional: Add medical information now or later.
          </p>

          <div className="space-y-4">
                {/* Demographics */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('demographics')}
                    className="w-full p-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-semibold text-gray-800">Demographics & Profile</span>
                    {expandedSections.demographics ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {expandedSections.demographics && (
                    <div className="p-4 space-y-3">
                      {DEMOGRAPHICS_PROFILE_FIELDS.map(field => (
                        <div key={field}>
                          <label className="text-xs font-semibold text-gray-700 mb-1 block">{field}</label>
                          <input
                            type="text"
                            value={demographics[field] || ''}
                            onChange={(e) => setDemographics({ ...demographics, [field]: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nomad-teal"
                            placeholder={`Enter ${field.toLowerCase()}`}
                            disabled={isDecrypting || isLoading}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Allergies */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('allergies')}
                    className="w-full p-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-semibold text-gray-800">Allergies</span>
                    {expandedSections.allergies ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {expandedSections.allergies && (
                    <div className="p-4 space-y-3">
                      {allergies.map((allergy, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded">
                          <div className="flex-1">
                            <span className="font-semibold text-sm">{allergy.allergen}</span>
                            <span className="text-xs text-gray-600 ml-2">- {allergy.reaction}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAllergy(idx)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newAllergen}
                          onChange={(e) => setNewAllergen(e.target.value)}
                          placeholder="Allergen"
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nomad-teal"
                          disabled={isDecrypting || isLoading}
                        />
                        <input
                          type="text"
                          value={newReaction}
                          onChange={(e) => setNewReaction(e.target.value)}
                          placeholder="Reaction"
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nomad-teal"
                          disabled={isDecrypting || isLoading}
                        />
                        <button
                          type="button"
                          onClick={addAllergy}
                          className="px-3 py-2 bg-nomad-teal text-white rounded-md hover:bg-nomad-teal/90 text-sm"
                          disabled={isDecrypting || isLoading}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Medical History */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('history')}
                    className="w-full p-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-semibold text-gray-800">Past Medical History</span>
                    {expandedSections.history ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {expandedSections.history && (
                    <div className="p-4 space-y-3">
                      {medicalHistory.map((condition, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 border border-gray-200 rounded">
                          <div className="flex-1">
                            <span className="font-semibold text-sm">{condition.condition}</span>
                            {condition.date && <span className="text-xs text-gray-600 ml-2">- {condition.date}</span>}
                            {condition.description && <p className="text-xs text-gray-600 mt-1">{condition.description}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCondition(idx)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newCondition}
                          onChange={(e) => setNewCondition(e.target.value)}
                          placeholder="Condition"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nomad-teal"
                          disabled={isDecrypting || isLoading}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={newDiagnosisDate}
                            onChange={(e) => setNewDiagnosisDate(e.target.value)}
                            placeholder="Date (DD/MM/YYYY)"
                            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nomad-teal"
                            disabled={isDecrypting || isLoading}
                          />
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as 'Active' | 'Resolved')}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nomad-teal"
                            disabled={isDecrypting || isLoading}
                          >
                            <option value="Active">Active</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </div>
                        <input
                          type="text"
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          placeholder="Description"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nomad-teal"
                          disabled={isDecrypting || isLoading}
                        />
                        <button
                          type="button"
                          onClick={addCondition}
                          className="w-full px-3 py-2 bg-nomad-teal text-white rounded-md hover:bg-nomad-teal/90 text-sm flex items-center justify-center gap-2"
                          disabled={isDecrypting || isLoading}
                        >
                          <Plus size={16} />
                          Add Condition
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Family History */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('familyHistory')}
                    className="w-full p-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-semibold text-gray-800">Family History</span>
                    {expandedSections.familyHistory ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {expandedSections.familyHistory && (
                    <div className="p-4 space-y-3">
                      {FAMILY_HISTORY_RELATIONS.slice(0, 2).map(relation => (
                        <div key={relation} className="space-y-2">
                          <label className="text-xs font-semibold text-gray-700">{relation}</label>
                          <input
                            type="text"
                            value={familyHistory[relation]?.condition || ''}
                            onChange={(e) => setFamilyHistory({
                              ...familyHistory,
                              [relation]: { ...familyHistory[relation], condition: e.target.value }
                            })}
                            placeholder="Condition"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nomad-teal"
                            disabled={isDecrypting || isLoading}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={familyHistory[relation]?.age || ''}
                              onChange={(e) => setFamilyHistory({
                                ...familyHistory,
                                [relation]: { ...familyHistory[relation], age: e.target.value }
                              })}
                              placeholder="Age"
                              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nomad-teal"
                              disabled={isDecrypting || isLoading}
                            />
                            <input
                              type="text"
                              value={familyHistory[relation]?.status || ''}
                              onChange={(e) => setFamilyHistory({
                                ...familyHistory,
                                [relation]: { ...familyHistory[relation], status: e.target.value }
                              })}
                              placeholder="Status (e.g., Deceased)"
                              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nomad-teal"
                              disabled={isDecrypting || isLoading}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vaccinations */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('vaccinations')}
                    className="w-full p-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-semibold text-gray-800">Vaccinations</span>
                    {expandedSections.vaccinations ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {expandedSections.vaccinations && (
                    <div className="p-4 space-y-3">
                      {vaccinations.map((vaccine, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 border border-gray-200 rounded">
                          <div className="flex-1">
                            <span className="font-semibold text-sm">{vaccine.name}</span>
                            <p className="text-xs text-gray-600">{vaccine.clinic} - {vaccine.type} - {vaccine.date}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeVaccination(idx)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newVaccine}
                          onChange={(e) => setNewVaccine(e.target.value)}
                          placeholder="Vaccine Name"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nomad-teal"
                          disabled={isDecrypting || isLoading}
                        />
                        <input
                          type="text"
                          value={newClinic}
                          onChange={(e) => setNewClinic(e.target.value)}
                          placeholder="Clinic/Location"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nomad-teal"
                          disabled={isDecrypting || isLoading}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={newVaccineType}
                            onChange={(e) => setNewVaccineType(e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nomad-teal"
                            disabled={isDecrypting || isLoading}
                          >
                            <option value="Booster">Booster</option>
                            <option value="Annual">Annual</option>
                            <option value="Initial">Initial</option>
                          </select>
                          <input
                            type="text"
                            value={newVaccineDate}
                            onChange={(e) => setNewVaccineDate(e.target.value)}
                            placeholder="Date (DD/MM/YYYY)"
                            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nomad-teal"
                            disabled={isDecrypting || isLoading}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={addVaccination}
                          className="w-full px-3 py-2 bg-nomad-teal text-white rounded-md hover:bg-nomad-teal/90 text-sm flex items-center justify-center gap-2"
                          disabled={isDecrypting || isLoading}
                        >
                          <Plus size={16} />
                          Add Vaccination
                        </button>
                      </div>
                    </div>
                  )}
                </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
