import Link from 'next/link';
import React from 'react';

export default function Page() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-bold text-lg mb-5">My Profile</h2>
        <div className="flex flex-col gap-4">
          <Link href="/lawyer/settings/profile/my-profile">My Profile</Link>
          <Link href="/lawyer/settings/profile/reviews">Reviews</Link>
          <Link href="/lawyer/settings/profile/badges">Badges</Link>
          <Link href="/lawyer/settings/profile/elite-pro">Elite Pro</Link>
          <Link href="/lawyer/settings/profile/verification">Verification</Link>
          <Link href="/lawyer/settings/profile/account-details">
            Account Details
          </Link>
        </div>
      </div>
      <div className="">
        <h2 className="font-bold text-lg mb-5">Lead Settings</h2>
        <div className="flex flex-col gap-4">
          <Link href="/lawyer/settings/lead-settings/my-services">
            My Services
          </Link>
          <Link href="/lawyer/settings/lead-settings/my-locations">
            My Locations
          </Link>
        </div>
      </div>
      <div className="">
        <h2 className="font-bold text-lg mb-5">Enquiries</h2>
        <div className="flex flex-col gap-4">
          <Link href="/lawyer/settings/enquiries/enquiries-settings">
            Enquiries settings
          </Link>
        </div>
      </div>
      <h2 className="font-bold text-lg">Communication</h2>
      <div className="flex flex-col gap-3">
        <Link href="/lawyer/settings/communication/one-click-response">
          One-click response
        </Link>
        <Link href="/lawyer/settings/communication/email-templates">
          Email templates
        </Link>
        <Link href="/lawyer/settings/communication/sms-templates">
          SMS Templates
        </Link>
      </div>
      <h2 className="font-bold text-lg">Integrations</h2>
      <div className="flex flex-col gap-3">
        <Link href="/lawyer/settings/integrations/hubspot">HubSpot</Link>
        <Link href="/lawyer/settings/integrations/zapier">Zapier</Link>
      </div>
      <h2 className="font-bold text-lg">Credits & Payments</h2>
      <div className="flex flex-col gap-3">
        <Link href="/lawyer/settings/billing/my-credits">My Credits</Link>
        <Link href="/lawyer/settings/billings/billing-details">
          Invoices and billing details
        </Link>
        <Link href="/lawyer/settings/billings/saved-card">
          My payment details
        </Link>
      </div>
      <h2 className="font-bold text-lg">Notifications</h2>
      <div className="flex flex-col gap-3">
        <Link href="/lawyer/settings/notifications/email-notifications">
          Email
        </Link>
        <Link href="/lawyer/settings/notifications/browser">Browser</Link>
      </div>
    </div>
  );
}
