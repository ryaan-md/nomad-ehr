import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle, Loader2 } from 'lucide-react';

interface DecryptOverlayProps {
  isDecrypting: boolean;
  onComplete: () => void;
}

export const DecryptOverlay: React.FC<DecryptOverlayProps> = ({ isDecrypting, onComplete }) => {
  const [stage, setStage] = useState<'locked' | 'fetching' | 'access-granted' | 'decrypting'>('locked');

  useEffect(() => {
    if (isDecrypting) {
      // Stage 1: Fetching medical records (1.5 seconds)
      setStage('fetching');
      const timer1 = setTimeout(() => {
        // Stage 2: Access granted (1 second)
        setStage('access-granted');
      }, 1500);
      const timer2 = setTimeout(() => {
        // Stage 3: Decrypting medical records (4 seconds)
        setStage('decrypting');
      }, 2500);
      const timer3 = setTimeout(() => {
        // Complete after decrypting stage
        onComplete();
      }, 6500); // 2.5s (fetching + access) + 4s (decrypting) = 6.5s total
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      setStage('locked');
    }
  }, [isDecrypting, onComplete]);

  if (!isDecrypting && stage === 'locked') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-nomad-dark/95 backdrop-blur-xl text-white"
      >
        <div className="relative">
          {(stage === 'fetching' || stage === 'decrypting') && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="absolute -inset-4 border-2 border-t-nomad-teal border-r-transparent border-b-transparent border-l-transparent rounded-full"
            />
          )}
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-2xl bg-gray-800 shadow-2xl border border-gray-700 flex items-center justify-center"
          >
             {stage === 'fetching' ? (
                <Loader2 className="text-nomad-teal animate-spin" size={48} />
             ) : stage === 'access-granted' ? (
                <CheckCircle className="text-green-400" size={48} />
             ) : stage === 'decrypting' ? (
                <Lock className="text-nomad-teal" size={48} />
             ) : null}
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-2xl font-heading font-bold tracking-wide"
        >
          {stage === 'fetching' ? "Fetching medical records" : 
           stage === 'access-granted' ? "Access granted" : 
           stage === 'decrypting' ? "Decrypting medical records" : ""}
        </motion.h2>
        
        {stage === 'decrypting' && (
          <motion.div className="mt-4 font-mono text-sm text-gray-400 space-y-1 text-center">
            <p>Validating hash 0x8F2...</p>
            <p>Reconstructing version history...</p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};