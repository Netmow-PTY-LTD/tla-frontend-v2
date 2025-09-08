'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { useIsMobile } from '@/hooks/use-mobile.jsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  useGetDashboardSChartDataQuery,
  useGetDashboardStatsQuery,
} from '@/store/features/admin/dashboardStatsApiService';

import dashboardData from '@/data/dashboardData.json';

const chartData = {
  data: [
    {
      date: '2024-06-01',
      users: 97,
      payments: 35,
      creditsSpent: 217,
      casePosts: 24,
      hires: 12,
      lawyerRegistrations: 7,
    },
    {
      date: '2024-06-02',
      users: 138,
      payments: 49,
      creditsSpent: 317,
      casePosts: 11,
      hires: 13,
      lawyerRegistrations: 3,
    },
    {
      date: '2024-06-03',
      users: 114,
      payments: 51,
      creditsSpent: 457,
      casePosts: 30,
      hires: 13,
      lawyerRegistrations: 6,
    },
    {
      date: '2024-06-04',
      users: 108,
      payments: 46,
      creditsSpent: 479,
      casePosts: 27,
      hires: 14,
      lawyerRegistrations: 7,
    },
    {
      date: '2024-06-05',
      users: 93,
      payments: 36,
      creditsSpent: 358,
      casePosts: 18,
      hires: 12,
      lawyerRegistrations: 7,
    },
    {
      date: '2024-06-06',
      users: 91,
      payments: 54,
      creditsSpent: 453,
      casePosts: 14,
      hires: 10,
      lawyerRegistrations: 3,
    },
    {
      date: '2024-06-07',
      users: 84,
      payments: 37,
      creditsSpent: 328,
      casePosts: 22,
      hires: 12,
      lawyerRegistrations: 7,
    },
    {
      date: '2024-06-08',
      users: 142,
      payments: 47,
      creditsSpent: 359,
      casePosts: 26,
      hires: 6,
      lawyerRegistrations: 2,
    },
    {
      date: '2024-06-09',
      users: 101,
      payments: 31,
      creditsSpent: 237,
      casePosts: 19,
      hires: 7,
      lawyerRegistrations: 2,
    },
    {
      date: '2024-06-10',
      users: 116,
      payments: 56,
      creditsSpent: 300,
      casePosts: 29,
      hires: 14,
      lawyerRegistrations: 3,
    },
    {
      date: '2024-06-11',
      users: 148,
      payments: 53,
      creditsSpent: 455,
      casePosts: 17,
      hires: 5,
      lawyerRegistrations: 4,
    },
    {
      date: '2024-06-12',
      users: 85,
      payments: 41,
      creditsSpent: 282,
      casePosts: 11,
      hires: 6,
      lawyerRegistrations: 2,
    },
    {
      date: '2024-06-13',
      users: 102,
      payments: 40,
      creditsSpent: 320,
      casePosts: 18,
      hires: 10,
      lawyerRegistrations: 4,
    },
    {
      date: '2024-06-14',
      users: 121,
      payments: 49,
      creditsSpent: 395,
      casePosts: 21,
      hires: 6,
      lawyerRegistrations: 6,
    },
    {
      date: '2024-06-15',
      users: 98,
      payments: 32,
      creditsSpent: 277,
      casePosts: 29,
      hires: 6,
      lawyerRegistrations: 7,
    },
    {
      date: '2024-06-16',
      users: 111,
      payments: 53,
      creditsSpent: 449,
      casePosts: 12,
      hires: 8,
      lawyerRegistrations: 2,
    },
    {
      date: '2024-06-17',
      users: 118,
      payments: 45,
      creditsSpent: 440,
      casePosts: 18,
      hires: 13,
      lawyerRegistrations: 6,
    },
    {
      date: '2024-06-18',
      users: 129,
      payments: 59,
      creditsSpent: 317,
      casePosts: 28,
      hires: 5,
      lawyerRegistrations: 5,
    },
    {
      date: '2024-06-19',
      users: 112,
      payments: 36,
      creditsSpent: 414,
      casePosts: 14,
      hires: 13,
      lawyerRegistrations: 5,
    },
    {
      date: '2024-06-20',
      users: 127,
      payments: 46,
      creditsSpent: 262,
      casePosts: 14,
      hires: 9,
      lawyerRegistrations: 4,
    },
    {
      date: '2024-06-21',
      users: 132,
      payments: 30,
      creditsSpent: 377,
      casePosts: 17,
      hires: 13,
      lawyerRegistrations: 3,
    },
    {
      date: '2024-06-22',
      users: 121,
      payments: 38,
      creditsSpent: 312,
      casePosts: 19,
      hires: 14,
      lawyerRegistrations: 6,
    },
    {
      date: '2024-06-23',
      users: 83,
      payments: 45,
      creditsSpent: 401,
      casePosts: 18,
      hires: 7,
      lawyerRegistrations: 7,
    },
    {
      date: '2024-06-24',
      users: 124,
      payments: 57,
      creditsSpent: 437,
      casePosts: 28,
      hires: 9,
      lawyerRegistrations: 5,
    },
    {
      date: '2024-06-25',
      users: 115,
      payments: 59,
      creditsSpent: 450,
      casePosts: 28,
      hires: 6,
      lawyerRegistrations: 4,
    },
    {
      date: '2024-06-26',
      users: 109,
      payments: 56,
      creditsSpent: 423,
      casePosts: 30,
      hires: 5,
      lawyerRegistrations: 6,
    },
    {
      date: '2024-06-27',
      users: 128,
      payments: 33,
      creditsSpent: 480,
      casePosts: 19,
      hires: 7,
      lawyerRegistrations: 4,
    },
    {
      date: '2024-06-28',
      users: 96,
      payments: 59,
      creditsSpent: 362,
      casePosts: 21,
      hires: 11,
      lawyerRegistrations: 3,
    },
    {
      date: '2024-06-29',
      users: 110,
      payments: 47,
      creditsSpent: 445,
      casePosts: 29,
      hires: 12,
      lawyerRegistrations: 3,
    },
    {
      date: '2024-06-30',
      users: 134,
      payments: 58,
      creditsSpent: 376,
      casePosts: 26,
      hires: 13,
      lawyerRegistrations: 2,
    },
  ],
};

