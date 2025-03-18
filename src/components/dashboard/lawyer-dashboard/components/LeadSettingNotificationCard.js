import PencilIcon from '@/assets/icon';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import React from 'react';

const LeadSettingNotificationCard = () => {
  return (
    <Card>
      <div className="m-3 flex justify-between items-center flex-wrap">
        <h2 className="font-medium text-lg">Lead Settings</h2>
        <h2 className="text-sm sm:text-base">
          <span>456</span> New Leads
        </h2>
      </div>
      <hr className="tet-[#F3F3F3] border" />

      <div className="m-3">
        <h1 className="font-medium flex items-center text-lg">
          Practice Area
          <button aria-label="Edit Name" className="ml-3 rounded">
            <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
          </button>
        </h1>
        <p className="my-2 text-sm sm:text-base">
          You'll receive leads in these categories
        </p>

        <div className=" inline-flex gap-2">
          <button className="text-sm px-3 py-1 bg-[#FF86021A] rounded-[29px] ">
            Child Custody Law
          </button>
          <button className="text-sm px-3 py-1 bg-[#004DA61A] rounded-[29px] ">
            Separation Law
          </button>
          <button className="text-sm px-3 py-1 bg-[#A600161A] rounded-[29px] ">
            Criminal Law
          </button>
        </div>
      </div>
      <hr className="tet-[#F3F3F3] border" />

      <div className="m-3">
        <h1 className="font-medium flex items-center text-lg">
          Locations
          <button aria-label="Edit Name" className="ml-3 rounded">
            <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
          </button>
        </h1>
        <p className="my-2 text-sm sm:text-base">
          You're receiving customers within
        </p>
        <div className="space-y-2">
          <p className="text-[#0B1C2D] bg-[#F3F3F3] rounded-lg p-4 flex items-center">
            <span className="mr-1">
              <MapPin />
            </span>{' '}
            Cedar Boulevard, Lakeside, Florida 32123
          </p>
          <p className="text-[#0B1C2D] bg-[#F3F3F3] rounded-lg p-4">30 miles</p>
        </div>
      </div>
      <hr className="tet-[#F3F3F3] border" />

      <div className="m-3">
        <h1 className="font-medium flex items-center text-lg">
          Lead Notifications
          <button aria-label="Edit Name" className="ml-3 rounded">
            <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
          </button>
        </h1>
        <p className="my-2 text-sm sm:text-base">
          Sending new leads notifications to
        </p>
        <p className="text-sm sm:text-base">yourmail@example.com</p>
      </div>

      <div className="m-3">
        <button className="px-[19px] py-2 text-[#0B1C2D] font-medium bg-[#EDF0F4] rounded-full text-sm sm:text-base">
          View Leads
        </button>
      </div>
    </Card>
  );
};

export default LeadSettingNotificationCard;
