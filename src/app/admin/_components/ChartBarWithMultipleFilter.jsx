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
import { Button } from '@/components/ui/button';
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
  users: { label: 'Users', color: '#478ECC' },
  // payments: { label: 'Payments', color: '#D97706' },
  // creditsSpent: { label: 'Credits Spent', color: '#059669' },
  casePosts: { label: 'Case Posts', color: '#8DAACA' },
  hires: { label: 'Hires', color: '#FF7061' },
  lawyerRegistrations: { label: 'Lawyer Registrations', color: '#4CD4B0' },
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

export default function InteractiveBarChart() {
  const [filter, setFilter] = useState('Yearly');

  // Fetch daily data for current month
  const { data: barChartData } = useGetDashboardBarChartDataQuery(
    FilterType[filter]
  );

  // Get today
  const today = new Date();

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
          <CardTitle>Key Metrics Overview</CardTitle>
          <CardDescription>
            Showing <b>{filter.toLowerCase()} </b>statistics
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
