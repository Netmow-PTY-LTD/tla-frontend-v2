'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function DropdownMenuSelect({
  triggerLabel = 'Select',
  dropdownLabel = '',
  options = [],
  onSelect,
  defaultValue = null,
}) {
  const [selected, setSelected] = useState(defaultValue);

  const handleSelect = (value) => {
    setSelected(value);
    onSelect?.(value); // Call the parent onSelect handler if provided
  };

  return (
    <DropdownMenu>
      <div className="flex flex-col space-y-1">
        <label className="text-black  font-semibold">{triggerLabel}</label>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{selected || triggerLabel}</Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="w-56 mt-1">
        {dropdownLabel && (
          <>
            <DropdownMenuLabel>{dropdownLabel}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {options.map((option, index) => (
          <DropdownMenuItem
            key={index}
            onSelect={() => handleSelect(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
