import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Premium Pagination component.
 * Features numbered page buttons, active indicators, and disabled boundaries.
 * Styled like a premium dashboard panel.
 * 
 * @param {number} currentPage - Active page index (1-indexed)
 * @param {number} totalPages - Total pages available
 * @param {function} onPageChange - Page click callback handler
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Guard clause - hide if only 1 page
  if (totalPages <= 1) return null;

  // Generate numbered list of pages
  const getPageNumbers = () => {
    const pages = [];
    // If totalPages is small, show all
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Otherwise, show current page, first, last, and buffer ellipses
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border-custom/50 px-4 py-5 sm:px-6 bg-white/70 backdrop-blur-md rounded-2xl border border-border-custom shadow-soft mt-12 gap-4">
      {/* Page description */}
      <div className="text-center sm:text-left">
        <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">
          Page <span className="text-text-primary font-extrabold">{currentPage}</span> of{' '}
          <span className="text-text-primary font-extrabold">{totalPages}</span>
        </p>
      </div>

      {/* Pagination control group */}
      <div className="flex items-center gap-1.5">
        {/* Previous page arrow */}
        <motion.button
          whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl border border-border-custom bg-white text-text-secondary hover:text-text-primary hover:border-primary disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-border-custom disabled:hover:text-text-secondary disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          title="Previous Page"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        {/* Page numbers */}
        <div className="flex items-center gap-1.5">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-9 h-9 flex items-center justify-center text-text-secondary text-xs font-bold"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <motion.button
                key={page}
                whileHover={{ scale: isActive ? 1 : 1.05 }}
                whileTap={{ scale: isActive ? 1 : 0.95 }}
                onClick={() => onPageChange(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-white border border-border-custom text-text-secondary hover:border-primary hover:text-text-primary'
                }`}
              >
                {page}
              </motion.button>
            );
          })}
        </div>

        {/* Next page arrow */}
        <motion.button
          whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl border border-border-custom bg-white text-text-secondary hover:text-text-primary hover:border-primary disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-border-custom disabled:hover:text-text-secondary disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          title="Next Page"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default Pagination;
