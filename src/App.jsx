import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { UploadCloud, Image, Heart, Folder, Trash2, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import UploadArea from './components/UploadArea';
import UploadCard from './components/UploadCard';
import { useFileUpload } from './hooks/useFileUpload';
import { imageService } from './services/imageService';

// Lazy load the Gallery page component
const Gallery = lazy(() => import('./pages/Gallery'));

/**
 * Premium Home subcomponent page.
 * Displays file upload areas, file dropzones, and queue list in an elegant card grid.
 */
function Home() {
  const { files, uploadFiles, clearFiles } = useFileUpload();

  // Custom remove single file function (internal to the local state queue)
  const [localFiles, setLocalFiles] = useState([]);
  
  // We can sync with files from hook, and add the option to dismiss a card
  useEffect(() => {
    setLocalFiles(files);
  }, [files]);

  const handleDismissFile = (id) => {
    setLocalFiles(prev => prev.filter(f => f.id !== id));
  };

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
        <h1 className="text-3xl md:text-5xl font-extrabold text-text-primary tracking-tight font-sans">
          Upload New Images
        </h1>
        <p className="text-sm md:text-base text-text-secondary max-w-lg mx-auto font-medium leading-relaxed font-sans">
          Drag and drop multiple files to batch upload them to your gallery. Monitor real-time upload progress.
        </p>
      </div>

      {/* Upload zone */}
      <div className="max-w-2xl mx-auto">
        <UploadArea onFilesSelected={uploadFiles} />
      </div>

      {/* Upload queue list */}
      <AnimatePresence>
        {localFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-4 max-w-2xl mx-auto pt-8 border-t border-border-custom"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                Upload Queue ({localFiles.length} {localFiles.length === 1 ? 'file' : 'files'})
              </h2>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#f1f5f9' }}
                whileTap={{ scale: 0.98 }}
                onClick={clearFiles}
                className="text-[11px] font-bold text-text-primary bg-white border border-border-custom px-3.5 py-2 rounded-xl transition-all duration-200 focus-ring shadow-sm cursor-pointer"
              >
                Clear Queue
              </motion.button>
            </div>

            {/* List queue grid */}
            <div className="grid grid-cols-1 gap-4 max-h-[350px] overflow-y-auto pr-1">
              <AnimatePresence>
                {localFiles.map((fileObj) => (
                  <UploadCard 
                    key={fileObj.id} 
                    fileObj={fileObj} 
                    onDismiss={() => handleDismissFile(fileObj.id)}
                  />
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
    <div className="flex flex-col min-h-screen bg-bg-app">
      {/* Sticky Premium Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border-custom shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            
            {/* Logo and stats */}
            <div className="flex items-center space-x-3.5">
              <div className="p-2 bg-primary rounded-xl text-white shadow-md shadow-primary/10">
                <Image className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-black tracking-tight text-text-primary leading-none">
                  Pixel<span className="text-primary font-extrabold">Vault</span>
                </span>
                <span className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mt-1 flex items-center gap-1">
                  <Folder className="w-2.5 h-2.5" />
                  <span>{totalCount} Total Images</span>
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="flex items-center space-x-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center justify-center space-x-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 focus-ring cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/15'
                      : 'text-text-secondary hover:text-text-primary hover:bg-slate-100/50'
                  }`
                }
              >
                <UploadCloud className="w-4 h-4 shrink-0" />
                <span>Upload</span>
              </NavLink>

              <NavLink
                to="/gallery"
                className={({ isActive }) =>
                  `flex items-center justify-center space-x-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 focus-ring cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/15'
                      : 'text-text-secondary hover:text-text-primary hover:bg-slate-100/50'
                  }`
                }
              >
                <Image className="w-4 h-4 shrink-0" />
                <span>Gallery</span>
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest animate-pulse">Loading gallery...</span>
          </div>
        }>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border-custom py-6 mt-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center text-[10px] font-bold uppercase tracking-wider text-text-secondary flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
          <div>
            &copy; {new Date().getFullYear()} PixelVault. All rights reserved.
          </div>
          <div className="flex items-center space-x-1.5">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-danger fill-danger" />
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
