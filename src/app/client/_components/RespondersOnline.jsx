import { userDummyImage } from '@/data/data';
import { useRealTimeStatus } from '@/hooks/useSocketListener';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
export default function RespondersOnline({ user }) {
  const currentUserId = useSelector(selectCurrentUser)?._id;
  const [onlineMap, setOnlineMap] = useState({});
  const maxVisible = 5;
  const visibleAvatars = user?.responders?.slice(0, maxVisible);
  const extraCount = user?.responders?.length - maxVisible;

  const userIds = Array.isArray(user?.responders)
    ? user.responders.map((r) => r?.user)
    : [];

  // ✅ Use hook directly (at top level of component)
  useRealTimeStatus(currentUserId, userIds, (userId, isOnline) => {
    setOnlineMap((prev) => ({ ...prev, [userId]: isOnline }));
  });

  return (
    <div className="px-3 py-1">
      {user?.responders?.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="text-[var(--color-black)] text-xs font-semibold">
            Responders:
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              {visibleAvatars.map((lead, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <img
                      src={lead?.profilePicture || userDummyImage}
                      alt={lead?.name || 'Avatar'}
                      className={`w-8 h-8 rounded-full border-2 object-cover ${
                        onlineMap[lead?.user]
                          ? 'border-green-500'
                          : 'border-gray-200'
                      }`}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {lead?.name || 'Unknown responder'}
                  </TooltipContent>
                </Tooltip>
              ))}

              {extraCount > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="-ml-5 w-8 h-8 rounded-full bg-gray-300 text-gray-700 border-2 border-white flex items-center justify-center text-xs font-semibold">
                      +{extraCount}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {extraCount} more responders
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  );
}
