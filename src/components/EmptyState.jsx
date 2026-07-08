import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

/**
 * Premium EmptyState component.
 * Displays a gorgeous minimal camera & landscape vector with subtle motion.
 * Designed to look like a premium Notion or Stripe feature placeholder.
 */
const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center p-8 md:p-16 bg-white/70 backdrop-blur-md rounded-3xl border border-slate-100 shadow-soft max-w-lg mx-auto select-none"
    >
      {/* Dynamic Floating SVG Illustration */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="w-44 h-44 mb-8 text-blue-500"
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Grid structure */}
          <rect x="40" y="40" width="120" height="120" rx="20" fill="#F8FAFC" />
          <rect x="55" y="55" width="40" height="40" rx="10" fill="#F1F5F9" />
          <rect x="105" y="55" width="40" height="40" rx="10" fill="#F1F5F9" />
          <rect x="55" y="105" width="40" height="40" rx="10" fill="#F1F5F9" />
          <rect x="105" y="105" width="40" height="40" rx="10" fill="#F1F5F9" />

          {/* Dotted rotate overlay */}
          <circle
            cx="100"
            cy="100"
            r="65"
            stroke="#3B82F6"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            className="animate-[spin_180s_linear_infinite]"
          />

          {/* Floating picture frame */}
          <g filter="drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.04))">
            <rect x="75" y="70" width="50" height="50" rx="12" fill="white" />
            <rect x="80" y="75" width="40" height="40" rx="8" fill="#EFF6FF" />
            {/* Mountains */}
            <path
              d="M84 108L93.5 96.5L102 105.5L111.5 91.5L116 97L116 110L84 110L84 108Z"
              fill="#93C5FD"
            />
            <circle cx="106" cy="85" r="4" fill="#60A5FA" />
          </g>

          {/* Plus icon tag */}
          <circle cx="128" cy="120" r="16" fill="#2563EB" />
          <path
            d="M128 114V126M122 120H134"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Header and description */}
      <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
        Your gallery is empty
      </h3>
      <p className="text-xs text-slate-400 font-semibold max-w-xs mt-2 mb-8 leading-relaxed">
        Start creating your custom portfolio by uploading your high-quality JPEG, PNG, or WEBP photos.
      </p>

      {/* Primary Action Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to="/"
          className="inline-flex items-center space-x-2.5 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg focus-ring cursor-pointer"
        >
          <FiPlus className="w-4 h-4" />
          <span>Upload First Image</span>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default EmptyState;
