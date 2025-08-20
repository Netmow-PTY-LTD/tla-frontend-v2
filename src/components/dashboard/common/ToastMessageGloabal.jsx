import { useState } from 'react';
import Image from 'next/image';

import { userDummyImage } from '@/data/data';

export default function ToastMessageGloabal({ senderName, senderAvatar, message }) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 200; // max characters to show initially

  const shouldTruncate = message.length > maxLength;
  const displayMessage = expanded ? message : message.slice(0, maxLength);

  return (
    <div className="flex items-start gap-3">
      <Image
        src={senderAvatar || userDummyImage}
        alt={senderName}
        width={36}
        height={36}
        className="rounded-full object-cover border border-gray-300"
      />
      <div className="flex flex-col">
        <span className="font-bold text-sm text-gray-900">{senderName}</span>
        <span className="text-sm text-gray-700">
          {displayMessage}
          {shouldTruncate && !expanded && '...'}
        </span>
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-blue-500 hover:underline mt-1"
          >
            See more
          </button>
        )}
      </div>
    </div>
  );
}
