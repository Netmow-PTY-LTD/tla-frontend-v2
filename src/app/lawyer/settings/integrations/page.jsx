'use client';
import ComingSoon from '@/components/ui/ComingSoon';
import React from 'react';

export default function HubspotIntegration() {
  return (
    <div>
      <div className="p-4 max-w-[600px] mx-auto">
        <ComingSoon
          title=" Integration Page Settings Coming Soon"
          message="We’re working hard to bring this feature to life. Stay tuned!"
        />
      </div>
    </div>
  );
}
