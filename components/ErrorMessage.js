'use client';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="glass-card border-2 border-red-500/30 rounded-xl p-6 max-w-md">
      <div className="flex gap-4">
        <div className="text-4xl">❌</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-red-400 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-300 text-sm mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-lg hover:bg-red-500/30 transition text-red-300 font-semibold text-sm"
            >
              🔄 Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
