import React, { useEffect } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium Fullscreen Lightbox Modal.
 * Uses Framer Motion for backdrop fades, image scaling, and layout transitions.
 * Supports complete keyboard navigation.
 * 
 * @param {object} image - Current active image data object: { id, url, name }
 * @param {number} currentIndex - Index of active image in list
 * @param {number} totalCount - Total images in list
 * @param {function} onClose - Modal close callback
 * @param {function} onPrev - Left arrow navigation callback
 * @param {function} onNext - Right arrow navigation callback
 */
const Lightbox = ({ image, currentIndex, totalCount, onClose, onPrev, onNext }) => {
  
  // Handle keyboard events (Left, Right, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock background scroll when open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  // Handle backdrop clicks (close if clicked outside the image/controls)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950/95 backdrop-blur-md p-4 select-none"
        role="dialog"
        aria-modal="true"
      >
        {/* 1. Header Toolbar */}
        <div className="w-full max-w-7xl flex items-center justify-between text-white py-4 px-4 md:px-8 z-10 border-b border-white/5">
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold truncate max-w-[200px] md:max-w-md" title={image.name}>
              {image.name}
            </span>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-1">
              Image {currentIndex + 1} of {totalCount}
            </span>
          </div>
          
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/5 flex items-center justify-center transition-colors focus-ring cursor-pointer"
            title="Close (Esc)"
            aria-label="Close lightbox"
          >
            <FiX className="w-5 h-5" />
          </motion.button>
        </div>

        {/* 2. Main Carousel Viewport */}
        <div className="relative flex-1 w-full max-w-7xl flex items-center justify-center py-4">
          
          {/* Left Arrow Button */}
          <div className="absolute left-2 md:left-6 z-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onPrev}
              className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/5 flex items-center justify-center transition-all duration-200 focus-ring cursor-pointer"
              title="Previous Image (Left Arrow)"
              aria-label="Previous image"
            >
              <FiChevronLeft className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Active Image Showcase Box */}
          <div className="relative max-w-full max-h-[70vh] md:max-h-[75vh] flex items-center justify-center px-4 md:px-16">
            <motion.img
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              src={image.url}
              alt={image.name}
              className="max-w-full max-h-[70vh] md:max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>

          {/* Right Arrow Button */}
          <div className="absolute right-2 md:right-6 z-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onNext}
              className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/5 flex items-center justify-center transition-all duration-200 focus-ring cursor-pointer"
              title="Next Image (Right Arrow)"
              aria-label="Next image"
            >
              <FiChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* 3. Helper Info Footer */}
        <div className="w-full text-center text-slate-500 text-[10px] font-bold uppercase tracking-wider py-4 border-t border-white/5">
          Use Left/Right keyboard arrows to navigate • Escape to exit
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
