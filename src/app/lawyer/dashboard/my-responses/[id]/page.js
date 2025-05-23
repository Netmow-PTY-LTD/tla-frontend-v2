import StatusDropdwon from '@/components/dashboard/lawyer/components/StatusDropdwon';
import Chat from '@/components/dashboard/lawyer/module/chat/Chat';
import { MoveLeft } from 'lucide-react';

import React from 'react';
import ProfileViewCard from '../_components/ProfileViewCard';

const page = async ({ params }) => {
  const { id } = await params;
  const menuLinks = [
    { label: 'Pending', href: '#pending' },
    { label: 'Hired', href: '#hired' },
  ];

  return (
    <div className="bg-white">
      <section className="bg-[#F3F3F3] p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <button className="flex py-2 items-center gap-2">
            {' '}
            <MoveLeft /> <span>Back to leads</span>
          </button>
          <StatusDropdwon status="pending" menuItems={menuLinks} />
        </div>
      </section>
      <section className="mt-3 lg:flex lg:gap-5 ">
        <ProfileViewCard id={id} />
        <div className="w-full lg:w-1/2 border-s-2">
          <Chat />
        </div>
      </section>
    </div>
  );
};

export default page;
