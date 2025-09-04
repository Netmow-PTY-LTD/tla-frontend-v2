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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useGetDashboardBarChartDataQuery } from '@/store/features/admin/dashboardStatsApiService';

export const description = 'A multiple bar chart';

// const chartConfig = {
//   users: {
//     label: 'Users',
//     color: 'var(--secondary-color)',
//   },
//   payments: {
//     label: 'Payments',
//     color: 'var(--color-black)',
//   },
//   creditsSpent: {
//     label: 'Credits Spent',
//     color: 'var(--chart-3)',
//   },
//   casePosts: {
//     label: 'Case Posts',
//     color: 'var(--chart-4)',
//   },
//   hires: {
//     label: 'Hires',
//     color: 'var(--chart-5)',
//   },
//   lawyerRegistrations: {
//     label: 'Lawyer Registrations',
//     color: 'var(--chart-6)',
//   },
// };

const chartConfig = {
  users: {
    label: 'Users',
    color: '#2563EB', // Deep Blue
  },
  payments: {
    label: 'Payments',
    color: '#D97706', // Deep Amber
  },
  creditsSpent: {
    label: 'Credits Spent',
    color: '#059669', // Deep Emerald
  },
  casePosts: {
    label: 'Case Posts',
    color: '#DB2777', // Deep Pink
  },
  hires: {
    label: 'Hires',
    color: '#7C3AED', // Deep Violet
  },
  lawyerRegistrations: {
    label: 'Lawyer Registrations',
    color: '#DC2626', // Deep Red
  },
};

export function ChartBarYearly() {
  const year = new Date().getFullYear();
  const { data: barChartData } = useGetDashboardBarChartDataQuery(year);

  const chartData =
    barChartData?.data?.map((item) => {
      const cleaned = { ...item };
      Object.keys(chartConfig).forEach((key) => {
        cleaned[key] = Math.abs(item[key] || 0); // 🔥 convert negatives → positive
      });
      return cleaned;
    }) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Stats</CardTitle>
        <CardDescription>
          Monthly stats for the year {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
                const [year, month] = value.split('-');
                return new Date(`${year}-${month}-01`).toLocaleDateString(
                  'en-US',
                  { month: 'short' }
                );
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  indicator="dashed"
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
            {/* ✅ Bars for each metric */}
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
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this year <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing monthly stats for {new Date().getFullYear()}
        </div>
      </CardFooter> */}
    </Card>
  );
}
