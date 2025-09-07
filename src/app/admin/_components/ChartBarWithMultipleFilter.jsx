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

// --- Dummy data generator ---
function generateDummyData() {
  const data = [];
  const start = new Date('2024-09-01');
  const today = new Date('2025-09-04'); // reference today

  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    data.push({
      date: d.toISOString().split('T')[0], // "YYYY-MM-DD"
      users: Math.floor(Math.random() * 100),
      // payments: Math.floor(Math.random() * 50),
      // creditsSpent: Math.floor(Math.random() * 30),
      casePosts: Math.floor(Math.random() * 20),
      hires: Math.floor(Math.random() * 10),
      lawyerRegistrations: Math.floor(Math.random() * 15),
    });
  }
  return data;
}

const dummyData = generateDummyData();

console.log('dummyData', dummyData);

export default function InteractiveBarChart() {
  const [filter, setFilter] = useState('Yearly');

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

  const chartData = useMemo(() => {
    if (!dummyData.length) return [];

    const normalized = dummyData.map((item) => {
      const cleaned = { ...item };
      Object.keys(chartConfig).forEach((key) => {
        cleaned[key] = Math.abs(item[key] || 0);
      });
      return cleaned;
    });

    const now = new Date('2025-09-04'); // fixed reference
    let days = 365;
    if (filter === '6 Months') days = 180;
    if (filter === '3 Months') days = 90;
    if (filter === 'Monthly') days = 30;
    if (filter === '15 Days') days = 15;
    if (filter === '7 Days') days = 7;

    const end = now;
    const start = new Date();
    start.setDate(end.getDate() - (days - 1));

    let filtered = normalized.filter((item) => {
      const date = new Date(item.date);
      return date >= start && date <= end;
    });

    // --- Aggregate by month when yearly / 6 months ---
    if (filter === 'Yearly' || filter === '6 Months') {
      const monthMap = {};

      filtered.forEach((item) => {
        const dateObj = new Date(item.date);
        const key = `${dateObj.getFullYear()}-${String(
          dateObj.getMonth() + 1
        ).padStart(2, '0')}`; // "2025-01"

        if (!monthMap[key]) {
          monthMap[key] = {
            date: key,
            users: 0,
            payments: 0,
            creditsSpent: 0,
            casePosts: 0,
            hires: 0,
            lawyerRegistrations: 0,
          };
        }

        Object.keys(chartConfig).forEach((k) => {
          monthMap[key][k] += item[k];
        });
      });

      filtered = Object.values(monthMap).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      // If 6 months → last 6 months only
      if (filter === '6 Months') {
        filtered = filtered.slice(-6);
      }
    }

    return filtered;
  }, [filter]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle>Key Metrics Overview</CardTitle>
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
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => {
                const dateObj = new Date(value);
                if (filter === 'Yearly' || filter === '6 Months') {
                  return dateObj.toLocaleDateString('en-US', {
                    month: 'short',
                  });
                }
                return dateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
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
                    if (filter === 'Yearly' || filter === '6 Months') {
                      return dateObj.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      });
                    }
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
        <div className="flex gap-2 font-medium leading-none">
          Trending up <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing data for {filter}
        </div>
      </CardFooter>
    </Card>
  );
}
