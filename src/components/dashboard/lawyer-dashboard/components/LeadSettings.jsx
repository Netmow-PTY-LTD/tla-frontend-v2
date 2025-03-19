import { Card } from '@/components/ui/card';
import Link from 'next/link';
import React from 'react';

const LeadSettings = () => {
  return (
    <Card>
      <div className="m-3 flex flex-wrap justify-between items-center">
        <h2 className="font-medium text-lg">Lead Settings</h2>
        <button className="text-sm px-3 py-1 rounded bg-[#F3F3F3] text-[#34495E]">
          Current plan: Free
        </button>
      </div>

      <hr className="border-[#F3F3F3]" />

      <div className="m-3">
        <p>Unlock more opportunities and increase your reach.</p>
        <button className="rounded-lg p-4 w-full bg-[#F3F3F3] my-2">
          Get 20% Off in Premium Plan
        </button>
        <p>
          Get your desired lawyer or client within a reasonable cost. Respond to
          up to 10 customers and get hired guarantee.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center m-3">
        <button className="btn-brand mb-2 sm:mb-0">Upgrade plan</button>
        <p className="text-sm">
          Visit{' '}
          <span>
            <Link href="#">help centre</Link>
          </span>{' '}
          for more info
        </p>
      </div>
    </Card>
  );
};

export default LeadSettings;
