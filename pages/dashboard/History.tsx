import React from 'react';
import { useApp } from '../../context/AppContext';
import { GitCommit, GitPullRequest, Clock, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export const History = () => {
  const { record, emergencyMode } = useApp();

  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-xl border flex items-start gap-4 ${
          emergencyMode ? 'bg-yellow-900/20 border-yellow-600/30 text-yellow-400' : 'bg-blue-50 border-blue-100 text-blue-800'
      }`}>
         <Database className="mt-1 shrink-0" size={20} />
         <div>
           <p className="font-bold text-sm">Immutable Ledger</p>
           <p className="text-xs opacity-80 mt-1">This record uses a content-addressable append-only log. Previous versions can be viewed but never altered or deleted.</p>
         </div>
      </div>

      <div className="space-y-0">
        {record.commits.map((commit, index) => (
          <motion.div 
            key={commit.hash}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-4 group"
          >
            {/* Left Column: Time & Hash */}
            <div className="w-24 flex flex-col items-end pt-1">
               <span className="font-mono text-xs text-gray-400">{commit.shortHash}</span>
               <span className="text-[10px] text-gray-400">{new Date(commit.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>

            {/* Center: Line & Icon */}
            <div className="relative flex flex-col items-center">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 ${
                   emergencyMode ? 'bg-black border-gray-700' : 'bg-white border-gray-100 shadow-sm'
               }`}>
                 {commit.type === 'note' ? <GitCommit size={14} className="text-nomad-teal" /> : <GitPullRequest size={14} className="text-purple-500" />}
               </div>
               {index !== record.commits.length - 1 && (
                 <div className="w-0.5 h-full bg-gray-200 absolute top-8"></div>
               )}
            </div>

            {/* Right: Content */}
            <div className="pb-8 pt-1 flex-grow">
               <h4 className={`text-sm font-bold ${emergencyMode ? 'text-yellow-200' : 'text-gray-800'}`}>{commit.message}</h4>
               <div className="flex items-center gap-2 mt-1">
                 <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                    {commit.author.charAt(0)}
                 </div>
                 <span className="text-xs text-gray-500">{commit.author}</span>
                 <span className="text-xs text-gray-300">•</span>
                 <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} /> {new Date(commit.timestamp).toLocaleDateString()}</span>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};