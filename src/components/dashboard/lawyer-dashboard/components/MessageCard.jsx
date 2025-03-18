import { Card } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';

const MessageCard = ({ messages }) => {
  return (
    <Card className="h-full">
      <div className="m-3 flex flex-col h-full">
        <h2 className="font-medium text-[18px] mb-3">Messages</h2>
        <hr className=" border border-[#F3F3F3] " />

        <div className="flex-1 overflow-y-auto">
          {messages?.map((msg, index) => (
            <div key={msg.id}>
              <div className="flex items-center gap-4 my-2">
                {/* Avatar */}
                <figure className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={msg.avatar}
                    alt={msg.name}
                    width={40}
                    height={40}
                    priority
                    className="rounded-full object-cover"
                  />
                </figure>

                {/* Message Info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
                  <div>
                    <h2 className="font-medium text-sm sm:text-base">
                      {msg.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {msg.message}
                    </p>
                  </div>
                  <p className="font-medium text-xs sm:text-sm text-gray-600 sm:ml-4 mt-2 sm:mt-0">
                    {msg.time}
                  </p>
                </div>
              </div>

              {/* Divider (except for the last item) */}
              {index !== messages.length - 1 && (
                <hr className=" border border-[#F3F3F3] " />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default MessageCard;
