import React, { useEffect } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Fullscreen Lightbox Modal component.
 * Allows viewing images in detail, navigating through the list, and supports keyboard controls.
 * 
 * @param {object} image - Current active image data object: { id, url, name }
 * @param {number} currentIndex - Index of active image in current list
 * @param {number} totalCount - Total images in active list
 * @param {function} onClose - Triggered when modal is closed
 * @param {function} onPrev - Triggered to navigate to previous image
 * @param {function} onNext - Triggered to navigate to next image
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
    // Lock scroll on body when modal is open
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
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950/95 backdrop-blur-sm p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Header Controls */}
      <div className="w-full flex items-center justify-between text-white py-2 px-4 md:px-8 z-10">
        <div className="flex flex-col">
          <span className="text-sm font-semibold truncate max-w-[250px] md:max-w-md">
            {image.name}
          </span>
          <span className="text-xs text-slate-400 font-medium mt-0.5">
            {currentIndex + 1} of {totalCount}
          </span>
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors focus-ring"
          title="Close (Esc)"
          aria-label="Close lightbox"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>

      {/* Main Showcase (Image + Arrow Buttons) */}
      <div className="relative flex-1 w-full flex items-center justify-center py-4">
        {/* Previous Image Control */}
        <button
          onClick={onPrev}
          className="absolute left-2 md:left-6 p-3.5 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/5 hover:border-white/10 transition-all duration-200 focus-ring z-10"
          title="Previous Image (Left Arrow)"
          aria-label="Previous image"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>

        {/* Enlarged Image */}
        <div className="relative max-w-full max-h-[75vh] md:max-h-[80vh] flex items-center justify-center px-4 md:px-12 select-none">
          <img
            src={image.url}
            alt={image.name}
            className="max-w-full max-h-[75vh] md:max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/5 animate-scaleUp"
          />
        </div>

        {/* Next Image Control */}
        <button
          onClick={onNext}
          className="absolute right-2 md:right-6 p-3.5 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/5 hover:border-white/10 transition-all duration-200 focus-ring z-10"
          title="Next Image (Right Arrow)"
          aria-label="Next image"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Footer Info / Space */}
      <div className="w-full text-center text-slate-500 text-xs py-4">
        Tip: Use your Keyboard Arrow Keys (← / →) to navigate, and Escape to close.
      </div>
    </div>
  );
};

export default Lightbox;
