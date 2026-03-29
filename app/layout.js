'use client';

import { ReactNode } from 'react';
import '../styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>StreamVault | Download Videos in HD Quality</title>
        <meta name="description" content="Download videos in HD quality with StreamVault. Free 3 video downloads, then unlock with Firebase authentication." />
      </head>
      <body className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-jakarta">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
