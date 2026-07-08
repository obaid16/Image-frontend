import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiMaximize2, FiLoader } from 'react-icons/fi';

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
 * @param {function} onDelete - Deletion promise callback
 */
const GalleryCard = ({ image, onClick, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation(); // Avoid launching the lightbox click callback
    if (window.confirm(`Are you sure you want to delete "${image.name}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(image.id);
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete image. Please try again.');
        setIsDeleting(false);
      }
    }
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      onClick={onClick}
      className="group relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100/80 shadow-soft cursor-pointer select-none"
    >
      {/* 1. Zooming Image Asset */}
      <div className="w-full h-full overflow-hidden relative">
        <img
          src={image.url}
          alt={image.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Soft dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* 2. Top-Right Hover Toolbar (Delete Button) */}
      <div className="absolute top-3.5 right-3.5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors focus-ring border-none shadow-md cursor-pointer"
          title="Delete image"
        >
          {isDeleting ? (
            <FiLoader className="w-4 h-4 animate-spin text-rose-500" />
          ) : (
            <FiTrash2 className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {/* 3. Bottom Gradient Text Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-350 bg-gradient-to-t from-black/70 via-black/40 to-transparent pt-12">
        <div className="flex items-center gap-1.5 text-blue-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">
          <FiMaximize2 className="w-3 h-3" />
          <span>Click to view</span>
        </div>
        <h3 className="text-sm font-bold text-white truncate" title={image.name}>
          {image.name}
        </h3>
        
        {/* Metadata sub-row */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
          <span>{formatDate(image.uploadedAt)}</span>
          {image.size && <span>{formatFileSize(image.size)}</span>}
        </div>
      </div>

      {/* Static fallbacks (Visible when overlay is off) */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5 bg-gradient-to-t from-slate-900/60 to-transparent group-hover:opacity-0 transition-opacity duration-200 z-10 pointer-events-none">
        <h4 className="text-xs font-bold text-white truncate">
          {image.name}
        </h4>
      </div>
    </motion.div>
  );
};

export default GalleryCard;
