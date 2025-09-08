'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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
import { useGetDashboardBarChartDataQuery } from '@/store/features/admin/dashboardStatsApiService';

export const description = 'An interactive bar chart';

const chartConfig = {
  users: {
    label: 'Users',
    color: 'var(--secondary-color)',
  },
  payments: {
    label: 'Payments',
    color: 'var(--color-black)',
  },
  creditsSpent: {
    label: 'Credits Spent',
    color: 'var(--chart-3)',
  },
  casePosts: {
    label: 'Case Posts',
    color: 'var(--chart-4)',
  },
  hires: {
    label: 'Hires',
    color: 'var(--chart-5)',
  },
  lawyerRegistrations: {
    label: 'Lawyer Registrations',
    color: 'var(--chart-6)',
  },
};

export function ChartBarInteractive() {
  // ✅ set a valid default
  const [activeChart, setActiveChart] = React.useState('users');

  const { data: barChartData } = useGetDashboardBarChartDataQuery(2025);

  //console.log('barChartData', barChartData);

  const total = React.useMemo(() => {
    const totals = {};
    Object.keys(chartConfig).forEach((key) => {
      totals[key] = barChartData?.data?.reduce(
        (acc, curr) => acc + (curr[key] || 0),
        0
      );
    });
    return totals;
  }, [barChartData]); // ✅ recalc when API data changes

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Total {chartConfig[activeChart]?.label || ''}</CardTitle>
          <CardDescription>
            Showing yearly stats for the year {new Date().getFullYear()}
          </CardDescription>
        </div>
        <div className="flex overflow-x-auto">
          {Object.keys(chartConfig).map((key) => {
            const chart = key;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-col justify-center gap-1 border-t px-4 py-3 text-left sm:border-t-0 sm:border-l sm:px-6 sm:py-4"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold">
                  {total[chart]?.toLocaleString() || 0}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            // ✅ use API data (fallback to empty array)
            data={barChartData?.data || []}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const [year, month] = value.split('-');
                return new Date(`${year}-${month}-01`).toLocaleDateString(
                  'en-US',
                  { month: 'short' }
                );
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={chartConfig[activeChart]?.label}
                  labelFormatter={(value) => {
                    const [year, month] = value.split('-');
                    return new Date(`${year}-${month}-01`).toLocaleDateString(
                      'en-US',
                      { month: 'long', year: 'numeric' }
                    );
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={chartConfig[activeChart]?.color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
