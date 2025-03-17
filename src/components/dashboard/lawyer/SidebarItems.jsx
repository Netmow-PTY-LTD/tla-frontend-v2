'use client';
import {
  Settings2,
  SquareTerminal,
  Plus,
  LayoutDashboard,
  List,
  MessageSquareMore,
  ChartLine,
} from 'lucide-react';

export const data = {
  navMain: [
    {
      title: 'Leader Boards',
      url: '/dashboard/lawyer/leader-boards',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'My Stats',
      url: '/dashboard/lawyer/my-stats',
      icon: ChartLine,
      isActive: true,
    },
    {
      title: 'Response',
      url: '/dashboard/lawyer/response',
      icon: MessageSquareMore,
    },
  ],
};
