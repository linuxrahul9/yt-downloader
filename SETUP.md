# StreamVault Setup Guide

## Complete Setup Instructions

### Step 1: Firebase Configuration

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Add project"
   - Enter project name (e.g., "StreamVault")
   - Continue through the setup wizard

2. **Get Firebase Credentials**
   - In Firebase Console, go to Project Settings (⚙️)
   - Under "Your apps", add Web app
   - Copy the config object
   - Fill in `.env.local`:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain_here
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

3. **Enable Authentication Methods**
   - Go to Authentication > Sign-in method
   - Enable these providers:
     - **Google**: Click enable, follow OAuth setup
     - **Email/Password**: Click enable
     - **Phone**: Click enable, add reCAPTCHA
   
4. **Configure OAuth Consent Screen** (for Google)
   - Go to APIs & Services > OAuth consent screen
   - Select "External" user type
   - Fill in app information
   - Add test users (your email)
   - Save

### Step 2: Local Setup

1. **Install Dependencies**
   ```bash
   cd /path/to/stream-vault
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Application**
   - Browser: http://localhost:3000
   - You should see the StreamVault home page

### Step 3: Backend Setup (Video Download Service)

Your project includes a Python Flask backend (`app.py`). You can use it alongside the Next.js frontend:

1. **Prepare Backend**
   ```bash
   # In a separate terminal
   cd /path/to/backend
   
   # Install Python packages
   pip install flask flask-cors yt-dlp ffmpeg-python requests
   
   # Run the server
   python app.py
   ```

2. **Update Backend Configuration**
   - Edit `app.py` to accept requests from http://localhost:3000
   - Configure CORS properly:
     ```python
     CORS(app, origins=["http://localhost:3000"])
     ```

3. **Connect Frontend to Backend**
   - In `.env.local`:
     ```
     NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
     ```

### Step 4: Testing the Application

1. **Test Free Download Limit**
   - Search for a video
   - Try downloading 3 videos
   - On 4th download, authentication modal should appear

2. **Test Authentication**
   - **Google**: Click "Continue with Google" button
   - **Email**: Create account with email/password
   - **Phone**: Enter phone number starting with +

3. **Test Quality Selection**
   - Search for a video
   - Click download
   - Quality selection modal should appear
   - Select different qualities to see sizes

4. **Check Browser**
   - Open DevTools (F12)
   - Check Console for any errors
   - Verify API calls under Network tab

### Step 5: Customization

#### Change App Name
- Edit `README.md`
- Edit `app/layout.js` (title and description)
- Edit `components/NavBar.js`

#### Change Color Scheme
1. Edit `styles/globals.css`
2. Edit `tailwind.config.js`
3. Update component files with new colors

#### Add Your Own Videos
- Replace mock video data in `app/page.js`
- Connect to your video database
- Update `VideoCard.js` with real data

#### Update Download Limit
- Edit `lib/storage.js`
- Change `FREE_DOWNLOADS_LIMIT = 3`
- Change `EXPIRY_DAYS = 30`

### Step 6: Deploy

#### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Add environment variables (from `.env.local`)
   - Click Deploy

3. **Update Firebase**
   - In Firebase Console, add your Vercel domain to authorized domains
   - Authentication > Settings > Authorized domains
   - Add `yourdomain.vercel.app`

#### Deploy Backend

1. **Option A: Railway** (Recommended)
   - Push code to GitHub
   - Connect to Railway
   - Set environment variables
   - Deploy

2. **Option B: Render**
   - Similar to Railway setup
   - Choose Python as runtime
   - Set start command: `python app.py`

3. **Option C: Heroku**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

### Step 7: Monitoring & Maintenance

1. **Check Logs**
   - Vercel: Deployments > Logs
   - Backend: Check console output
   - Firebase: Firebase Console > Logs

2. **Monitor Storage**
   - Check Firebase usage
   - Set up billing alerts
   - Monitor download folder size

3. **Update Dependencies**
   ```bash
   npm update
   npm audit
   ```

## Troubleshooting

### Firebase Connection Fails
**Problem**: "Firebase initialization error"
- Check `.env.local` credentials
- Verify Firebase project is active
- Clear browser cache and reload

**Solution**:
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run dev
```

### Google Sign-In Not Working
**Problem**: "Invalid client ID" error
- OAuth consent screen not set up
- Domain not added to authorized domains
- reCAPTCHA not configured

**Solution**:
1. Go to APIs & Services > OAuth consent screen
2. Set to "External"
3. Add test users
4. In Authentication, add your domain

### Backend Not Connecting
**Problem**: Downloads fail, "Cannot reach backend"
- Backend server not running
- Wrong URL in `.env.local`
- CORS not configured

**Solution**:
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
python app.py

# Check CORS headers
# Should see Access-Control-Allow-Origin in response
```

### Tailwind CSS Not Loading
**Problem**: Styling looks broken
- Paths misconfigured in `tailwind.config.js`
- CSS file not imported

**Solution**:
```bash
# Rebuild
rm -rf .next
npm run dev
```

## Next Steps

1. **Customize Branding**
   - Add your logo
   - Change colors
   - Update text and messaging

2. **Add Features**
   - User dashboard
   - Download history
   - Playlist support
   - Social sharing

3. **Optimize Performance**
   - Add image optimization
   - Implement caching
   - Set up CDN for downloads

4. **Improve Security**
   - Set up reCAPTCHA v3
   - Add rate limiting
   - Implement input validation

5. **Scale Infrastructure**
   - Add more download servers
   - Implement queue system
   - Add download retry logic

## Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [YouTube yt-dlp Documentation](https://github.com/yt-dlp/yt-dlp)

## Community

- Report issues on GitHub
- Join Discord for discussions
- Share your customizations

---

**You're all set! 🚀 Start building your video downloader today!**
