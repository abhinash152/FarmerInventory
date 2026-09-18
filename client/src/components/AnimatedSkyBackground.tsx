import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedSkyBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden transition-colors duration-700 select-none bg-gradient-to-b from-sky-200/50 via-sky-100/30 to-emerald-50/20 dark:from-sky-950/40 dark:via-slate-900/60 dark:to-emerald-950/20"
    >
      {/* Gentle Atmospheric Sky Tint */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-sky-100/30 dark:to-slate-950/40" />

      {/* Radiant Glowing Sun */}
      <div className="absolute top-6 sm:top-10 right-10 sm:right-28 z-10">
        {/* Outer Solar Corona Pulse */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -inset-8 sm:-inset-12 rounded-full bg-gradient-to-r from-amber-300/40 via-yellow-200/30 to-amber-400/40 blur-2xl dark:from-amber-500/20 dark:to-yellow-300/15"
        />

        {/* Mid Solar Flare */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 45, 90, 180],
          }}
          transition={{
            scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
          }}
          className="absolute -inset-4 sm:-inset-6 rounded-full bg-gradient-to-tr from-amber-400/30 via-yellow-300/30 to-orange-300/20 blur-lg"
        />

        {/* Sun Core Disc */}
        <motion.div
          animate={{
            scale: [1, 1.03, 1],
            boxShadow: [
              '0 0 40px 10px rgba(251, 191, 36, 0.45)',
              '0 0 55px 16px rgba(251, 191, 36, 0.6)',
              '0 0 40px 10px rgba(251, 191, 36, 0.45)',
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-yellow-100 via-amber-300 to-amber-500 dark:from-yellow-200 dark:via-amber-400 dark:to-orange-500 shadow-xl relative"
        >
          {/* Subtle Sun Surface Sheen */}
          <div className="absolute inset-0 rounded-full bg-radial-gradient from-white/60 to-transparent" />
        </motion.div>
      </div>

      {/* Cloud Layer 1: High Wispy Cloud (Distant, Slow Drift) */}
      <motion.div
        initial={{ x: '-20vw' }}
        animate={{ x: '110vw' }}
        transition={{
          duration: 75,
          repeat: Infinity,
          ease: 'linear',
          delay: 0,
        }}
        className="absolute top-3 sm:top-6 left-0 z-5 opacity-40 dark:opacity-20 scale-75 sm:scale-90"
      >
        <CloudShape width={240} height={70} />
      </motion.div>

      {/* Cloud Layer 2: PRIMARY SUN-OCCLUDING CLOUD
          Aligned exactly at the Sun's height (top-8 to top-14),
          passing directly in front of the sun with z-20.
          As it glides over, it gently hides the sun and lets it re-emerge naturally! */}
      <motion.div
        initial={{ x: '-30vw' }}
        animate={{ x: '115vw' }}
        transition={{
          duration: 48,
          repeat: Infinity,
          ease: 'linear',
          delay: 4,
        }}
        className="absolute top-6 sm:top-10 left-0 z-20 opacity-85 dark:opacity-50 scale-100 sm:scale-125 filter drop-shadow-sm"
      >
        <CloudShape width={310} height={90} dense />
      </motion.div>

      {/* Cloud Layer 3: Secondary Mid-Sky Cloud */}
      <motion.div
        initial={{ x: '-25vw' }}
        animate={{ x: '115vw' }}
        transition={{
          duration: 56,
          repeat: Infinity,
          ease: 'linear',
          delay: 18,
        }}
        className="absolute top-24 sm:top-28 left-0 z-5 opacity-60 dark:opacity-30 scale-90 sm:scale-110"
      >
        <CloudShape width={280} height={80} />
      </motion.div>

      {/* Cloud Layer 4: Lower Sky Broad Horizon Cloud */}
      <motion.div
        initial={{ x: '-35vw' }}
        animate={{ x: '115vw' }}
        transition={{
          duration: 68,
          repeat: Infinity,
          ease: 'linear',
          delay: 26,
        }}
        className="absolute top-44 sm:top-56 left-0 z-5 opacity-35 dark:opacity-20 scale-110 sm:scale-135"
      >
        <CloudShape width={360} height={95} />
      </motion.div>

      {/* Cloud Layer 5: Fast Little Puffy Cloud Passing Under Sun */}
      <motion.div
        initial={{ x: '-15vw' }}
        animate={{ x: '115vw' }}
        transition={{
          duration: 38,
          repeat: Infinity,
          ease: 'linear',
          delay: 34,
        }}
        className="absolute top-16 sm:top-20 left-0 z-20 opacity-70 dark:opacity-40 scale-75"
      >
        <CloudShape width={210} height={65} dense />
      </motion.div>
    </div>
  );
};

// Reusable Realistic SVG Cloud Component
const CloudShape: React.FC<{ width: number; height: number; dense?: boolean }> = ({
  width,
  height,
  dense = false,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="filter drop-shadow-sm"
    >
      <g fill={dense ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.78)'}>
        {/* Base flat puff */}
        <ellipse cx="100" cy="46" rx="80" ry="16" />
        {/* Left cloud bump */}
        <circle cx="50" cy="40" r="22" />
        {/* Tall central main bump */}
        <circle cx="95" cy="30" r="28" />
        {/* Secondary right bump */}
        <circle cx="135" cy="34" r="24" />
        {/* Far right small puff */}
        <circle cx="160" cy="44" r="16" />
        {/* Far left small puff */}
        <circle cx="32" cy="46" r="14" />
      </g>
    </svg>
  );
};
