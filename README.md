# StreamVault - Modern Video Downloader

A beautiful, modern web application for downloading videos in multiple qualities with Firebase authentication. Download up to 3 videos for free, then sign in for unlimited access.

## Features

✨ **Modern Design**
- Beautiful glassmorphism UI with Tailwind CSS
- Smooth animations and transitions
- Responsive design for all devices
- Dark theme optimized for eye comfort

🎬 **Video Management**
- Search and download videos from multiple sources
- Multiple quality options (360p to 4K)
- Real-time file size information
- Video metadata display

🔐 **Firebase Authentication**
- Google Sign-In
- Email/Password authentication
- Phone number authentication
- Secure user sessions

📥 **Smart Download System**
- 3 free downloads for guest users
- 30-day reset period for free downloads
- Unlimited downloads for authenticated users
- Quality selection before download
- Download tracking and history

## Tech Stack

- **Frontend**: Next.js 14, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Authentication**: Firebase Auth
- **Database**: Firestore (optional, for download history)
- **Storage**: Firebase Storage (optional, for downloaded files)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase project (free tier is sufficient)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd stream-vault
```

2. **Install dependencies**
```bash
npm install
```

3. **Firebase Setup**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project or select existing
   - Enable Authentication methods:
     - Google
     - Email/Password
     - Phone
   - Copy your Firebase credentials

4. **Configure Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
stream-vault/
├── app/
│   ├── layout.js              # Main layout with Tailwind globals
│   ├── page.js                # Home page with search and video grid
│   ├── auth/                  # Auth-related pages
│   │   ├── login.js
│   │   └── signup.js
│   └── api/
│       └── download/
│           └── route.js       # Download API endpoint
├── components/
│   ├── NavBar.js              # Navigation component
│   ├── SearchBar.js           # Video search component
│   ├── VideoCard.js           # Video display card
│   ├── QualitySelector.js     # Quality selection modal
│   └── AuthModal.js           # Authentication modal
├── lib/
│   ├── firebase.js            # Firebase configuration
│   └── storage.js             # LocalStorage utilities
├── styles/
│   └── globals.css            # Global Tailwind styles
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Key Features Explained

### Free Download System
- Guests get **3 free downloads** tracked in localStorage
- Counter resets every **30 days**
- On 4th download, authentication modal appears
- Authenticated users get **unlimited downloads**

### Quality Selection
Before downloading, users can choose from available qualities:
- **360p**: Mobile optimized (smallest file)
- **480p**: Standard quality
- **720p**: HD quality
- **1080p**: Full HD
- **4K**: Ultra HD (largest file)

### Authentication Methods
Users can sign in using:
1. **Google Sign-In** - One-click authentication
2. **Email/Password** - Traditional email authentication with secure password
3. **Phone Number** - SMS-based verification for phone users

### Modern Design Elements
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Gradient Text**: Eye-catching headings
- **Smooth Animations**: Float animations, shimmer effects
- **Dark Theme**: Easy on the eyes, modern feel
- **Responsive Grid**: Adapts to all screen sizes

## API Integration

### Download Endpoint
```javascript
POST /api/download
Content-Type: application/json

{
  "videoUrl": "https://example.com/video",
  "quality": "1080p"
}

Response:
{
  "success": true,
  "downloadUrl": "/downloads/video_123.mp4",
  "quality": "1080p",
  "message": "Download started"
}
```

## Customization

### Change Theme Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#0f172a',      // Background
  secondary: '#1e293b',    // Card background
  accent: '#60a5fa',       // Primary accent
  gradient: '#c084fc',     // Secondary accent
}
```

### Change Free Download Limit
Edit `lib/storage.js`:
```javascript
const FREE_DOWNLOADS_LIMIT = 3; // Change this value
```

### Add More Authentication Methods
Edit `components/AuthModal.js` and add new sign-in methods

## Security Considerations

✅ **Best Practices Implemented**
- Environment variables for sensitive data
- Firebase security rules (configure in Firebase Console)
- CORS protection on API routes
- Input validation on all forms
- Secure password requirements

⚠️ **Additional Setup Needed**
1. Configure Firebase Firestore security rules
2. Set up OAuth consent screen for Google provider
3. Enable reCAPTCHA for bot protection
4. Set up backend download service (e.g., yt-dlp server)

## Connecting to Backend Service

For actual video downloads, you'll need to set up a backend service:

Option 1: **Using Python Flask** (as in your original `app.py`)
```bash
# Create a separate Flask server on port 5000
# Update API calls in `app/api/download/route.js` to call Flask endpoint
```

Option 2: **Using Next.js API Routes with FFmpeg**
```bash
npm install fluent-ffmpeg
# Set up download logic in `/app/api/download/route.js`
```

Option 3: **Using a Third-Party Service**
- RapidAPI Video Download APIs
- External download services

## Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms
- Railway
- Render
- Heroku
- AWS Amplify

## Troubleshooting

**Firebase Not Connecting**
- Check `.env.local` has correct credentials
- Verify Firebase project is active
- Check browser console for error messages

**Tailwind CSS Not Loading**
- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run dev`

**Download Not Working**
- Ensure backend service is running
- Check API endpoint in browser DevTools
- Verify CORS settings

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use for personal or commercial projects

## Support

For issues or questions:
- Create an issue in the repository
- Check existing issues for solutions
- Review Firebase documentation

## Credits

- Built with Next.js and React
- Authentication by Firebase
- Styling with Tailwind CSS
- Icons and emojis for visual appeal

## Roadmap

- [ ] User dashboard with download history
- [ ] Playlist support
- [ ] Scheduled downloads
- [ ] Advanced search filters
- [ ] Download statistics
- [ ] Dark/Light theme toggle
- [ ] Mobile app version
- [ ] API for third-party integration

---

**Happy downloading! 🎬📥**
# yt-downloader
