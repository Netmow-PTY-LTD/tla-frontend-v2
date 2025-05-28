import { SendHorizontal } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const Chat = () => {
  return (
    <div className="m-5">
      <h1 className="font-bold text-xl text-black">Chat Activity</h1>
      <div>
        <p className="flex items-center text-gray-500">
          <span className="flex-1 border-t border-gray-300"></span>
          <span className="mx-3 text-sm">Fri 27 Feb</span>
          <span className="flex-1 border-t border-gray-300"></span>
        </p>
        <div className="flex gap-3 mt-2">
          {' '}
          <div>
            <p className="bg-[#E6F9F9] text-[#34495E] rounded-xl p-3">
              Hello Angie Vella, I noticed you need a lawyer to review a
              business contract. I have experience in corporate law and can help
              you. Would you like to share the contract for review?
            </p>
            <text className="flex justify-end mt-2">4:30 PM</text>
          </div>
          <figure className="w-6 h-6 rounded-full overflow-hidden">
            <Image
              src="/assets/img/auth-step1.png"
              alt="John Doe"
              width={24}
              height={24}
              priority
              className="rounded-full object-cover"
            />
          </figure>
        </div>
        <div className="flex gap-3 my-4">
          {' '}
          <figure className="w-6 h-6 rounded-full overflow-hidden">
            <Image
              src="/assets/img/auth-step1.png"
              alt="John Doe"
              width={24}
              height={24}
              priority
              className="rounded-full object-cover"
            />
          </figure>
          <div>
            <p className="bg-[#E6F9F9] text-[#34495E] rounded-xl p-3">
              Hello Angie Vella, I noticed you need a lawyer to review a
              business contract. I have experience in corporate law and can help
              you. Would you like to share the contract for review?
            </p>
            <text className="mt-2">4:30 PM</text>
          </div>
        </div>
      </div>
      <div className="flex items-center w-full bg-[#FFFFFF] px-2 py-1 border-[#DCE2EA] border rounded-lg ">
        <input
          className="w-full placeholder:text-[#919FAC] ml-2 mr-4 "
          placeholder="Type message..."
          name="message"
        />
        <button className="btn-default btn-primary">
          {' '}
          <span>Send </span> <SendHorizontal />
        </button>
      </div>
    </div>
  );
};

export default Chat;
