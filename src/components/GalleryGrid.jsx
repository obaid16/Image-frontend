import React from 'react';
import { motion } from 'framer-motion';
import GalleryCard from './GalleryCard';
import EmptyState from './EmptyState';

/**
 * Premium Responsive Gallery Grid.
 * Configured with responsive column bounds (5 columns desktop, 3 tablet, 2 mobile).
 * Features custom skeleton loader shimmers for outstanding initial UX.
 *
 * @param {Array} images - Array of active image objects
 * @param {function} onImageClick - Lightbox select callback
 * @param {function} onImageDelete - Deletion callback handler
 * @param {boolean} loading - State indicator for rendering skeleton loader
 */
const GalleryGrid = ({ images, onImageClick, onImageDelete, loading }) => {
  
  // 1. Shimmering Skeleton State
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
        {Array.from({ length: 9 }).map((_, idx) => (
          <motion.div
            key={`skeleton-${idx}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="w-full aspect-[4/5] rounded-2xl border border-slate-100/80 bg-white p-3.5 flex flex-col justify-between shadow-soft"
          >
            {/* Top image box skeleton */}
            <div className="w-full h-[75%] rounded-xl shimmer" />
            
            {/* Bottom metadata skeleton */}
            <div className="space-y-2.5 mt-3">
              <div className="w-[65%] h-3.5 rounded-lg shimmer" />
              <div className="flex justify-between items-center">
                <div className="w-[35%] h-2.5 rounded-md shimmer" />
                <div className="w-[20%] h-2.5 rounded-md shimmer" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // 2. Empty State
  if (!images || images.length === 0) {
    return (
      <div className="w-full py-16 flex items-center justify-center">
        <EmptyState />
      </div>
    );
  }

  // 3. Render Active Cards List
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.06
          }
        }
      }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full"
    >
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          variants={{
            hidden: { opacity: 0, y: 15 },
            show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } }
          }}
        >
          <GalleryCard
            image={image}
            onClick={() => onImageClick(image, index)}
            onDelete={onImageDelete}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default GalleryGrid;
