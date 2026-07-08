import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

/**
 * EmptyState component displayed when the gallery has no images.
 * Features an elegant modern SVG illustration and a call-to-action button.
 */
const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-16 bg-white rounded-2xl border border-slate-100 shadow-soft max-w-lg mx-auto">
      {/* SVG Illustration */}
      <div className="w-48 h-48 mb-6 text-blue-500">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background grid representation */}
          <rect x="40" y="40" width="120" height="120" rx="16" fill="#F1F5F9" />
          <rect x="55" y="55" width="40" height="40" rx="8" fill="#E2E8F0" />
          <rect x="105" y="55" width="40" height="40" rx="8" fill="#E2E8F0" />
          <rect x="55" y="105" width="40" height="40" rx="8" fill="#E2E8F0" />
          <rect x="105" y="105" width="40" height="40" rx="8" fill="#E2E8F0" />

          {/* Dotted border circle overlay */}
          <circle
            cx="100"
            cy="100"
            r="65"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeDasharray="4 6"
            className="animate-[spin_120s_linear_infinite]"
          />

          {/* Core picture frame icon floating in middle */}
          <g filter="drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.05))">
            <rect x="75" y="70" width="50" height="50" rx="10" fill="white" />
            <rect x="80" y="75" width="40" height="40" rx="6" fill="#EFF6FF" />
            {/* Mountain */}
            <path
              d="M84 108L93.5 96.5L102 105.5L111.5 91.5L116 97L116 110L84 110L84 108Z"
              fill="#93C5FD"
            />
            {/* Sun */}
            <circle cx="106" cy="85" r="4" fill="#60A5FA" />
          </g>

          {/* Plus icon indicating addition */}
          <circle cx="128" cy="120" r="16" fill="#3B82F6" />
          <path
            d="M128 114V126M122 120H134"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Texts */}
      <h3 className="text-xl font-bold text-slate-800 mb-2">
        No images uploaded yet
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        Your digital gallery is ready! Start filling it by uploading your favorite high-quality photos.
      </p>

      {/* CTA Button to Upload Page */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus-ring"
      >
        <FiPlus className="w-4 h-4" />
        <span>Upload First Image</span>
      </Link>
    </div>
  );
};

export default EmptyState;
