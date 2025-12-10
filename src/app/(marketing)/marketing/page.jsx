
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, BarChart2, ClipboardList, Briefcase } from 'lucide-react';

export default function MarketingDashboard() {
  const kpis = [
    { title: 'Active Campaigns', value: 12, icon: Briefcase, color: 'bg-blue-100 text-blue-700' },
    { title: 'Leads Generated', value: 340, icon: Users, color: 'bg-green-100 text-green-700' },
    { title: 'Pending Approvals', value: 5, icon: ClipboardList, color: 'bg-yellow-100 text-yellow-700' },
    { title: 'Revenue', value: '$24.3K', icon: BarChart2, color: 'bg-purple-100 text-purple-700' },
  ];

  const recentCampaigns = [
    { name: 'Summer Sale', status: 'Active', budget: '$2,500', leads: 120 },
    { name: 'Winter Promo', status: 'Completed', budget: '$3,000', leads: 180 },
    { name: 'Product Launch', status: 'Pending', budget: '$5,000', leads: 0 },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor campaigns, leads, and performance metrics</p>
        </div>
        <Button className="h-10 px-4" variant="default">
          Create Campaign
        </Button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="shadow-lg hover:shadow-xl transition-shadow rounded-xl">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-700">{kpi.title}</CardTitle>
              <div className={`p-2 rounded-full ${kpi.color} flex items-center justify-center mt-4`}>
                <kpi.icon className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Campaigns Table */}
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCampaigns.map((campaign) => (
                <TableRow key={campaign.name} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        campaign.status === 'Active'
                          ? 'default'
                          : campaign.status === 'Pending'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{campaign.budget}</TableCell>
                  <TableCell>{campaign.leads}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

