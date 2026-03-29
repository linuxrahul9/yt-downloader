'use client';

import { useState } from 'react';

const QUALITY_OPTIONS = [
  {
    quality: '360p',
    emoji: '📱',
    label: 'Mobile',
    description: 'Smooth streaming, low data usage',
    avgSize: '180-250 MB'
  },
  {
    quality: '480p',
    emoji: '💻',
    label: 'Standard',
    description: 'Good quality for most devices',
    avgSize: '300-400 MB'
  },
  {
    quality: '720p',
    emoji: '📺',
    label: 'HD',
    description: 'High definition, recommended',
    avgSize: '600-900 MB'
  },
  {
    quality: '1080p',
    emoji: '🎬',
    label: 'Full HD',
    description: 'Crystal clear, best quality',
    avgSize: '1.2-1.8 GB'
  },
  {
    quality: '4K',
    emoji: '🚀',
    label: 'Ultra HD',
    description: 'Stunning quality, large file',
    avgSize: '2.5-4 GB'
  }
];

export default function QualitySelector({ video, onQualitySelect, onDownload, onClose }) {
  const [selected, setSelected] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSelect = (quality) => {
    setSelected(quality);
    onQualitySelect?.(quality);
    // Automatically trigger download on selection
    setIsDownloading(true);
    setTimeout(() => {
      onDownload?.(quality);
    }, 200);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-all duration-300"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-0">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-slate-700/50 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-xl">
          
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur p-6 border-b border-slate-700/50 flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Select Quality
              </h2>
              <p className="text-gray-400 text-sm mt-1">Choose your preferred download quality to start</p>
            </div>
            <button
              onClick={onClose}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-700/50 transition-all duration-200 group"
            >
              <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">✕</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Video Info */}
            <div className="mb-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl">
              <h3 className="font-bold text-white line-clamp-2 mb-2">
                {video?.title || 'Your Video'}
              </h3>
              <p className="text-gray-400 text-sm">
                📌 Just click any quality below to start downloading
              </p>
            </div>

            {/* Quality Options Grid */}
            <div className="space-y-3 mb-8">
              {QUALITY_OPTIONS.map((option) => (
                <button
                  key={option.quality}
                  onClick={() => handleSelect(option.quality)}
                  disabled={isDownloading}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    selected === option.quality
                      ? 'border-blue-500/80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/30'
                      : 'border-slate-600/50 bg-slate-800/30 hover:border-blue-500/50 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Checkbox */}
                      <div className={`w-6 h-6 rounded-full border-2 mt-0.5 flex items-center justify-center transition-all ${
                        selected === option.quality
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-500 group-hover:border-blue-500'
                      }`}>
                        {selected === option.quality && <span className="text-white text-sm">✓</span>}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{option.emoji}</span>
                          <div>
                            <h4 className="font-bold text-white text-lg">{option.quality}</h4>
                            <p className="text-gray-400 text-sm">{option.label}</p>
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm mt-2 ml-10">
                          {option.description}
                        </p>
                      </div>
                    </div>

                    {/* File Size Badge */}
                    <div className={`px-3 py-1.5 rounded-lg font-semibold text-xs whitespace-nowrap transition-all ${
                      selected === option.quality
                        ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                        : 'bg-slate-700/50 text-gray-400 border border-slate-600/50'
                    }`}>
                      {option.avgSize}
                    </div>
                  </div>

                  {/* Status indicator for selection */}
                  {selected === option.quality && (
                    <div className="mt-3 flex items-center gap-2 text-blue-300 text-sm font-semibold">
                      <span className="inline-block animate-spin">⟳</span>
                      Downloading...
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Info Box */}
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-2xl p-4 mb-6">
              <div className="flex gap-2">
                <span className="text-xl mt-0.5">💡</span>
                <div>
                  <p className="font-semibold text-white text-sm">⚡ One Click Download</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Select any quality and the download starts instantly. Files save to your project&apos;s download folder.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 rounded-xl font-bold text-gray-300 border border-slate-600/50 hover:border-slate-500 hover:bg-slate-800/50 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
