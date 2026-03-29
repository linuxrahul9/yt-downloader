// Video download service integration
// This file connects to the backend video download service

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function downloadVideo(videoUrl, quality) {
  try {
    const response = await fetch(`${BACKEND_URL}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: videoUrl,
        quality: quality,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Download failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: data.success,
      message: data.message,
      file: data.file,
      size: data.size
    };
  } catch (error) {
    console.error('Download API error:', error);
    throw error;
  }
}

export async function getVideoInfo(videoUrl) {
  try {
    const response = await fetch(`${BACKEND_URL}/video-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: videoUrl,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch video info: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw error;
  }
}

export async function getAvailableQualities(videoUrl) {
  try {
    const info = await getVideoInfo(videoUrl);
    return info.qualities || ['360p', '480p', '720p', '1080p'];
  } catch (error) {
    console.error('Error getting qualities:', error);
    return ['360p', '480p', '720p', '1080p']; // Default fallback
  }
}
