import React from 'react';
import SocialMediaLink from './social-media/SocialMediaLink';
import ExternalLinks from './social-media/ExternalLinks';

export default function SocialMediaLinks() {
  return (
    <div>
      <h2 className="font-bold text-lg">Social media & links</h2>
      <div className="flex flex-col gap-3">
        <SocialMediaLink />
        <ExternalLinks />
      </div>
    </div>
  );
}
