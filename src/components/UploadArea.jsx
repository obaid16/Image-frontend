import React, { useRef, useState } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium Drag-and-Drop File Upload Area.
 * Styled with soft shimmers, active glow dropzones, and responsive layout.
 *
 * @param {function} onFilesSelected - Callback when files are chosen/dropped
 * @param {string} error - Parent error text validation message if select fails
 */
const UploadArea = ({ onFilesSelected, error }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Trigger input element click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Intercept selected input files
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      e.target.value = ''; // Reset input to allow re-uploading same file
    }
  };

  // Drag listeners
  const handleDragOver = (e) => {
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
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="w-full">
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
        whileHover={{ scale: 1.005, y: -2 }}
        whileTap={{ scale: 0.995 }}
        className={`w-full relative overflow-hidden rounded-3xl border-2 border-dashed py-14 px-6 md:px-12 text-center transition-all duration-300 cursor-pointer focus-ring select-none ${
          isDragActive
            ? 'border-primary bg-primary-50/10 shadow-glow'
            : error
            ? 'border-danger/30 bg-danger/5'
            : 'border-secondary/40 bg-white/70 backdrop-blur-md hover:border-primary hover:shadow-glow'
        }`}
      >
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        {/* Dynamic Glow Effect */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-radial-gradient from-primary/10 to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 flex flex-col items-center max-w-sm mx-auto">
          {/* Animated Upload Icon */}
          <motion.div
            animate={isDragActive ? { y: [0, -8, 0], scale: 1.1 } : { y: 0 }}
            transition={{ repeat: isDragActive ? Infinity : 0, duration: 1.5 }}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-soft ${
              isDragActive
                ? 'bg-primary border-primary text-white'
                : 'bg-bg-app border-border-custom text-text-secondary'
            }`}
          >
            <UploadCloud className="w-6 h-6" />
          </motion.div>

          <h3 className="mt-5 text-base font-bold text-text-primary tracking-tight">
            Drag & drop your images here
          </h3>
          <p className="mt-1.5 text-xs text-text-secondary font-semibold">
            Or, <span className="text-primary font-bold hover:underline">browse your files</span> from your device
          </p>

          {/* Formats and Limit Details */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
            <span className="bg-bg-app/80 border border-border-custom px-2 py-0.5 rounded-lg">JPG, JPEG, PNG, WEBP</span>
            <span className="bg-bg-app/80 border border-border-custom px-2 py-0.5 rounded-lg">MAX 5MB PER IMAGE</span>
          </div>
        </div>

        {/* Hidden File Picker Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          multiple
          accept="image/*"
          className="hidden"
        />
      </motion.div>

      {/* Validation Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3.5 flex items-center gap-2.5 p-3 rounded-2xl border border-danger/20 bg-danger/5 text-danger text-xs font-semibold"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadArea;
