import ComingSoon from '@/components/ui/ComingSoon';
import React from 'react';

export default function OneClickResponse() {
  return (
    <div>
      <div className="p-4 max-w-[600px] mx-auto">
        <ComingSoon
          title=" Communication Page Settings Coming Soon"
          message="We’re working hard to bring this feature to life. Stay tuned!"
        />
      </div>
    </div>
  );
}
