import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronRight, ChevronLeft, Film, Image as ImageIcon } from 'lucide-react';

export interface MediaSlide {
  id: number;
  type: 'video' | 'image';
  src: string;
  title: string;
  subtitle?: string;
}

const MEDIA_PLAYLIST: MediaSlide[] = [
  {
    id: 1,
    type: 'video',
    src: '/assets/videos/video1.mp4',
    title: 'Morning Harvest Routine',
    subtitle: 'Kisaan Field Preparations',
  },
  {
    id: 2,
    type: 'image',
    src: '/assets/farmer_woman_harvest.jpg',
    title: 'Joyful Golden Grain Winnowing',
    subtitle: 'Traditional Post-Harvest Care',
  },
  {
    id: 3,
    type: 'video',
    src: '/assets/videos/video2.mp4',
    title: 'Fresh Farm Produce Curation',
    subtitle: 'From Soil to Table Experience',
  },
  {
    id: 4,
    type: 'image',
    src: '/assets/farmer_capsicum.jpg',
    title: 'Fresh Green Capsicum Harvest',
    subtitle: 'Direct Organic Cultivation',
  },
  {
    id: 5,
    type: 'video',
    src: '/assets/videos/video3.mp4',
    title: 'Modern Agricultural Storytelling',
    subtitle: 'Empowering Indian Farmers',
  },
  {
    id: 6,
    type: 'image',
    src: '/assets/farmer_papaya_basket.jpg',
    title: 'Fresh Papaya Harvest Basket',
    subtitle: 'Local Orchard Produce',
  },
  {
    id: 7,
    type: 'image',
    src: '/assets/farmer_wheat_sunrise.jpg',
    title: 'Green Wheat Field at Sunrise',
    subtitle: 'Rural India Agricultural Heritage',
  },
  {
    id: 8,
    type: 'image',
    src: '/assets/farmer_smiling_harvest.jpg',
    title: 'Proud Grower with Harvest Yield',
    subtitle: 'Fair Market Prosperity',
  },
  {
    id: 9,
    type: 'image',
    src: '/assets/farmer_female_field.jpg',
    title: 'Women in Indian Agriculture',
    subtitle: 'Nurturing Every Seed',
  },
];

