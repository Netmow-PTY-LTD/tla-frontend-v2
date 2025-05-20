'use client';

import Progress from '@/components/UIComponents/Progress';
import Link from 'next/link';

export default function ProfileProgress() {
  const completion = 27;

  return (
    <div className="space-y-2 mb-5">
      <p className="text-sm text-gray-700">
        Your profile is{' '}
        <span className="text-cyan-600 font-semibold">
          {completion} % complete
        </span>
      </p>

      <Progress completion={completion} />

      <p className="text-sm text-gray-400">
        Take two minutes to improve your profile
      </p>

      <p className="text-sm text-gray-700">
        Make the best first impression with a great profile — this is what
        customers will look at first when choosing which professional to hire.{' '}
        <Link href="/lawyer/settings/profile/my-profile">
          <span className="text-cyan-600 font-semibold hover:underline">
            View profile
          </span>
        </Link>
      </p>
    </div>
  );
}
