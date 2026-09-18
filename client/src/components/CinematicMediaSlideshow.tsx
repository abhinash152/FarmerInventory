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
    title: 'Morning Harvest & Agricultural Routine',
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

interface CinematicMediaSlideshowProps {
  className?: string;
  overlayOpacity?: string;
  autoPlayInterval?: number; // ms for images
}

export const CinematicMediaSlideshow: React.FC<CinematicMediaSlideshowProps> = ({
  className = 'absolute inset-0 w-full h-full',
  overlayOpacity = 'bg-stone-950/70 dark:bg-stone-950/80',
  autoPlayInterval = 6000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentSlide = MEDIA_PLAYLIST[currentIndex];

  // Auto-advance logic
  useEffect(() => {
    if (!isPlaying) return;

    // For images: advance after autoPlayInterval
    if (currentSlide.type === 'image') {
      const timer = setTimeout(() => {
        handleNext();
      }, autoPlayInterval);
      return () => clearTimeout(timer);
    }

    // For videos: fallback timeout in case video stalls or fails to trigger onEnded
    const fallbackTimer = setTimeout(() => {
      handleNext();
    }, 12000);

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
    // If a video fails to load, gracefully skip to next slide
    handleNext();
  };

  return (
    <div className={`overflow-hidden select-none pointer-events-none ${className}`}>
      {/* Slides Transition Container */}
      <AnimatePresence mode="wait">
        {currentSlide.type === 'video' ? (
          <motion.div
            key={`video-${currentSlide.id}-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
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
              className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
            />
          </motion.div>
        ) : (
          <motion.div
            key={`image-${currentSlide.id}-${currentIndex}`}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.9, ease: 'easeInOut' },
              scale: { duration: 7, ease: 'easeOut' },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentSlide.src}
              alt={currentSlide.title}
              onError={() => handleNext()}
              className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Vignette & Readability Gradient Overlays */}
      <div className={`absolute inset-0 ${overlayOpacity} transition-colors duration-500`} />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-transparent to-stone-950/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-transparent" />

      {/* Subtle Slide Type & Media Indicator Pill (Bottom Left) */}
      <div className="absolute bottom-4 left-6 z-20 pointer-events-auto flex items-center gap-2">
        <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold flex items-center gap-1.5 shadow-lg">
          {currentSlide.type === 'video' ? (
            <Film className="w-3 h-3 text-amber-400 animate-pulse" />
          ) : (
            <ImageIcon className="w-3 h-3 text-emerald-400" />
          )}
          <span>{currentSlide.type === 'video' ? 'Cinematic Video' : 'Farmer Story'}</span>
          <span className="text-white/40">•</span>
          <span className="text-white/80">
            {currentIndex + 1} / {MEDIA_PLAYLIST.length}
          </span>
        </div>

        {/* Play / Pause Toggle */}
        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          title={isPlaying ? 'Pause Background Slideshow' : 'Play Background Slideshow'}
          className="p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-black/80 transition-colors"
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>

        {/* Previous / Next buttons */}
        <button
          type="button"
          onClick={handlePrev}
          title="Previous Slide"
          className="p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-black/80 transition-colors"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          title="Next Slide"
          className="p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-black/80 transition-colors"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Slide Progress Dots (Bottom Center) */}
      <div className="absolute bottom-4 right-6 z-20 pointer-events-auto hidden sm:flex items-center gap-1.5">
        {MEDIA_PLAYLIST.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all rounded-full ${
              idx === currentIndex
                ? 'w-5 h-1.5 bg-amber-400'
                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
            }`}
            title={slide.title}
          />
        ))}
      </div>
    </div>
  );
};
