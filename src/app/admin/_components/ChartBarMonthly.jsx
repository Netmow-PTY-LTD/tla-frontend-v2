'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useGetDashboardBarChartDataQuery } from '@/store/features/admin/dashboardStatsApiService';

export const description = 'Daily chart for current month';

// Deep colors
const chartConfig = {
  users: { label: 'Users', color: '#2563EB' },
  payments: { label: 'Payments', color: '#D97706' },
  creditsSpent: { label: 'Credits Spent', color: '#059669' },
  casePosts: { label: 'Case Posts', color: '#DB2777' },
  hires: { label: 'Hires', color: '#7C3AED' },
  lawyerRegistrations: { label: 'Lawyer Registrations', color: '#DC2626' },
};

export function ChartBarMonthly() {
  function generateMonthDays(year, month) {
    const days = [];
    const date = new Date(year, month - 1, 1); // month is 0-indexed
    while (date.getMonth() === month - 1) {
      const day = date.getDate().toString().padStart(2, '0');
      days.push(`${year}-${month}-${day}`);
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // "09"
  const year = today.getFullYear();

  // Fetch daily data for current month
  const { data: barChartData } = useGetDashboardBarChartDataQuery({
    year,
    month,
  });

  console.log('barChartData in ChartBarMonthly', barChartData);

  const allDays = generateMonthDays(year, month);

  const chartData = allDays.map((day) => {
    const item = barChartData?.data?.find((d) => d.date === day) || {};
    const cleaned = { date: day };
    Object.keys(chartConfig).forEach((key) => {
      cleaned[key] = Math.abs(item[key] || 0);
    });
    return cleaned;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Achievement Chart</CardTitle>
        <CardDescription>
          Daily stats for{' '}
          {today.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const dateObj = new Date(value);
                return dateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                }); // → "Sep 1", "Sep 2", ...
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[250px]"
                  indicator="dashed"
                  labelFormatter={(value) => {
                    const dateObj = new Date(value);
                    return dateObj.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
              }
            />
            {Object.keys(chartConfig).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={chartConfig[key].color}
                name={chartConfig[key].label}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing daily stats for the current month
        </div>
      </CardFooter>
    </Card>
  );
}
