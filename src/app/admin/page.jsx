import React from 'react';
import { SectionCards } from './_components/SectionCards';
import { ChartAreaInteractive } from './_components/ChartAreaInteractive';
import data from '@/data/data.json';
//import { AdminHomeDataTable } from './_components/AdminHomeDataTable';
import { AllTransactionHistory } from './_components/AllTransactionHistory';

const AdminDashboardPage = () => {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <div>
        <ChartAreaInteractive />
      </div>
      <AllTransactionHistory />
      {/* <AdminHomeDataTable data={data} /> */}
    </div>
  );
};

export default AdminDashboardPage;
