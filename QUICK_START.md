# Quick Start Guide - StreamVault

## ✨ What Was Created

Your project has been completely converted to a modern Next.js application with:

### Features Built In
✅ **Video Downloader** - Search and download videos in multiple qualities  
✅ **Firebase Authentication** - Google, Email, and Phone sign-in  
✅ **Free Download System** - 3 free downloads for guests, unlimited after login  
✅ **Quality Selection** - Choose from 360p to 4K before downloading  
✅ **Modern Beautiful UI** - Glassmorphism design with smooth animations  
✅ **Responsive Design** - Works on mobile, tablet, and desktop  

### Technology Stack
- Next.js 16 (React 19)
- Firebase Authentication
- Tailwind CSS for styling
- Modern glassmorphism UI components
- LocalStorage for tracking free downloads

---

## 🚀 Getting Started

### 1. Start Development Server
```bash
npm run dev
```
Then open: http://localhost:3000

### 2. Firebase Setup (Required for Auth to Work)

#### Create Firebase Project
1. Go to https://console.firebase.google.com
2. Create a new project (name it "StreamVault")
3. Skip Analytics for now
4. Wait for project creation

#### Get Firebase Credentials
1. In Firebase Console, go to **Project Settings** (⚙️ icon)
2. Under "Your apps", click **"Add app"**
3. Select **Web** (</>) icon
4. Copy the Firebase config:
```javascript
{
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

#### Update .env.local
Replace the values in `/.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Enable Authentication Methods
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable these providers:
   - **Google** - Click enable, accept defaults
   - **Email/Password** - Click enable
   - **Phone** - Click enable, add reCAPTCHA

3. For **Google OAuth**:
   - Go to **APIs & Services** > **OAuth consent screen**
   - Select "External"
   - Fill in app name, email
   - Add test users (your email address)
   - Save

---

## 📁 Project Structure

```
/home/freenux/Documents/Projects/html/
├── app/
│   ├── layout.js           # Main layout
│   ├── page.js             # Home page with search
│   └── api/
│       └── download/       # API endpoint
├── components/             # React components
│   ├── NavBar.js
│   ├── SearchBar.js
│   ├── VideoCard.js
│   ├── QualitySelector.js
│   ├── AuthModal.js
│   └── ...
├── lib/
│   ├── firebase.js         # Firebase config
│   ├── storage.js          # Download counter logic
│   └── videoService.js     # Video API calls
├── styles/
│   └── globals.css         # Tailwind styles
├── .env.local             # Your Firebase credentials
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🎬 Using the Application

### As a Guest User
1. Search for a video using the search bar
2. Download up to **3 videos for free**
3. On the 4th download, auth modal appears
4. Sign in using Google, Email, or Phone

### After Authentication
✅ Unlimited downloads  
✅ Access restricted content  
✅ View download history  

### Downloading a Video
1. **Search** - Enter video title or URL
2. **View** - See video information in card
3. **Select Quality** - Choose 360p, 480p, 720p, 1080p, or 4K
4. **Download** - File starts downloading
5. **Check Downloads** - File appears in your downloads folder

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Install new packages
npm install package-name
```

---

## 🎨 Customization

### Change App Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#0f172a',      // Background
  secondary: '#1e293b',    // Card bg
  accent: '#60a5fa',       // Blue
  gradient: '#c084fc',     // Purple
}
```

### Change Free Download Limit
Edit `lib/storage.js`:
```javascript
const FREE_DOWNLOADS_LIMIT = 3;  // Change this number
const EXPIRY_DAYS = 30;          // Reset period
```

### Add Your Logo
Replace emoji in `components/NavBar.js`:
```javascript
<div className="text-2xl font-bold gradient-text">YOUR_LOGO ✨</div>
```

---

## 📱 Features Explained

### Free Download System
- **Tracking**: Uses browser localStorage
- **Reset**: Automatically resets every 30 days
- **Counter**: Shows remaining free downloads in header
- **Flow**: 3 free → Sign in required → Unlimited

### Authentication Options
1. **Google** - One-click sign-in with Google account
2. **Email/Password** - Traditional email authentication
3. **Phone** - SMS verification code sent to phone

### Quality Selection
Shows available qualities with file sizes before download:
- 360p - Mobile optimized (smallest)
- 480p - Standard quality
- 720p - HD quality
- 1080p - Full HD quality  
- 4K - Ultra HD (largest)

### Modern Design Features
- **Glassmorphism** - Frosted glass effect on cards
- **Gradient Text** - Eye-catching headings
- **Smooth Animations** - Float, shimmer effects
- **Dark Theme** - Easy on eyes, modern feel
- **Responsive** - Mobile-first design
- **Loading States** - Spinner during interactions

---

## 🔗 API Integration

The app includes API endpoint for downloads:
```javascript
POST /api/download
Content-Type: application/json

{
  "videoUrl": "https://...",
  "quality": "1080p"
}
```

To connect to your Python Flask backend:
1. Update `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
2. Ensure Flask server runs on same port
3. Configure CORS in Flask `app.py`

---

## 🚀 Deploy to Production

### Deploy Frontend to Vercel
```bash
npm install -g vercel
vercel
```

1. Login with GitHub account
2. Select repository
3. Add environment variables
4. Deploy!

### Deploy Backend (Optional)
- Railway, Render, or Heroku
- Set `NEXT_PUBLIC_BACKEND_URL` to your backend URL

---

## ⚠️ Important Security Notes

✅ Never commit `.env.local` to GitHub  
✅ Keep Firebase credentials secure  
✅ Use HTTPS in production  
✅ Set up Firebase security rules  
✅ Enable reCAPTCHA for bots protection  

---

## 📚 Documentation Files

1. **README.md** - Complete project documentation
2. **SETUP.md** - Detailed setup instructions
3. **QUICK_START.md** - This file

---

## 🆘 Troubleshooting

### Firebase Not Connected
```
Error: Cannot initialize Firebase
```
→ Check `.env.local` has correct credentials

### Tailwind Not Styling
```
Styles look plain
```
→ Clear cache: `rm -rf .next && npm run dev`

### Port 3000 Already in Use
```
Error: Port 3000 already in use
```
→ Kill process: `lsof -ti:3000 | xargs kill -9`

### Import Errors
```
Module not found: Can't resolve '@/components/...'
```
→ Ensure `jsconfig.json` exists with path aliases

---

## 📞 Need Help?

1. Check **README.md** for detailed documentation
2. Review **SETUP.md** for step-by-step setup
3. Check browser console (F12) for error messages
4. Verify `.env.local` has Firebase credentials

---

## 🎯 Next Steps

1. ✅ Start server: `npm run dev`
2. ✅ Configure Firebase
3. ✅ Test on http://localhost:3000
4. ✅ Customize colors and branding
5. ✅ Connect to video download backend
6. ✅ Deploy to production

---

**Happy coding! 🚀**
