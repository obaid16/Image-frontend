import React, { useState, useEffect, useCallback } from 'react';
import { imageService } from '../services/imageService';
import GalleryGrid from '../components/GalleryGrid';
import Pagination from '../components/Pagination';
import Lightbox from '../components/Lightbox';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';

/**
 * Gallery Page Component.
 * Fetches images, manages state for pagination, deletion, and lightbox.
 */
const Gallery = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lightbox state
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const IMAGES_PER_PAGE = 9;

  // Load images for specified page, filter, and sort order
  const loadImages = useCallback(async (page, type, sort) => {
    setLoading(true);
    setError(null);
    try {
      const data = await imageService.fetchImages(page, IMAGES_PER_PAGE, type, sort);
      setImages(data.images || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      console.error('Failed to load images:', err);
      setError('Could not retrieve images. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch images on mount, page, filter, or sort changes
  useEffect(() => {
    loadImages(currentPage, filterType, sortOrder);
  }, [currentPage, filterType, sortOrder, loadImages]);

  // Handle image deletion
  const handleDeleteImage = async (id) => {
    try {
      await imageService.deleteImage(id);
      
      // Update local state instantly without page refresh
      const updatedImages = images.filter((img) => img.id !== id);
      setImages(updatedImages);

      // If we deleted the last item on the current page and it's not the first page, go back a page
      if (updatedImages.length === 0 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        // Otherwise, refresh current page configuration
        loadImages(currentPage, filterType, sortOrder);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      throw err; // Propagate error so component can show alert
    }
  };

  // Lightbox handlers
  const handleImageClick = (image, index) => {
    setActiveImageIndex(index);
  };

  const handleCloseLightbox = () => {
    setActiveImageIndex(null);
  };

  const handlePrevImage = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1); // Reset page to 1 on filter switch
  };

  const handleSortChange = (sort) => {
    setSortOrder(sort);
    setCurrentPage(1); // Reset page to 1 on sort change
  };

  const activeImage = activeImageIndex !== null ? images[activeImageIndex] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Title section */}
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Image Gallery
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Explore your uploaded photos in a responsive masonry-style grid layout.
          </p>
        </div>
      </div>

      {/* Filter and Sort Row (Dropdowns) */}
      <div className="flex flex-wrap items-center gap-4 mb-8 border-b border-slate-100 pb-5">
        {/* Filter Dropdown */}
        <div className="flex flex-col space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pl-1">
            Filter by Type
          </span>
          <select
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="w-48 text-left bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl pl-4 pr-10 py-2.5 hover:border-blue-400 focus-ring cursor-pointer shadow-sm transition-colors"
          >
            <option value="all">All Images</option>
            <option value="png">PNG</option>
            <option value="jpg">JPG / JPEG</option>
            <option value="webp">WEBP</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex flex-col space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pl-1">
            Sort Order
          </span>
          <select
            value={sortOrder}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-48 text-left bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl pl-4 pr-10 py-2.5 hover:border-blue-400 focus-ring cursor-pointer shadow-sm transition-colors"
          >
            <option value="desc">Recently Added</option>
            <option value="asc">Oldest Added</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        // Loading State
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <FiLoader className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading gallery images...</p>
        </div>
      ) : error ? (
        // Error State
        <div className="max-w-md mx-auto p-6 rounded-2xl border border-rose-100 bg-rose-50 text-center space-y-4">
          <FiAlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Something went wrong</h3>
          <p className="text-sm text-slate-600">{error}</p>
          <button
            onClick={() => loadImages(currentPage, filterType, sortOrder)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors focus-ring"
          >
            Retry
          </button>
        </div>
      ) : (
        // Gallery + Pagination View
        <>
          <GalleryGrid
            images={images}
            onImageClick={handleImageClick}
            onImageDelete={handleDeleteImage}
          />
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}

      {/* Lightbox Modal */}
      {activeImageIndex !== null && activeImage && (
        <Lightbox
          image={activeImage}
          currentIndex={activeImageIndex}
          totalCount={images.length}
          onClose={handleCloseLightbox}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
        />
      )}
    </div>
  );
};

export default Gallery;
