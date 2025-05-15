import TagButton from '@/components/dashboard/lawyer/components/TagButton';
import ToggleButton from '@/components/UIComponents/ToggleButton';
import { MapPin, MoveLeft, PencilIcon, PlusIcon, XIcon } from 'lucide-react';
import Link from 'next/link';

export default function LeadSettingsPage() {
  return (
    <div className="mb-10">
      <div className="bg-white rounded-lg p-5 border border-[#DCE2EA] shadow-lg ">
        <div className="flex items-center justify-between">
          <Link href={'/dashboard/lawyer/lead-board'}>
            <button className="flex py-2 items-center gap-2">
              {' '}
              <MoveLeft /> <span>Back to leads</span>
            </button>
          </Link>
        </div>
        <div className="mt-3 max-w-4xl">
          <div>
            <h1 className="text-[#0B1C2D] font-bold text-[1.625rem] ">
              Lead settings
            </h1>
            <p className="text-[#344351] mt-2">
              Leads you can choose to contact.
            </p>
          </div>
          <hr className="border-[#F3F3F3] my-5  " />
          <div className="mt-5">
            <h1 className="font-medium mb-1 text-xl">Your services</h1>
            <p className="mt-2">
              Fine tune the leads you want to be alerted about
            </p>
            <div className="flex flex-wrap gap-2 mt-4 mb-5">
              <TagButton text="Child Custody" bgColor="#FF86021A" />
              <TagButton text="Divorce Law" bgColor="#004DA61A" />
              <TagButton text="Wills & Property" bgColor="#E6FAF2" />
              <TagButton text="Family Law" bgColor="#FF86021A" />
            </div>
            <button className="text-[#0194EF] font-medium flex items-center mb-5">
              {' '}
              <PlusIcon className="mr-2" />
              <span>Add a service</span>
            </button>
          </div>
          <hr className="border-[#F3F3F3] my-5  " />
          <div className="mt-5">
            <h1 className="font-medium mb-1 text-xl">locations</h1>
            <p className="mt-2">Choose where you want to find new customers</p>
            <div className="flex justify-between gap-2 mt-4 mb-5 bg-[#F8F9FA] rounded-lg px-5 py-4">
              <h1 className="flex items-center gap-3 text-[#0B1C2D] ">
                <MapPin className="mr-2" />
                <span>1234 Pine Lane, Hillcrest, New York 10001</span>
              </h1>
              <div className="flex items-center gap-3">
                <button className="w-6 h-6">
                  {' '}
                  <PencilIcon className="text-[#717B85]" />{' '}
                </button>
                <button className="w-6 h-6">
                  {' '}
                  <XIcon className="text-red-500" />{' '}
                </button>
              </div>
            </div>
            <button className="text-[#0194EF] font-medium flex items-center mb-5">
              {' '}
              <PlusIcon className="mr-2" />
              <span>Add new locations</span>
            </button>
          </div>
          <hr className="border-[#F3F3F3] my-5  " />
          <div className="mt-5">
            <h1 className="text-[#0B1C2D] font-bold text-[1.625rem] ">
              Online/remote leads
            </h1>
            <p className="text-[#344351] mt-2">
              Customers tell us if they’re happy to receive services online or
              remotely
            </p>
            <div className="bg-[#F8F9FA] rounded-lg border-[#E7E8EA] py-[18px] px-5 flex items-center mt-4 max-w-[280px]">
              <h3>See online/remote leads</h3>
              <ToggleButton className="ml-3" size="sm" />
            </div>
          </div>
          <button className="btn-brand mt-12">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
