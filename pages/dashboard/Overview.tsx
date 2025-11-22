import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Edit2, ChevronUp, ChevronDown, Save, X, Plus } from 'lucide-react';
import { MedicalSection, PatientRecord } from '../../types';
import { DEMOGRAPHICS_PROFILE_FIELDS, FAMILY_HISTORY_RELATIONS } from '../../constants';

export const Overview = () => {
  const { record } = useApp();

  return (
    <div className="bg-gray-100 min-h-screen -mx-4 md:-mx-6 px-4 md:px-6 py-6">
      <div className="space-y-6 max-w-5xl mx-auto">
        <DemographicsSection data={record.demographics} />
        <AllergiesSection data={record.allergies} />
        <MedicationsSection data={record.medications} />
        <PastMedicalHistorySection data={record.history} />
        <FamilyHistorySection />
        <VaccinationsSection />
      </div>
    </div>
  );
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

// Helper function to get last updated info
const getLastUpdated = (entries: any[]): { date: string; by: string } | null => {
  if (entries.length === 0) return null;
  const sorted = [...entries].sort((a, b) => 
    new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  );
  return {
    date: formatDate(sorted[0].lastUpdated),
    by: sorted[0].updatedBy
  };
};

// Demographics & Profile Section
const DemographicsSection = ({ data }: { data: MedicalSection }) => {
  const { batchUpdateMedicalEntries, isLoading } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const lastUpdated = getLastUpdated(data.entries);

  // Initialize edit values from existing entries
  React.useEffect(() => {
    if (isEditing) {
      const values: Record<string, string> = {};
      DEMOGRAPHICS_PROFILE_FIELDS.forEach(field => {
        const entry = data.entries.find(e => e.key === field);
        values[field] = entry?.value || '';
      });
      setEditValues(values);
    }
  }, [isEditing, data.entries]);

  const handleSave = async () => {
    try {
      // Prepare batch updates
      const updates = DEMOGRAPHICS_PROFILE_FIELDS.map(field => {
        const value = editValues[field] || '';
        const existingEntry = data.entries.find(e => e.key === field);
        return {
          id: existingEntry?.id,
          key: field,
          value: value.trim()
        };
      });

      // Single batch update with all changes
      await batchUpdateMedicalEntries('demographics', updates);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save demographics:', err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
  };

  const getFieldValue = (field: string) => {
    return data.entries.find(e => e.key === field)?.value || '';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <h2 className="text-lg font-bold text-gray-800">Demographics & Profile</h2>
        </div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit2 size={14} />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
                <Save size={14} />
                Save
        </button>
        <button
                onClick={handleCancel}
          disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
                <X size={14} />
                Cancel
        </button>
            </div>
          )}
        </div>

        {lastUpdated && !isEditing && (
          <p className="text-xs text-gray-500 mb-4">
            Last updated {lastUpdated.date} by {lastUpdated.by}
          </p>
        )}

        {isExpanded && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              {DEMOGRAPHICS_PROFILE_FIELDS.slice(0, 2).map((field) => (
                <div key={field}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{field}</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editValues[field] || ''}
                      onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter ${field.toLowerCase()}`}
                    />
                  ) : (
                    <p className="text-sm text-gray-800">{getFieldValue(field) || 'Not set'}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {DEMOGRAPHICS_PROFILE_FIELDS.slice(2).map((field) => (
                <div key={field}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{field}</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editValues[field] || ''}
                      onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter ${field.toLowerCase()}`}
                    />
                  ) : (
                    <p className="text-sm text-gray-800">{getFieldValue(field) || 'Not set'}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Allergies Section
const AllergiesSection = ({ data }: { data: MedicalSection }) => {
  const { updateMedicalEntry, addMedicalEntry, isLoading } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAllergen, setNewAllergen] = useState('');
  const [newReaction, setNewReaction] = useState('');
  const [editAllergen, setEditAllergen] = useState('');
  const [editReaction, setEditReaction] = useState('');
  const lastUpdated = getLastUpdated(data.entries);

  const parseAllergy = (entry: any) => {
    const value = entry.value || '';
    const isHighRisk = /severe|anaphylaxis|difficulty breathing/i.test(value);
    const reaction = value.includes(':') ? value.split(':')[1]?.trim() : value;
    return { isHighRisk, reaction };
  };

  const handleAddAllergy = async () => {
    if (!newAllergen.trim() || !newReaction.trim()) return;
    try {
      await addMedicalEntry('allergies', newAllergen.trim(), `Reaction: ${newReaction.trim()}`);
      setNewAllergen('');
      setNewReaction('');
    } catch (err) {
      console.error('Failed to add allergy:', err);
    }
  };

  const handleEditStart = (entry: any) => {
    setEditingId(entry.id);
    setEditAllergen(entry.key);
    const { reaction } = parseAllergy(entry);
    setEditReaction(reaction);
  };

  const handleEditSave = async (entryId: string) => {
    if (!editAllergen.trim() || !editReaction.trim()) return;
    try {
      // Update both the key (allergen name) and value (reaction)
      await updateMedicalEntry('allergies', entryId, `Reaction: ${editReaction.trim()}`, editAllergen.trim());
      setEditingId(null);
      setEditAllergen('');
      setEditReaction('');
    } catch (err) {
      console.error('Failed to update allergy:', err);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditAllergen('');
    setEditReaction('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <h2 className="text-lg font-bold text-gray-800">Allergies</h2>
          </div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit2 size={14} />
              Edit
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingId(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Done
            </button>
          )}
        </div>

        {lastUpdated && !isEditing && (
          <p className="text-xs text-gray-500 mb-4">
            Last updated {lastUpdated.date} by {lastUpdated.by}
          </p>
        )}

        {isExpanded && (
          <div className="space-y-3">
            {data.entries.map((entry) => {
              const { isHighRisk, reaction } = parseAllergy(entry);
              const isCurrentlyEditing = editingId === entry.id;

              return (
                <div
                  key={entry.id}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  {isCurrentlyEditing && isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Allergen</label>
                        <input
                          type="text"
                          value={editAllergen}
                          onChange={(e) => setEditAllergen(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Reaction</label>
                        <input
                          type="text"
                          value={editReaction}
                          onChange={(e) => setEditReaction(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Severe rash, difficulty breathing"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSave(entry.id)}
                          disabled={isLoading}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Save size={14} />
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          disabled={isLoading}
                          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                          <X size={14} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{entry.key}</h3>
                        {reaction && (
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Reaction:</span> {reaction}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {isHighRisk && (
                          <span className="flex-shrink-0 px-2.5 py-1 bg-red-600 text-white text-xs font-medium rounded-full whitespace-nowrap">
                            High Risk
                          </span>
                        )}
                        {isEditing && (
                          <button
                            onClick={() => handleEditStart(entry)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isEditing && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Add New Allergy</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Allergen</label>
                    <input
                      type="text"
                      value={newAllergen}
                      onChange={(e) => setNewAllergen(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Penicillin"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Reaction</label>
                    <input
                      type="text"
                      value={newReaction}
                      onChange={(e) => setNewReaction(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Severe rash, difficulty breathing"
                    />
                  </div>
                  <button
                    onClick={handleAddAllergy}
                    disabled={isLoading || !newAllergen.trim() || !newReaction.trim()}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Plus size={14} />
                    Add Allergy
                  </button>
                </div>
              </div>
            )}

            {!isEditing && data.entries.length === 0 && (
              <p className="text-sm text-gray-500">No allergies recorded</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Medications Section
const MedicationsSection = ({ data }: { data: MedicalSection }) => {
  const { updateMedicalEntry, addMedicalEntry, isLoading } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMedication, setNewMedication] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [editMedication, setEditMedication] = useState('');
  const [editDetails, setEditDetails] = useState('');
  const lastUpdated = getLastUpdated(data.entries);

  const handleAddMedication = async () => {
    if (!newMedication.trim() || !newDetails.trim()) return;
    try {
      await addMedicalEntry('medications', newMedication.trim(), newDetails.trim());
      setNewMedication('');
      setNewDetails('');
    } catch (err) {
      console.error('Failed to add medication:', err);
    }
  };

  const handleEditStart = (entry: any) => {
    setEditingId(entry.id);
    setEditMedication(entry.key);
    setEditDetails(entry.value);
  };

  const handleEditSave = async (entryId: string) => {
    if (!editMedication.trim() || !editDetails.trim()) return;
    try {
      await updateMedicalEntry('medications', entryId, editDetails.trim(), editMedication.trim());
      setEditingId(null);
      setEditMedication('');
      setEditDetails('');
    } catch (err) {
      console.error('Failed to update medication:', err);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditMedication('');
    setEditDetails('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <h2 className="text-lg font-bold text-gray-800">Current Medications</h2>
          </div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit2 size={14} />
              Edit
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingId(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Done
            </button>
          )}
        </div>

        {lastUpdated && !isEditing && (
          <p className="text-xs text-gray-500 mb-4">
            Last updated {lastUpdated.date} by {lastUpdated.by}
          </p>
        )}

        {isExpanded && (
          <div className="space-y-3">
            {data.entries.map((entry) => {
              const isCurrentlyEditing = editingId === entry.id;

              return (
                <div
                  key={entry.id}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                  {isCurrentlyEditing && isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Medication Name</label>
                        <input
                          type="text"
                          value={editMedication}
                          onChange={(e) => setEditMedication(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Details (Dosage, Frequency, etc.)</label>
                        <input
                          type="text"
                          value={editDetails}
                          onChange={(e) => setEditDetails(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 10mg daily, PRN for pain"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSave(entry.id)}
                          disabled={isLoading}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Save size={14} />
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          disabled={isLoading}
                          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                          <X size={14} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{entry.key}</h3>
                        {entry.value && (
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Details:</span> {entry.value}
                          </p>
                        )}
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => handleEditStart(entry)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {isEditing && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Add New Medication</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Medication Name</label>
                    <input
                      type="text"
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Albuterol Inhaler"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Details (Dosage, Frequency, etc.)</label>
                    <input
                      type="text"
                      value={newDetails}
                      onChange={(e) => setNewDetails(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 10mg daily, PRN for asthma"
                    />
                  </div>
                  <button
                    onClick={handleAddMedication}
                    disabled={isLoading || !newMedication.trim() || !newDetails.trim()}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Plus size={14} />
                    Add Medication
                  </button>
                </div>
              </div>
            )}

            {!isEditing && data.entries.length === 0 && (
              <p className="text-sm text-gray-500">No medications recorded</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Past Medical History Section
const PastMedicalHistorySection = ({ data }: { data: MedicalSection }) => {
  const { record, updateMedicalEntry, addMedicalEntry, isLoading } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCondition, setNewCondition] = useState('');
  const [newDiagnosisDate, setNewDiagnosisDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState<'Active' | 'Resolved'>('Active');
  const [editCondition, setEditCondition] = useState('');
  const [editDiagnosisDate, setEditDiagnosisDate] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Resolved'>('Active');

  // Use record.history directly to ensure we have the latest data
  const historyData = record.history || data;
  
  // Filter out Family History and Vaccination entries
  const medicalHistoryEntries = historyData.entries.filter(entry => 
    !entry.key.toLowerCase().includes('family history') &&
    !entry.key.toLowerCase().includes('vaccination') &&
    !entry.key.toLowerCase().includes('vaccine')
  );

  const parseHistoryEntry = (entry: any) => {
    const value = entry.value || '';
    
    // Match date in format DD/MM/YYYY or N/A
    const dateMatch = value.match(/diagnosed:\s*(\d{2}\/\d{2}\/\d{4}|N\/A)/i);
    const date = dateMatch ? dateMatch[1] : '';
    
    // Check for explicit status markers (more specific than before)
    // Look for "(Resolved)", "Status: Resolved", or keywords in description
    const hasResolvedMarker = /\(resolved\)|status:\s*resolved|resolved\)/i.test(value);
    const hasResolvedKeywords = /\b(resolved|healed|surgery completed|past condition)\b/i.test(value);
    // Don't match "history" or "past" alone as they're too common
    const status = (hasResolvedMarker || hasResolvedKeywords) ? 'Resolved' : 'Active';
    
    // Extract description by removing "Diagnosed: [date/N/A]. " prefix
    let description = value;
    
    // Remove "Diagnosed: [date/N/A]. " pattern (with period and space after)
    description = description.replace(/diagnosed:\s*(?:\d{2}\/\d{2}\/\d{4}|N\/A)\.\s*/i, '');
    
    // Also handle case where there's no period after the date
    if (description === value) {
      description = description.replace(/diagnosed:\s*(?:\d{2}\/\d{2}\/\d{4}|N\/A)\s*/i, '');
    }
    
    // Remove status markers from description for display
    description = description
      .replace(/\(resolved\)/gi, '')
      .replace(/status:\s*resolved/gi, '')
      .trim();
    
    // Remove any leading periods, commas, or dashes that might be left
    description = description.replace(/^[.,\s-]+/, '').trim();
    
    return { date, status, description };
  };

  const handleAddCondition = async () => {
    if (!newCondition.trim()) return;
    
    let description = (newDescription || '').trim();
    if (!description) {
      description = 'No additional details';
    }
    
    // Explicitly include status in the value
    const statusMarker = newStatus === 'Resolved' ? ' (Resolved)' : '';
    const value = `Diagnosed: ${newDiagnosisDate || 'N/A'}. ${description}${statusMarker}`;
    
    try {
      await addMedicalEntry('history', newCondition.trim(), value);
      setNewCondition('');
      setNewDiagnosisDate('');
      setNewDescription('');
      setNewStatus('Active');
    } catch (err) {
      console.error('Failed to add condition:', err);
      alert('Failed to add condition. Please try again.');
    }
  };

  const handleEditStart = (entry: any) => {
    setEditingId(entry.id);
    setEditCondition(entry.key);
    const { date, status, description } = parseHistoryEntry(entry);
    setEditDiagnosisDate(date);
    setEditDescription(description);
    setEditStatus(status);
  };

  const handleEditSave = async (entryId: string) => {
    if (!editCondition.trim()) return;
    
    // Clean description - remove any existing status markers
    let description = (editDescription || '').trim();
    description = description
      .replace(/\(resolved\)/gi, '')
      .replace(/status:\s*resolved/gi, '')
      .trim();
    
    if (!description) {
      description = 'No additional details';
    }
    
    // Explicitly include status in the value
    const statusMarker = editStatus === 'Resolved' ? ' (Resolved)' : '';
    const value = `Diagnosed: ${editDiagnosisDate || 'N/A'}. ${description}${statusMarker}`;
    
    try {
      // Update both the key (condition name) and value
      await updateMedicalEntry('history', entryId, value, editCondition.trim());
      // Clear editing state after successful save
      setEditingId(null);
      setEditCondition('');
      setEditDiagnosisDate('');
      setEditDescription('');
      setEditStatus('Active');
    } catch (err) {
      console.error('Failed to update condition:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save changes';
      alert(`Error: ${errorMessage}. Please try again.`);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditCondition('');
    setEditDiagnosisDate('');
    setEditDescription('');
    setEditStatus('Active');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <h2 className="text-lg font-bold text-gray-800">Past Medical History</h2>
          </div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit2 size={14} />
              Edit
            </button>
          ) : (
          <button
            onClick={() => {
                setIsEditing(false);
                setEditingId(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Done
          </button>
        )}
      </div>

        {isExpanded && (
          <div className="space-y-3">
            {medicalHistoryEntries.map((entry) => {
              const { date, status, description } = parseHistoryEntry(entry);
              const isCurrentlyEditing = editingId === entry.id;

            return (
                <div
                  key={entry.id}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  {isCurrentlyEditing && isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Condition</label>
                        <input
                          type="text"
                          value={editCondition}
                          onChange={(e) => setEditCondition(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-700 mb-1 block">Diagnosis Date (DD/MM/YYYY)</label>
                          <input
                            type="text"
                            value={editDiagnosisDate}
                            onChange={(e) => setEditDiagnosisDate(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="DD/MM/YYYY"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-700 mb-1 block">Status</label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as 'Active' | 'Resolved')}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Active">Active</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Description</label>
                      <input 
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Well-controlled with medication"
                        />
                      </div>
                      <div className="flex gap-2">
                      <button 
                          onClick={() => handleEditSave(entry.id)}
                        disabled={isLoading}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                          <Save size={14} />
                          Save
                      </button>
                      <button 
                          onClick={handleEditCancel}
                        disabled={isLoading}
                          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm rounded-md hover:bg-gray-50 disabled:opacity-50"
                      >
                          <X size={14} />
                          Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{entry.key}</h3>
                        {date && (
                          <p className="text-xs text-gray-600 mb-1">
                            Diagnosed: {date}
                          </p>
                        )}
                        {description && (
                          <p className="text-sm text-gray-700">{description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex-shrink-0 px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                            status === 'Active'
                              ? 'bg-teal-500 text-white'
                              : 'bg-gray-800 text-white'
                          }`}
                        >
                          {status}
                        </span>
                        {isEditing && (
                          <button
                            onClick={() => handleEditStart(entry)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                      </div>
                  </div>
                )}
              </div>
            );
            })}

            {isEditing && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Add New Condition</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Condition</label>
                    <input
                      type="text"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Type 2 Diabetes Mellitus"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1 block">Diagnosis Date (DD/MM/YYYY)</label>
                  <input
                        type="text"
                        value={newDiagnosisDate}
                        onChange={(e) => setNewDiagnosisDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="DD/MM/YYYY"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1 block">Status</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as 'Active' | 'Resolved')}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Description</label>
                  <input
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Well-controlled with medication and diet"
                    />
                  </div>
                  <button
                    onClick={handleAddCondition}
                    disabled={isLoading || !newCondition.trim()}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Plus size={14} />
                    Add Condition
                  </button>
                </div>
              </div>
            )}

            {!isEditing && medicalHistoryEntries.length === 0 && (
              <p className="text-sm text-gray-500">No medical history recorded</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Family History Section
const FamilyHistorySection = () => {
  const { record, batchUpdateMedicalEntries, isLoading } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, { condition: string; age: string; status: string }>>({});
  
  // Parse family history from record - we'll store it in a custom format in the history section
  // Format: "Family History: [Relation] - [Condition], Age [age], [Status]"
  const parseFamilyHistory = () => {
    const familyEntries = record.history.entries.filter(e => 
      e.key.toLowerCase().includes('family') || 
      FAMILY_HISTORY_RELATIONS.some(rel => e.key.includes(rel))
    );
    
    const parsed: Record<string, { condition: string; age: string; status: string; entryId?: string }> = {};
    
    familyEntries.forEach(entry => {
      const relation = FAMILY_HISTORY_RELATIONS.find(rel => entry.key.includes(rel));
      if (relation) {
        const value = entry.value || '';
        const ageMatch = value.match(/age\s*(\d+)/i);
        const age = ageMatch ? ageMatch[1] : '';
        const statusMatch = value.match(/(deceased|alive)/i);
        const status = statusMatch ? statusMatch[1] : '';
        const condition = value.replace(/age\s*\d+/i, '').replace(/(deceased|alive)/i, '').replace(/[,\s-]+/g, ' ').trim();
        
        parsed[relation] = { condition, age, status, entryId: entry.id };
      }
    });
    
    // Initialize with default relations
    FAMILY_HISTORY_RELATIONS.slice(0, 2).forEach(relation => {
      if (!parsed[relation]) {
        parsed[relation] = { condition: '', age: '', status: '' };
      }
    });
    
    return parsed;
  };

  React.useEffect(() => {
    if (isEditing) {
      setEditValues(parseFamilyHistory());
    }
  }, [isEditing, record.history.entries]);

  const handleSave = async () => {
    try {
      // Prepare batch updates
      const updates = FAMILY_HISTORY_RELATIONS.slice(0, 2).map(relation => {
        const data = editValues[relation];
        if (!data) return null;
        
        const value = `${data.condition}${data.age ? `, Age ${data.age}` : ''}${data.status ? `, ${data.status}` : ''}`;
        const key = `Family History: ${relation}`;
        
        const existing = parseFamilyHistory()[relation];
        return {
          id: existing?.entryId,
          key: key,
          value: value.trim()
        };
      }).filter((update): update is { id?: string; key: string; value: string } => update !== null);

      // Single batch update with all changes
      await batchUpdateMedicalEntries('history', updates);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save family history:', err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
  };

  const familyData = parseFamilyHistory();

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <h2 className="text-lg font-bold text-gray-800">Family History</h2>
          </div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit2 size={14} />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save size={14} />
                Save
              </button>
                    <button 
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                <X size={14} />
                Cancel
                    </button>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="space-y-3">
            {FAMILY_HISTORY_RELATIONS.slice(0, 2).map((relation) => {
              const data = isEditing ? editValues[relation] : familyData[relation];
              if (!data) return null;

              return (
                <div
                  key={relation}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Relation</label>
                        <input
                          type="text"
                          value={relation}
                          disabled
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Condition</label>
                        <input
                          type="text"
                          value={data.condition || ''}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [relation]: { ...data, condition: e.target.value }
                          })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Type 2 Diabetes"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-700 mb-1 block">Age</label>
                          <input
                            type="text"
                            value={data.age || ''}
                            onChange={(e) => setEditValues({
                              ...editValues,
                              [relation]: { ...data, age: e.target.value }
                            })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 52"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-700 mb-1 block">Status</label>
                          <input
                            type="text"
                            value={data.status || ''}
                            onChange={(e) => setEditValues({
                              ...editValues,
                              [relation]: { ...data, status: e.target.value }
                            })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Deceased (optional)"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{relation}</h3>
                        {data.condition && (
                          <p className="text-sm text-gray-600 mb-1">{data.condition}</p>
                        )}
                        {data.status && (
                          <p className="text-sm text-gray-600">{data.status}</p>
                        )}
                      </div>
                      {data.age && (
                        <p className="text-sm text-gray-600">Age {data.age}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Vaccinations Section
const VaccinationsSection = () => {
  const { record, addMedicalEntry, updateMedicalEntry, isLoading } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newVaccine, setNewVaccine] = useState('');
  const [newClinic, setNewClinic] = useState('');
  const [newType, setNewType] = useState('Booster');
  const [newDate, setNewDate] = useState('');
  const [editVaccine, setEditVaccine] = useState('');
  const [editClinic, setEditClinic] = useState('');
  const [editType, setEditType] = useState('Booster');
  const [editDate, setEditDate] = useState('');

  // Parse vaccinations from record - stored as "Vaccination: [Name] - [Clinic], [Type], [Date]"
  const parseVaccinations = () => {
    const vaccineEntries = record.history.entries.filter(e => 
      e.key.toLowerCase().includes('vaccination') || 
      e.key.toLowerCase().includes('vaccine')
    );
    
    return vaccineEntries.map(entry => {
      const key = entry.key.replace(/vaccination:\s*/i, '');
      const value = entry.value || '';
      const parts = value.split(',').map(p => p.trim());
      const clinic = parts[0] || '';
      const type = parts[1] || 'Booster';
      const date = parts[2] || '';
      
      return {
        id: entry.id,
        name: key,
        clinic,
        type,
        date
      };
    });
  };

  const handleAddVaccination = async () => {
    if (!newVaccine.trim()) return;
    const key = `Vaccination: ${newVaccine}`;
    const value = `${newClinic}, ${newType}, ${newDate}`;
    try {
      await addMedicalEntry('history', key, value);
      setNewVaccine('');
      setNewClinic('');
      setNewType('Booster');
      setNewDate('');
    } catch (err) {
      console.error('Failed to add vaccination:', err);
    }
  };

  const handleEditStart = (vaccine: any) => {
    setEditingId(vaccine.id);
    setEditVaccine(vaccine.name);
    setEditClinic(vaccine.clinic);
    setEditType(vaccine.type);
    setEditDate(vaccine.date);
  };

  const handleEditSave = async (vaccineId: string) => {
    if (!editVaccine.trim()) return;
    const key = `Vaccination: ${editVaccine}`;
    const value = `${editClinic}, ${editType}, ${editDate}`;
    try {
      // Update both the key (vaccine name) and value (clinic, type, date)
      await updateMedicalEntry('history', vaccineId, value, key);
      setEditingId(null);
      setEditVaccine('');
      setEditClinic('');
      setEditType('Booster');
      setEditDate('');
    } catch (err) {
      console.error('Failed to update vaccination:', err);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditVaccine('');
    setEditClinic('');
    setEditType('Booster');
    setEditDate('');
  };

  const vaccinations = parseVaccinations();

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <h2 className="text-lg font-bold text-gray-800">Vaccinations</h2>
          </div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit2 size={14} />
              Edit
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingId(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Done
            </button>
          )}
        </div>

        {isExpanded && (
          <div className="space-y-3">
            {vaccinations.map((vaccine) => {
              const isCurrentlyEditing = editingId === vaccine.id;

              return (
                <div
                  key={vaccine.id}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  {isCurrentlyEditing && isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Vaccine Name</label>
                        <input
                          type="text"
                          value={editVaccine}
                          onChange={(e) => setEditVaccine(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Clinic/Location</label>
                        <input
                          type="text"
                          value={editClinic}
                          onChange={(e) => setEditClinic(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-700 mb-1 block">Type</label>
                          <select
                            value={editType}
                            onChange={(e) => setEditType(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Booster">Booster</option>
                            <option value="Annual">Annual</option>
                            <option value="Initial">Initial</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-700 mb-1 block">Date (DD/MM/YYYY)</label>
                      <input 
                            type="text"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="DD/MM/YYYY"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                      <button 
                          onClick={() => handleEditSave(vaccine.id)}
                        disabled={isLoading}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                          <Save size={14} />
                          Save
                      </button>
                      <button 
                          onClick={handleEditCancel}
                        disabled={isLoading}
                          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm rounded-md hover:bg-gray-50 disabled:opacity-50"
                      >
                          <X size={14} />
                          Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{vaccine.name}</h3>
                        {vaccine.clinic && (
                          <p className="text-xs text-gray-600 mb-2">{vaccine.clinic}</p>
                        )}
                        {vaccine.date && (
                          <p className="text-sm text-gray-800">{vaccine.date}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0 px-2.5 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap">
                          {vaccine.type}
                        </span>
                        {isEditing && (
                          <button
                            onClick={() => handleEditStart(vaccine)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isEditing && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Add New Vaccination</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Vaccine Name</label>
                    <input
                      type="text"
                      value={newVaccine}
                      onChange={(e) => setNewVaccine(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., COVID-19 (Pfizer)"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Clinic/Location</label>
                    <input
                      type="text"
                      value={newClinic}
                      onChange={(e) => setNewClinic(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., UNHCR Clinic, Za'atari"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1 block">Type</label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Booster">Booster</option>
                        <option value="Annual">Annual</option>
                        <option value="Initial">Initial</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1 block">Date (DD/MM/YYYY)</label>
                      <input
                        type="text"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="DD/MM/YYYY"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddVaccination}
                    disabled={isLoading || !newVaccine.trim()}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Plus size={14} />
                    Add Vaccination
                  </button>
                </div>
              </div>
            )}

            {!isEditing && vaccinations.length === 0 && (
              <p className="text-sm text-gray-500">No vaccinations recorded</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
