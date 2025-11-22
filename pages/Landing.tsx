import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Activity, FileText, Database, Lock, WifiOff, Shield, Network, Key, GitBranch, Hash } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';

export const Landing = () => {
  const { setCurrentView } = useApp();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-nomad-light overflow-hidden relative">
      {/* Logo in top left */}
      <div className="absolute top-6 left-6 z-20">
        <Logo size="md" showText={true} />
      </div>

      {/* Abstract Background Map */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
         <svg className="w-full h-full text-nomad-dark" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
             <path d="M0 0 C 50 100 80 100 100 0 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
         </svg>
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-nomad-light"></div>
      </div>

      <main className="flex-grow flex flex-col relative z-10 pt-10 overflow-y-auto">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center px-6 py-16 min-h-[80vh]">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center max-w-3xl"
          >
            <motion.div variants={item} className="flex justify-center mb-6">
               <div className="w-16 h-16 bg-gradient-to-br from-nomad-teal to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-nomad-teal/20">
                 <Globe className="text-white w-8 h-8" />
               </div>
            </motion.div>

            <motion.h1 variants={item} className="text-4xl md:text-6xl font-heading font-bold text-gray-900 leading-tight mb-6">
              Your health record,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nomad-teal to-blue-600">
                anywhere on earth.
              </span>
            </motion.h1>

            <motion.p variants={item} className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Portable. Transparent. Resilient. 
              Nomad EHR allows displaced patients and field clinicians to access secure medical history without central infrastructure.
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setCurrentView('access')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-400 text-white rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-blue-500 transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
              >
                <Lock size={18} strokeWidth={2} />
                Access Record
              </button>
              <button 
                onClick={() => setCurrentView('create')}
                className="w-full sm:w-auto px-8 py-4 bg-white text-nomad-dark border border-gray-200 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Activity size={18} />
                Create New
              </button>
            </motion.div>

            {/* Feature Cards */}
            <motion.div variants={item} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
               <FeatureCard 
                 icon={<WifiOff className="text-nomad-teal" />} 
                 title="Offline First" 
                 desc="Works without internet. Syncs securely when connectivity returns." 
               />
               <FeatureCard 
                 icon={<Database className="text-blue-500" />} 
                 title="Versioned History" 
                 desc="Every edit is a permanent commit. Nothing is ever lost." 
               />
               <FeatureCard 
                 icon={<FileText className="text-purple-500" />} 
                 title="Universal Access" 
                 desc="Log in with simple human identifiers. No ID cards required." 
               />
            </motion.div>
          </motion.div>
        </div>

        {/* Technical Architecture Section */}
        <TechnicalSection />
      </main>
      
      <footer className="p-6 text-center text-sm text-gray-400 relative z-10">
        <p>Prototype — Simulated End-to-End Encryption</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-6 bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-4 p-3 bg-gray-50 rounded-lg w-fit">{icon}</div>
    <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

const TechnicalSection = () => {
  return (
    <section className="w-full bg-white border-t border-gray-200 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nomad-teal to-blue-600">
              Blockchain-Powered
            </span>
            <br />
            Architecture
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built on distributed ledger technology with cryptographic encryption and peer-to-peer node synchronization
          </p>
        </motion.div>

        {/* Blockchain Encryption */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-nomad-teal/5 to-blue-50 rounded-3xl p-8 md:p-12 border border-nomad-teal/20">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-nomad-teal to-blue-600 rounded-xl shadow-lg">
                <Shield className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Blockchain-Based Encryption</h3>
                <p className="text-gray-600 text-lg">
                  Patient records are encrypted using AES-256-GCM with keys derived from multi-party authentication
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="text-nomad-teal w-6 h-6" />
                  <h4 className="text-xl font-bold text-gray-900">Two-Party Key Derivation</h4>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Encryption keys are generated using <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">PBKDF2</code> or <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">Argon2id</code> key derivation functions, combining credentials from both patient and accessor identities.
                </p>
                <div className="bg-gray-900 rounded-lg p-4 text-xs font-mono text-green-400 overflow-x-auto">
                  <div className="mb-2 text-gray-400">// Key derivation process</div>
                  <div>salt = generateRandomSalt(32 bytes)</div>
                  <div>iterations = 100,000</div>
                  <div>patientKey = PBKDF2(patientWords, salt, iterations)</div>
                  <div>accessorKey = PBKDF2(accessorWords, salt, iterations)</div>
                  <div>encryptionKey = HKDF(patientKey + accessorKey)</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="text-blue-600 w-6 h-6" />
                  <h4 className="text-xl font-bold text-gray-900">End-to-End Encryption</h4>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  All sensitive data (demographics, medical history, notes) is encrypted at rest using <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">AES-256-GCM</code>, providing authenticated encryption with associated data (AEAD).
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-nomad-teal mt-1">✓</span>
                    <span>128-bit authentication tag for tamper detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-nomad-teal mt-1">✓</span>
                    <span>Nonce-based encryption preventing replay attacks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-nomad-teal mt-1">✓</span>
                    <span>Keys never stored—only derived on-demand</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Distributed Node Network */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 border border-blue-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Network className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Distributed Node Network</h3>
                <p className="text-gray-600 text-lg">
                  Patient records are maintained across a peer-to-peer network of nodes using blockchain-like commit history
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <GitBranch className="text-blue-600 w-6 h-6" />
                  <h4 className="text-xl font-bold text-gray-900">Immutable Commit History</h4>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Every change to a patient record is recorded as a cryptographic commit, creating an append-only ledger that preserves complete audit history.
                </p>
                <div className="bg-gray-900 rounded-lg p-4 text-xs font-mono text-green-400">
                  <div className="mb-2 text-gray-400">// Commit structure</div>
                  <div>{"{"}</div>
                  <div className="ml-4">hash: SHA256(timestamp + previousHash + data)</div>
                  <div className="ml-4">timestamp: ISO 8601</div>
                  <div className="ml-4">author: accessorIdentity</div>
                  <div className="ml-4">message: changeDescription</div>
                  <div className="ml-4">signature: HMAC(commit, accessorKey)</div>
                  <div>{"}"}</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Hash className="text-purple-600 w-6 h-6" />
                  <h4 className="text-xl font-bold text-gray-900">Node Synchronization</h4>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Nodes automatically synchronize commit history using Merkle tree verification, ensuring consensus across the distributed network.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Each node maintains a local copy of encrypted records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Gossip protocol for efficient commit propagation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Merkle root verification prevents tampering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Conflict resolution via timestamp-ordered commits</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Node Network Visualization */}
            <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Network Topology</h4>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {[1, 2, 3, 4, 5, 6].map((node) => (
                  <motion.div
                    key={node}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + node * 0.1 }}
                    className="relative"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      N{node}
                    </div>
                    {node < 6 && (
                      <div className="absolute top-1/2 right-0 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform translate-x-full"></div>
                    )}
                  </motion.div>
                ))}
              </div>
              <p className="text-center text-gray-600 mt-4 text-sm">
                Each node stores encrypted patient records and synchronizes commit history peer-to-peer
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-nomad-teal/10 to-nomad-teal/5 rounded-2xl p-6 border border-nomad-teal/20">
            <Database className="text-nomad-teal w-8 h-8 mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">Content-Addressable Storage</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Records are stored using content-addressable hashing (SHA-256), enabling efficient deduplication and integrity verification.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <Shield className="text-blue-600 w-8 h-8 mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">Cryptographic Signatures</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Every commit is cryptographically signed using HMAC-SHA256 with the accessor's derived key, ensuring non-repudiation.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <Lock className="text-purple-600 w-8 h-8 mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">Zero-Knowledge Access</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Nodes can verify commit integrity without decrypting patient data, maintaining privacy while ensuring authenticity.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};