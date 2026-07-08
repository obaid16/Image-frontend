import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiAlertTriangle, FiX } from 'react-icons/fi';

/**
 * UploadArea component providing Drag & Drop zone and file picker button.
 * Validates files: only images, max size 5MB. Displays custom error alerts.
 * 
 * @param {function} onFilesSelected - Callback function triggered when valid files are chosen.
 */
const UploadArea = ({ onFilesSelected }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Constants
  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  // Handle file inputs (either drop or picker selection)
  const handleFiles = (files) => {
    setError(null); // Reset previous errors
    const selectedFiles = Array.from(files);
    const validFiles = [];
    const invalidTypes = [];
    const overSized = [];

    selectedFiles.forEach((file) => {
      // 1. Validate MIME type (must be image/*)
      if (!file.type.startsWith('image/')) {
        invalidTypes.push(file.name);
        return;
      }

      // 2. Validate file size (max 5MB)
      if (file.size > MAX_FILE_SIZE_BYTES) {
        overSized.push(file.name);
        return;
      }

      validFiles.push(file);
    });

    // Create error message if any validation checks failed
    if (invalidTypes.length > 0 || overSized.length > 0) {
      let errorMsg = '';
      if (invalidTypes.length > 0) {
        errorMsg += `Invalid file type(s): ${invalidTypes.join(', ')}. Only image files are allowed. `;
      }
      if (overSized.length > 0) {
        errorMsg += `File(s) exceed ${MAX_FILE_SIZE_MB}MB limit: ${overSized.join(', ')}.`;
      }
      setError(errorMsg.trim());
      
      // Auto-clear error after 6 seconds
      setTimeout(() => setError(null), 6000);
    }

    // Pass valid files to parent callback
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  // Drag Event Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Click handler to open file dialog
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // File Picker Change handler
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Error Alert Display */}
      {error && (
        <div className="flex items-start space-x-3 p-4 rounded-xl border border-rose-100 bg-rose-50 text-rose-800 shadow-sm animate-fadeIn">
          <FiAlertTriangle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
          <div className="flex-1 text-sm font-medium">
            {error}
          </div>
          <button 
            type="button" 
            onClick={() => setError(null)} 
            className="text-rose-500 hover:text-rose-700 focus-ring rounded-lg p-0.5"
            aria-label="Dismiss error"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Drag & Drop Visual Area */}
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`group relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50/50 scale-[0.99] shadow-inner'
            : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50/30 shadow-soft'
        }`}
      >
        {/* Hidden input for selecting files */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload-input"
        />

        {/* Icon container */}
        <div className={`p-4 rounded-full mb-4 transition-all duration-300 ${
          isDragActive 
            ? 'bg-blue-100 text-blue-600 scale-110 shadow-sm' 
            : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'
        }`}>
          <FiUploadCloud className="w-10 h-10" />
        </div>

        {/* Prompt texts */}
        <h3 className="text-base font-semibold text-slate-800 mb-1.5">
          {isDragActive ? 'Drop your images here' : 'Drag & drop your images here'}
        </h3>
        <p className="text-xs text-slate-500 mb-5 max-w-xs">
          Supports PNG, JPG, JPEG, WEBP or GIF (Max {MAX_FILE_SIZE_MB}MB per file)
        </p>

        {/* Action Button */}
        <button
          type="button"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus-ring"
          onClick={(e) => {
            e.stopPropagation(); // Avoid triggering container click
            openFileDialog();
          }}
        >
          Select Files
        </button>
      </div>
    </div>
  );
};

export default UploadArea;
