
'use client';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAllUsersQuery } from '@/store/features/admin/userApiService';
import { useAllServicesQuery } from '@/store/features/admin/servicesApiService';
import { useGetAllCreditPackagesQuery, useTransactionHistoryListQuery } from '@/store/features/credit_and_payment/creditAndPaymentApiService';

export function SectionCards() {
  const { data: userList } = useAllUsersQuery();
  const { data: packages } = useGetAllCreditPackagesQuery();
  const { data: allServices } = useAllServicesQuery();
  const { data: transactionData } = useTransactionHistoryListQuery();

  return (
    <div className="*:data-[slot=card]:shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">

      {/* Total Users */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {userList?.pagination?.total ?? 0}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +8.2%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            New signups are growing <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Based on last 30 days of registrations
          </div>
        </CardFooter>
      </Card>

      {/* Total Services */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Services</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {allServices?.data?.length ?? 0}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +3.4%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            More services published <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            New services added this quarter
          </div>
        </CardFooter>
      </Card>

      {/* Total Transactions */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Transactions</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {transactionData?.data?.length ?? 0}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +15.7%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong revenue flow <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Transactions volume increased month-over-month
          </div>
        </CardFooter>
      </Card>

      {/* Total Packages */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Packages</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {packages?.data?.length ?? 0}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +5.9%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Package variety is growing <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            More plans available for users to purchase
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
