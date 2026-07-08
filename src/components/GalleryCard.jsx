import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Maximize2, Image as ImageIcon } from 'lucide-react';

/**
 * Format file size helper.
 */
const formatFileSize = (bytes) => {
  if (!bytes) return '';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Format date string helper.
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Premium GalleryCard Component.
 * Styled with scale hover animations, overlay icons, metadata, and deletions.
 *
 * @param {object} image - Image data: { id, url, name, uploadedAt, size }
 * @param {function} onClick - Lightbox click callback
 * @param {function} onDelete - Deletion callback passing image object
 */
const GalleryCard = ({ image, onClick, onDelete }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation(); // Avoid launching the lightbox click callback
    onDelete(image);
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      onClick={onClick}
      className="group relative flex flex-col w-full rounded-2xl overflow-hidden bg-white border border-border-custom shadow-soft cursor-pointer select-none"
    >
      {/* 1. Zooming Image Asset */}
      <div className="w-full aspect-[4/3] overflow-hidden relative bg-bg-app border-b border-border-custom/50 flex items-center justify-center">
        {/* Shimmer skeleton shown while loading */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 shimmer z-10" />
        )}
        
        {/* Fallback icon shown if image fails to load */}
        {imageError ? (
          <div className="flex flex-col items-center justify-center text-text-secondary p-4 space-y-1">
            <ImageIcon className="w-8 h-8 opacity-40 text-text-secondary" />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Failed to load</span>
          </div>
        ) : (
          <img
            src={image.url}
            alt={image.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0 absolute'
            }`}
          />
        )}
        {/* Soft dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3.5">
          <div className="flex items-center gap-1 text-white text-[9px] font-extrabold uppercase tracking-widest bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
            <Maximize2 className="w-2.5 h-2.5" />
            <span>Maximize</span>
          </div>
        </div>
      </div>

      {/* 2. Top-Right Hover Toolbar (Delete Button) */}
      <div className="absolute top-3.5 right-3.5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-350 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDelete}
          className="w-8 h-8 rounded-xl bg-danger/10 hover:bg-danger text-danger hover:text-white transition-all duration-200 flex items-center justify-center shadow-md cursor-pointer border-none"
          title="Delete image"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* 3. Bottom White Panel Text Content */}
      <div className="p-4 bg-white flex flex-col flex-grow">
        <h3 className="text-sm font-bold text-text-primary truncate" title={image.name}>
          {image.name}
        </h3>
        
        {/* Metadata sub-row */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border-custom text-[10px] font-bold text-text-secondary uppercase tracking-wider">
          <span>{formatDate(image.uploadedAt)}</span>
          {image.size && <span>{formatFileSize(image.size)}</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryCard;
