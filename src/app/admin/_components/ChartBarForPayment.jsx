'use client';

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetDashboardBarChartDataQuery } from '@/store/features/admin/dashboardStatsApiService';

// Deep colors
const chartConfig = {
  //   users: { label: 'Users', color: '#2563EB' },
  payments: { label: 'Payments', color: '#5C96A4' },
  creditsPurchased: { label: 'Credits Purchased', color: '#8884D8' },
  creditsSpent: { label: 'Credits Spent', color: '#F5C767' },
  //   casePosts: { label: 'Case Posts', color: '#DB2777' },
  //   hires: { label: 'Hires', color: '#7C3AED' },
  //   lawyerRegistrations: { label: 'Lawyer Registrations', color: '#DC2626' },
};

const FILTERS = [
  'Yearly',
  '6 Months',
  '3 Months',
  'Monthly',
  '15 Days',
  '7 Days',
];

const FilterType = {
  Yearly: 'yearly',
  '6 Months': 'six-months',
  '3 Months': 'three-months',
  Monthly: 'monthly',
  '15 Days': 'fifteen-days',
  '7 Days': 'seven-days',
};

// --- Dummy data generator ---
// function generateDummyData() {
//   const data = [];
//   const start = new Date('2024-09-01');
//   const today = new Date('2025-09-04'); // reference today

//   for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
//     data.push({
//       date: d.toISOString().split('T')[0], // "YYYY-MM-DD"
//       //   users: Math.floor(Math.random() * 100),
//       payments: Math.floor(Math.random() * 50),
//       creditsSpent: Math.floor(Math.random() * 30),
//       //   casePosts: Math.floor(Math.random() * 20),
//       //   hires: Math.floor(Math.random() * 10),
//       //   lawyerRegistrations: Math.floor(Math.random() * 15),
//     });
//   }
//   return data;
// }

// const dummyData = generateDummyData();

export default function InteractiveBarChartForPayment() {
  const [filter, setFilter] = useState('Yearly');

  const { data: barChartData } = useGetDashboardBarChartDataQuery(
    FilterType[filter]
  );

  console.log('barChartData in ChartBarForPayment', barChartData);

  // Inside ChartBarFilterable

  // Get today
  const today = new Date();

  // Helper to subtract days
  //   function subtractDays(date, days) {
  //     const d = new Date(date);
  //     d.setDate(d.getDate() - days);
  //     return d;
  //   }

  const chartData = React.useMemo(() => {
    if (!barChartData?.data) return [];

    let data = [...barChartData.data];

    // Ensure all values are positive
    data = data.map((item) => {
      const cleaned = { ...item };
      Object.keys(chartConfig).forEach((key) => {
        cleaned[key] = Math.abs(item[key] || 0);
      });
      return cleaned;
    });

    // Get date range
    let start, end;
    if (filter === 'Monthly') {
      end = new Date(today);
      start = new Date(today);
      start.setDate(end.getDate() - 29); // ✅ 30 days total (inclusive)
    } else if (filter === '15 Days') {
      end = new Date(today);
      start = new Date(today);
      start.setDate(end.getDate() - 14); // ✅ 15 days total
    } else if (filter === '7 Days') {
      end = new Date(today);
      start = new Date(today);
      start.setDate(end.getDate() - 6); // ✅ 7 days total
    }

    // Fill missing dates
    if (['Monthly', '15 Days', '7 Days'].includes(filter)) {
      const filled = [];
      const current = new Date(start);

      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0]; // "YYYY-MM-DD"

        const existing = data.find((item) => item.date === dateStr);
        if (existing) {
          filled.push(existing);
        } else {
          filled.push({
            date: dateStr,
            users: 0,
            payments: 0,
            creditsSpent: 0,
            casePosts: 0,
            hires: 0,
            lawyerRegistrations: 0,
          });
        }

        current.setDate(current.getDate() + 1); // ✅ move forward by 1 day
      }

      data = filled;
    }

    return data;
  }, [barChartData, filter]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle>Payment & credit spent overview</CardTitle>
          <CardDescription>
            Stats filtered by <span className="font-semibold">{filter}</span>
          </CardDescription>
        </div>
        <div className="w-[200px] px-4 pb-4">
          <Select value={filter} onValueChange={(value) => setFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              {FILTERS.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
              interval={0}
              tickFormatter={(value) => {
                const d = new Date(value);

                if (['Yearly', '6 Months', '3 Months'].includes(filter)) {
                  // Show only month names
                  return d.toLocaleString('en-US', { month: 'short' });
                }

                if (['Monthly', '15 Days', '7 Days'].includes(filter)) {
                  // Show month + day (e.g., "Aug 09")
                  return d.toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                  });
                }

                return d.getDate(); // fallback
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[250px]"
                  indicator="dot"
                  labelFormatter={(value) => {
                    const d = new Date(value);
                    if (['Yearly', '6 Months', '3 Months'].includes(filter)) {
                      return d.toLocaleString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      });
                    }
                    // For daily ranges (monthly, 15d, 7d) → full date
                    return d.toLocaleDateString('en-US', {
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
          Trending up <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing data for last{' '}
          <b>
            {filter === 'Yearly'
              ? 'year'
              : filter === 'Monthly'
              ? 'month'
              : filter}
          </b>
        </div>
      </CardFooter>
    </Card>
  );
}
