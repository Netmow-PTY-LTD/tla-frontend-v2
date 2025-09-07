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

// Deep colors
const chartConfig = {
  users: { label: 'Users', color: '#3A6CC5' },
  // payments: { label: 'Payments', color: '#D97706' },
  // creditsSpent: { label: 'Credits Spent', color: '#059669' },
  casePosts: { label: 'Case Posts', color: '#F07623' },
  hires: { label: 'Hires', color: '#979797' },
  lawyerRegistrations: { label: 'Lawyer Registrations', color: '#F1BE01' },
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

export default function InteractiveBarChart() {
  const [filter, setFilter] = useState('Yearly');

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
      <CardHeader>
        <CardTitle>Key Metrics Overview</CardTitle>
        <CardDescription>
          Stats filtered by <span className="font-semibold">{filter}</span>
        </CardDescription>
      </CardHeader>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 px-4 pb-4">
        {FILTERS.map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

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
