import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { FiUploadCloud, FiImage, FiHeart } from 'react-icons/fi';
import UploadArea from './components/UploadArea';
import UploadCard from './components/UploadCard';
import Gallery from './pages/Gallery';
import { useFileUpload } from './hooks/useFileUpload';

/**
 * Home subcomponent page.
 * Contains the drag-and-drop file upload interface and the uploading file queue list.
 */
function Home() {
  const { files, uploadFiles, clearFiles } = useFileUpload();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Upload New Images
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-lg mx-auto font-medium">
          Drag and drop multiple image files or click the selector button. Monitor progress cards in real-time.
        </p>
      </div>

      {/* Upload Drag Area Container */}
      <div className="max-w-2xl mx-auto">
        <UploadArea onFilesSelected={uploadFiles} />
      </div>

      {/* Upload Progress Queue List */}
      {files.length > 0 && (
        <div className="space-y-4 max-w-2xl mx-auto pt-6 border-t border-slate-200/60">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Upload Queue ({files.length} {files.length === 1 ? 'file' : 'files'})
            </h2>
            <button
              onClick={clearFiles}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all duration-200 focus-ring"
            >
              Clear Queue
            </button>
          </div>

          {/* Scrolling queue grid */}
          <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-1">
            {files.map((fileObj) => (
              <UploadCard key={fileObj.id} fileObj={fileObj} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Main Application routing and shell wrapper.
 * Sets up navbar navigation links and mounts child routes.
 */
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Sticky Professional Navbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              
              {/* Branding and Logo */}
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20">
                  <FiImage className="w-5 h-5" />
                </div>
                <span className="text-lg font-black tracking-tight text-slate-900">
                  Pixel<span className="text-blue-600 font-extrabold">Vault</span>
                </span>
              </div>

              {/* Navigation Links */}
              <nav className="flex space-x-1.5">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 focus-ring ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/70'
                    }`
                  }
                >
                  <FiUploadCloud className="w-4 h-4" />
                  <span>Upload</span>
                </NavLink>

                <NavLink
                  to="/gallery"
                  className={({ isActive }) =>
                    `inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 focus-ring ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/70'
                    }`
                  }
                >
                  <FiImage className="w-4 h-4" />
                  <span>Gallery</span>
                </NavLink>
              </nav>
            </div>
          </div>
        </header>

        {/* Route content body wrapper */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </main>

        {/* Minimal Footer */}
        <footer className="bg-white border-t border-slate-100 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs font-semibold text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              &copy; {new Date().getFullYear()} PixelVault. All rights reserved.
            </div>
            <div className="flex items-center space-x-1">
              <span>Designed with</span>
              <FiHeart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for professional codebase audit</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