export const AnimatedSkyBackground: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentSlide = MEDIA_PLAYLIST[currentIndex];

  // Auto-advance logic
  useEffect(() => {
    if (!isPlaying) return;

    // For images: advance after 5.5 seconds
    if (currentSlide.type === 'image') {
      const timer = setTimeout(() => {
        handleNext();
      }, 5500);
      return () => clearTimeout(timer);
    }

    // For videos: fallback timeout in case video stalls or fails to trigger onEnded
    const fallbackTimer = setTimeout(() => {
      handleNext();
    }, 11000);

    return () => clearTimeout(fallbackTimer);
  }, [currentIndex, isPlaying, currentSlide.type]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % MEDIA_PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + MEDIA_PLAYLIST.length) % MEDIA_PLAYLIST.length);
  };

  const handleVideoEnded = () => {
    if (isPlaying) {
      handleNext();
    }
  };

  const handleVideoError = () => {
    handleNext();
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none w-full h-full bg-stone-950"
    >
      {/* 1. Fullscreen Media Slideshow Layer (Videos & Photos Alternating) */}
      <AnimatePresence mode="wait">
        {currentSlide.type === 'video' ? (
          <motion.div
            key={`full-video-${currentSlide.id}-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <video
              ref={videoRef}
              src={currentSlide.src}
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnded}
              onError={handleVideoError}
              className="w-full h-full object-cover filter brightness-[0.82] contrast-[1.05]"
            />
          </motion.div>
        ) : (
          <motion.div
            key={`full-image-${currentSlide.id}-${currentIndex}`}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.0, ease: 'easeInOut' },
              scale: { duration: 6.5, ease: 'easeOut' },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentSlide.src}
              alt={currentSlide.title}
              onError={() => handleNext()}
              className="w-full h-full object-cover filter brightness-[0.82] contrast-[1.05]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Balanced Atmospheric Vignette Scrim (Ensures 100% text readability without dimming the video) */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/65 via-stone-950/30 to-stone-950/75" />
      <div className="absolute inset-0 bg-stone-950/20" />

      {/* 3. Glowing Radiant Sun at Top-Right */}
      <div className="absolute top-5 sm:top-8 right-8 sm:right-24 z-10 opacity-90 pointer-events-none">
        {/* Outer Solar Corona Pulse */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.55, 0.3],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -inset-8 sm:-inset-12 rounded-full bg-gradient-to-r from-amber-300/40 via-yellow-200/30 to-amber-400/40 blur-2xl"
        />

        {/* Mid Solar Flare */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 90, 180, 270, 360],
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
              '0 0 35px 8px rgba(251, 191, 36, 0.45)',
              '0 0 50px 14px rgba(251, 191, 36, 0.6)',
              '0 0 35px 8px rgba(251, 191, 36, 0.45)',
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-yellow-100 via-amber-300 to-amber-500 shadow-xl relative"
        >
          <div className="absolute inset-0 rounded-full bg-radial-gradient from-white/60 to-transparent" />
        </motion.div>
      </div>

      {/* 4. Layered Realistic SVG Clouds Drifting Across Horizon & Occluding Sun */}
      {/* Cloud Layer 1: High Wispy Cloud */}
      <motion.div
        initial={{ x: '-20vw' }}
        animate={{ x: '110vw' }}
        transition={{
          duration: 75,
          repeat: Infinity,
          ease: 'linear',
          delay: 0,
        }}
        className="absolute top-2 sm:top-5 left-0 z-5 opacity-35 scale-75 sm:scale-90 pointer-events-none"
      >
        <CloudShape width={240} height={70} />
      </motion.div>

      {/* Cloud Layer 2: PRIMARY SUN-OCCLUDING CLOUD (z-20 in front of the sun) */}
      <motion.div
        initial={{ x: '-30vw' }}
        animate={{ x: '115vw' }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: 'linear',
          delay: 3,
        }}
        className="absolute top-5 sm:top-8 left-0 z-20 opacity-80 scale-100 sm:scale-120 filter drop-shadow-sm pointer-events-none"
      >
        <CloudShape width={310} height={90} dense />
      </motion.div>

      {/* Cloud Layer 3: Mid-Sky Cloud */}
      <motion.div
        initial={{ x: '-25vw' }}
        animate={{ x: '115vw' }}
        transition={{
          duration: 55,
          repeat: Infinity,
          ease: 'linear',
          delay: 16,
        }}
        className="absolute top-20 sm:top-24 left-0 z-5 opacity-40 scale-90 sm:scale-105 pointer-events-none"
      >
        <CloudShape width={280} height={80} />
      </motion.div>

      {/* 5. Bottom Interactive Controls Pill */}
      <div className="absolute bottom-4 left-6 z-30 pointer-events-auto flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/25 text-white text-[11px] font-bold flex items-center gap-2 shadow-2xl">
          {currentSlide.type === 'video' ? (
            <Film className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          ) : (
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span className="hidden sm:inline">
            {currentSlide.type === 'video' ? 'Live Video' : 'Farmer Photo'}:
          </span>
          <span className="text-amber-200 truncate max-w-[140px] sm:max-w-xs">{currentSlide.title}</span>
          <span className="text-white/40">•</span>
          <span className="text-white/80 font-mono text-[10px]">
            {currentIndex + 1}/{MEDIA_PLAYLIST.length}
          </span>
        </div>

        {/* Play / Pause Toggle */}
        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
          className="p-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/25 text-white/90 hover:text-white hover:bg-black/85 transition-colors shadow-lg cursor-pointer"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Previous / Next buttons */}
        <button
          type="button"
          onClick={handlePrev}
          title="Previous Slide"
          className="p-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/25 text-white/90 hover:text-white hover:bg-black/85 transition-colors shadow-lg cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          title="Next Slide"
          className="p-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/25 text-white/90 hover:text-white hover:bg-black/85 transition-colors shadow-lg cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Right Slide Progress Dots */}
      <div className="absolute bottom-4 right-6 z-30 pointer-events-auto hidden md:flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-2 rounded-full border border-white/20 shadow-lg">
        {MEDIA_PLAYLIST.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all rounded-full cursor-pointer ${
              idx === currentIndex
                ? 'w-6 h-1.5 bg-amber-400'
                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
            }`}
            title={slide.title}
          />
        ))}
      </div>
    </div>
  );
};

// Reusable SVG Cloud Component
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
      <g fill={dense ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.72)'}>
        <ellipse cx="100" cy="46" rx="80" ry="16" />
        <circle cx="50" cy="40" r="22" />
        <circle cx="95" cy="30" r="28" />
        <circle cx="135" cy="34" r="24" />
        <circle cx="160" cy="44" r="16" />
        <circle cx="32" cy="46" r="14" />
      </g>
    </svg>
  );
};
