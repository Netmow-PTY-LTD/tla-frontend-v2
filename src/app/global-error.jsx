'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center border border-gray-100">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 mb-6 shadow-sm">
              <svg
                className="h-10 w-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
              Service Unavailable
            </h2>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              We are currently experiencing technical difficulties connecting to our servers. Our team is working on resolving the issue.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
              <button
                onClick={() => reset()}
                className="flex-1 justify-center rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb] transition-all duration-200"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 justify-center rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all duration-200"
              >
                Refresh Page
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-red-50 text-left rounded-lg overflow-auto max-h-48 border border-red-100">
                <p className="text-xs text-red-800 font-mono whitespace-pre-wrap flex flex-col gap-2">
                  <span className="font-bold">Error Message:</span>
                  <span>{error?.message || 'Unknown error occurred'}</span>
                  {error?.digest && (
                     <span><span className="font-bold">Digest:</span> {error.digest}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
