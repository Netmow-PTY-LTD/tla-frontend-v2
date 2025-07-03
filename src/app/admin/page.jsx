import React from 'react';
import { SectionCards } from './_components/SectionCards';
import { ChartAreaInteractive } from './_components/ChartAreaInteractive';
import data from '@/data/data.json';
import { AdminHomeDataTable } from './_components/AdminHomeDataTable';
import { AllTransectionHistory } from './_components/AllTransectionHistory';

const AdminDashboardPage = () => {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <div>
        <ChartAreaInteractive />
      </div>
      <AdminHomeDataTable data={data} />
      {/* <AllTransectionHistory data={data} /> */}
    </div>
  );
};

export default AdminDashboardPage;
