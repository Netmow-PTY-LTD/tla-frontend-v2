import React from 'react';
import { SectionCards } from './_components/SectionCards';
import { ChartAreaInteractive } from './_components/ChartAreaInteractive';
import data from '@/data/data.json';
//import { AdminHomeDataTable } from './_components/AdminHomeDataTable';
import { AllTransactionHistory } from './_components/AllTransactionHistory';
import { safeJsonParse } from '@/helpers/safeJsonParse';
import Cookies from 'js-cookie';

const AdminDashboardPage = () => {
  const cookieCountry = safeJsonParse(Cookies.get('countryObj'));
  console.log('cookieCountry', cookieCountry);
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
