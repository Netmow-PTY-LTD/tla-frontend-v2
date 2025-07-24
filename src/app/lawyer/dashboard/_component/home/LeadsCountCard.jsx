
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {

  useGetAllMyLeadsQuery,
} from '@/store/features/lawyer/LeadsApiService';

export default function LeadsCountCard() {
  const { data: allLeads, isLoading } = useGetAllMyLeadsQuery({
    page: 1,
    limit: 10,
  });

  const totalLeads = allLeads?.pagination?.total ?? 0;
  const approvedLeads =
    allLeads?.data?.filter((lead) => lead.status === 'approved')?.length;
  const pendingLeads =
    allLeads?.data?.filter((lead) => lead.status === 'pending')?.length;


  return (
    <Card className="w-full shadow-sm rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Leads</h2>
        <Link href="/lawyer/dashboard/leads-board">
          <Button variant="outline" size="sm">
            View
          </Button>
        </Link>
      </div>

      {/* Divider */}
      <hr className="border-t border-[#D9D9D9]" />

      {/* Counts */}
      <div className="flex items-center justify-center h-[calc(100%-100px)]">
        <div className="flex items-center justify-center gap-6 p-4">
          {/* Total */}
          {
            totalLeads > 0 && <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 text-white">
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : totalLeads}
                </p>
              </div>
              <span className="text-sm font-medium mt-1">Total</span>
            </div>
          }

          {/* Approved */}
          {
            approvedLeads > 0 && <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white">
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : approvedLeads}
                </p>
              </div>
              <span className="text-sm font-medium mt-1">Approved</span>
            </div>
          }


          {/* Pending */}

          {
            pendingLeads > 0 && <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500 text-white">
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : pendingLeads}
                </p>
              </div>
              <span className="text-sm font-medium mt-1">Pending</span>
            </div>
          }
        </div>
      </div>
    </Card>
  );
}
