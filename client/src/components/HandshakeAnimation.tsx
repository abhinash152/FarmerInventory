import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

export const HandshakeAnimation: React.FC<{ className?: string }> = ({ className = 'w-full max-w-md' }) => {
  const [claspCount, setClaspCount] = useState(0);
  const [isClasping, setIsClasping] = useState(false);

  const triggerClasp = () => {
    setIsClasping(true);
    setClaspCount((c) => c + 1);
    setTimeout(() => setIsClasping(false), 900);
  };

  return (
    <div className={`relative select-none ${className}`}>
      {/* Outer Golden Hour Ambient Glow */}
      <motion.div
        animate={{
          scale: [1, 1.04, 1],
          opacity: [0.4, 0.65, 0.4],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-amber-500/25 via-emerald-500/20 to-yellow-500/25 blur-xl pointer-events-none"
      />

      {/* Main Photographic & Interactive Handshake Card */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-amber-300/60 dark:border-amber-500/40 shadow-2xl bg-stone-900 group">
        {/* Real Sunset Field Handshake Photography */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src="/assets/handshake_sunset.jpg"
            alt="Farmer and Customer Handshake at Sunset in Wheat Field"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
            onError={(e) => {
              // Graceful fallback if image unavailable
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />

          {/* Golden Hour Sunset Warm Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-transparent to-amber-950/40" />

          {/* Central Handshake Energy Flare at Clasp Center */}
          <motion.div
            key={claspCount}
            initial={{ scale: 0.8, opacity: 0.3 }}
            animate={{
              scale: isClasping ? [1, 1.6, 1.1] : [1, 1.15, 1],
              opacity: isClasping ? [0.8, 1, 0.85] : [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: isClasping ? 0.8 : 3.5,
              repeat: isClasping ? 0 : Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-gradient-to-r from-amber-300/40 via-yellow-200/50 to-orange-400/40 blur-xl pointer-events-none"
          />

          {/* Golden Pulse Shockwave on Clasp */}
          <AnimatePresence>
            {isClasping && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0.9 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-yellow-300 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Floating Golden Sparks & Agricultural Particles */}
          <motion.div
            animate={{ y: [-4, 6, -4], x: [-3, 3, -3], rotate: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-6 left-6 text-xl filter drop-shadow-md pointer-events-none"
          >
            🌾
          </motion.div>

          <motion.div
            animate={{ y: [4, -6, 4], x: [3, -3, 3], rotate: [5, -5, 5] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute top-8 right-8 text-xl filter drop-shadow-md pointer-events-none"
          >
            🌱
          </motion.div>

          <motion.div
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className="absolute top-14 left-1/2 -translate-x-1/2 text-yellow-300 text-lg filter drop-shadow pointer-events-none"
          >
            ✨
          </motion.div>

          {/* Dynamic Trust Handshake Seal Ribbon */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-stone-900/85 backdrop-blur-md text-emerald-300 border border-emerald-500/40 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Direct Kisaan-Grahak Trust
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/90 text-stone-950 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Fair Price
            </span>
          </div>

          {/* Side Indicator Badges: Farmer & Customer */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-emerald-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-400/50 text-white shadow-lg text-left"
            >
              <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Producer</div>
              <div className="text-xs font-black flex items-center gap-1">
                <span>👨‍🌾</span>
                <span>Kisaan / Farmer</span>
              </div>
            </motion.div>

            {/* Center Clasp Button Micro-Interaction */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={triggerClasp}
              title="Click to Seal Trust Handshake"
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/40 border-2 border-white hover:brightness-110 active:scale-95 transition-all cursor-pointer z-10"
            >
              <HeartHandshake className="w-5 h-5" />
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-amber-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-400/50 text-white shadow-lg text-right"
            >
              <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Consumer</div>
              <div className="text-xs font-black flex items-center gap-1 justify-end">
                <span>Grahak / Buyer</span>
                <span>🛒</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Slogan Banner Footer */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 p-3 text-stone-950 text-center flex flex-col sm:flex-row items-center justify-between px-5 gap-1.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-stone-900 shrink-0" />
            <span className="font-black text-sm tracking-wide">
              “Fasal wahi, raasta naya”
            </span>
          </div>
          <span className="text-[11px] font-bold text-stone-800 tracking-tight">
            Kisaan se seedha Grahak Tak — Kam Log, Behtar Daam
          </span>
        </div>
      </div>
    </div>
  );
};
