import { userDummyImage } from '@/data/data';
import { useRealTimeStatus } from '@/hooks/useSocketListener';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

export default function RespondersOnline({ user }) {
    const currentUserId = useSelector(selectCurrentUser)?._id;
    const [onlineMap, setOnlineMap] = useState({});
    const maxVisible = 5;
    const visibleAvatars = user?.responders?.slice(0, maxVisible);
    const extraCount = user?.responders?.length - maxVisible;


    const userIds = Array.isArray(user?.responders)
        ? user.responders.map(r => r?.user)
        : [];

    // ✅ Use hook directly (at top level of component)
    useRealTimeStatus(currentUserId, userIds, (userId, isOnline) => {
        setOnlineMap((prev) => ({ ...prev, [userId]: isOnline }));
    });



    return (
        <div className="px-3 py-2">
            {user?.responders?.length > 0 && (
                <div className="flex items-center gap-2">
                    <div className="text-[var(--color-black)] text-xs font-semibold">
                        Responders:
                    </div>
                    <div className="flex items-center gap-2">
                        {visibleAvatars.map((lead, index) => (
                            <img
                                key={index}
                                src={lead?.profilePicture || userDummyImage}
                                alt="Avatar"
                                className={`w-8 h-8 rounded-full border-2 object-cover ${onlineMap[lead?.user] ? 'border-green-500' : 'border-white-500'
                                    }`}
                            />
                        ))}
                        {extraCount > 0 && (
                            <div className="-ml-5 w-8 h-8 rounded-full bg-gray-300 text-gray-700 border-2 border-white flex items-center justify-center text-xs font-semibold">
                                +{extraCount}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
