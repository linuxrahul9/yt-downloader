from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import os

app = Flask(__name__)
CORS(app, origins="*")

# Directory Setup
DOWNLOAD_FOLDER = os.path.expanduser('~/Downloads')
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

# Quality mapping - improved for better quality download
QUALITY_MAP = {
    '360p': '(bestvideo[height=360]/bestvideo[height<=360])+bestaudio[ext=m4a]/bestaudio',
    '480p': '(bestvideo[height=480]/bestvideo[height<=480])+bestaudio[ext=m4a]/bestaudio',
    '720p': '(bestvideo[height=720]/bestvideo[height<=720])+bestaudio[ext=m4a]/bestaudio',
    '1080p': '(bestvideo[height=1080]/bestvideo[height<=1080])+bestaudio[ext=m4a]/bestaudio',
    '4K': '(bestvideo[height=2160]/bestvideo[height<=2160])+bestaudio[ext=m4a]/bestaudio',
}

@app.route('/download', methods=['POST'])
def download_video():
    data = request.json
    url = data.get('url')
    quality = data.get('quality', '720p')
    format_type = data.get('format', 'mp4')

    if not url:
        return jsonify({"success": False, "error": "URL is missing!"}), 400

    print(f"\n{'='*60}")
    print(f"[*] Starting Download")
    print(f"[*] URL: {url}")
    print(f"[*] Quality: {quality}")
    print(f"[*] Format: {format_type}")
    print(f"{'='*60}\n")

    try:
        # Get format string for quality
        format_str = QUALITY_MAP.get(quality, QUALITY_MAP['720p'])
        
        ydl_opts = {
            'format': format_str,
            'outtmpl': f'{DOWNLOAD_FOLDER}/%(title)s.%(ext)s',
            'merge_output_format': 'mp4',
            'noplaylist': True,
            'nocheckcertificate': True,
            'quiet': False,
            'no_warnings': False,
            'socket_timeout': 30,
            'prefer_ffmpeg': True,
            'postprocessors': [
                {
                    'key': 'FFmpegVideoConvertor',
                    'preferedformat': 'mp4',
                },
                {
                    'key': 'FFmpegMetadata',
                }
            ],
            'extractor_args': {
                'youtube': {
                    'player_client': ['android_embedded'],
                }
            },
        }

        # Add User-Agent header
        ydl_opts['http_headers'] = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        }

        # Specific Logic for MP3
        if format_type.lower() == 'mp3':
            ydl_opts['format'] = 'bestaudio/best'
            ydl_opts['postprocessors'] = [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            print("[*] Downloading video information...")
            info = ydl.extract_info(url, download=True)
            temp_path = ydl.prepare_filename(info)
            
            print(f"[*] Video title: {info.get('title', 'Unknown')}")
            print(f"[*] Processing video...")
            
            # Resolve final filename
            base = os.path.splitext(temp_path)[0]
            final_path = f"{base}.{format_type}"

        if os.path.exists(final_path):
            file_size = os.path.getsize(final_path)
            file_name = os.path.basename(final_path)
            
            print(f"\n[✓] DOWNLOAD COMPLETE!")
            print(f"[✓] File: {file_name}")
            print(f"[✓] Size: {file_size / (1024*1024):.2f} MB")
            print(f"[✓] Location: {final_path}")
            print(f"{'='*60}\n")
            
            return jsonify({
                "success": True,
                "message": "Download completed successfully",
                "file": file_name,
                "size": file_size,
                "path": final_path
            }), 200
        else:
            error_msg = "File merged but not found on disk."
            print(f"[!] ERROR: {error_msg}")
            return jsonify({"success": False, "error": error_msg}), 404

    except Exception as e:
        error_msg = str(e)
        print(f"\n[!] ERROR: {error_msg}")
        print(f"{'='*60}\n")
        return jsonify({"success": False, "error": error_msg}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "Backend server is running"}), 200

if __name__ == '__main__':
    print("=" * 60)
    print("YouTube Video Downloader Backend")
    print("=" * 60)
    print(f"Server running on: http://0.0.0.0:8000")
    print(f"Download folder: {DOWNLOAD_FOLDER}")
    print("=" * 60)
    app.run(host='0.0.0.0', port=8000, debug=False)