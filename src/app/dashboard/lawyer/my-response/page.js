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
    </div>
  );
};

export default MyResponsePage;
