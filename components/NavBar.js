'use client';

import { useState } from 'react';

export default function NavBar({ user, remainingDownloads }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">YTDownload</h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Download counter */}
            <div className="text-sm text-gray-600">
              Free downloads: <span className="font-bold text-red-600">{remainingDownloads}/3</span>
            </div>

            {/* User info or Auth button */}
            {user ? (
              <div className="text-sm text-gray-700">
                {user.email || user.phone || 'Logged In'}
              </div>
            ) : (
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
