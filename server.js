const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { promisify } = require('util');

const app = express();
const execPromise = promisify(exec);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Directory Setup
const DOWNLOAD_FOLDER = path.join(os.homedir(), 'Downloads');
if (!fs.existsSync(DOWNLOAD_FOLDER)) {
  fs.mkdirSync(DOWNLOAD_FOLDER, { recursive: true });
}

// Quality mapping - improved for better quality download
const QUALITY_MAP = {
  '360p': '(bestvideo[height=360]/bestvideo[height<=360])+bestaudio[ext=m4a]/bestaudio',
  '480p': '(bestvideo[height=480]/bestvideo[height<=480])+bestaudio[ext=m4a]/bestaudio',
  '720p': '(bestvideo[height=720]/bestvideo[height<=720])+bestaudio[ext=m4a]/bestaudio',
  '1080p': '(bestvideo[height=1080]/bestvideo[height<=1080])+bestaudio[ext=m4a]/bestaudio',
  '4K': '(bestvideo[height=2160]/bestvideo[height<=2160])+bestaudio[ext=m4a]/bestaudio',
};

// Download endpoint
app.post('/download', async (req, res) => {
  try {
    const { url, quality = '720p', format = 'mp4' } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is missing!' });
    }

    console.log('\n' + '='.repeat(60));
    console.log('[*] Starting Download');
    console.log(`[*] URL: ${url}`);
    console.log(`[*] Quality: ${quality}`);
    console.log(`[*] Format: ${format}`);
    console.log('='.repeat(60) + '\n');

    const formatStr = QUALITY_MAP[quality] || QUALITY_MAP['720p'];
    
    let ydlCommand = `yt-dlp`;
    ydlCommand += ` -f "${formatStr}"`;
    ydlCommand += ` -o "${DOWNLOAD_FOLDER}/%(title)s.%(ext)s"`;
    ydlCommand += ` -S "codec:h264"`;
    ydlCommand += ` --merge-output-format mp4`;
    ydlCommand += ` --no-playlist`;
    ydlCommand += ` --socket-timeout 30`;
    
    // Add FFmpeg post-processors
    if (format.toLowerCase() === 'mp3') {
      ydlCommand += ` -x --audio-format mp3 --audio-quality 192`;
    } else {
      ydlCommand += ` --postprocessor-args "-c:v libx264 -preset fast"`;
    }

    // Add User-Agent
    ydlCommand += ` --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"`;
    ydlCommand += ` "${url}"`;

    console.log('[*] Downloading video...');
    
    const { stdout, stderr } = await execPromise(ydlCommand, {
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      timeout: 600000, // 10 minutes
    });

    console.log(stdout);
    if (stderr) console.log(stderr);

    // Get the downloaded file info from stdout
    const titleMatch = stdout.match(/\[download\].*?Destination: ([^\n]+)/);
    const sizeMatch = stdout.match(/(\d+\.?\d*)\s*(?:MiB|GiB|KiB|B)(?:\s|$)/);

    let downloadedFile = null;
    let fileSize = 0;

    // Search for most recently modified file in Downloads folder
    const files = fs.readdirSync(DOWNLOAD_FOLDER)
      .map(file => ({
        name: file,
        path: path.join(DOWNLOAD_FOLDER, file),
        time: fs.statSync(path.join(DOWNLOAD_FOLDER, file)).mtimeMs,
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length > 0) {
      downloadedFile = files[0];
      fileSize = fs.statSync(downloadedFile.path).size;
    }

    if (downloadedFile) {
      const fileSizeInMB = (fileSize / (1024 * 1024)).toFixed(2);
      
      console.log('\n[✓] DOWNLOAD COMPLETE!');
      console.log(`[✓] File: ${downloadedFile.name}`);
      console.log(`[✓] Size: ${fileSizeInMB} MB`);
      console.log(`[✓] Location: ${downloadedFile.path}`);
      console.log('='.repeat(60) + '\n');

      return res.status(200).json({
        success: true,
        message: 'Download completed successfully',
        file: downloadedFile.name,
        size: fileSize,
        path: downloadedFile.path,
      });
    } else {
      const errorMsg = 'Download failed: File not created';
      console.log(`[!] ERROR: ${errorMsg}`);
      return res.status(404).json({ success: false, error: errorMsg });
    }

  } catch (error) {
    const errorMsg = error.message || String(error);
    console.log('\n[!] ERROR: ' + errorMsg);
    console.log('='.repeat(60) + '\n');
    return res.status(500).json({ success: false, error: errorMsg });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running' });
});

// Start server
const PORT = 8000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log('='.repeat(60));
  console.log('YouTube Video Downloader Backend (Node.js)');
  console.log('='.repeat(60));
  console.log(`Server running on: http://0.0.0.0:${PORT}`);
  console.log(`Download folder: ${DOWNLOAD_FOLDER}`);
  console.log('='.repeat(60));
});
