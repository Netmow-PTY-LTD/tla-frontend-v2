import LeadCard from '@/components/dashboard/lawyer/components/LeadCard';
import StatusButton from '@/components/dashboard/lawyer/components/StatusButton';
import React from 'react';

const MyResponsePage = () => {
  return (
    <div>
      <section>
        <h1 className="font-bold text-[1.625rem] border-b-2 ">My Response</h1>

        <div className="flex items-center gap-2 mt-2 ">
          <StatusButton status="pending" />
          <StatusButton status="hired" />
        </div>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5  5xl:grid-cols-6 6xl:grid-cols-8 gap-5 lg:px-4 mt-4 mb-10">
        <LeadCard />
        <LeadCard />
        <LeadCard />
        <LeadCard />
        <LeadCard />
        <LeadCard />
      </section>
    </div>
  );
};

export default MyResponsePage;
