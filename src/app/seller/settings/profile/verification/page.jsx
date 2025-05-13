import Link from 'next/link';
import React from 'react';

export default function Verification() {
  return (
    <div>
      <h1>Verification Page</h1>
      <Link href="/seller/settings/profile/verification/business">
        Start Your Free Month
      </Link>
    </div>
  );
}
