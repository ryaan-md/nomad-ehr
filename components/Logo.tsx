import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: { icon: 'w-6 h-6', text: 'text-base' },
    md: { icon: 'w-8 h-8', text: 'text-lg' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl' }
  };

  const currentSize = sizeClasses[size];

  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo Icon */}
      <div className={`${currentSize.icon} relative`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Globe/World Circle */}
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="url(#nomad-gradient)"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white"
          />
          
          {/* Medical Cross */}
          <path
            d="M32 16 L32 48 M16 32 L48 32"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
          
          {/* Nomad Path (curved line around globe) */}
          <path
            d="M10 32 Q32 10 54 32 Q32 54 10 32"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.3"
            fill="none"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="nomad-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className={`${currentSize.text} font-heading font-bold`}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-nomad-teal to-blue-600">
            Nomad
          </span>
          <span className="text-gray-900 ml-1">Health</span>
        </div>
      )}
    </motion.div>
  );
};

