import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Reusable Pagination controls.
 * Shows 'Previous' and 'Next' buttons and current page info.
 * 
 * @param {number} currentPage - Active page index (1-indexed)
 * @param {number} totalPages - Total pages available
 * @param {function} onPageChange - Callback triggered with target page number
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Guard clause - hide pagination if only 1 page
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-4 sm:px-6 bg-white rounded-2xl shadow-soft mt-8">
      {/* Mobile view: simple stack */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200 focus-ring disabled:opacity-50 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200 focus-ring disabled:opacity-50 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Desktop view: details + elegant control buttons */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">
            Showing page <span className="font-semibold text-slate-800">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-800">{totalPages}</span>
          </p>
        </div>
        
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-xl space-x-2" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 focus-ring disabled:opacity-40 disabled:border-slate-200 disabled:bg-white disabled:text-slate-400 disabled:cursor-not-allowed"
              title="Previous Page"
              aria-label="Previous Page"
            >
              <FiChevronLeft className="w-5 h-5" />
              <span className="sr-only">Previous</span>
            </button>

            <span className="inline-flex items-center justify-center px-4 rounded-xl border border-transparent bg-blue-50/50 text-sm font-semibold text-blue-600">
              {currentPage}
            </span>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 focus-ring disabled:opacity-40 disabled:border-slate-200 disabled:bg-white disabled:text-slate-400 disabled:cursor-not-allowed"
              title="Next Page"
              aria-label="Next Page"
            >
              <FiChevronRight className="w-5 h-5" />
              <span className="sr-only">Next</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
