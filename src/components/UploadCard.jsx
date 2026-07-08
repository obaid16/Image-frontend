import React from 'react';
import { FiImage, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';
import ProgressBar from './ProgressBar';

/**
 * Helper to format file sizes in bytes into human-readable units.
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Individual upload card representing a file being uploaded.
 * Shows status details, file meta, progress bar, and feedback.
 * 
 * @param {object} fileObj - Upload file info from hook: { id, name, size, progress, status, error }
 */
const UploadCard = ({ fileObj }) => {
  const { name, size, progress, status, error } = fileObj;

  // Determine status display details
  const getStatusDisplay = () => {
    switch (status) {
      case 'success':
        return {
          icon: <FiCheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
          label: 'Success',
          bgClass: 'bg-emerald-50/50 border-emerald-100',
          textColor: 'text-emerald-700'
        };
      case 'failed':
        return {
          icon: <FiAlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          label: 'Failed',
          bgClass: 'bg-rose-50/50 border-rose-100',
          textColor: 'text-rose-700',
          errorMsg: error || 'Upload failed'
        };
      case 'uploading':
      default:
        return {
          icon: <FiLoader className="w-5 h-5 text-blue-500 animate-spin shrink-0" />,
          label: 'Uploading...',
          bgClass: 'bg-blue-50/20 border-blue-100/50',
          textColor: 'text-blue-700'
        };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className={`p-4 rounded-xl border glass-panel transition-all duration-300 ${statusInfo.bgClass}`}>
      <div className="flex items-start space-x-3">
        {/* File icon wrapper */}
        <div className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm text-slate-400 shrink-0">
          <FiImage className="w-5 h-5 text-blue-500" />
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between space-x-2">
            <h4 className="text-sm font-semibold text-slate-800 truncate" title={name}>
              {name}
            </h4>
            <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              status === 'success' 
                ? 'bg-emerald-100 text-emerald-800' 
                : status === 'failed' 
                  ? 'bg-rose-100 text-rose-800' 
                  : 'bg-blue-100 text-blue-800'
            }`}>
              {statusInfo.label}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-0.5">
            {formatFileSize(size)}
          </p>

          {/* Progress Section */}
          <div className="mt-3">
            <ProgressBar progress={progress} status={status} />
          </div>

          {/* Error Message if failed */}
          {status === 'failed' && (
            <p className="text-xs text-rose-600 mt-2 font-medium bg-rose-50 p-2 rounded-lg border border-rose-100/50">
              {statusInfo.errorMsg}
            </p>
          )}
        </div>
        
        {/* Status Indicator Icon */}
        <div className="shrink-0 pt-0.5">
          {statusInfo.icon}
        </div>
      </div>
    </div>
  );
};

export default UploadCard;
