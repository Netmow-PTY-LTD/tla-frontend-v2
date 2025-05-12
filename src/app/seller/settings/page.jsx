import Link from 'next/link';
import React from 'react';

export default function Page() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-bold text-lg mb-5">My Profile</h2>
        <div className="flex flex-col gap-4">
          <Link href="/seller/settings/profile/my-profile">My Profile</Link>
          <Link href="/seller/settings/profile/reviews">Reviews</Link>
          <Link href="/seller/settings/profile/badges">Badges</Link>
          <Link href="/seller/settings/profile/elite-pro">Elite Pro</Link>
          <Link href="/seller/settings/profile/verification">Verification</Link>
          <Link href="/seller/settings/profile/account-details">
            Account Details
          </Link>
        </div>
      </div>
      <div className="">
        <h2 className="font-bold text-lg mb-5">Lead Settings</h2>
        <div className="flex flex-col gap-4">
          <Link href="/seller/settings/lead-settings/my-services">
            My Services
          </Link>
          <Link href="/seller/settings/lead-settings/my-locations">
            My Locations
          </Link>
        </div>
      </div>
      <div className="">
        <h2 className="font-bold text-lg mb-5">Enquiries</h2>
        <div className="flex flex-col gap-4">
          <Link href="/seller/settings/enquiries/enquiries-settings">
            Enquiries settings
          </Link>
        </div>
      </div>
      <h2 className="font-bold text-lg">Communication</h2>
      <div className="flex flex-col gap-3">
        <Link href="/seller/settings/communication/one-click-response">
          One-click response
        </Link>
        <Link href="/seller/settings/communication/email-templates">
          Email templates
        </Link>
        <Link href="/seller/settings/communication/sms-templates">
          SMS Templates
        </Link>
      </div>
      <h2 className="font-bold text-lg">Integrations</h2>
      <div className="flex flex-col gap-3">
        <Link href="/seller/settings/integrations/hubspot">HubSpot</Link>
        <Link href="/seller/settings/integrations/zapier">Zapier</Link>
      </div>
      <h2 className="font-bold text-lg">Credits & Payments</h2>
      <div className="flex flex-col gap-3">
        <Link href="/seller/settings/billing/my-credits">My Credits</Link>
        <Link href="/seller/settings/billings/billing-details">
          Invoices and billing details
        </Link>
        <Link href="/seller/settings/billings/saved-card">
          My payment details
        </Link>
      </div>
      <h2 className="font-bold text-lg">Notifications</h2>
      <div className="flex flex-col gap-3">
        <Link href="/seller/settings/notifications/email-notifications">
          Email
        </Link>
        <Link href="/seller/settings/notifications/browser">Browser</Link>
      </div>
    </div>
  );
}
