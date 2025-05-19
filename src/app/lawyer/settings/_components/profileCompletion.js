'use client';

import Link from 'next/link';

export default function ProfileCompletion() {
  const completion = 27;

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-700">
        Your profile is{' '}
        <span className="text-cyan-600 font-semibold">
          {completion} % complete
        </span>
      </p>

      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-cyan-500 transition-all"
          style={{ width: `${completion}%` }}
        ></div>
      </div>

      <p className="text-sm text-gray-400">
        Take two minutes to improve your profile
      </p>

      <p className="text-sm text-gray-700">
        Make the best first impression with a great profile — this is what
        customers will look at first when choosing which professional to hire.{' '}
        <Link href="/lawyer/profile">
          <span className="text-cyan-600 font-semibold hover:underline">
            View profile
          </span>
        </Link>
      </p>
    </div>
  );
}
