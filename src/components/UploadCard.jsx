import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';
import ProgressBar from './ProgressBar';

/**
 * Format file size helper.
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Premium UploadCard component.
 * Displays local thumbnail previews, progress updates, and states.
 * Animates into view smoothly using Framer Motion.
 * 
 * @param {object} fileObj - Target uploading file information
 */
const UploadCard = ({ fileObj }) => {
  const { name, size, progress, status, error, file } = fileObj;
  const [previewUrl, setPreviewUrl] = useState(null);

  // Generate a local object URL for instant thumbnail previewing
  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Revoke the object URL on unmount to prevent memory leaks
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  // Dynamic borders and backgrounds based on current upload state
  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return {
          bgClass: 'bg-emerald-50/30 border-emerald-100',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100/50',
          icon: <FiCheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
          label: 'Success'
        };
      case 'failed':
        return {
          bgClass: 'bg-rose-50/30 border-rose-100',
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-100/50',
          icon: <FiAlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          label: 'Failed'
        };
      case 'uploading':
      default:
        return {
          bgClass: 'bg-white border-slate-100',
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-100/30',
          icon: <FiLoader className="w-5 h-5 text-blue-500 animate-spin shrink-0" />,
          label: 'Uploading'
        };
    }
  };

  const statusInfo = getStatusStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`p-4 rounded-2xl border glass-panel glass-panel-hover flex gap-4 ${statusInfo.bgClass}`}
    >
      {/* 1. Image Thumbnail Preview */}
      <div className="w-14 h-14 rounded-xl border border-slate-100/80 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center relative shadow-inner">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full shimmer" />
        )}
      </div>

      {/* 2. Upload Info & Progress bar */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-800 truncate" title={name}>
              {name}
            </h4>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              {formatFileSize(size)}
            </p>
          </div>
          
          <span className={`inline-flex items-center text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-lg border ${statusInfo.badgeClass}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-2.5">
          <ProgressBar progress={progress} status={status} />
        </div>

        {/* Fail Error Text Banner */}
        {status === 'failed' && (
          <div className="text-[11px] text-rose-600 mt-2 font-bold bg-rose-50/50 p-2.5 rounded-xl border border-rose-100/40">
            {error || 'Upload was rejected by server.'}
          </div>
        )}
      </div>

      {/* 3. Status Action Icon */}
      <div className="shrink-0 pt-0.5 flex items-start">
        {statusInfo.icon}
      </div>
    </motion.div>
  );
};

export default UploadCard;
