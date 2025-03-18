import LeadCard from '@/components/dashboard/lawyer-dashboard/components/LeadCard';
import StatusButton from '@/components/dashboard/lawyer-dashboard/components/StatusButton';
import React from 'react';

const MyResponsePage = () => {
  return (
    <div>
      <section>
        <h1 className="font-bold text-[1.625rem] border-b-2 ">My Response</h1>

        <div className="flex items-center gap-2 mt-2">
          <StatusButton status="pending" />
          <StatusButton status="hired" />
        </div>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 mt-4">
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
