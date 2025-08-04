'use client';

import Progress from '@/components/UIComponents/Progress';
import Link from 'next/link';

export default function ProfileProgress() {
  const completion = 27;

  return (
    <div className="space-y-2 mb-5">
      {/* <p className="text-sm text-gray-700">
        Your profile is{' '}
        <span className="text-cyan-600 font-semibold">
          {completion} % complete
        </span>
      </p>

      <Progress completion={completion} />

      <p className="text-sm text-gray-400">
        Take a moment to improve your profile and make it stand out
      </p> */}

      <p className="text-sm text-gray-700">
        Make the best first impression with a strong legal profile — this is the
        first things clients see when deciding which lawyer to trust and hire .
        <Link href="/lawyer/dashboard/my-stats">
          <span className="text-cyan-600 font-semibold hover:underline">
            View profile
          </span>
        </Link>
      </p>
    </div>
  );
}
