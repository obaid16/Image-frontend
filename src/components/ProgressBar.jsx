import React from 'react';

/**
 * Reusable ProgressBar component.
 * Displays a smooth blue progress bar with status styling.
 * 
 * @param {number} progress - Progress percentage (0 - 100)
 * @param {string} status - Upload status ('uploading' | 'success' | 'failed')
 */
const ProgressBar = ({ progress, status }) => {
  // Determine color based on upload status
  const getBarColor = () => {
    switch (status) {
      case 'success':
        return 'bg-emerald-500';
      case 'failed':
        return 'bg-rose-500';
      case 'uploading':
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div className="w-full">
      {/* Outer wrapper */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        {/* Animated fill */}
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${getBarColor()}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      
      {/* Percentage text */}
      <div className="flex justify-between items-center mt-1.5">
        <span className="text-xs font-medium text-slate-500">
          {status === 'success' ? 'Completed' : status === 'failed' ? 'Error' : 'Uploading'}
        </span>
        <span className="text-xs font-semibold text-slate-700">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
