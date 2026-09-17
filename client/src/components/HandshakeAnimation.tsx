import React from 'react';
import { motion } from 'framer-motion';

export const HandshakeAnimation: React.FC<{ className?: string }> = ({ className = 'w-64 h-64' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Background Soft Glowing Aura */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.6, 0.35],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400/30 via-amber-300/30 to-emerald-500/20 blur-2xl"
      />

      {/* Floating Botanical Elements */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          rotate: [-4, 6, -4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-3 -right-2 text-2xl"
      >
        🌾
      </motion.div>

      <motion.div
        animate={{
          y: [6, -6, 6],
          rotate: [4, -6, 4],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-2 -left-2 text-2xl"
      >
        🌱
      </motion.div>

      {/* Main Handshake SVG Illustration */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-md"
      >
        {/* Sunbeam burst behind handshake */}
        <circle cx="100" cy="100" r="75" stroke="#86efac" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6" />
        
        {/* Left Hand: Farmer (with plaid sleeve & sturdy grip) */}
        <motion.g
          initial={{ x: -25, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Farmer Sleeve */}
          <path
            d="M20 75 L60 85 L50 120 L15 105 Z"
            fill="#15803d"
            stroke="#166534"
            strokeWidth="2"
          />
          {/* Plaid stripe details */}
          <line x1="30" y1="78" x2="25" y2="108" stroke="#86efac" strokeWidth="1.5" />
          <line x1="45" y1="82" x2="38" y2="114" stroke="#86efac" strokeWidth="1.5" />
          <line x1="20" y1="92" x2="55" y2="103" stroke="#86efac" strokeWidth="1.5" />

          {/* Farmer Forearm & Palm */}
          <path
            d="M58 86 C65 89 74 92 84 94 C92 95 98 100 100 106 C101 112 95 118 86 117 C78 116 70 113 52 118 Z"
            fill="#e0a96d"
            stroke="#b87333"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Thumb */}
          <path
            d="M75 87 C80 80 88 78 94 82 C98 85 96 92 90 95 C85 97 80 95 76 92"
            fill="#e0a96d"
            stroke="#b87333"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Right Hand: Customer (Modern clean cuff & warm clasp) */}
        <motion.g
          initial={{ x: 25, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        >
          {/* Customer Cuff */}
          <path
            d="M180 82 L142 88 L148 122 L185 110 Z"
            fill="#0284c7"
            stroke="#0369a1"
            strokeWidth="2"
          />
          {/* Customer Forearm */}
          <path
            d="M144 89 C136 91 127 94 116 95 C108 97 104 102 102 108 C100 114 106 120 115 119 C124 118 132 115 146 120 Z"
            fill="#f6c28b"
            stroke="#c88242"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Customer Clasping Fingers */}
          <path
            d="M103 98 C108 97 114 100 113 106 C112 111 106 113 101 110 C96 107 98 100 103 98 Z"
            fill="#f6c28b"
            stroke="#c88242"
            strokeWidth="2"
          />
          {/* Thumb */}
          <path
            d="M125 88 C120 81 112 79 106 83 C102 86 104 93 110 96 C115 98 120 96 124 93"
            fill="#f6c28b"
            stroke="#c88242"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Heart / Leaf Connection Sparkle */}
        <motion.path
          d="M100 70 C100 65 106 60 111 65 C116 70 100 80 100 80 C100 80 84 70 89 65 C94 60 100 65 100 70 Z"
          fill="#22c55e"
          animate={{
            scale: [0.9, 1.25, 0.9],
            y: [-2, 2, -2],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Sparkle stars */}
        <motion.circle
          cx="70"
          cy="60"
          r="3"
          fill="#facc15"
          animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
        />
        <motion.circle
          cx="130"
          cy="65"
          r="3.5"
          fill="#facc15"
          animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1.1 }}
        />
        <motion.circle
          cx="100"
          cy="140"
          r="2.5"
          fill="#4ade80"
          animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
        />
      </svg>
    </div>
  );
};
