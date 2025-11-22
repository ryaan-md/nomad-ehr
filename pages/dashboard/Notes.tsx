import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, FileText, Paperclip, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Notes = () => {
  const { record, addNote, emergencyMode, isLoading, error } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (newNoteContent.trim()) {
      try {
        await addNote(newNoteContent);
        setNewNoteContent("");
        setIsModalOpen(false);
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Failed to add note');
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className={`font-bold text-lg ${emergencyMode ? 'text-yellow-400' : 'text-gray-800'}`}>Timeline & Clinical Encounters</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-nomad-teal text-white px-4 py-2 rounded-lg shadow-lg shadow-nomad-teal/30 hover:bg-teal-500 transition flex items-center gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          Add Entry
        </button>
      </div>

      <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
        {record.notes.map((note, index) => (
          <motion.div 
            key={note.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[23px] top-4 w-4 h-4 rounded-full border-2 border-white bg-nomad-teal shadow-sm z-10">
               <div className="w-full h-full animate-ping absolute bg-nomad-teal rounded-full opacity-20"></div>
            </div>

            <div className={`rounded-xl border p-5 relative ${
                emergencyMode ? 'bg-gray-900 border-yellow-900' : 'bg-white border-gray-100 shadow-sm'
            }`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-mono ${emergencyMode ? 'bg-yellow-900 text-yellow-400' : 'bg-blue-50 text-blue-600'}`}>
                    {note.commitHash}
                  </span>
                  <span className={`text-sm font-bold ${emergencyMode ? 'text-white' : 'text-gray-900'}`}>{note.author}</span>
                </div>
                <span className="text-xs text-gray-400">
                   {new Date(note.timestamp).toLocaleString()}
                </span>
              </div>
              
              <p className={`text-sm leading-relaxed whitespace-pre-wrap ${emergencyMode ? 'text-yellow-100' : 'text-gray-600'}`}>
                {note.content}
              </p>

              {note.attachments && note.attachments.length > 0 && (
                <div className="mt-4 flex gap-2">
                  {note.attachments.map((att, i) => (
                    <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${
                        emergencyMode ? 'bg-black border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}>
                      <Paperclip size={12} />
                      <span>Attachment {i + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${emergencyMode ? 'bg-gray-900' : 'bg-white'}`}
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className={`font-bold ${emergencyMode ? 'text-yellow-400' : 'text-gray-900'}`}>New Clinical Note</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                {submitError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                    {submitError}
                  </div>
                )}
                <textarea
                  autoFocus
                  className={`w-full h-40 p-4 rounded-xl border resize-none focus:ring-2 focus:ring-nomad-teal focus:outline-none ${
                      emergencyMode ? 'bg-black border-gray-700 text-yellow-300' : 'bg-gray-50 border-gray-200 text-gray-800'
                  }`}
                  placeholder="Document clinical observations, treatments, or referrals..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  disabled={isLoading}
                />
                <div className="flex justify-between items-center mt-4">
                   <button 
                     type="button" 
                     className="text-nomad-teal text-sm font-medium flex items-center gap-1 disabled:opacity-50"
                     disabled={isLoading}
                   >
                      <Paperclip size={16} /> Add Attachment
                   </button>
                   <button 
                     type="submit" 
                     className="bg-nomad-dark text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                     disabled={isLoading || !newNoteContent.trim()}
                   >
                      {isLoading ? 'Saving...' : 'Commit Note'}
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};