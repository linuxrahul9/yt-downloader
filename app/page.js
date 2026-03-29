'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import VideoCard from '@/components/VideoCard';
import AuthModal from '@/components/AuthModal';
import NavBar from '@/components/NavBar';
import { getDownloadCount, getRemainingFreeDownloads, incrementDownloadCount } from '@/lib/storage';
import { downloadVideo } from '@/lib/videoService';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);
  const [remainingDownloads, setRemainingDownloads] = useState(3);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setDownloadCount(getDownloadCount());
    setRemainingDownloads(getRemainingFreeDownloads());
  }, []);

  // Enhanced video database with better data
  const videoDatabase = {
    'nature': [
      { id: '1', title: 'Beautiful Nature Documentary 4K', duration: '45:32', quality: ['360p', '480p', '720p', '1080p', '4K'], size: { '360p': '150MB', '480p': '250MB', '720p': '500MB', '1080p': '1.2GB', '4K': '3.5GB' } },
      { id: '5', title: 'Ocean Wonders: Life Under the Sea', duration: '52:15', quality: ['480p', '720p', '1080p', '4K'], size: { '480p': '280MB', '720p': '580MB', '1080p': '1.5GB', '4K': '4.2GB' } },
    ],
    'web': [
      { id: '2', title: 'Web Development Tutorial - Full Course', duration: '2:15:45', quality: ['360p', '480p', '720p', '1080p'], size: { '360p': '200MB', '480p': '350MB', '720p': '750MB', '1080p': '1.8GB' } },
      { id: '6', title: 'Modern JavaScript ES2024 Guide', duration: '3:30:00', quality: ['360p', '480p', '720p', '1080p'], size: { '360p': '250MB', '480p': '450MB', '720p': '950MB', '1080p': '2.2GB' } },
    ],
    'music': [
      { id: '3', title: 'Music Production Masterclass 2024', duration: '1:30:20', quality: ['360p', '480p', '720p'], size: { '360p': '180MB', '480p': '300MB', '720p': '650MB' } },
      { id: '7', title: 'FL Studio Complete Tutorial Series', duration: '4:20:15', quality: ['480p', '720p', '1080p'], size: { '480p': '320MB', '720p': '680MB', '1080p': '1.6GB' } },
    ],
    'marketing': [
      { id: '4', title: 'Digital Marketing Strategies 2024', duration: '56:15', quality: ['480p', '720p', '1080p'], size: { '480p': '280MB', '720p': '580MB', '1080p': '1.5GB' } },
      { id: '8', title: 'SEO Mastery: Complete Guide', duration: '2:45:30', quality: ['360p', '480p', '720p', '1080p'], size: { '360p': '220MB', '480p': '380MB', '720p': '800MB', '1080p': '1.9GB' } },
    ],
  };

  const getThumbnailUrl = (id, title) => {
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE'];
    const color = colors[parseInt(id) % colors.length];
    return `https://via.placeholder.com/400x225?bg=${color}&text=${encodeURIComponent(title.substring(0, 20))}`;
  };

  // Extract YouTube video ID from various URL formats
  const extractYouTubeVideoId = (url) => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Just the video ID
    ];

    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setVideos([]);
      setSearchQuery('');
      return;
    }

    setSearchQuery(query);
    setLoading(true);

    try {
      // Check if it's a YouTube URL
      const videoId = extractYouTubeVideoId(query.trim());
      
      if (videoId) {
        // Handle YouTube URL
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const youtubeVideo = {
          id: videoId,
          title: `YouTube Video: ${videoId}`,
          duration: 'Unknown',
          url: `https://www.youtube.com/watch?v=${videoId}`,
          youtubeId: videoId,
          quality: ['360p', '480p', '720p', '1080p'],
          size: { '360p': '180MB', '480p': '300MB', '720p': '650MB', '1080p': '1.5GB' },
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          isYouTube: true
        };

        setVideos([youtubeVideo]);
      } else {
        // Search in mock database
        await new Promise(resolve => setTimeout(resolve, 600));

        const queryLower = query.toLowerCase();
        let results = [];

        // Search through database
        Object.entries(videoDatabase).forEach(([category, categoryVideos]) => {
          const matching = categoryVideos.filter(video => 
            video.title.toLowerCase().includes(queryLower) || 
            category.includes(queryLower)
          );
          results = [...results, ...matching];
        });

        // If no exact matches, return some recommendations
        if (results.length === 0) {
          results = [
            ...videoDatabase.nature,
            ...videoDatabase.web,
          ].slice(0, 4);
        }

        // Add thumbnails to results
        const videosWithThumbnails = results.map(video => ({
          ...video,
          thumbnail: getThumbnailUrl(video.id, video.title)
        }));

        setVideos(videosWithThumbnails);
      }
    } catch (error) {
      console.error('Search error:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadClick = async (videoId, quality) => {
    const remaining = getRemainingFreeDownloads();

    if (remaining <= 0) {
      setShowAuthModal(true);
      return;
    }

    try {
      incrementDownloadCount();
      setRemainingDownloads(getRemainingFreeDownloads());
      
      // Find the video
      const video = videos.find(v => v.id === videoId);
      if (video) {
        console.log(`Starting download of ${video.title} in ${quality}...`);
        
        // Call download endpoint - it saves to server folder
        const result = await downloadVideo(video.url || video.youtubeId || video.id, quality);
        
        if (result.success) {
          console.log('✅ Download completed successfully!');
          console.log(`📁 File saved: ${result.file}`);
          console.log(`📦 File size: ${(result.size / (1024*1024)).toFixed(2)} MB`);
          
          // Show success notification
          alert(`✅ Download Complete!\n\n📁 File: ${result.file}\n📦 Size: ${(result.size / (1024*1024)).toFixed(2)} MB\n\n📂 Location: /downloads folder`);
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      alert(`❌ Download failed: ${error.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar user={user} remainingDownloads={remainingDownloads} />

      {/* Hero Section */}
      <section className="pt-8 pb-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Video Downloader</h1>
            <p className="text-gray-600">Download YouTube videos in any quality</p>
            <p className="text-sm text-gray-500 mt-2">Free Downloads Left: <span className="font-bold text-red-600">{remainingDownloads}</span>/3</p>
          </div>

          {/* Main Search Section */}
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>
        </div>
      </section>

      {/* Results Section */}
      {videos.length > 0 && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {searchQuery ? `Results for "${searchQuery}"` : 'Search Results'}
              </h2>
              <p className="text-gray-600">{videos.length} video{videos.length !== 1 ? 's' : ''} found</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="text-center">
                  <div className="inline-block">
                    <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                  </div>
                  <p className="text-gray-400">Searching videos...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onDownload={(quality) => handleDownloadClick(video.id, quality)}
                    remainingFree={remainingDownloads}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Empty State */}
      {videos.length === 0 && !loading && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-5xl mb-4">📺</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Paste a YouTube Link</h3>
            <p className="text-gray-600 mb-6">
              Enter a YouTube URL above to get started. Select your preferred quality and download!
            </p>
          </div>
        </section>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(userData) => {
            setUser(userData);
            setShowAuthModal(false);
            setRemainingDownloads(999);
          }}
        />
      )}
    </main>
  );
}
