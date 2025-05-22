import React from 'react';
import JobPostCard from '../_components/JobPostCard';
import JobRequest from '../_components/JobRequest';
import { CircleX, SlidersHorizontal } from 'lucide-react';
import { FilterDropdown } from '../_components/FilterDropDwon';

export default function BuyerDashboard() {
  const posts = [
    {
      title: 'Family Lawyer',
      date: 'Monday, 28 April 2025',
      status: 'Approved',
      message: 'Congratulations! Your Job Post Is Approved.',
    },
    {
      title: 'Family Lawyer',
      date: 'Monday, 28 April 2025',
      status: 'Pending',
      message: 'Your Request Is Being Pending!',
    },
    {
      title: 'Family Lawyer',
      date: 'Monday, 28 April 2025',
      status: 'Rejected',
      message: '',
    },
    {
      title: 'Family Lawyer',
      date: 'Monday, 28 April 2025',
      status: 'Pending',
      message: 'Your Request Is Being Pending!',
    },
    {
      title: 'Family Lawyer',
      date: 'Monday, 28 April 2025',
      status: 'Rejected',
      message: '',
    },
    {
      title: 'Family Lawyer',
      date: 'Monday, 28 April 2025',
      status: 'Approved',
      message: 'Congratulations! Your Job Post Is Approved.',
    },
  ];
  return (
    <div className="bg-white rounded-xl p-4 border">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Request</h2>
        <button className="text-[#00C3C0] p-[10px] rounded-[5px] border border-[#00C3C0]">
          Place a new request
        </button>
      </div>
      <div className="mt-5 ">
        <JobRequest />

        <div className="flex justify-between items-center my-5">
          <FilterDropdown />
          <button className="bg-green-700 p-[10px]  flex items-center gap-2 text-white rounded-lg">
            <CircleX className="w-4 h-4" /> <span>Approve</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
          {posts?.map((post, index) => (
            <JobPostCard key={index} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
}
