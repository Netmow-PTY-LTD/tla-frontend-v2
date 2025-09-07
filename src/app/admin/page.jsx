import React from 'react';
import { SectionCards } from './_components/SectionCards';
import { ChartAreaInteractive } from './_components/ChartAreaInteractive';
import data from '@/data/data.json';
//import { AdminHomeDataTable } from './_components/AdminHomeDataTable';
import { AllTransactionHistory } from './_components/AllTransactionHistory';
import { safeJsonParse } from '@/helpers/safeJsonParse';
import Cookies from 'js-cookie';
import { ChartBarInteractive } from './_components/ChartBarInteractive';
import { ChartBarYearly } from './_components/ChartBarMultiple';
import { ChartBarMonthly } from './_components/ChartBarMonthly';
import InteractiveBarChart from './_components/ChartBarWithMultipleFilter';
import InteractiveBarChartForPayment from './_components/ChartBarForPayment';

const AdminDashboardPage = () => {
  const cookieCountry = safeJsonParse(Cookies.get('countryObj'));
  console.log('cookieCountry', cookieCountry);
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <div>
        <ChartAreaInteractive />
      </div>
      <div className="grid grid-cols-1">
        <InteractiveBarChart />
      </div>
      <div className="grid grid-cols-1">
        <InteractiveBarChartForPayment />
      </div>
      {/* <div className="grid grid-cols-1">
        <ChartBarMonthly />
      </div> */}
      {/* <div className="grid grid-cols-1">
        <ChartBarYearly />
      </div> */}

      <AllTransactionHistory />
      {/* <AdminHomeDataTable data={data} /> */}
    </div>
  );
};

export default AdminDashboardPage;
