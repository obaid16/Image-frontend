import React, { useState, useEffect, useCallback } from 'react';
import { imageService } from '../services/imageService';
import GalleryGrid from '../components/GalleryGrid';
import Pagination from '../components/Pagination';
import Lightbox from '../components/Lightbox';
import { Loader2, AlertCircle, ArrowUpDown, Filter } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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

  // Deletion Confirmation Modal state
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Handle image deletion (triggered after modal confirmation)
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

  const handleRequestDelete = (image) => {
    setImageToDelete(image);
  };

  const activeImage = activeImageIndex !== null ? images[activeImageIndex] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Title section */}
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl font-sans">
            Image Gallery
          </h1>
          <p className="mt-2 text-sm text-text-secondary font-medium font-sans">
            Explore your uploaded photos in a responsive grid layout.
          </p>
        </div>
      </div>

      {/* Filter and Sort Row (Dropdowns) */}
      <div className="flex flex-wrap items-center gap-4 mb-8 border-b border-border-custom pb-5">
        {/* Filter Dropdown */}
        <div className="flex flex-col space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-secondary pl-1 flex items-center gap-1.5 select-none">
            <Filter className="w-3 h-3 text-text-secondary" />
            <span>Filter by Type</span>
          </span>
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="w-48 text-left bg-white border border-border-custom text-text-primary text-sm font-bold rounded-xl pl-4 pr-10 py-2.5 hover:border-primary focus-ring cursor-pointer shadow-sm transition-colors appearance-none"
            >
              <option value="all">All Images</option>
              <option value="png">PNG</option>
              <option value="jpg">JPG / JPEG</option>
              <option value="webp">WEBP</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-4 w-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex flex-col space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-secondary pl-1 flex items-center gap-1.5 select-none">
            <ArrowUpDown className="w-3 h-3 text-text-secondary" />
            <span>Sort Order</span>
          </span>
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-48 text-left bg-white border border-border-custom text-text-primary text-sm font-bold rounded-xl pl-4 pr-10 py-2.5 hover:border-primary focus-ring cursor-pointer shadow-sm transition-colors appearance-none"
            >
              <option value="desc">Recently Added</option>
              <option value="asc">Oldest Added</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-4 w-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {error ? (
        // Error State
        <div className="max-w-md mx-auto p-6 rounded-3xl border border-danger/10 bg-danger/5 text-center space-y-4 shadow-soft">
          <AlertCircle className="w-10 h-10 text-danger mx-auto" />
          <h3 className="text-base font-bold text-text-primary">Something went wrong</h3>
          <p className="text-sm text-text-secondary">{error}</p>
          <button
            onClick={() => loadImages(currentPage, filterType, sortOrder)}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl transition-all duration-200 focus-ring cursor-pointer shadow-sm shadow-primary/10"
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
            onImageDelete={handleRequestDelete}
            loading={loading}
          />
          
          {!loading && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
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

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {imageToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-3xl border border-border-custom shadow-2xl max-w-sm w-full overflow-hidden p-6 text-center space-y-5"
            >
              <div className="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center mx-auto text-danger">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-text-primary">
                  Delete Image?
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Are you sure you want to permanently delete <span className="font-bold text-text-primary">"{imageToDelete.name}"</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={() => setImageToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 border border-border-custom bg-white hover:bg-slate-50 text-text-primary text-xs font-bold rounded-xl transition-all focus-ring cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setIsDeleting(true);
                    try {
                      await handleDeleteImage(imageToDelete.id);
                      setImageToDelete(null);
                    } catch (err) {
                      alert('Failed to delete image.');
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-danger hover:bg-danger/90 text-white text-xs font-bold rounded-xl transition-all focus-ring flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
