import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, Trash2 } from 'lucide-react';
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
 * @param {function} onDismiss - Callback to remove card from the queue list
 */
const UploadCard = ({ fileObj, onDismiss }) => {
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
          bgClass: 'bg-success/5 border-success/20',
          badgeClass: 'bg-success/10 text-success border-success/20',
          icon: <CheckCircle2 className="w-5 h-5 text-success shrink-0" />,
          label: 'Success'
        };
      case 'failed':
        return {
          bgClass: 'bg-danger/5 border-danger/20',
          badgeClass: 'bg-danger/10 text-danger border-danger/20',
          icon: <AlertCircle className="w-5 h-5 text-danger shrink-0" />,
          label: 'Failed'
        };
      case 'uploading':
      default:
        return {
          bgClass: 'bg-white/70 border-border-custom',
          badgeClass: 'bg-primary/10 text-primary border-primary/20',
          icon: <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />,
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
      className={`p-4 rounded-2xl border backdrop-blur-md shadow-soft flex gap-4 transition-colors duration-300 ${statusInfo.bgClass}`}
    >
      {/* 1. Image Thumbnail Preview */}
      <div className="w-14 h-14 rounded-xl border border-border-custom bg-bg-app overflow-hidden shrink-0 flex items-center justify-center relative shadow-inner">
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
            <h4 className="text-sm font-bold text-text-primary truncate" title={name}>
              {name}
            </h4>
            <p className="text-xs text-text-secondary font-semibold mt-0.5">
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
          <div className="text-[11px] text-danger mt-2 font-bold bg-danger/5 p-2.5 rounded-xl border border-danger/10">
            {error || 'Upload was rejected by server.'}
          </div>
        )}
      </div>

      {/* 3. Status Action Icon & Delete Icon */}
      <div className="shrink-0 pt-0.5 flex flex-col items-end justify-between">
        <div className="flex items-center gap-1">
          {statusInfo.icon}
          {onDismiss && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="text-text-secondary hover:text-danger transition-colors p-1 rounded-lg hover:bg-slate-100/50 cursor-pointer"
              title="Remove from queue"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UploadCard;
