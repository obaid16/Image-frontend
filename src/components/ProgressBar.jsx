import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable ProgressBar component.
 * Uses Framer Motion for smooth, layout-animating progress fills.
 * 
 * @param {number} progress - Progress percentage (0 - 100)
 * @param {string} status - Upload status ('uploading' | 'success' | 'failed')
 */
const ProgressBar = ({ progress, status }) => {
  // Determine color based on upload status
  const getBarColor = () => {
    switch (status) {
      case 'success':
        return 'bg-success';
      case 'failed':
        return 'bg-danger';
      case 'uploading':
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="w-full">
      {/* Outer track */}
      <div className="w-full bg-bg-app border border-border-custom/50 rounded-full h-2 overflow-hidden shadow-inner">
        {/* Framer Motion animated fill */}
        <motion.div
          className={`h-full rounded-full ${getBarColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      
      {/* Percentage details */}
      <div className="flex justify-between items-center mt-2.5">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
          {status === 'success' ? 'Completed' : status === 'failed' ? 'Failed' : 'Uploading'}
        </span>
        <span className="text-xs font-extrabold text-text-primary">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