// const chartConfig = {
//   visitors: {
//     label: 'Visitors',
//   },
//   desktop: {
//     label: 'Desktop',
//     color: 'hsl(var(--chart-1))',
//   },
//   mobile: {
//     label: 'Mobile',
//     color: 'hsl(var(--chart-2))',
//   },
// };

const chartConfig = {
  users: {
    label: 'Users',
    color: 'hsl(var(--chart-1))',
  },
  payments: {
    label: 'Payments',
    color: 'hsl(var(--chart-2))',
  },
  creditsSpent: {
    label: 'Credits Spent',
    color: 'hsl(var(--chart-3))',
  },
  casePosts: {
    label: 'Case Posts',
    color: 'hsl(var(--chart-4))',
  },
  hires: {
    label: 'Hires',
    color: 'hsl(var(--chart-5))',
  },
  lawyerRegistrations: {
    label: 'Lawyer Registrations',
    color: 'hsl(var(--chart-6))',
  },
};

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('30d');
  const [startDate, setStartDate] = React.useState('2025-09-01');
  const [endDate, setEndDate] = React.useState('2025-09-20');

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  // const { data: dashboardData } = useGetDashboardSChartDataQuery({
  //   startDate,
  //   endDate,
  // });

  //console.log('dashboardData', dashboardData);

  // const filteredData = React.useMemo(() => {
  //   if (!dashboardData?.data) return [];

  //   let daysToSubtract = 90;
  //   if (timeRange === '30d') daysToSubtract = 30;
  //   if (timeRange === '7d') daysToSubtract = 7;

  //   // Convert state values (strings) into Date objects
  //   const end = new Date(endDate); // reference end date
  //   const start = new Date(end); // clone
  //   start.setDate(start.getDate() - (daysToSubtract - 1));

  //   return dashboardData.data.filter((item) => {
  //     const date = new Date(item.date);
  //     return date >= start && date <= end;
  //   });
  // }, [dashboardData, timeRange, startDate, endDate]);

  const filteredData = React.useMemo(() => {
    if (!dashboardData) return [];

    let daysToSubtract = 90;
    if (timeRange === '30d') daysToSubtract = 30;
    if (timeRange === '7d') daysToSubtract = 7;

    // Reference end date
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // include entire day

    const start = new Date(end);
    start.setDate(start.getDate() - (daysToSubtract - 1));
    start.setHours(0, 0, 0, 0);

    return dashboardData.filter((item) => {
      const date = new Date(item.date);
      return date >= start && date <= end;
    });
  }, [dashboardData, timeRange, startDate, endDate]);

  //  console.log('filteredData', filteredData);

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Total Data</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Total for the last {timeRange}
          </span>
          <span className="@[540px]/card:hidden">
            Last{' '}
            {timeRange === '90d'
              ? '3 months'
              : timeRange === '30d'
              ? '30 days'
              : timeRange === '7d'
              ? '7 days'
              : ''}
          </span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="fillPayments" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-payments)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-payments)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="fillCreditsSpent" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-creditsSpent)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-creditsSpent)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="fillCasePosts" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-casePosts)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-casePosts)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="fillHires" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-hires)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-hires)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient
                id="fillLawyerRegistrations"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-lawyerRegistrations)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-lawyerRegistrations)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              interval={0}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="users"
              type="monotone"
              fill="url(#fillUsers)"
              stroke="var(--color-users)"
            />
            <Area
              dataKey="payments"
              type="monotone"
              fill="url(#fillPayments)"
              stroke="var(--color-payments)"
            />
            <Area
              dataKey="creditsSpent"
              type="monotone"
              fill="url(#fillCreditsSpent)"
              stroke="var(--color-creditsSpent)"
            />
            <Area
              dataKey="casePosts"
              type="monotone"
              fill="url(#fillCasePosts)"
              stroke="var(--color-casePosts)"
            />
            <Area
              dataKey="hires"
              type="monotone"
              fill="url(#fillHires)"
              stroke="var(--color-hires)"
            />
            <Area
              dataKey="lawyerRegistrations"
              type="monotone"
              fill="url(#fillLawyerRegistrations)"
              stroke="var(--color-lawyerRegistrations)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
