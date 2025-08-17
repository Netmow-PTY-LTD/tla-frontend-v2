import MapMarkerAlt from '@/components/icon/MapMarkerAlt';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function SendNewLeadsCard({
  profile,
  locations,
  isLoading,
  isError,
  error,
}) {
  return (
    <Card className="shadow-sm rounded-2xl w-full">
      {/* Title */}
      <div className="p-4">
        <h3 className="text-black font-medium heading-md">
          Estimated 10 cases per day
        </h3>
      </div>

      {/* Divider */}
      <hr className="border-t border-[#D9D9D9]" />

      {/* Services Section */}
      <div className="p-4">
        <div>
          <h4 className="text-black font-medium heading-base">
            Sending new cases to{' '}
          </h4>
          <p className="text-[#34495E] mt-[5px] admin-text">{profile?.email}</p>
        </div>
        <Link href={'/lawyer/settings/profile?section=about'}>
          {' '}
          <button className="text-[#00C3C0] text-[14px] mt-2">Change</button>
        </Link>
      </div>
    </Card>
  );
}
