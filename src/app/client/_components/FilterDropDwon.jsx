'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SlidersHorizontal } from 'lucide-react';

export const FilterDropdown = () => {
  const handleFilterChange = (status) => {
    console.log('Selected status:', status);
    // Dispatch Redux action or trigger filter logic here
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-[#00C3C0] font-medium flex items-center gap-2 px-3 py-2  hover:bg-[#f0fdfa] transition">
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filter</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuItem onClick={() => handleFilterChange('approved')}>
          Approve
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFilterChange('rejected')}>
          Reject
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFilterChange('pending')}>
          Pending
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
