import React from 'react';
import GalleryCard from './GalleryCard';
import EmptyState from './EmptyState';

/**
 * Responsive Gallery Grid component.
 * Lays out GalleryCards in a responsive grid, and handles EmptyState rendering.
 * 
 * @param {Array} images - List of image objects to display
 * @param {function} onImageClick - Triggered when card is selected
 * @param {function} onImageDelete - Triggered when delete button is clicked
 */
const GalleryGrid = ({ images, onImageClick, onImageDelete }) => {
  // If no images, render EmptyState component
  if (!images || images.length === 0) {
    return (
      <div className="w-full py-12">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 w-full">
      {images.map((image, index) => (
        <GalleryCard
          key={image.id}
          image={image}
          onClick={() => onImageClick(image, index)}
          onDelete={onImageDelete}
        />
      ))}
    </div>
  );
};

export default GalleryGrid;
