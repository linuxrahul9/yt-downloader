'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-2 bg-slate-900 rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl">▶️</span>
          </div>
        </div>
        <p className="text-gray-300 font-semibold">Loading...</p>
      </div>
    </div>
  );
}
