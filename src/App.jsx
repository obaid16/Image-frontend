import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { FiUploadCloud, FiImage, FiHeart, FiFolder } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import UploadArea from './components/UploadArea';
import UploadCard from './components/UploadCard';
import Gallery from './pages/Gallery';
import { useFileUpload } from './hooks/useFileUpload';
import { imageService } from './services/imageService';

/**
 * Premium Home subcomponent page.
 * Displays file upload areas, file dropzones, and queue list in an elegant card grid.
 */
function Home() {
  const { files, uploadFiles, clearFiles } = useFileUpload();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-10"
    >
      {/* Headings */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Upload New Images
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-lg mx-auto font-medium leading-relaxed">
          Drag and drop multiple files to batch upload them to your gallery. Monitor real-time upload progress.
        </p>
      </div>

      {/* Upload zone */}
      <div className="max-w-2xl mx-auto">
        <UploadArea onFilesSelected={uploadFiles} />
      </div>

      {/* Upload queue list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-4 max-w-2xl mx-auto pt-8 border-t border-slate-100"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Upload Queue ({files.length} {files.length === 1 ? 'file' : 'files'})
              </h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearFiles}
                className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-all duration-200 focus-ring shadow-sm cursor-pointer"
              >
                Clear Queue
              </motion.button>
            </div>

            {/* List queue grid */}
            <div className="grid grid-cols-1 gap-4 max-h-[350px] overflow-y-auto pr-1">
              <AnimatePresence>
                {files.map((fileObj) => (
                  <UploadCard key={fileObj.id} fileObj={fileObj} />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Inner shell routing and layout logic.
 * Wraps routes inside BrowserRouter to use location-based page transitions.
 */
function AppContent() {
  const location = useLocation();
  const [totalCount, setTotalCount] = useState(0);

  // Fetch live image count dynamically on route changes
  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const data = await imageService.fetchImages(1, 1);
        setTotalCount(data.totalImages || 0);
      } catch (err) {
        console.warn('Failed to retrieve total image count:', err);
      }
    };
    fetchTotalCount();
  }, [location.pathname]); // Update counter whenever route page changes

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Sticky Premium Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100/80 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            
            {/* Logo and stats */}
            <div className="flex items-center space-x-3.5">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/10">
                <FiImage className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-black tracking-tight text-slate-900 leading-none">
                  Pixel<span className="text-blue-600 font-extrabold">Vault</span>
                </span>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-1 flex items-center gap-1">
                  <FiFolder className="w-2.5 h-2.5" />
                  <span>{totalCount} Total Images</span>
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="flex space-x-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 focus-ring cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                  }`
                }
              >
                <FiUploadCloud className="w-4 h-4 shrink-0" />
                <span>Upload</span>
              </NavLink>

              <NavLink
                to="/gallery"
                className={({ isActive }) =>
                  `inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 focus-ring cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                  }`
                }
              >
                <FiImage className="w-4 h-4 shrink-0" />
                <span>Gallery</span>
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100/60 py-6 mt-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
          <div>
            &copy; {new Date().getFullYear()} PixelVault. All rights reserved.
          </div>
          <div className="flex items-center space-x-1.5">
            <span>Designed with</span>
            <FiHeart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for professional codebase audit</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Bootstrapped App component.
 */
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
