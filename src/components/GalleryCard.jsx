import React, { useState } from 'react';
import { FiTrash2, FiMaximize2, FiLoader } from 'react-icons/fi';

/**
 * Helper to format date strings.
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
 * GalleryCard component for displaying a single image in the gallery.
 * Features hover effects, click to enlarge, and an instant delete trigger.
 * 
 * @param {object} image - Image data: { id, url, name, uploadedAt }
 * @param {function} onClick - Callback to open this image in the lightbox.
 * @param {function} onDelete - Callback to delete this image.
 */
const GalleryCard = ({ image, onClick, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent opening the lightbox
    if (window.confirm(`Are you sure you want to delete "${image.name}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(image.id);
      } catch (err) {
        console.error('Failed to delete image:', err);
        alert('Failed to delete image. Please try again.');
        setIsDeleting(false);
      }
    }
  };

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden bg-white border border-slate-100 rounded-2xl shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Image container */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <img
          src={image.url}
          alt={image.name}
          loading="lazy"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-slate-800 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <FiMaximize2 className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        {/* Delete button (absolute positioned top-right) */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-3 right-3 p-2.5 rounded-xl bg-white/90 backdrop-blur-sm text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-100/50 shadow-sm transition-all duration-200 focus-ring z-10 disabled:opacity-75 disabled:cursor-not-allowed"
          title="Delete image"
          aria-label="Delete image"
        >
          {isDeleting ? (
            <FiLoader className="w-4 h-4 animate-spin text-slate-500" />
          ) : (
            <FiTrash2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Info footer */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <h4 className="text-sm font-semibold text-slate-800 truncate" title={image.name}>
          {image.name}
        </h4>
        {image.uploadedAt && (
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Uploaded: {formatDate(image.uploadedAt)}
          </p>
        )}
      </div>
    </div>
  );
};

export default GalleryCard;
