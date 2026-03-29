'use client';

import { useState } from 'react';
import QualitySelector from './QualitySelector';

export default function VideoCard({ video, onDownload, remainingFree }) {
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const isFree = remainingFree > 0;

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition border border-gray-200">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-900 overflow-hidden">
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <span className="text-4xl">🎥</span>
            </div>
          )}
          
          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm mb-2">
            {video.title}
          </h3>

          {/* Quality Info */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Available qualities:</p>
            <div className="flex flex-wrap gap-1">
              {video.quality.map((q) => (
                <span key={q} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                  {q}
                </span>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={() => {
              if (isFree) {
                setShowQualityModal(true);
              } else {
                onDownload('720p');
              }
            }}
            className={`w-full py-2 rounded font-semibold text-sm transition ${
              isFree
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            {isFree ? 'Download' : 'Sign In to Download'}
          </button>

          {!isFree && (
            <p className="text-xs text-orange-600 mt-2 text-center">
              Limit reached
            </p>
          )}
        </div>
      </div>

      {/* Quality Modal */}
      {showQualityModal && (
        <QualitySelector
          video={video}
          onQualitySelect={setSelectedQuality}
          onDownload={() => {
            if (selectedQuality) {
              onDownload(selectedQuality);
              setShowQualityModal(false);
              setSelectedQuality(null);
            }
          }}
          onClose={() => {
            setShowQualityModal(false);
            setSelectedQuality(null);
          }}
        />
      )}
    </>
  );
}
