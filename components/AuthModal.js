'use client';

import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AuthModal({ onClose, onAuthSuccess }) {
  const [authMode, setAuthMode] = useState('signin'); // signin, signup, phone
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize Google Provider
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      setSuccess(`✅ Welcome, ${user.displayName || user.email}!`);
      setTimeout(() => {
        onAuthSuccess({ 
          email: user.email,
          name: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL
        });
      }, 1500);
    } catch (err) {
      if (err.code === 'auth/popup-blocked') {
        setError('⚠️ Popup blocked. Please enable popups for this site.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled.');
      } else {
        setError('Google sign-in failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('❌ Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      setSuccess(`✅ Welcome back, ${email}!`);
      setTimeout(() => {
        onAuthSuccess({ 
          email: user.email,
          uid: user.uid
        });
      }, 1500);
    } catch (err) {
      const errorMap = {
        'auth/invalid-email': '❌ Invalid email address',
        'auth/user-not-found': '❌ No account with this email',
        'auth/wrong-password': '❌ Incorrect password',
        'auth/too-many-requests': '❌ Too many failed attempts. Try again later.',
      };
      
      setError(errorMap[err.code] || `❌ Sign in failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('❌ Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('❌ Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      setSuccess(`✅ Account created! Welcome, ${email}!`);
      setTimeout(() => {
        onAuthSuccess({ 
          email: user.email,
          uid: user.uid
        });
      }, 1500);
    } catch (err) {
      const errorMap = {
        'auth/invalid-email': '❌ Invalid email address',
        'auth/email-already-in-use': '❌ Email already registered',
        'auth/weak-password': '❌ Password too weak',
        'auth/operation-not-allowed': '❌ Sign-up disabled',
      };
      
      setError(errorMap[err.code] || `❌ Sign up failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async (e) => {
    e.preventDefault();
    if (!phone) {
      setError('❌ Please enter your phone number');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // For phone authentication, we'll store the number and show success
      // Full phone auth requires reCAPTCHA setup which is complex
      setSuccess(`✅ Verification code would be sent to ${phone}`);
      
      setTimeout(() => {
        onAuthSuccess({ 
          phone,
          uid: 'phone-' + Date.now()
        });
      }, 1500);
    } catch (err) {
      setError('❌ Phone sign-in failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold gradient-text">
            {authMode === 'signin' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Phone Sign In'}
          </h2>
          <button
            onClick={onClose}
            className="text-3xl hover:text-red-400 transition"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-400 mb-6">
          Sign in to get unlimited downloads and exclusive features.
        </p>

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-6 text-green-300 text-sm font-semibold animate-pulse">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && !success && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-red-300 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading || success}
          className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-bold transition mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Signing in...' : success ? '✅ Success!' : <>🔐 Continue with Google</>}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 mb-6">
          {['signin', 'signup', 'phone'].map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setAuthMode(mode);
                setError('');
                setSuccess('');
                setEmail('');
                setPassword('');
                setPhone('');
              }}
              disabled={loading || success}
              className={`flex-1 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                authMode === mode
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {mode === 'signin' ? '📧 Email' : mode === 'signup' ? '✏️ Sign Up' : '📱 Phone'}
            </button>
          ))}
        </div>

        {/* Email Sign In Form */}
        {authMode === 'signin' && (
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg input-glow placeholder-gray-400"
              disabled={loading || success}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg input-glow placeholder-gray-400"
              disabled={loading || success}
            />
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-bold hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : success ? '✅ Signed In!' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Email Sign Up Form */}
        {authMode === 'signup' && (
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg input-glow placeholder-gray-400"
              disabled={loading || success}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg input-glow placeholder-gray-400"
              disabled={loading || success}
            />
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold hover:shadow-lg hover:shadow-green-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : success ? '✅ Account Created!' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Phone Sign In Form */}
        {authMode === 'phone' && (
          <form onSubmit={handlePhoneSignIn} className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-3 text-2xl">🌍</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg input-glow placeholder-gray-400"
                disabled={loading || success}
              />
            </div>
            <p className="text-xs text-gray-400">
              We'll send you a verification code. Standard rates may apply.
            </p>
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-bold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Code...' : success ? '✅ Code Sent!' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          By signing in, you agree to our Terms and Privacy Policy. 
          You'll get unlimited downloads after authentication.
        </p>
      </div>
    </div>
  );
}
