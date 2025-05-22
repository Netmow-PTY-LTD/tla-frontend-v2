import React from 'react';
import JobPostCard from '../_components/JobPostCard';
import JobRequest from '../_components/JobRequest';

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
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Request</h2>
        <button className="text-[#00C3C0] p-[10px] rounded-[5px] border border-[#00C3C0]">
          Place a new request
        </button>
      </div>
      <div className="mt-5 ">
        <JobRequest />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {posts?.map((post, index) => (
            <JobPostCard key={index} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
}
